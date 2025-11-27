'use server';
/**
 * @fileOverview Generates micro-project prompts based on a learning roadmap.
 *
 * - generateMicroProjectPrompts - A function that generates micro-project prompts based on a learning roadmap.
 * - GenerateMicroProjectPromptsInput - The input type for the generateMicroProjectPrompts function.
 * - GenerateMicroProjectPromptsOutput - The return type for the generateMicroProjectPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMicroProjectPromptsInputSchema = z.object({
  roadmap: z
    .string()
    .describe('The learning roadmap for which to generate micro-project prompts.'),
});
export type GenerateMicroProjectPromptsInput = z.infer<typeof GenerateMicroProjectPromptsInputSchema>;

const GenerateMicroProjectPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('An array of micro-project prompts.'),
});
export type GenerateMicroProjectPromptsOutput = z.infer<typeof GenerateMicroProjectPromptsOutputSchema>;

export async function generateMicroProjectPrompts(
  input: GenerateMicroProjectPromptsInput
): Promise<GenerateMicroProjectPromptsOutput> {
  return generateMicroProjectPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMicroProjectPromptsPrompt',
  input: {schema: GenerateMicroProjectPromptsInputSchema},
  output: {schema: GenerateMicroProjectPromptsOutputSchema},
  prompt: `You are an AI assistant designed to generate micro-project prompts based on a user\'s learning roadmap.

  Roadmap: {{{roadmap}}}

  Generate a list of engaging and practical micro-project prompts that will help the user solidify their understanding of the topics in the roadmap. Each prompt should be concise and actionable, encouraging hands-on learning and portfolio development.
  Format output as a JSON array of strings.
  `,
});

const generateMicroProjectPromptsFlow = ai.defineFlow(
  {
    name: 'generateMicroProjectPromptsFlow',
    inputSchema: GenerateMicroProjectPromptsInputSchema,
    outputSchema: GenerateMicroProjectPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
