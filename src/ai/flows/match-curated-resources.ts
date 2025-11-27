'use server';

/**
 * @fileOverview Matches curated learning resources to skills and roadmap topics.
 *  Uses TensorFlow.js embeddings to match learning resources.
 *
 * - matchCuratedResources - A function that handles the matching process.
 * - MatchCuratedResourcesInput - The input type for the matchCuratedResources function.
 * - MatchCuratedResourcesOutput - The return type for the matchCuratedResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchCuratedResourcesInputSchema = z.object({
  roleSkills: z.array(z.string()).describe('Skills associated with the target job role.'),
  roadmapTopics: z.array(z.string()).describe('Topics from the generated learning roadmap.'),
  resourceDescriptions: z.array(z.string()).describe('Descriptions of available learning resources.'),
});
export type MatchCuratedResourcesInput = z.infer<
  typeof MatchCuratedResourcesInputSchema
>;

const MatchCuratedResourcesOutputSchema = z.array(
  z.object({
    resourceIndex: z
      .number()
      .describe('Index of the matched resource in the resourceDescriptions array.'),
    confidenceScore: z.number().describe('Confidence score indicating the relevance of the match.'),
  })
);
export type MatchCuratedResourcesOutput = z.infer<
  typeof MatchCuratedResourcesOutputSchema
>;

export async function matchCuratedResources(
  input: MatchCuratedResourcesInput
): Promise<MatchCuratedResourcesOutput> {
  return matchCuratedResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchCuratedResourcesPrompt',
  input: {schema: MatchCuratedResourcesInputSchema},
  output: {schema: MatchCuratedResourcesOutputSchema},
  prompt: `You are an AI assistant designed to match learning resources to user skills and roadmap topics.

  Given a list of role skills, roadmap topics, and resource descriptions, determine the relevance of each resource to the skills and topics.

  Return an array of objects, where each object contains the index of the matched resource in the resourceDescriptions array and a confidence score indicating the relevance of the match.

  Role Skills:
  {{#each roleSkills}}
  - {{{this}}}
  {{/each}}

  Roadmap Topics:
  {{#each roadmapTopics}}
  - {{{this}}}
  {{/each}}

  Resource Descriptions:
  {{#each resourceDescriptions}}
  - {{{this}}}
  {{/each}}`,
});

const matchCuratedResourcesFlow = ai.defineFlow(
  {
    name: 'matchCuratedResourcesFlow',
    inputSchema: MatchCuratedResourcesInputSchema,
    outputSchema: MatchCuratedResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
