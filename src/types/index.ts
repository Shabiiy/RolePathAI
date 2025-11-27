import type { LucideIcon } from 'lucide-react'

export interface Role {
  title: string
  description: string
  skills: string[]
}

export interface Resource {
  title: string
  url: string
  description: string
  tags: string[]
  level: 'Beginner' | 'Intermediate' | 'Advanced'
}

export interface MatchedResource extends Resource {
  confidence: number
}

export interface Task {
  id: string
  text: string
  completed: boolean
  xp: number
}

export interface Badge {
  name: string
  xpThreshold: number
  icon: LucideIcon
  description: string
}

export interface RoadmapPhase {
  title: string;
  weeks: string;
  topics: { title: string }[];
}

export interface SkillAnalysis {
    skill: string;
    priority: 'High' | 'Medium' | 'Low';
    estimatedHours: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SkillGapAnalysis {
    missingSkills: string[];
    weakSkills: string[];
    learningPlan: SkillAnalysis[];
    summary: string;
}

export interface RoadmapData {
  id: string;
  createdAt: string;
  inputs: {
    targetJobRole: string
    currentSkills: string
    weeklyHours: number
    desiredWeeks: number
  } | null
  roadmap: string | null
  projects: string[] | null
  resources: MatchedResource[] | null
  tasks: Task[] | null
  analysis: SkillGapAnalysis | null;
}

export interface AppState {
  roadmaps: RoadmapData[];
  currentRoadmapIndex: number;
}


export interface QuizQuestion {
  question: string
  options: string[]
  answer: string
  explanation: string
}

export interface Quiz {
  topic: string
  questions: QuizQuestion[]
}
