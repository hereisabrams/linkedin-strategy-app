
import { GoogleGenAI, Type } from "@google/genai";
import type { InitialOnboardingData, OnboardingData, Strategy, PostIdea } from '../types';

const apiKey = process.env.GEMINI_API_KEY;
console.log(apiKey);
const ai = new GoogleGenAI({ apiKey });

const audienceSchema = {
    type: Type.OBJECT,
    properties: {
        audiences: {
            type: Type.ARRAY,
            description: "A list of 3-5 distinct, specific target audiences.",
            items: {
                type: Type.STRING,
                description: "A potential target audience, e.g., 'CTOs at early-stage startups' or 'Product Managers in the FinTech space'."
            }
        }
    },
    required: ["audiences"]
};

export const generateAudienceSuggestions = async (data: InitialOnboardingData): Promise<string[]> => {
    const prompt = `
        You are a world-class LinkedIn strategist. Based on the user's information, generate a few potential target audience suggestions for their LinkedIn presence. The audiences should be specific and relevant to their industry, goals, and topics.

        User Information:
        - Industry: ${data.industry}
        - Primary Goal on LinkedIn: ${data.goal}
        - Topics of Expertise/Passion: ${data.topics}
        - Desired Tone of Voice: ${data.tone}

        Based on this, generate a JSON object that follows the provided schema. Provide 3-5 distinct suggestions.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: audienceSchema,
        }
    });

    const jsonText = response.text.trim();
    try {
        const parsedJson = JSON.parse(jsonText);
        if (parsedJson && Array.isArray(parsedJson.audiences)) {
            return parsedJson.audiences as string[];
        }
        console.error("Parsed JSON for audience does not match expected format:", parsedJson);
        throw new Error("Invalid format for audience suggestions.");
    } catch (e) {
        console.error("Failed to parse JSON from Gemini for audiences:", jsonText);
        throw new Error("Received an invalid format from the AI. Please try again.");
    }
};


const strategySchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A short, encouraging paragraph summarizing the user's LinkedIn strategy." },
        contentPillars: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "3-5 key themes the user should focus on for their content."
        },
        tone: { type: Type.STRING, description: "The recommended tone of voice for the user's posts." },
        targetAudience: { type: Type.STRING, description: "The target audience provided by the user, copied verbatim into this field." },
        postIdeas: {
            type: Type.ARRAY,
            description: "A list of 5 distinct, engaging post ideas.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A catchy title for the post idea." },
                    description: { type: Type.STRING, description: "A brief one-sentence description of what the post would cover." }
                },
                required: ["title", "description"]
            }
        }
    },
    required: ["summary", "contentPillars", "tone", "targetAudience", "postIdeas"]
};

export const generateStrategy = async (data: OnboardingData): Promise<Strategy> => {
    const prompt = `
        You are a world-class LinkedIn strategist and personal branding expert. A user has provided the following information about themselves. Your task is to generate a concise, actionable LinkedIn strategy and initial content ideas for them.

        User Information:
        - Industry: ${data.industry}
        - Target Audience: ${data.targetAudience}
        - Primary Goal on LinkedIn: ${data.goal}
        - Topics of Expertise/Passion: ${data.topics}
        - Desired Tone of Voice: ${data.tone}

        Based on this, generate a JSON object that follows the provided schema. The strategy summary should be a short, encouraging paragraph. The content pillars should be 3-5 key themes they should focus on. The post ideas should be 5 distinct, engaging ideas that align with the strategy. Each idea should have a title and a brief description of what the post would be about. Ensure you include the user's Target Audience in the 'targetAudience' field of your response.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: strategySchema,
        }
    });

    const jsonText = response.text.trim();
    try {
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as Strategy;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", jsonText);
        throw new Error("Received an invalid format from the AI. Please try again.");
    }
};


export const generatePost = async (postIdea: PostIdea, strategy: Strategy): Promise<string> => {
    const prompt = `
        You are an expert LinkedIn copywriter. Your task is to write a complete, engaging LinkedIn post. The post should be ready to be copied and pasted.

        The user's overall strategy is:
        - Target Audience: ${strategy.targetAudience}
        - Tone of Voice: ${strategy.tone}

        The specific post you need to write is about:
        - Title: "${postIdea.title}"
        - More context: "${postIdea.description}"

        Please write the post now. Use paragraphs, bullet points if appropriate, and 3-5 relevant hashtags at the end to make it readable and effective. Do not include any preamble like "Here is the post:". Just provide the post content itself.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt
    });

    return response.text;
};