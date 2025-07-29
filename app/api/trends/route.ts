import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import type { Trend, Strategy } from '@/types';

const parseTrendsFromText = (text: string): Trend[] => {
    const trends: Trend[] = [];
    const trendRegex = /Title: (.*?)\nSummary: (.*?)(?=\n\nTitle:|\n\n$|$)/g;
    let match;
    while ((match = trendRegex.exec(text)) !== null) {
        trends.push({
            title: match[1].trim(),
            summary: match[2].trim(),
        });
    }
    return trends;
};


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

    const prompt = `You are a LinkedIn content expert. Analyze the user's strategy:
Strategy Summary: '${strategy.summary}'
Target Audience: '${strategy.targetAudience}'
Key Topics: '${strategy.contentPillars.join(', ')}'.

Based on this, use Google Search to identify 3 key trending topics, articles, or discussions on LinkedIn right now that would be highly relevant for them to post about.

For each of the 3 trends, provide a concise title and a one-sentence summary. Format your response clearly, with each trend having a "Title:" and a "Summary:" on separate lines, with a blank line between trends.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        }
    });

    const text = response.text;
    const trends = parseTrendsFromText(text);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web?.uri && !!web?.title)
      .filter((web, index, self) => index === self.findIndex(t => t.uri === web.uri));

    if (trends.length === 0 && text.length > 0) {
      trends.push({
        title: "Latest Insights",
        summary: text
      });
    }

    return NextResponse.json({ trends, sources });

  } catch (error: any) {
    console.error("Error in trends API:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch trends." }, { status: 500 });
  }
}
