'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const ChatInputSchema = z.object({
    history: z.array(MessageSchema),
    message: z.string(),
});

const SYSTEM_PROMPT = `
You are the AI assistant for RolePath AI.
RolePath AI is a platform that helps users create personalized career development roadmaps.
Key features include:
- Personalized Roadmap Generation: AI-powered learning paths based on job role, skills, and availability.
- Interactive Mind Map: Visualizing learning paths with editable maps.
- Gamified Progress Tracking: Earn XP and badges.
- Curated Resource Matching: AI-matched articles, courses, and tutorials.
- Micro-Project Ideas: Practical projects to practice skills.
- Weekly Planner: Structured weekly schedules.
- Data Portability: Save, export, and share progress.

If a user asks what this site does, provide a guide and explanation based on these features.
Be helpful, encouraging, and concise.
`;

export const chatFlow = ai.defineFlow(
    {
        name: 'chatFlow',
        inputSchema: ChatInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
        const { history, message } = input;

        // Construct a text prompt from history as a fallback since ai.chat is causing issues
        const conversation = history.map(m => `${m.role === 'user' ? 'User' : 'Model'}: ${m.content}`).join('\n');
        const prompt = `${SYSTEM_PROMPT}\n\n${conversation}\nUser: ${message}\nModel:`;

        const { text } = await ai.generate(prompt);
        return text;
    }
);
