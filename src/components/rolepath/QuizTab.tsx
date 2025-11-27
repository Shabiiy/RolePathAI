'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, HelpCircle, Loader, Sparkles, XCircle } from 'lucide-react'

import { parseTopics } from '@/lib/parser'
import type { Quiz, QuizQuestion } from '@/types'
import { generateQuizAction } from '@/app/actions'
import { cn } from '@/lib/utils'

interface QuizTabProps {
  roadmap: string
}

const quizTopicSchema = z.object({
  topic: z.string().min(1, 'Please select a topic.'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
})

type QuizTopicFormValues = z.infer<typeof quizTopicSchema>

const difficultyLevels: QuizTopicFormValues['level'][] = ['Beginner', 'Intermediate', 'Advanced'];

const quizAnswerSchema = z.object({}) // Empty schema for the quiz answers form

export default function QuizTab({ roadmap }: QuizTabProps) {
  const allTopics = parseTopics(roadmap)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)


  const form = useForm<QuizTopicFormValues>({
    resolver: zodResolver(quizTopicSchema),
    defaultValues: { topic: '', level: 'Beginner' },
  })

  // A new form instance for the quiz answers
  const quizForm = useForm({
    resolver: zodResolver(quizAnswerSchema),
  });

  const onTopicSubmit = async (values: QuizTopicFormValues) => {
    setIsLoading(true)
    setError(null)
    setQuiz(null)
    setShowResults(false)
    setSelectedAnswers({})
    setCurrentQuestionIndex(0)

    try {
      const result = await generateQuizAction(values)
      if (result.error) {
        throw new Error(result.error)
      }
      if (result.data) {
        setQuiz(result.data)
      }
    } catch (e: any) {
      setError(e.message || 'Failed to generate quiz.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({...prev, [questionIndex]: answer}));
  }

  const handleSubmitQuiz = () => {
    setShowResults(true);
  }

  const handleRestart = () => {
    setQuiz(null);
    setShowResults(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    form.reset();
  }
  
  const score = quiz ? Object.keys(selectedAnswers).reduce((correct, qIndex) => {
    const question = quiz.questions[parseInt(qIndex)];
    return question.answer === selectedAnswers[parseInt(qIndex)] ? correct + 1 : correct;
  }, 0) : 0;


  if (!quiz) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <HelpCircle className="text-primary" />
            Test Your Knowledge
          </CardTitle>
          <CardDescription>
            Select a topic and difficulty from your roadmap to generate a quick quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onTopicSubmit)}
              className="space-y-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allTopics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a level..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Quiz
              </Button>
            </form>
          </Form>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  const currentQuestion: QuizQuestion = quiz.questions[currentQuestionIndex];

  if (showResults) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Quiz Results: {quiz.topic}</CardTitle>
                <CardDescription>You scored {score} out of {quiz.questions.length}!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {quiz.questions.map((q, index) => {
                    const userAnswer = selectedAnswers[index];
                    const isCorrect = q.answer === userAnswer;
                    return (
                        <div key={index} className="p-4 border rounded-lg">
                            <p className="font-semibold">{index + 1}. {q.question}</p>
                            <p className={cn("text-sm mt-2 flex items-center gap-2", isCorrect ? "text-green-500" : "text-red-500")}>
                                {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                Your answer: {userAnswer || 'Not answered'} {isCorrect ? "" : `(Correct: ${q.answer})`}
                            </p>
                            <Alert className="mt-2 text-sm bg-secondary/50">
                                <AlertDescription>{q.explanation}</AlertDescription>
                            </Alert>
                        </div>
                    );
                })}
            </CardContent>
            <CardFooter>
                <Button onClick={handleRestart}>Take Another Quiz</Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Quiz: {quiz.topic}</CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </CardDescription>
      </CardHeader>
      <Form {...quizForm}>
        <form>
            <CardContent className="space-y-6">
                <p className="font-semibold text-lg">{currentQuestion.question}</p>
                <RadioGroup onValueChange={(val) => handleAnswerSelect(currentQuestionIndex, val)} value={selectedAnswers[currentQuestionIndex]}>
                    {currentQuestion.options.map((option, index) => (
                        <FormItem key={index} className="flex items-center space-x-3 space-y-0 p-3 rounded-md hover:bg-secondary transition-colors">
                            <FormControl>
                                <RadioGroupItem value={option} id={`q${currentQuestionIndex}-opt${index}`} />
                            </FormControl>
                            <FormLabel htmlFor={`q${currentQuestionIndex}-opt${index}`} className="font-normal cursor-pointer flex-grow">{option}</FormLabel>
                        </FormItem>
                    ))}
                </RadioGroup>
            </CardContent>
        </form>
      </Form>
       <CardFooter className="flex justify-between">
        <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
        >
            Previous
        </Button>
        {currentQuestionIndex < quiz.questions.length - 1 ? (
             <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} disabled={!selectedAnswers[currentQuestionIndex]}>
                Next
            </Button>
        ) : (
            <Button onClick={handleSubmitQuiz} disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}>
                Submit Quiz
            </Button>
        )}
      </CardFooter>
    </Card>
  )
}
