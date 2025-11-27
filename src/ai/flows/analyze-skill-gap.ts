'use server';
/**
 * @fileOverview Analyzes the gap between a user's current skills and the skills required for a target job role.
 *
 * - analyzeSkillGap - A function that performs the skill gap analysis.
 * - AnalyzeSkillGapInput - The input type for the function.
 * - AnalyzeSkillGapOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ROLES } from '@/lib/constants';

const AnalyzeSkillGapInputSchema = z.object({
  targetJobRole: z
    .string()
    .describe('The job role the user is aiming for.'),
  currentSkills: z
    .array(z.string())
    .describe("An array of skills the user currently possesses."),
});
export type AnalyzeSkillGapInput = z.infer<typeof AnalyzeSkillGapInputSchema>;

const SkillAnalysisSchema = z.object({
  skill: z.string().describe('The skill being analyzed.'),
  priority: z
    .enum(['High', 'Medium', 'Low'])
    .describe('The priority for learning this skill.'),
  estimatedHours: z
    .number()
    .describe('Estimated hours needed to learn this skill to a proficient level.'),
  difficulty: z
    .enum(['Beginner', 'Intermediate', 'Advanced'])
    .describe('The difficulty level of the skill.'),
});

const AnalyzeSkillGapOutputSchema = z.object({
  missingSkills: z
    .array(z.string())
    .describe('A list of critical skills the user is missing for the role.'),
  weakSkills: z
    .array(z.string())
    .describe('A list of skills the user has but may need to improve.'),
  learningPlan: z
    .array(SkillAnalysisSchema)
    .describe(
      'A prioritized list of skills to learn, including estimated time and difficulty.'
    ),
  summary: z
    .string()
    .describe('A concise, encouraging summary of the skill gap analysis.'),
});
export type AnalyzeSkillGapOutput = z.infer<typeof AnalyzeSkillGapOutputSchema>;

export async function analyzeSkillGap(
  input: AnalyzeSkillGapInput
): Promise<AnalyzeSkillGapOutput> {
  // Find the skills for the target role
  const role = ROLES.find(r => r.title === input.targetJobRole);
  const requiredSkills = role ? role.skills : [];

  return analyzeSkillGapFlow({
    ...input,
    requiredSkills,
  });
}

// New input schema for the prompt, including the required skills
const PromptInputSchema = AnalyzeSkillGapInputSchema.extend({
    requiredSkills: z.array(z.string()).describe('The list of skills required for the target job role.')
});

const prompt = ai.definePrompt({
  name: 'analyzeSkillGapPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: AnalyzeSkillGapOutputSchema },
  prompt: `You are an expert AI career coach. Your task is to perform a detailed skill gap analysis for a user aiming for a specific job role.

Context:
- Target Job Role: {{{targetJobRole}}}
- User's Current Skills: {{#if currentSkills}}{{#each currentSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}
- Required Skills for Role: {{#if requiredSkills}}{{#each requiredSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}Skills to be inferred by the model based on the role title.{{/if}}

Analysis Task:
1.  **Identify Required Skills**: Based on the target job role, determine the essential skills. Use the provided list of "Required Skills for Role". If that list is empty, infer the skills based on the role title.
2.  **Compare Skills**: Compare the user's current skills against the required skills.
3.  **Identify Gaps**:
    -   Categorize skills into 'missingSkills' (user has no related knowledge). These are skills from the required list that are completely absent from the user's current skills.
    -   **CRITICAL**: You MUST identify and populate the 'weakSkills' field. A "weak skill" is one where the user has a related or adjacent skill, but not the specific one required. For example, if the role requires 'React' and the user knows 'Vue' or 'Angular', then 'React' is a weak skill area for them. If the role requires 'PyTorch' and the user knows 'TensorFlow', 'PyTorch' is a weak skill. You must find at least one weak skill if there is any plausible connection.
4.  **Create a Learning Plan**:
    -   For each missing or weak skill, create a learning plan item.
    -   **Prioritize**: Assign 'High', 'Medium', or 'Low' priority. Foundational skills get high priority.
    -   **Estimate Hours**: Provide a realistic estimate of learning hours to become job-ready in that skill.
    -   **Set Difficulty**: Assign 'Beginner', 'Intermediate', or 'Advanced' difficulty.
5.  **Write a Summary**: Provide a brief, encouraging summary of the analysis, highlighting the user's strengths and the clear path forward.

Output the entire analysis in the specified JSON format. Do not leave the 'weakSkills' array empty if there are any skills that are related but not an exact match.
`,
});

const analyzeSkillGapFlow = ai.defineFlow(
  {
    name: 'analyzeSkillGapFlow',
    inputSchema: PromptInputSchema, // Use the extended schema
    outputSchema: AnalyzeSkillGapOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
