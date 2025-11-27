'use server';
/**
 * @fileOverview Generates a multiple-choice quiz for a given topic and difficulty level.
 *
 * - generateQuiz - A function that generates the quiz.
 * - GenerateQuizInput - The input type for the function.
 * - GenerateQuizOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate a quiz.'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The difficulty level of the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;


const QuizQuestionSchema = z.object({
    question: z.string().describe('The question text.'),
    options: z.array(z.string()).describe('An array of 4 multiple-choice options.'),
    answer: z.string().describe('The correct option.'),
    explanation: z.string().describe('A brief explanation for the correct answer.'),
});

const GenerateQuizOutputSchema = z.object({
    topic: z.string(),
    questions: z.array(QuizQuestionSchema).length(5).describe('An array of 5 quiz questions.'),
});

export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(
  input: GenerateQuizInput
): Promise<{ quiz: GenerateQuizOutput, error?: string }> {
    try {
        const quiz = await generateQuizFlow(input);
        return { quiz };
    } catch(e: any) {
        return { error: e.message, quiz: { topic: input.topic, questions: []}};
    }
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an AI expert who creates educational content. Your task is to generate a 5-question multiple-choice quiz about the given topic, tailored to the specified difficulty level.

For each question, provide:
1.  A clear and concise question.
2.  Four distinct multiple-choice options.
3.  The correct answer.
4.  A brief but helpful explanation of why the answer is correct.

The quiz should be challenging enough to test understanding but not overly obscure. Ensure all information is accurate.

Topic: {{{topic}}}
Difficulty Level: {{{level}}}
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
