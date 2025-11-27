'use server';
/**
 * @fileOverview Generates resume bullet points for a given skill and job role.
 *
 * - generateResumePoints - A function that generates resume bullet points.
 * - GenerateResumePointsInput - The input type for the function.
 * - GenerateResumePointsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { GenerateResumePointsInputSchema, GenerateResumePointsOutputSchema, type GenerateResumePointsInput, type GenerateResumePointsOutput } from '@/ai/types';


export async function generateResumePoints(
  input: GenerateResumePointsInput
): Promise<GenerateResumePointsOutput> {
  return generateResumePointsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateResumePointsPrompt',
  input: { schema: GenerateResumePointsInputSchema },
  output: { schema: GenerateResumePointsOutputSchema },
  prompt: `You are an expert AI resume writer and career coach. Your task is to generate strong, action-oriented resume bullet points for a specific skill, tailored for a target job role.

Context:
- Target Job Role: {{{targetJobRole}}}
- Skill to Highlight: {{{skill}}}
{{#if projectName}}- Project Context: The skill was applied in a project named "{{{projectName}}}"{{/if}}

Task:
1.  Generate 3 to 5 distinct resume bullet points.
2.  Each bullet point must start with a strong action verb.
3.  Frame the bullet points to show the *impact* or *result* of using the skill, not just that the skill was used. Use the STAR method (Situation, Task, Action, Result) as inspiration.
4.  Quantify the achievement where possible (e.g., "improved performance by 15%", "reduced load times by 300ms"). If you can't quantify, describe the positive outcome.
5.  If a project name is provided, incorporate it into the bullet points to provide context.

Example for (Role: "Frontend Developer", Skill: "React", Project: "E-commerce Dashboard"):
- "Engineered a dynamic, component-based E-commerce Dashboard using React and Redux, leading to a 25% decrease in user-reported UI bugs."
- "Implemented lazy loading for product images and components in the dashboard, cutting initial page load time by 40%."

Generate the bullet points and provide them in the specified JSON format.
`,
});

const generateResumePointsFlow = ai.defineFlow(
  {
    name: 'generateResumePointsFlow',
    inputSchema: GenerateResumePointsInputSchema,
    outputSchema: GenerateResumePointsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
