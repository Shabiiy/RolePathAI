'use client'

import { BrainCircuit, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  LayoutDashboard,
  Network,
  ListChecks,
  Briefcase,
  MessageSquare,
  Scale,
} from 'lucide-react'

const features = [
  {
    icon: <Network className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Roadmaps',
    description: 'Get a personalized, step-by-step learning plan for any tech role.',
  },
  {
    icon: <ListChecks className="h-8 w-8 text-blue-500" />,
    title: 'Skill Gap Analysis',
    description: 'Understand exactly which skills you need to learn to reach your goal.',
  },
  {
    icon: <Briefcase className="h-8 w-8 text-green-500" />,
    title: 'Project Generation',
    description: 'Receive tailored project ideas to build a portfolio that stands out.',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-yellow-500" />,
    title: 'Interview Prep Toolkit',
    description: 'Generate resume points and practice with AI-curated interview questions.',
  },
  {
    icon: <Scale className="h-8 w-8 text-purple-500" />,
    title: 'Compare Career Paths',
    description: 'Analyze two different job roles to see which one is a better fit for you.',
  },
  {
    icon: <LayoutDashboard className="h-8 w-8 text-red-500" />,
    title: 'Progress Dashboard',
    description: 'Track your completed tasks and earn XP and badges to stay motivated.',
  },
]

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center px-4 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center pt-20 md:pt-32"
      >
        <div className="mx-auto w-fit mb-4">
          <BrainCircuit className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/60 py-2">
          RolePath AI
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
          Your personal AI career co-pilot. Generate tailored learning roadmaps, analyze skill gaps, and get the tools you need to land your dream job in tech.
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
          className="mt-8"
        >
          <Button asChild size="lg">
            <Link href="/login">
              Get Started for Free
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        className="mt-24 md:mt-32 w-full max-w-6xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-center">
          Everything You Need to Succeed
        </h2>
        <p className="text-center text-muted-foreground mt-2">From planning your path to acing the interview.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-primary/10 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-start gap-4">
                  {feature.icon}
                  <div className="flex-1">
                    <CardTitle className='text-lg'>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center my-24 md:my-32"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Start Your Journey?</h2>
        <p className="mt-4 text-lg text-muted-foreground">Stop guessing. Start building.</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/login">
            Create Your First Roadmap
          </Link>
        </Button>
      </motion.div>
    </main>
  )
}
