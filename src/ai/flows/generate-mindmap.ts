'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMindmapInputSchema = z.object({
    roadmap: z.string().describe('The full text of the generated roadmap.'),
});

const GenerateMindmapOutputSchema = z.object({
    mermaid: z.string().describe('The Mermaid.js syntax for the mindmap.'),
});

export async function generateMindmap(input: z.infer<typeof GenerateMindmapInputSchema>) {
    return generateMindmapFlow(input);
}

const mindmapPrompt = ai.definePrompt({
    name: 'mindmapPrompt',
    input: { schema: GenerateMindmapInputSchema },
    output: { schema: GenerateMindmapOutputSchema },
    prompt: `
    Based on the following roadmap, generate a Mermaid.js mindmap syntax.
    
    Roadmap:
    {{roadmap}}

    Requirements:
    - Use 'mindmap' diagram type.
    - Root node should be the main goal/role.
    - Branches should be the phases.
    - Sub-branches should be the key topics.
    - Keep it concise.
    - DO NOT include markdown code blocks (like \`\`\`mermaid). Just return the raw syntax.
    - Avoid using parentheses () in node text if possible, or use brackets [] instead.
  `,
});

const generateMindmapFlow = ai.defineFlow(
    {
        name: 'generateMindmapFlow',
        inputSchema: GenerateMindmapInputSchema,
        outputSchema: GenerateMindmapOutputSchema,
    },
    async (input) => {
        console.log("Generating mindmap for roadmap length:", input.roadmap.length);
        try {
            const { output } = await mindmapPrompt(input);
            console.log("Raw Mindmap Output:", JSON.stringify(output));

            // Strip markdown code blocks if present
            let cleanOutput = output?.mermaid?.replace(/```mermaid/g, '').replace(/```/g, '').trim() || '';

            // Sanitize: Replace parentheses with brackets to avoid Mermaid syntax errors
            // But preserve the root node's (( )) syntax
            const lines = cleanOutput.split('\n');
            cleanOutput = lines.map(line => {
                if (line.trim().startsWith('root((')) return line; // Keep root shape
                return line.replace(/\(/g, '[').replace(/\)/g, ']');
            }).join('\n');

            console.log("Clean Mindmap Output:", cleanOutput);

            return { mermaid: cleanOutput };
        } catch (e) {
            console.error("Mindmap Generation Error:", e);
            return { mermaid: '' };
        }
    }
);
