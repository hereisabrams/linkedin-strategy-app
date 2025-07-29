import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import { commentRepliesSchema } from '@/app/lib/schemas';
import type { Strategy } from '@/types';

export async function POST(request: Request) {
  if (!process.env.API_KEY) {
    return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const { postContent, comment, strategy }: { postContent: string, comment: string, strategy: Strategy } = await request.json();

    if (!postContent || !comment || !strategy) {
        return NextResponse.json({ error: "Post content, comment, and strategy are required." }, { status: 400 });
    }

    const prompt = `
        You are a LinkedIn engagement expert. Your goal is to help a user reply to a comment on their post in a way that fosters conversation.

        User's Strategy:
        - Tone of Voice: ${strategy.tone}
        - Target Audience: ${strategy.targetAudience}

        The Original Post:
        ---
        ${postContent}
        ---

        The Comment Received:
        ---
        ${comment}
        ---

        Please generate 3 distinct, smart, and engaging reply suggestions. The replies should match the user's tone. Each suggestion should have a different angle (e.g., one that adds more value, one that shows appreciation, one that asks a follow-up question).

        Generate a JSON object that follows the provided schema.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: commentRepliesSchema,
        }
    });

    const jsonText = response.text?.trim() || '';
    const result = JSON.parse(jsonText);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error in generate replies API:", error);
    return NextResponse.json({ error: error.message || "Failed to generate comment replies." }, { status: 500 });
  }
}
