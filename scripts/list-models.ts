import { GoogleGenerativeAI } from '@google/generative-ai';

// Replace with your API key
const apiKey = 'AIzaSyBZBWch9Lm6-YmSi4iw5uaKS3heXaYcVPo';

async function listModels() {
    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // Note: listModels is on the genAI instance directly
        // TypeScript definitions may be tricky depending on version
        // If listModels is not on genAI, try accessing via genAI.getGenerativeModel... but listModels is usually top level or on a manager
        // Actually, in the node SDK, it might be different. Let's check imports.
        // Based on docs: import { GoogleGenerativeAI } from "@google/generative-ai";
        // const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        // There isn't a direct listModels on the instance in some versions.
        // Let's try to just use a known model that usually works: gemini-pro

        // BUT, let's try to fetch a specific model to see if it works
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("gemini-pro works:", result.response.text());

        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        try {
            const resultFlash = await modelFlash.generateContent("Hello");
            console.log("gemini-1.5-flash works:", resultFlash.response.text());
        } catch (e) {
            console.log("gemini-1.5-flash failed");
        }

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
