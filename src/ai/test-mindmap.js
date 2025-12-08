

// Mocking the ai/genkit import might be hard in a simple script if it depends on Next.js server context.
// Instead, I will use the raw API test approach but with the mindmap prompt to see what the model does.

require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testMindmap() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const roadmap = `
Phase 1: Foundations (Weeks 1-2)
- HTML & CSS
- JavaScript Basics

Phase 2: Frontend (Weeks 3-4)
- React
- Tailwind CSS
  `;

    const prompt = `
    Based on the following roadmap, generate a Mermaid.js mindmap syntax.
    
    Roadmap:
    ${roadmap}

    Requirements:
    - Use 'mindmap' diagram type.
    - Root node should be the main goal/role.
    - Branches should be the phases.
    - Sub-branches should be the key topics.
    - Keep it concise.
    - DO NOT include markdown code blocks (like \`\`\`mermaid). Just return the raw syntax.
  `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log("RAW OUTPUT:");
        console.log(text);
    } catch (e) {
        console.log("ERROR:", e);
    }
}

testMindmap();
