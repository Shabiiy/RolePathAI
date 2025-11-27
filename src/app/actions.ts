'use server'

import { z } from 'zod'
import { generatePersonalizedRoadmap } from '@/ai/flows/generate-personalized-roadmap'
import { generateMicroProjectPrompts } from '@/ai/flows/generate-micro-project-prompts'
import { matchCuratedResources } from '@/ai/flows/match-curated-resources'
import { generateQuiz } from '@/ai/flows/generate-quiz'
import { analyzeSkillGap } from '@/ai/flows/analyze-skill-gap'
import { generateResumePoints } from '@/ai/flows/generate-resume-points'
import { generatePortfolioAdvice } from '@/ai/flows/generate-portfolio-advice'
import { generateInterviewQuestions } from '@/ai/flows/generate-interview-questions'
import { generateStandardProjects } from '@/ai/flows/generate-standard-projects'
import { compareJobRoles } from '@/ai/flows/compare-job-roles'
import { generateResourceRecommendations } from '@/ai/flows/generate-resource-recommendations'
import {
  GenerateResumePointsInputSchema,
  GeneratePortfolioAdviceInputSchema,
  GenerateInterviewQuestionsInputSchema,
  GenerateStandardProjectsInputSchema,
  CompareJobRolesInputSchema,
  GenerateResourceRecommendationsInputSchema
} from '@/ai/types'

import { RESOURCES, ROLES } from '@/lib/constants'
import { parseRoadmap, parseTopics } from '@/lib/parser'
import type { RoadmapData } from '@/types'

const formSchema = z.object({
  targetJobRole: z.string(),
  currentSkills: z.string(),
  weeklyHours: z.coerce.number(),
  desiredWeeks: z.coerce.number(),
})

export async function generateFullRoadmap(values: z.infer<typeof formSchema>): Promise<{ data?: Omit<RoadmapData, 'id' | 'createdAt'>; error?: string; }> {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      error:
        'Missing GOOGLE_API_KEY. Please add it to your .env file to enable AI features.',
    }
  }
  const validatedValues = formSchema.safeParse(values)
  if (!validatedValues.success) {
    return { error: 'Invalid input values.' }
  }

  const { targetJobRole, currentSkills, weeklyHours, desiredWeeks } = validatedValues.data

  const finalJobRole = targetJobRole;

  if (!finalJobRole) {
    return { error: 'A job role must be specified.' }
  }

  const currentSkillList = currentSkills.split(',').map((s) => s.trim()).filter(s => s.toLowerCase() !== 'none' && s);

  try {
    // Run all generation tasks in parallel
    const [
      roadmapResult,
      analysisResult,
    ] = await Promise.all([
      generatePersonalizedRoadmap({
        targetJobRole: finalJobRole,
        currentSkills: currentSkillList,
        weeklyHours,
        desiredWeeks,
      }),
      analyzeSkillGap({
        targetJobRole: finalJobRole,
        currentSkills: currentSkillList,
      }),
    ]);


    if (!roadmapResult || !roadmapResult.phases) {
      throw new Error('Failed to get a response from the roadmap generation AI.')
    }

    // Convert structured phases back to string format for compatibility
    const roadmap = roadmapResult.phases.map((phase, index) => {
      const topics = phase.topics.map(t => `- ${t}`).join('\n');
      return `Phase ${index + 1}: ${phase.title} (${phase.weeks})\n${topics}`;
    }).join('\n\n');

    if (!analysisResult) {
      throw new Error('Failed to get a response from the skill analysis AI.');
    }

    // Dependent generations
    const promptsResult = await generateMicroProjectPrompts({ roadmap })
    const projects = promptsResult?.prompts || ['No projects generated.']

    const roleSkills =
      ROLES.find((r) => r.title === finalJobRole)?.skills || parseTopics(roadmap).slice(0, 5) // Use generated topics if role is custom
    const roadmapTopics = parseTopics(roadmap)
    const resourceDescriptions = RESOURCES.map((r) => r.description)

    const matchedResourcesIndices = await matchCuratedResources({
      roleSkills,
      roadmapTopics,
      resourceDescriptions,
    })

    const matchedResources = matchedResourcesIndices
      .map((match) => ({
        ...RESOURCES[match.resourceIndex],
        confidence: match.confidenceScore,
      }))
      .sort((a, b) => b.confidence - a.confidence)

    const tasks = parseRoadmap(roadmap).flatMap(phase => phase.topics.map(topic => ({
      id: topic.title.replace(/\s+/g, '-').toLowerCase() + '-' + Math.random().toString(36).substring(2, 7),
      text: topic.title,
      completed: false,
      xp: 10,
    })))


    return {
      data: {
        inputs: validatedValues.data,
        roadmap,
        projects,
        resources: matchedResources,
        tasks,
        analysis: analysisResult,
      },
    }
  } catch (error: any) {
    console.error('Error in generateFullRoadmap:', error)
    return {
      error: error.message || 'An error occurred while generating the roadmap. Please try again.',
    }
  }
}


