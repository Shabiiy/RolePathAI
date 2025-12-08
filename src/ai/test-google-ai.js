
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    const models = ["gemini-1.5-pro", "gemini-1.5-flash"];

    for (const modelName of models) {
        console.log(`Testing ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            await model.generateContent("Hello");
            console.log(`SUCCESS: ${modelName}`);
        } catch (error) {
            console.log(`FAILED: ${modelName}`);
            console.log(`MSG: ${error.message}`);
        }
    }
}

test();
