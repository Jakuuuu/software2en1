
import { GoogleGenerativeAI } from '@google/generative-ai';

// Replace with your API key
const apiKey = 'AIzaSyBZBWch9Lm6-YmSi4iw5uaKS3heXaYcVPo';

const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-1.0-pro'
];

async function testModels() {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("Testing available models...");

    for (const modelName of modelsToTest) {
        try {
            console.log(`Checking ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            const response = await result.response;
            const text = response.text();
            console.log(`✅ SUCCESS: ${modelName} responded: "${text.trim().substring(0, 50)}..."`);
        } catch (error: any) {
            if (error.message && error.message.includes("404")) {
                console.log(`❌ FAILED: ${modelName} not found (404)`);
            } else {
                console.log(`❌ ERROR: ${modelName} failed with: ${error.message}`);
            }
        }
    }
}

testModels();
