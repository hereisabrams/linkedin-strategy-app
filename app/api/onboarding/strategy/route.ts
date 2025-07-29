import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import { strategySchema } from '@/app/lib/schemas';
import type { OnboardingData } from '@/types';

export async function POST(request: Request) {
  if (!process.env.API_KEY) {
    return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const { data }: { data: OnboardingData } = await request.json();

    if (!data) {
        return NextResponse.json({ error: "Onboarding data is required." }, { status: 400 });
    }

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
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: strategySchema,
        }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error in generate strategy API:", error);
    return NextResponse.json({ error: error.message || "Failed to generate strategy." }, { status: 500 });
  }
}
