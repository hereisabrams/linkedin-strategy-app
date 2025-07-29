import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import type { PostDraft, Strategy } from '@/types';

export async function POST(request: Request) {
  if (!process.env.API_KEY) {
    return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const { draft, strategy }: { draft: PostDraft, strategy: Strategy } = await request.json();

    if (!draft || !strategy) {
        return NextResponse.json({ error: "Draft and strategy are required." }, { status: 400 });
    }
    
    const prompt = `
        You are an expert LinkedIn copywriter. Your task is to take a user's draft and expand it into a complete, engaging LinkedIn post. The post should be ready to be copied and pasted.

        The user's overall strategy is:
        - Target Audience: ${strategy.targetAudience}
        - Tone of Voice: ${strategy.tone}

        The user's draft is:
        - Title: "${draft.title}"
        - Key Points / Draft Content: "${draft.keyPoints}"

        Please write the full post now based on the draft. Flesh it out, ensure it flows well, and add relevant details. Use paragraphs, bullet points if appropriate, and 3-5 relevant hashtags at the end. Do not include any preamble like "Here is the post:". Just provide the post content itself.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return NextResponse.json({ content: response.text });

  } catch (error: any) {
    console.error("Error in generate post from draft API:", error);
    return NextResponse.json({ error: error.message || "Failed to generate post from draft." }, { status: 500 });
  }
}
