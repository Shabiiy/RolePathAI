
const { VertexAI } = require('@google-cloud/vertexai');
require('dotenv').config();

async function listModels() {
    const projectId = process.env.GCLOUD_PROJECT;
    const location = process.env.GCLOUD_LOCATION || 'us-central1';

    console.log(`Checking models for Project: ${projectId}, Location: ${location}`);

    // Initialize Vertex with your Cloud project and location
    const vertex_ai = new VertexAI({ project: projectId, location: location });
    const model = 'gemini-pro';

    try {
        const generativeModel = vertex_ai.preview.getGenerativeModel({
            model: model,
            generationConfig: {
                'maxOutputTokens': 2048,
                'temperature': 0.9,
                'topP': 1
            },
        });

        const req = {
            contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
        };

        console.log(`Attempting to generate content with model: ${model}`);
        const streamingResp = await generativeModel.generateContentStream(req);

        for await (const item of streamingResp.stream) {
            // consume stream
        }

        console.log('aggregated response: ', JSON.stringify(await streamingResp.response));
        console.log('SUCCESS: Model found and working.');

    } catch (error) {
        console.error('ERROR:', error);
    }
}

listModels();
