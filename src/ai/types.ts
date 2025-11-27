/**
 * @fileoverview This file contains the Zod schemas and TypeScript types for the AI flows.
 * It is kept separate from the flow definitions to avoid "use server" conflicts, as these
 * schemas need to be imported by client-side components and server-side actions.
 */
import { z } from 'zod';

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SCHEMAS FOR: generateResumePoints
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

export const GenerateResumePointsInputSchema = z.object({
  targetJobRole: z.string().describe('The job role the user is aiming for.'),
  skill: z.string().describe('The skill the user is learning or has just learned.'),
  projectName: z.string().optional().describe('An optional project name where the skill was applied.'),
});
export type GenerateResumePointsInput = z.infer<typeof GenerateResumePointsInputSchema>;

export const GenerateResumePointsOutputSchema = z.object({
  bulletPoints: z.array(z.string()).describe('An array of 3-5 resume bullet points.'),
});
export type GenerateResumePointsOutput = z.infer<typeof GenerateResumePointsOutputSchema>;


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SCHEMAS FOR: generatePortfolioAdvice
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

export const GeneratePortfolioAdviceInputSchema = z.object({
  targetJobRole: z.string().describe('The job role the user is aiming for.'),
  skills: z.array(z.string()).describe("The user's key skills."),
});
export type GeneratePortfolioAdviceInput = z.infer<typeof GeneratePortfolioAdviceInputSchema>;


export const GeneratePortfolioAdviceOutputSchema = z.object({
  suggestedStructure: z.array(z.object({
      section: z.string().describe('Name of the portfolio section (e.g., "Hero", "Projects", "About Me").'),
      description: z.string().describe('What this section should contain and why it is important for the target role.'),
  })).describe('An array of objects describing the suggested portfolio structure.'),
  projectDisplayTips: z.array(z.string()).describe('A list of tips on how to best display projects to impress recruiters for this role.'),
  generalTips: z.array(z.string()).describe("A list of general \"do's\" and \"don'ts\" for the portfolio."),
});
export type GeneratePortfolioAdviceOutput = z.infer<typeof GeneratePortfolioAdviceOutputSchema>;


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SCHEMAS FOR: generateInterviewQuestions
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

export const GenerateInterviewQuestionsInputSchema = z.object({
  targetJobRole: z.string().describe('The job role to generate questions for.'),
  skills: z.array(z.string()).describe('A list of skills to focus on.'),
  questionTypes: z.array(z.enum(['Technical', 'Behavioral'])).describe('The types of questions to generate.'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const InterviewQuestionSchema = z.object({
    question: z.string(),
    type: z.enum(['Technical', 'Behavioral']),
    topic: z.string().describe('The skill or area this question relates to.'),
});

export const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z.array(InterviewQuestionSchema),
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SCHEMAS FOR: generateStandardProjects
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

export const GenerateStandardProjectsInputSchema = z.object({
  targetJobRole: z.string().describe('The job role to generate projects for.'),
  interests: z.array(z.string()).describe('A list of user interests to tailor the projects.'),
});
export type GenerateStandardProjectsInput = z.infer<typeof GenerateStandardProjectsInputSchema>;

const ProjectSchema = z.object({
    title: z.string(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    description: z.string(),
    keyFeatures: z.array(z.string()).describe('A list of key features to implement in the project.'),
    suggestedDatasets: z.array(z.object({ name: z.string(), url: z.string().url() })).optional().describe('Suggested datasets to use.'),
    evaluationMetrics: z.array(z.string()).optional().describe('How to evaluate the success of the project.'),
});

export const GenerateStandardProjectsOutputSchema = z.object({
  projects: z.array(ProjectSchema).describe('An array of project ideas, with one for each difficulty level.'),
});
export type GenerateStandardProjectsOutput = z.infer<typeof GenerateStandardProjectsOutputSchema>;


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SCHEMAS FOR: compareJobRoles
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

export const CompareJobRolesInputSchema = z.object({
  roleOne: z.string().describe("The first job role to compare."),
  roleTwo: z.string().describe("The second job role to compare."),
  userSkills: z.array(z.string()).describe("The user's current list of skills."),
});
export type CompareJobRolesInput = z.infer<typeof CompareJobRolesInputSchema>;

export const CompareJobRolesOutputSchema = z.object({
  skillOverlap: z.array(z.string()).describe('A list of key skills valuable for both roles.'),
  keyDifferences: z.array(z.object({
    role: z.string().describe("The job role being described."),
    points: z.array(z.string()).describe("List of unique responsibilities or skills for this role."),
  })).describe("A breakdown of features unique to each role."),
  requiredMindset: z.array(z.object({
    role: z.string().describe("The job role being described."),
    mindset: z.string().describe("Description of the typical mindset or work style for this role."),
  })).describe("A description of the mindset required for each role."),
  salaryExpectations: z.array(z.object({
    role: z.string(),
    expectation: z.string().describe("A generic, qualitative overview of salary potential."),
  })).describe("A qualitative summary of salary expectations for each role."),
  fitAssessment: z.string().describe("A brief analysis of which role might be a better fit for the user and why."),
});
export type CompareJobRolesOutput = z.infer<typeof CompareJobRolesOutputSchema>;


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SCHEMAS FOR: generateResourceRecommendations
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

export const GenerateResourceRecommendationsInputSchema = z.object({
  topic: z.string().describe('The learning topic for which to generate recommendations.'),
});
export type GenerateResourceRecommendationsInput = z.infer<typeof GenerateResourceRecommendationsInputSchema>;

const ResourceRecommendationSchema = z.object({
  category: z.string().describe("The category of the recommendation (e.g., 'Best Course', 'Best Book')."),
  title: z.string().describe("The title of the resource."),
  url: z.string().url().describe("The direct URL to the resource."),
  justification: z.string().describe("A brief explanation of why this resource is a good fit."),
});

export const GenerateResourceRecommendationsOutputSchema = z.object({
  recommendations: z.array(ResourceRecommendationSchema).length(6).describe("An array of 6 curated resource recommendations."),
});
export type GenerateResourceRecommendationsOutput = z.infer<typeof GenerateResourceRecommendationsOutputSchema>;
