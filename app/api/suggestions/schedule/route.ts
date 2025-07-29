import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import { scheduleSuggestionSchema } from '@/app/lib/schemas';
import type { Strategy } from '@/types';

export async function POST(request: Request) {
  if (!process.env.API_KEY) {
    return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const { strategy }: { strategy: Strategy } = await request.json();

    if (!strategy || !strategy.postIdeas || strategy.postIdeas.length === 0) {
        return NextResponse.json(null); // No ideas to suggest from
    }
    
    const postTitles = strategy.postIdeas.map(p => `- "${p.title}"`).join('\n');

    const prompt = `
        You are a strategic content planner for LinkedIn. A user has a content strategy and a list of post ideas. Your task is to recommend the single best post for them to schedule next.

        User's Strategy:
        - Goal: Drive engagement and build authority.
        - Target Audience: ${strategy.targetAudience}
        - Content Pillars: ${strategy.contentPillars.join(', ')}

        Available Post Ideas:
        ${postTitles}

        Analyze the ideas and choose the one that would be most impactful to post now. Provide a compelling but brief reason for your choice. Return your suggestion as a JSON object following the schema. The 'postTitle' must be an exact match from the list of available ideas.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: scheduleSuggestionSchema,
        }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error in schedule suggestion API:", error);
    return NextResponse.json(null); // Return null on failure
  }
}
