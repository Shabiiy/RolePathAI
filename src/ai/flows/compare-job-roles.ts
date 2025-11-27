'use server';
/**
 * @fileOverview Compares two job roles based on a user's background.
 *
 * - compareJobRoles - A function that performs the comparison.
 * - CompareJobRolesInput - The input type for the function.
 * - CompareJobRolesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import {
  CompareJobRolesInputSchema,
  CompareJobRolesOutputSchema,
  type CompareJobRolesInput,
  type CompareJobRolesOutput,
} from '@/ai/types';

export async function compareJobRoles(
  input: CompareJobRolesInput
): Promise<CompareJobRolesOutput> {
  return compareJobRolesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareJobRolesPrompt',
  input: { schema: CompareJobRolesInputSchema },
  output: { schema: CompareJobRolesOutputSchema },
  prompt: `You are an expert AI career counselor and industry analyst. Your task is to provide a detailed comparison between two job roles for a user, considering their current skills.

Context:
- Role 1: {{{roleOne}}}
- Role 2: {{{roleTwo}}}
- User's Current Skills: {{#if userSkills}}{{#each userSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None provided{{/if}}

Comparison Task:
1.  **Skill Overlap**: Identify and list the key skills that are valuable for BOTH roles.
2.  **Key Differences**: Detail the primary responsibilities, day-to-day tasks, and required skills that are UNIQUE to each role.
3.  **Required Mindset**: Describe the typical personality traits, problem-solving approaches, and work styles that lead to success in each role. For example, is one more collaborative and the other more independent? Is one more focused on detail and the other on big-picture thinking?
4.  **Salary Expectations (Generic)**: Provide a generic, qualitative overview of salary potential for each role (e.g., "Competitive, with high growth potential," or "Solid entry-level salary, moderate growth"). DO NOT provide specific numbers, but give a sense of the career trajectory.
5.  **Fit Assessment**: Based on the user's current skills, provide a brief analysis of which role might be a more natural fit or a quicker transition for them, and why.

Output the entire comparison in the specified JSON format.
`,
});

const compareJobRolesFlow = ai.defineFlow(
  {
    name: 'compareJobRolesFlow',
    inputSchema: CompareJobRolesInputSchema,
    outputSchema: CompareJobRolesOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
