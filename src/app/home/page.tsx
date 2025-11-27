'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, BrainCircuit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { useRolePathStore } from '@/hooks/use-rolepath-store'
import MainForm from '@/components/rolepath/MainForm'
import { generateFullRoadmap } from '../actions'
import { ROLES } from '@/lib/constants'
import { useUser } from '@/firebase'
import { Loader } from 'lucide-react'
import { Spotlight } from '@/components/ui/spotlight'

const formSchema = z.object({
  targetJobRole: z.string().min(1, 'Please select or enter a job role.'),
  currentSkills: z.string(),
  weeklyHours: z.coerce
    .number()
    .min(1, 'Please enter a number greater than 0.'),
  desiredWeeks: z.coerce
    .number()
    .min(1, 'Please enter a number greater than 0.'),
})


export type FormValues = z.infer<typeof formSchema>

export default function HomePage() {
  const { user, loading: isUserLoading } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const [state, { addNewRoadmap, setCurrentRoadmap }, isHydrated] = useRolePathStore();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetJobRole: '',
      currentSkills: 'None',
      weeklyHours: 10,
      desiredWeeks: 12,
    },
  })
  
  // This effect handles routing just for unauthenticated users
  useEffect(() => {
    if (isUserLoading || !isHydrated) return;

    if (!user) {
        router.push('/login');
    }
    
  }, [user, isUserLoading, isHydrated, router]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await generateFullRoadmap(values)
      if (result.error) {
        throw new Error(result.error)
      }
      if (result.data) {
        const newIndex = addNewRoadmap({
            inputs: values,
            roadmap: result.data.roadmap,
            projects: result.data.projects,
            resources: result.data.resources,
            tasks: result.data.tasks,
            analysis: result.data.analysis,
        });
        setCurrentRoadmap(newIndex);
        toast({
          title: 'Roadmap Generated!',
          description: 'Your new learning path is ready.',
        })
        router.push('/home/dashboard');
      }
    } catch (e: any) {
      setError(e.message)
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          e.message || 'There was a problem with your request.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show a full-screen loader while we determine the correct route.
  if (isUserLoading || !isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // If we reach here, it means the user is logged in. Show the form.
  return (
    <main className="container mx-auto p-0 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center gap-4 mb-8"
      >
        <BrainCircuit className="h-12 w-12 text-primary" />
        <div>
          <h1 className="text-4xl font-bold font-headline text-primary">
            RolePath AI
          </h1>
          <p className="text-muted-foreground">
            Generate a new, AI-powered career development co-pilot
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <Card className="mb-8 transition-shadow hover:shadow-primary/10 hover:shadow-lg">
          <Spotlight>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Create Your Roadmap
              </CardTitle>
              <CardDescription>Fill out the details below to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <MainForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
                roles={ROLES}
              />
            </CardContent>
          </Spotlight>
        </Card>
      </motion.div>


      {error && (
        <Alert variant="destructive" className="mb-8 animate-in fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

    </main>
  )
}
