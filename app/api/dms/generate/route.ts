import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import type { Strategy } from '@/types';

export async function POST(request: Request) {
  if (!process.env.API_KEY) {
    return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const { connectionProfile, strategy }: { connectionProfile: string, strategy: Strategy } = await request.json();

    if (!connectionProfile || !strategy) {
        return NextResponse.json({ error: "Connection profile and strategy are required." }, { status: 400 });
    }
    
    const prompt = `
        You are a networking expert specializing in crafting personalized, non-salesy LinkedIn direct messages. Your task is to draft a friendly, genuine opening message to a new connection.

        Here is your user's profile context (who you are):
        - User's Strategy Summary: ${strategy.summary}
        - User's Key Topics: ${strategy.contentPillars.join(', ')}

        Here is the new connection's "About" section:
        ---
        ${connectionProfile}
        ---

        Draft a short, personalized DM. The message should:
        1. Reference something specific and interesting from their profile to show you've actually read it.
        2. Briefly and humbly connect it to one of your own interests or experiences.
        3. End with an open-ended question to encourage a reply and start a real conversation.
        4. Be friendly and avoid any sales pitches or requests.

        Just provide the DM text itself, with no preamble.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return NextResponse.json({ content: response.text });

  } catch (error: any) {
    console.error("Error in generate DM API:", error);
    return NextResponse.json({ error: error.message || "Failed to generate DM." }, { status: 500 });
  }
}
