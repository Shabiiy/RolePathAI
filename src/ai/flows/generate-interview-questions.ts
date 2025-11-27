'use server';
/**
 * @fileOverview Generates interview questions for a given job role.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the function.
 * - GenerateInterviewQuestionsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { GenerateInterviewQuestionsInputSchema, GenerateInterviewQuestionsOutputSchema, type GenerateInterviewQuestionsInput, type GenerateInterviewQuestionsOutput } from '@/ai/types';


export async function generateInterviewQuestions(
  input: GenerateInterviewQuestionsInput
): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: { schema: GenerateInterviewQuestionsInputSchema },
  output: { schema: GenerateInterviewQuestionsOutputSchema },
  prompt: `You are an expert AI career coach and technical recruiter. Your task is to generate a mix of technical and behavioral interview questions for a specific job role and skill set.

Context:
- Target Job Role: {{{targetJobRole}}}
- Key Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Question Types to Generate: {{#each questionTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Task:
1.  Generate 5-7 interview questions based on the provided context.
2.  Ensure a good mix of question types as requested.
3.  For technical questions, base them on the provided skills. They should be specific and test for practical knowledge.
4.  For behavioral questions, frame them in the context of the target job role's responsibilities. Use the STAR (Situation, Task, Action, Result) method as a guiding principle for the expected answer structure.
5.  For each question, specify its type ('Technical' or 'Behavioral') and the relevant topic.

Output the entire list in the specified JSON format.
`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
