'use server';
/**
 * @fileOverview Generates industry-standard project ideas based on user interest and role.
 *
 * - generateStandardProjects - A function that generates project ideas.
 * - GenerateStandardProjectsInput - The input type for the function.
 * - GenerateStandardProjectsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { GenerateStandardProjectsInputSchema, GenerateStandardProjectsOutputSchema, type GenerateStandardProjectsInput, type GenerateStandardProjectsOutput } from '@/ai/types';


export async function generateStandardProjects(
  input: GenerateStandardProjectsInput
): Promise<GenerateStandardProjectsOutput> {
  return generateStandardProjectsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateStandardProjectsPrompt',
  input: { schema: GenerateStandardProjectsInputSchema },
  output: { schema: GenerateStandardProjectsOutputSchema },
  prompt: `You are an AI curriculum developer for a tech bootcamp. Your task is to generate three project ideas (Beginner, Intermediate, Advanced) for a student based on their target role and interests.

Context:
- Target Job Role: {{{targetJobRole}}}
- Student's Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Task:
1.  Create one project idea for each level: Beginner, Intermediate, and Advanced.
2.  Tailor the project domain to the student's interests.
3.  For each project, provide:
    -   A clear and engaging title.
    -   The difficulty level.
    -   A concise description of the project.
    -   A list of key features or user stories to implement.
    -   (If applicable, especially for data/ML roles) A list of suggested public datasets with names and URLs.
    -   (If applicable) A list of evaluation metrics to measure the project's success (e.g., "Model accuracy > 90%", "Lighthouse performance score > 95").

Output the projects in the specified JSON format.
`,
});

const generateStandardProjectsFlow = ai.defineFlow(
  {
    name: 'generateStandardProjectsFlow',
    inputSchema: GenerateStandardProjectsInputSchema,
    outputSchema: GenerateStandardProjectsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
