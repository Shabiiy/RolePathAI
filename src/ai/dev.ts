'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-micro-project-prompts.ts';
import '@/ai/flows/generate-personalized-roadmap.ts';
import '@/ai/flows/match-curated-resources.ts';
import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/analyze-skill-gap.ts';
import '@/ai/flows/generate-resume-points.ts';
import '@/ai/flows/generate-portfolio-advice.ts';
import '@/ai/flows/generate-interview-questions.ts';
import '@/ai/flows/generate-standard-projects.ts';
import '@/ai/flows/compare-job-roles.ts';
import '@/ai/flows/generate-resource-recommendations.ts';
import '@/ai/types.ts';
