'use server';

/**
 * @fileOverview Generates a personalized learning roadmap for a specific job role.
 *
 * - generatePersonalizedRoadmap - A function that generates the roadmap.
 * - GeneratePersonalizedRoadmapInput - The input type for the generatePersonalizedRoadmap function.
 * - GeneratePersonalizedRoadmapOutput - The return type for the generatePersonalizedRoadmap function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePersonalizedRoadmapInputSchema = z.object({
  targetJobRole: z.string().describe('The target job role for the roadmap.'),
  currentSkills: z.array(z.string()).describe('The user\'s current skills.'),
  weeklyHours: z.number().describe('The number of hours per week the user can dedicate to learning.'),
  desiredWeeks: z.number().describe('The desired number of weeks to complete the roadmap.'),
});
export type GeneratePersonalizedRoadmapInput = z.infer<typeof GeneratePersonalizedRoadmapInputSchema>;

const GeneratePersonalizedRoadmapOutputSchema = z.object({
  phases: z.array(z.object({
    title: z.string().describe('The title of the phase.'),
    weeks: z.string().describe('The weeks range for the phase (e.g. "Weeks 1-2").'),
    topics: z.array(z.string()).describe('List of topics covered in this phase.'),
  })).describe('The generated learning roadmap phases.'),
});
export type GeneratePersonalizedRoadmapOutput = z.infer<typeof GeneratePersonalizedRoadmapOutputSchema>;

export async function generatePersonalizedRoadmap(
  input: GeneratePersonalizedRoadmapInput
): Promise<GeneratePersonalizedRoadmapOutput> {
  return generatePersonalizedRoadmapFlow(input);
}

const roadmapPrompt = ai.definePrompt({
  name: 'roadmapPrompt',
  input: { schema: GeneratePersonalizedRoadmapInputSchema },
  output: { schema: GeneratePersonalizedRoadmapOutputSchema },
  prompt: `You are an AI career coach who specializes in generating personalized learning roadmaps.

  Based on the user\'s target job role, current skills, time commitment, and desired timeline, generate a structured learning roadmap.

  Target Job Role: {{{targetJobRole}}}
  Current Skills: {{#each currentSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Weekly Hours: {{{weeklyHours}}}
  Desired Weeks: {{{desiredWeeks}}}
  
  Generate a list of phases. Each phase should have a title, a weeks range, and a list of topics.`,
});

const generatePersonalizedRoadmapFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedRoadmapFlow',
    inputSchema: GeneratePersonalizedRoadmapInputSchema,
    outputSchema: GeneratePersonalizedRoadmapOutputSchema,
  },
  async input => {
    const { output } = await roadmapPrompt(input);
    return output!;
  }
);
