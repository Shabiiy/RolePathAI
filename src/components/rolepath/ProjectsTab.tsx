'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Loader, Sparkles, Code, Database, Target, ChevronRight } from 'lucide-react';
import type { RoadmapData } from '@/types';
import { generateStandardProjectsAction } from '@/app/actions';

interface ProjectsTabProps {
  roadmapData: RoadmapData;
}

const projectsFormSchema = z.object({
  interests: z.string().min(1, 'Please enter at least one interest.'),
});
type ProjectsFormValues = z.infer<typeof projectsFormSchema>;

const levelClasses = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/50',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  Advanced: 'bg-red-500/20 text-red-400 border-red-500/50',
};

export default function ProjectsTab({ roadmapData }: ProjectsTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProjectsFormValues>({
    resolver: zodResolver(projectsFormSchema),
    defaultValues: { interests: '' },
  });

  const handleGenerateProjects = async (values: ProjectsFormValues) => {
    setIsLoading(true);
    setError(null);
    setProjects([]);
    try {
      const interests = values.interests.split(',').map(s => s.trim()).filter(Boolean);
      const result = await generateStandardProjectsAction({
        targetJobRole: roadmapData.inputs?.targetJobRole || '',
        interests: interests,
      });
      if (result.error) throw new Error(result.error);
      setProjects(result.data?.projects || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Code className="text-primary" />
            Industry Project Generator
          </CardTitle>
          <CardDescription>
            Generate beginner, intermediate, and advanced project ideas based on your interests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateProjects)} className="space-y-4">
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Interests</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Gaming, Finance, Healthcare" {...field} />
                    </FormControl>
                    <FormDescription>
                        Enter a few topics you're passionate about, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                Generate Project Ideas
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

        {error && (
            <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

      {projects.length > 0 && (
        <Accordion type="single" collapsible defaultValue={projects[0].title} className="w-full space-y-4">
            {projects.map((project, index) => (
                <AccordionItem value={project.title} key={index} className="border bg-secondary/30 rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                        <div className='flex items-center gap-4'>
                            <Badge className={levelClasses[project.level]}>{project.level}</Badge>
                            <span className="text-lg font-semibold">{project.title}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                        <p className="text-muted-foreground">{project.description}</p>
                        
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><ChevronRight className="w-5 h-5"/>Key Features</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {project.keyFeatures.map((feature: string, i: number) => <li key={i}>{feature}</li>)}
                            </ul>
                        </div>

                        {project.suggestedDatasets && project.suggestedDatasets.length > 0 && (
                             <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><Database className="w-5 h-5"/>Suggested Datasets</h4>
                                <ul className="list-none space-y-2 text-sm">
                                    {project.suggestedDatasets.map((ds: any, i: number) => (
                                        <li key={i}><a href={ds.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{ds.name}</a></li>
                                    ))}
                                </ul>
                            </div>
                        )}

                         {project.evaluationMetrics && project.evaluationMetrics.length > 0 && (
                             <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><Target className="w-5 h-5"/>Evaluation Metrics</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {project.evaluationMetrics.map((metric: string, i: number) => <li key={i}>{metric}</li>)}
                                </ul>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      )}
    </div>
  );
}
