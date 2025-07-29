import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import { postingSuggestionsSchema } from '@/app/lib/schemas';
import type { Strategy } from '@/types';

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

    const prompt = `
        Based on general best practices for LinkedIn and the user's specific strategy, suggest 3-4 optimal days and times for them to post.

        User's Strategy:
        - Industry: ${strategy.summary}
        - Target Audience: ${strategy.targetAudience}

        Consider when this audience is most likely to be active on LinkedIn. Provide the suggestions in a JSON object following the schema.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: postingSuggestionsSchema,
        }
    });

    const jsonText = response.text?.trim() || '';
    const result = JSON.parse(jsonText);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error in posting suggestions API:", error);
    return NextResponse.json({ suggestions: [] }); // Return empty on failure
  }
}
