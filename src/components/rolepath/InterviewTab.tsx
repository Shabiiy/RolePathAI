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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader, Sparkles, Clipboard, Check, Lightbulb, UserCheck, MessageSquare } from 'lucide-react';
import type { RoadmapData } from '@/types';
import { parseTopics } from '@/lib/parser';
import {
  generateResumePointsAction,
  generatePortfolioAdviceAction,
  generateInterviewQuestionsAction,
} from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface InterviewTabProps {
  roadmapData: RoadmapData;
}

const resumeFormSchema = z.object({
  skill: z.string().min(1, 'Please enter a skill.'),
  projectName: z.string().optional(),
});
type ResumeFormValues = z.infer<typeof resumeFormSchema>;

const interviewQuestionsFormSchema = z.object({
  questionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})
type InterviewQuestionsFormValues = z.infer<typeof interviewQuestionsFormSchema>;


const questionTypes = [
  { id: 'Technical', label: 'Technical' },
  { id: 'Behavioral', label: 'Behavioral' },
] as const;

export default function InterviewTab({ roadmapData }: InterviewTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>();
  const [resumePoints, setResumePoints] = useState<string[]>([]);
  const [portfolioAdvice, setPortfolioAdvice] = useState<any>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const resumeForm = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: { skill: '', projectName: '' },
  });

  const iqForm = useForm<InterviewQuestionsFormValues>({
    resolver: zodResolver(interviewQuestionsFormSchema),
    defaultValues: {
      questionTypes: ["Technical", "Behavioral"],
    },
  })

  const handleGenerateResumePoints = async (values: ResumeFormValues) => {
    setIsLoading(true);
    setError(null);
    setResumePoints([]);
    try {
      const result = await generateResumePointsAction({
        ...values,
        targetJobRole: roadmapData.inputs?.targetJobRole || '',
      });
      if (result.error) throw new Error(result.error);
      setResumePoints(result.data?.bulletPoints || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePortfolioAdvice = async () => {
    setIsLoading(true);
    setError(null);
    setPortfolioAdvice(null);
    try {
      const skills = parseTopics(roadmapData.roadmap || '');
      const result = await generatePortfolioAdviceAction({
        targetJobRole: roadmapData.inputs?.targetJobRole || '',
        skills: skills.slice(0, 5),
      });
      if (result.error) throw new Error(result.error);
      setPortfolioAdvice(result.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateInterviewQuestions = async (values: InterviewQuestionsFormValues) => {
    setIsLoading(true);
    setError(null);
    setInterviewQuestions([]);
    try {
      const skills = parseTopics(roadmapData.roadmap || '');
      const result = await generateInterviewQuestionsAction({
        targetJobRole: roadmapData.inputs?.targetJobRole || '',
        skills: skills,
        questionTypes: values.questionTypes as ('Technical' | 'Behavioral')[]
      });
      if (result.error) throw new Error(result.error);
      setInterviewQuestions(result.data?.questions || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <UserCheck className="text-primary" />
            Interview Prep Toolkit
          </CardTitle>
          <CardDescription>
            Generate resume points, get portfolio advice, and practice interview questions.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible onValueChange={setActiveAccordion}>
        <AccordionItem value="resume">
          <AccordionTrigger className="text-lg font-semibold">AI Resume Helper</AccordionTrigger>
          <AccordionContent>
            <Card className="border-0">
              <CardContent className="pt-6">
                <Form {...resumeForm}>
                  <form onSubmit={resumeForm.handleSubmit(handleGenerateResumePoints)} className="space-y-4">
                    <FormField
                      control={resumeForm.control}
                      name="skill"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skill to Highlight</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., React, Python, ETL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resumeForm.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., E-commerce Dashboard" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && activeAccordion === 'resume' ? <Loader className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                      Generate Bullet Points
                    </Button>
                  </form>
                </Form>
                {resumePoints.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-semibold">Generated Bullet Points:</h3>
                    <ul className="list-none space-y-2">
                      {resumePoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 p-3 bg-secondary rounded-md text-sm">
                          <span className="flex-grow">{point}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => copyToClipboard(point)}>
                            <Clipboard className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="portfolio">
          <AccordionTrigger className="text-lg font-semibold">AI Portfolio Advisor</AccordionTrigger>
          <AccordionContent>
            <Card className="border-0">
              <CardContent className="pt-6">
                <Button onClick={handleGeneratePortfolioAdvice} disabled={isLoading}>
                  {isLoading && activeAccordion === 'portfolio' ? <Loader className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                  Get Portfolio Advice
                </Button>

                {portfolioAdvice && (
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Suggested Portfolio Structure</h3>
                      <Accordion type="multiple" defaultValue={portfolioAdvice.suggestedStructure.map((s: any) => s.section)}>
                        {portfolioAdvice.suggestedStructure.map((item: any, index: number) => (
                          <AccordionItem value={item.section} key={index}>
                            <AccordionTrigger>{item.section}</AccordionTrigger>
                            <AccordionContent>{item.description}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Project Display Tips</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {portfolioAdvice.projectDisplayTips.map((tip: string, index: number) => <li key={index}>{tip}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">General Do's & Don'ts</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {portfolioAdvice.generalTips.map((tip: string, index: number) => <li key={index}>{tip}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="interview">
          <AccordionTrigger className="text-lg font-semibold">AI Interview Practice</AccordionTrigger>
          <AccordionContent>
            <Card className="border-0">
              <CardContent className="pt-6">
                <Form {...iqForm}>
                  <form onSubmit={iqForm.handleSubmit(handleGenerateInterviewQuestions)} className="space-y-4">
                    <FormField
                      control={iqForm.control}
                      name="questionTypes"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Question Types</FormLabel>
                            <FormDescription>
                              Select the types of questions you want to practice.
                            </FormDescription>
                          </div>
                          <div className="flex gap-4 items-center">
                            {questionTypes.map((item) => (
                              <FormField
                                key={item.id}
                                control={iqForm.control}
                                name="questionTypes"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), item.id])
                                              : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && activeAccordion === 'interview' ? <Loader className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                      Generate Questions
                    </Button>
                  </form>
                </Form>

                {interviewQuestions.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold">Generated Questions:</h3>
                    {interviewQuestions.map((q, index) => (
                      <Alert key={index}>
                        <div className="flex items-center gap-2 mb-1">
                          {q.type === "Technical" ? <Lightbulb className="h-4 w-4 text-blue-500" /> : <MessageSquare className="h-4 w-4 text-green-500" />}
                          <AlertTitle>{q.type} Question ({q.topic})</AlertTitle>
                        </div>
                        <AlertDescription>{q.question}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}

              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
