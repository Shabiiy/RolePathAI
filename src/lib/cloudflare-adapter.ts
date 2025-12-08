
import { generateText } from './cloudflare';
import { GeneratePersonalizedRoadmapInput } from '@/ai/flows/generate-personalized-roadmap';

export async function generateRoadmapWithCloudflare(input: GeneratePersonalizedRoadmapInput) {
    const prompt = `
    You are an expert career coach. Create a highly detailed and personalized learning roadmap for the following user:
    - Target Role: ${input.targetJobRole}
    - Current Skills: ${input.currentSkills.join(', ')}
    - Availability: ${input.weeklyHours} hours/week for ${input.desiredWeeks} weeks.

    For each phase, provide a catchy title and a list of topics.
    For each topic, provide a brief but expressive description or sub-topics (e.g., "React Hooks: Mastering useEffect and useState").

    Output ONLY valid JSON with the following structure:
    {
        "phases": [
            {
                "title": "Phase Title",
                "weeks": "Weeks 1-4",
                "topics": ["Topic 1: Description", "Topic 2: Description"]
            }
        ]
    }
    Do not include any markdown formatting (like \`\`\`json). Just the raw JSON string.
    `;

    const response = await generateText(prompt);

    if (!response) {
        throw new Error('Failed to generate roadmap with Cloudflare AI.');
    }

    try {
        // Clean up response if it contains markdown code blocks
        const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedResponse);

        if (!parsed.phases || !Array.isArray(parsed.phases)) {
            throw new Error('Invalid roadmap format received from AI.');
        }

        return parsed as { phases: { title: string; weeks: string; topics: string[] }[] };
    } catch (error) {
        console.error('Error parsing Cloudflare response:', error, response);
        throw new Error('Failed to parse roadmap generation result.');
    }
}

export async function analyzeSkillGapWithCloudflare(input: { targetJobRole: string; currentSkills: string[] }) {
    const prompt = `
    You are an expert AI career coach. Perform a skill gap analysis.
    - Target Role: ${input.targetJobRole}
    - Current Skills: ${input.currentSkills.join(', ')}

    Output ONLY valid JSON with the following structure:
    {
        "missingSkills": ["Skill 1", "Skill 2"],
        "weakSkills": ["Skill 3"],
        "learningPlan": [
            {
                "skill": "Skill Name",
                "priority": "High",
                "estimatedHours": 10,
                "difficulty": "Beginner"
            }
        ],
        "summary": "Brief summary text."
    }
    Do not include any markdown formatting.
    `;

    const response = await generateText(prompt);

    if (!response) {
        throw new Error('Failed to analyze skill gap with Cloudflare AI.');
    }

    try {
        const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedResponse);
        return parsed as {
            missingSkills: string[];
            weakSkills: string[];
            learningPlan: {
                skill: string;
                priority: 'High' | 'Medium' | 'Low';
                estimatedHours: number;
                difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
            }[];
            summary: string;
        };
    } catch (error) {
        console.error('Error parsing Cloudflare skill analysis:', error, response);
        throw new Error('Failed to parse skill analysis result.');
    }
}

export async function generateMicroProjectPromptsWithCloudflare(input: { roadmap: string }) {
    const prompt = `
    You are an AI assistant designed to generate micro-project prompts based on a user's learning roadmap.

    Roadmap: ${input.roadmap}

    Generate a list of engaging and practical micro-project prompts that will help the user solidify their understanding of the topics in the roadmap. Each prompt should be concise and actionable, encouraging hands-on learning and portfolio development.
    
    Output ONLY valid JSON with the following structure:
    {
        "prompts": ["Prompt 1", "Prompt 2"]
    }
    Do not include any markdown formatting.
    `;

    const response = await generateText(prompt);

    if (!response) {
        throw new Error('Failed to generate micro-project prompts with Cloudflare AI.');
    }

    try {
        const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedResponse);
        return parsed as { prompts: string[] };
    } catch (error) {
        console.error('Error parsing Cloudflare micro-projects:', error, response);
        return { prompts: ['Failed to generate specific projects. Try building a simple app using the skills in your roadmap.'] };
    }
}

export async function matchCuratedResourcesWithCloudflare(input: { roleSkills: string[], roadmapTopics: string[], resourceDescriptions: string[] }) {
    const prompt = `
    You are an AI assistant designed to match learning resources to user skills and roadmap topics.

    Given a list of role skills, roadmap topics, and resource descriptions, determine the relevance of each resource to the skills and topics.

    Role Skills: ${input.roleSkills.join(', ')}
    Roadmap Topics: ${input.roadmapTopics.join(', ')}
    
    Resource Descriptions:
    ${input.resourceDescriptions.map((desc, i) => `${i}: ${desc}`).join('\n')}

    Return an array of objects, where each object contains the index of the matched resource in the resourceDescriptions array and a confidence score (0-1) indicating the relevance of the match.
    
    Output ONLY valid JSON with the following structure:
    [
        { "resourceIndex": 0, "confidenceScore": 0.95 },
        { "resourceIndex": 1, "confidenceScore": 0.4 }
    ]
    Do not include any markdown formatting.
    `;

    const response = await generateText(prompt);

    if (!response) {
        throw new Error('Failed to match resources with Cloudflare AI.');
    }

    try {
        const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedResponse);
        return parsed as { resourceIndex: number; confidenceScore: number }[];
    } catch (error) {
        console.error('Error parsing Cloudflare resource matching:', error, response);
        return [];
    }
}

