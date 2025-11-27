'use server';
/**
 * @fileOverview Converts a text-based learning roadmap into Mermaid.js mindmap syntax.
 *
 * - generateEditableMindmap - A function that generates the mindmap syntax.
 * - GenerateEditableMindmapInput - The input type for the function.
 * - GenerateEditableMindmapOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEditableMindmapInputSchema = z.object({
  roadmap: z.string().describe('The learning roadmap text to be converted into a mindmap.'),
});
export type GenerateEditableMindmapInput = z.infer<typeof GenerateEditableMindmapInputSchema>;

const GenerateEditableMindmapOutputSchema = z.object({
  mindmap: z.string().describe('The Mermaid.js syntax for the generated mindmap.'),
});
export type GenerateEditableMindmapOutput = z.infer<typeof GenerateEditableMindmapOutputSchema>;

export async function generateEditableMindmap(
  input: GenerateEditableMindmapInput
): Promise<GenerateEditableMindmapOutput> {
  return generateEditableMindmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEditableMindmapPrompt',
  input: {schema: GenerateEditableMindmapInputSchema},
  output: {schema: GenerateEditableMindmapOutputSchema},
  prompt: `You are an expert in converting structured text into Mermaid.js syntax. Your task is to convert the given learning roadmap into a visually appealing and logically structured Mermaid.js mindmap.

- The root of the mindmap should be the main goal (e.g., the job role).
- Each "Phase" from the roadmap should be a main branch.
- Each topic under a phase should be a sub-node of that phase.
- Use indentation to create the hierarchy.
- Do NOT include the week numbers in the mindmap nodes.
- Do NOT add any notes or explanations outside of the Mermaid syntax.
- The output must be only the Mermaid code block.

Example Input Roadmap:
Phase 1: Foundations (Weeks 1-4)
- HTML Basics
- CSS Fundamentals
Phase 2: JavaScript (Weeks 5-8)
- Variables and Data Types
- Functions and Scope

Example Output:
mindmap
  root((Frontend Developer))
    Phase 1: Foundations
      HTML Basics
      CSS Fundamentals
    Phase 2: JavaScript
      Variables and Data Types
      Functions and Scope

Roadmap to Convert:
{{{roadmap}}}
`,
});

const generateEditableMindmapFlow = ai.defineFlow(
  {
    name: 'generateEditableMindmapFlow',
    inputSchema: GenerateEditableMindmapInputSchema,
    outputSchema: GenerateEditableMindmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
