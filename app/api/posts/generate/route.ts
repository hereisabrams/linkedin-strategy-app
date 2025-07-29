import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import type { PostIdea, Strategy } from '@/types';

export async function POST(request: Request) {
  if (!process.env.API_KEY) {
    return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const { postIdea, strategy }: { postIdea: PostIdea, strategy: Strategy } = await request.json();

    if (!postIdea || !strategy) {
        return NextResponse.json({ error: "Post idea and strategy are required." }, { status: 400 });
    }

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
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return NextResponse.json({ content: response.text });

  } catch (error: any) {
    console.error("Error in generate post API:", error);
    return NextResponse.json({ error: error.message || "Failed to generate post." }, { status: 500 });
  }
}