export async function generateQuizWithCloudflare(input: { topic: string; level: string }) {
    const prompt = `
    Generate a multiple-choice quiz for the topic: "${input.topic}" at a "${input.level}" level.
    Create 5 questions.

    Output ONLY valid JSON with the following structure:
    {
        "quiz": {
            "topic": "${input.topic}",
            "questions": [
                {
                    "question": "Question text?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "answer": "Option A",
                    "explanation": "Explanation text."
                }
            ]
        }
    }
    Do not include any markdown formatting.
    `;

    const response = await generateText(prompt);
    if (!response) throw new Error('Failed to generate quiz with Cloudflare AI.');

    try {
        const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedResponse);
        return parsed as { quiz: { topic: string; questions: any[] } };
    } catch (error) {
        console.error('Error parsing quiz:', error);
        throw new Error('Failed to parse quiz.');
    }
}

export async function generateResumePointsWithCloudflare(input: { targetJobRole: string; skill: string; projectName?: string }) {
    const prompt = `
    Generate professional resume bullet points for a "${input.targetJobRole}".
    Focus on the skill: "${input.skill}"${input.projectName ? ` applied in project "${input.projectName}"` : ''}.

    Output ONLY valid JSON:
    {
        "bulletPoints": ["Point 1", "Point 2", "Point 3"]
    }
    `;
    const response = await generateText(prompt);
    if (!response) throw new Error('Failed to generate resume points.');
    try {
        const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned) as { bulletPoints: string[] };
    } catch (e) { return { bulletPoints: [] }; }
}

export async function generatePortfolioAdviceWithCloudflare(input: { targetJobRole: string; skills: string[] }) {
    const prompt = `
    Provide portfolio advice for a "${input.targetJobRole}".
    Skills: ${input.skills.join(', ')}.

    Output ONLY valid JSON:
    {
        "suggestedStructure": [{ "section": "Name", "description": "Desc" }],
        "projectDisplayTips": ["Tip 1"],
        "generalTips": ["Tip 1"]
    }
    `;
    const response = await generateText(prompt);
    if (!response) throw new Error('Failed to generate portfolio advice.');
    try {
        const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned) as { suggestedStructure: any[]; projectDisplayTips: string[]; generalTips: string[] };
    } catch (e) { return { suggestedStructure: [], projectDisplayTips: [], generalTips: [] }; }
}

export async function generateInterviewQuestionsWithCloudflare(input: { targetJobRole: string; skills: string[]; questionTypes: string[] }) {
    const prompt = `
    Generate interview questions for a "${input.targetJobRole}".
    Skills: ${input.skills.join(', ')}.
    Types: ${input.questionTypes.join(', ')}.

    Output ONLY valid JSON:
    {
        "questions": [
            { "question": "Q1", "type": "Technical", "topic": "React" }
        ]
    }
    `;
    const response = await generateText(prompt);
    if (!response) throw new Error('Failed to generate interview questions.');
    try {
        const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned) as { questions: { question: string; type: string; topic: string }[] };
    } catch (e) { return { questions: [] }; }
}

export async function generateStandardProjectsWithCloudflare(input: { targetJobRole: string; interests: string[] }) {
    const prompt = `
    Suggest standard portfolio projects for a "${input.targetJobRole}".
    Interests: ${input.interests.join(', ')}.

    Output ONLY valid JSON:
    {
        "projects": [
            { "title": "Project 1", "level": "Beginner", "description": "Desc", "keyFeatures": ["Feature 1"] }
        ]
    }
    `;
    const response = await generateText(prompt);
    if (!response) throw new Error('Failed to generate projects.');
    try {
        const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned) as { projects: any[] };
    } catch (e) { return { projects: [] }; }
}

export async function compareJobRolesWithCloudflare(input: { roleOne: string; roleTwo: string; userSkills: string[] }) {
    const prompt = `
    Compare the job roles "${input.roleOne}" and "${input.roleTwo}".
    User Skills: ${input.userSkills.join(', ')}.

    Output ONLY valid JSON:
    {
        "skillOverlap": ["Skill 1"],
        "keyDifferences": [{ "role": "${input.roleOne}", "points": ["Point 1"] }],
        "requiredMindset": [{ "role": "${input.roleOne}", "mindset": "Mindset description" }],
        "salaryExpectations": [{ "role": "${input.roleOne}", "expectation": "Salary info" }],
        "fitAssessment": "Assessment text"
    }
    `;
    const response = await generateText(prompt);
    if (!response) throw new Error('Failed to compare roles.');
    try {
        const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned) as { skillOverlap: string[]; keyDifferences: any[]; requiredMindset: any[]; salaryExpectations: any[]; fitAssessment: string };
    } catch (e) { throw new Error('Failed to parse comparison.'); }
}

export async function generateResourceRecommendationsWithCloudflare(input: { topic: string }) {
    const prompt = `
    Recommend 6 learning resources for "${input.topic}".

    Output ONLY valid JSON:
    {
        "recommendations": [
            { "category": "Course", "title": "Title", "url": "https://example.com", "justification": "Why good?" }
        ]
    }
    `;
    const response = await generateText(prompt);
    if (!response) throw new Error('Failed to generate recommendations.');
    try {
        const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned) as { recommendations: any[] };
    } catch (e) { return { recommendations: [] }; }
}