const quizFormSchema = z.object({
  topic: z.string(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
})

export async function generateQuizAction(values: z.infer<typeof quizFormSchema>) {
  if (!process.env.GOOGLE_API_KEY) {
    return {
      error:
        'Missing GOOGLE_API_KEY. Please add it to your .env file to enable AI features.',
    }
  }
  const validatedValues = quizFormSchema.safeParse(values)
  if (!validatedValues.success) {
    return { error: 'Invalid input values.' }
  }

  const { topic, level } = validatedValues.data

  try {
    const result = await generateQuiz({ topic, level })
    if (result.error) {
      throw new Error(result.error)
    }
    return {
      data: result.quiz,
    }
  } catch (error: any) {
    console.error('Error in generateQuizAction:', error)
    return {
      error: error.message || 'An error occurred while generating the quiz.',
    }
  }
}

async function handleAIGeneration<T, U>(input: T, schema: z.ZodType<T>, flow: (input: T) => Promise<U>) {
  if (!process.env.GOOGLE_API_KEY) {
    return { error: 'Missing GOOGLE_API_KEY. Please add it to your .env file to enable AI features.' };
  }
  const validatedInput = schema.safeParse(input);
  if (!validatedInput.success) {
    return { error: 'Invalid input values.' };
  }
  try {
    const result = await flow(validatedInput.data);
    return { data: result };
  } catch (error: any) {
    console.error(`Error in AI action:`, error);
    return { error: error.message || 'An error occurred during AI generation.' };
  }
}

export async function generateResumePointsAction(values: z.infer<typeof GenerateResumePointsInputSchema>) {
  return handleAIGeneration(values, GenerateResumePointsInputSchema, generateResumePoints);
}

export async function generatePortfolioAdviceAction(values: z.infer<typeof GeneratePortfolioAdviceInputSchema>) {
  return handleAIGeneration(values, GeneratePortfolioAdviceInputSchema, generatePortfolioAdvice);
}

export async function generateInterviewQuestionsAction(values: z.infer<typeof GenerateInterviewQuestionsInputSchema>) {
  return handleAIGeneration(values, GenerateInterviewQuestionsInputSchema, generateInterviewQuestions);
}

export async function generateStandardProjectsAction(values: z.infer<typeof GenerateStandardProjectsInputSchema>) {
  return handleAIGeneration(values, GenerateStandardProjectsInputSchema, generateStandardProjects);
}

export async function compareJobRolesAction(values: z.infer<typeof CompareJobRolesInputSchema>) {
  return handleAIGeneration(values, CompareJobRolesInputSchema, compareJobRoles);
}

export async function generateResourceRecommendationsAction(values: z.infer<typeof GenerateResourceRecommendationsInputSchema>) {
  return handleAIGeneration(values, GenerateResourceRecommendationsInputSchema, generateResourceRecommendations);
}
