import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  if (!process.env.API_KEY) {
    return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const { profileUrl }: { profileUrl: string } = await request.json();

    if (!profileUrl) {
        return NextResponse.json({ error: "Profile URL is required." }, { status: 400 });
    }

    const prompt = `
        You are an expert LinkedIn profile analyzer. Analyze the following LinkedIn profile URL and provide insights:

        Profile URL: ${profileUrl}

        Please provide a comprehensive analysis including:
        1. Profile strengths and areas for improvement
        2. Content strategy recommendations
        3. Networking opportunities
        4. Personal branding suggestions
        5. Engagement optimization tips

        Format your response in a clear, structured manner with actionable insights.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return NextResponse.json({ analysis: response.text });

  } catch (error: any) {
    console.error("Error in profile analysis API:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze profile." }, { status: 500 });
  }
}
