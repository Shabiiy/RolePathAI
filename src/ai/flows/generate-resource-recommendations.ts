'use server';
/**
 * @fileOverview Generates curated resource recommendations for a specific learning topic.
 *
 * - generateResourceRecommendations - A function that generates resource recommendations.
 * - GenerateResourceRecommendationsInput - The input type for the function.
 * - GenerateResourceRecommendationsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateResourceRecommendationsInputSchema,
  GenerateResourceRecommendationsOutputSchema,
  type GenerateResourceRecommendationsInput,
  type GenerateResourceRecommendationsOutput,
} from '@/ai/types';

export async function generateResourceRecommendations(
  input: GenerateResourceRecommendationsInput
): Promise<GenerateResourceRecommendationsOutput> {
  return generateResourceRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResourceRecommendationsPrompt',
  input: { schema: GenerateResourceRecommendationsInputSchema },
  output: { schema: GenerateResourceRecommendationsOutputSchema },
  prompt: `You are an expert AI curator of educational content. For a given learning topic, your task is to recommend a variety of high-quality resources, explaining why each is a good fit for the user.

Learning Topic: {{{topic}}}

Resource Curation Task:
For the topic above, find and recommend one resource for each of the following categories:
1.  **Best Course**: An online course (e.g., from Coursera, Udemy, or a standalone platform).
2.  **Best Book**: A physical or digital book (e.g., from O'Reilly, a university press, or a well-regarded author).
3.  **Best Tool/API Documentation**: The official documentation for a relevant tool, library, or framework.
4.  **Fastest Introduction**: A short video (e.g., YouTube) or a concise blog post that gives a quick, high-level overview.
5.  **Budget-Friendly Option**: A high-quality resource that is cheaper than the main recommendations.
6.  **Free Alternative**: The best available resource that costs nothing (e.g., a university lecture series, a comprehensive tutorial).

For EACH of the 6 recommendations, you must provide:
-   \`category\`: The category name from the list above.
-   \`title\`: The title of the resource.
-   \`url\`: A direct URL to the resource.
-   \`justification\`: A brief, personalized explanation (1-2 sentences) of *why* this specific resource is a great choice for learning the given topic.

Output the entire list of 6 recommendations in the specified JSON format.
`,
});

const generateResourceRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateResourceRecommendationsFlow',
    inputSchema: GenerateResourceRecommendationsInputSchema,
    outputSchema: GenerateResourceRecommendationsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
