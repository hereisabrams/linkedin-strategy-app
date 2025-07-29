import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import { postIdeasListSchema } from '@/app/lib/schemas';
import type { PostIdea, Strategy } from '@/types';

export async function POST(request: Request) {
  if (!process.env.API_KEY) {
    return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const { strategy }: { strategy: Strategy } = await request.json();

    if (!strategy) {
        return NextResponse.json({ error: "Strategy is required." }, { status: 400 });
    }
    
    const existingTitles = strategy.postIdeas.map(idea => idea.title).join(', ');
    const prompt = `
        You are a world-class LinkedIn strategist. Based on the user's strategy below, generate 5 completely new and distinct content ideas.

        User's Strategy:
        - Target Audience: ${strategy.targetAudience}
        - Content Pillars: ${strategy.contentPillars.join(', ')}
        - Tone of Voice: ${strategy.tone}

        IMPORTANT: Do NOT repeat or rephrase any of the following existing ideas: "${existingTitles}". The new ideas must be different.

        Generate a JSON object that follows the provided schema, containing a list of 5 new post ideas.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: postIdeasListSchema,
        }
    });

    const jsonText = response.text?.trim() || '';
    const parsedJson = JSON.parse(jsonText);
    return NextResponse.json(parsedJson);

  } catch (error: any) {
    console.error("Error in regenerate ideas API:", error);
    return NextResponse.json({ error: error.message || "Failed to regenerate post ideas." }, { status: 500 });
  }
}
