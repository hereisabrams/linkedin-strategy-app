import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import { onboardingAnalysisSchema } from '@/app/lib/schemas';

export async function POST(request: Request) {
  if (!process.env.API_KEY) {
    return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const { profileText } = await request.json();

    if (!profileText) {
        return NextResponse.json({ error: "Profile text is required." }, { status: 400 });
    }

    const prompt = `
        You are a world-class LinkedIn strategist and branding expert. Analyze the following LinkedIn "About" section. Based on the text, your task is to deduce the user's professional identity and generate a preliminary strategy profile for them.

        User's "About" Section:
        ---
        ${profileText}
        ---

        Based *only* on the text provided, generate a JSON object that follows the provided schema. Deduce the most likely values for each field. Be specific and insightful. For topics, provide a comma-separated string.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: onboardingAnalysisSchema,
        }
    });

    const jsonText = response.text?.trim() || '';
    const result = JSON.parse(jsonText);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error in onboarding analysis API:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze profile for onboarding." }, { status: 500 });
  }
}
