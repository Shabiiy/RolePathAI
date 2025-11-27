'use server';
/**
 * @fileOverview Generates advice for structuring a project portfolio.
 *
 * - generatePortfolioAdvice - A function that generates portfolio advice.
 * - GeneratePortfolioAdviceInput - The input type for the function.
 * - GeneratePortfolioAdviceOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { GeneratePortfolioAdviceInputSchema, GeneratePortfolioAdviceOutputSchema, type GeneratePortfolioAdviceInput, type GeneratePortfolioAdviceOutput } from '@/ai/types';


export async function generatePortfolioAdvice(
  input: GeneratePortfolioAdviceInput
): Promise<GeneratePortfolioAdviceOutput> {
  return generatePortfolioAdviceFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generatePortfolioAdvicePrompt',
  input: { schema: GeneratePortfolioAdviceInputSchema },
  output: { schema: GeneratePortfolioAdviceOutputSchema },
  prompt: `You are a senior hiring manager and career coach AI. Your task is to provide personalized advice on how a candidate should structure their portfolio to be maximally effective for a specific job role.

Context:
- Target Job Role: {{{targetJobRole}}}
- Candidate's Key Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Task:
1.  **Suggest a Portfolio Structure**: Outline the key sections of a portfolio website or document. For each section, provide a name and a description of what it should contain. Tailor the importance of sections to the target job role. For a designer, visual sections are key. For a data engineer, project architecture diagrams are more important.
2.  **Provide Project Display Tips**: Give specific, actionable advice on how to present projects. For example, "Include live demos, link to GitHub, and write a detailed README with setup instructions."
3.  **Offer General Tips**: List some crucial "do's" and "don'ts" for creating a portfolio for this field.

Output the advice in the specified JSON format.
`,
});

const generatePortfolioAdviceFlow = ai.defineFlow(
  {
    name: 'generatePortfolioAdviceFlow',
    inputSchema: GeneratePortfolioAdviceInputSchema,
    outputSchema: GeneratePortfolioAdviceOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
