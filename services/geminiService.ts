

import { GoogleGenAI, Type } from "@google/genai";
import type { OnboardingData, Strategy, PostIdea, PostingSuggestion, ScheduleSuggestion, TrendsResult, Trend, PostDraft, CommentReplySuggestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const onboardingAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        industry: { type: Type.STRING, description: "The user's primary industry or field, deduced from their profile." },
        goal: { type: Type.STRING, description: "A likely primary goal for the user on LinkedIn, such as 'Build a personal brand' or 'Generate leads'." },
        topics: { type: Type.STRING, description: "A comma-separated list of 3-5 key topics of expertise mentioned or implied in the text." },
        tone: { type: Type.STRING, description: "The most fitting tone of voice, chosen from: 'Professional', 'Casual & Humorous', 'Inspirational & Motivational', 'Technical & Educational'." },
        targetAudience: { type: Type.STRING, description: "A specific, deduced target audience for the user, e.g., 'Hiring managers in tech' or 'Potential clients in the marketing sector'." }
    },
    required: ["industry", "goal", "topics", "tone", "targetAudience"]
};

export const analyzeProfileForOnboarding = async (profileText: string): Promise<OnboardingData> => {
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

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as OnboardingData;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini for onboarding analysis:", jsonText);
        throw new Error("Received an invalid format from the AI. Please try again.");
    }
};

const strategySchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A short, encouraging paragraph summarizing the user's LinkedIn strategy." },
        contentPillars: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "3-5 key themes the user should focus on for their content."
        },
        tone: { type: Type.STRING, description: "The recommended tone of voice for the user's posts." },
        targetAudience: { type: Type.STRING, description: "The target audience provided by the user, copied verbatim into this field." },
        postIdeas: {
            type: Type.ARRAY,
            description: "A list of 5 distinct, engaging post ideas.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A catchy title for the post idea." },
                    description: { type: Type.STRING, description: "A brief one-sentence description of what the post would be about." }
                },
                required: ["title", "description"]
            }
        }
    },
    required: ["summary", "contentPillars", "tone", "targetAudience", "postIdeas"]
};

export const generateStrategy = async (data: OnboardingData): Promise<Strategy> => {
    const prompt = `
        You are a world-class LinkedIn strategist and personal branding expert. A user has provided the following information about themselves. Your task is to generate a concise, actionable LinkedIn strategy and initial content ideas for them.

        User Information:
        - Industry: ${data.industry}
        - Target Audience: ${data.targetAudience}
        - Primary Goal on LinkedIn: ${data.goal}
        - Topics of Expertise/Passion: ${data.topics}
        - Desired Tone of Voice: ${data.tone}

        Based on this, generate a JSON object that follows the provided schema. The strategy summary should be a short, encouraging paragraph. The content pillars should be 3-5 key themes they should focus on. The post ideas should be 5 distinct, engaging ideas that align with the strategy. Each idea should have a title and a brief description of what the post would be about. Ensure you include the user's Target Audience in the 'targetAudience' field of your response.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: strategySchema,
        }
    });

    const jsonText = response.text.trim();
    try {
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as Strategy;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", jsonText);
        throw new Error("Received an invalid format from the AI. Please try again.");
    }
};


export const generatePost = async (postIdea: PostIdea, strategy: Strategy): Promise<string> => {
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

    return response.text;
};

export const generatePostFromDraft = async (draft: PostDraft, strategy: Strategy): Promise<string> => {
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

    return response.text;
};

const postingSuggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "A list of 3-4 suggested posting times.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: {
                        type: Type.STRING,
                        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                    },
                    time: {
                        type: Type.STRING,
                        description: "A specific time or time window, e.g., '9:00 AM - 11:00 AM EST'."
                    }
                },
                required: ["day", "time"]
            }
        }
    },
    required: ["suggestions"]
}

export const getPostingSuggestions = async (strategy: Strategy): Promise<PostingSuggestion[]> => {
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

    const jsonText = response.text.trim();
    try {
        const parsedJson = JSON.parse(jsonText);
        return parsedJson.suggestions as PostingSuggestion[];
    } catch (e) {
        console.error("Failed to parse JSON from Gemini for posting suggestions:", jsonText);
        return []; // Return empty array on failure
    }
};

const scheduleSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        postTitle: {
            type: Type.STRING,
            description: "The exact title of the post idea that is being recommended for scheduling."
        },
        reason: {
            type: Type.STRING,
            description: "A concise reason why this specific post should be scheduled next, based on the user's strategy."
        }
    },
    required: ["postTitle", "reason"]
};

export const getScheduleSuggestion = async (strategy: Strategy): Promise<ScheduleSuggestion | null> => {
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
    try {
        return JSON.parse(jsonText) as ScheduleSuggestion;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini for schedule suggestion:", jsonText);
        return null; // Return null on failure
    }
};

const postIdeasListSchema = {
    type: Type.OBJECT,
    properties: {
        postIdeas: {
            type: Type.ARRAY,
            description: "A list of 5 distinct, new, and engaging post ideas.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A catchy title for the post idea." },
                    description: { type: Type.STRING, description: "A brief one-sentence description of what the post would cover." }
                },
                required: ["title", "description"]
            }
        }
    },
    required: ["postIdeas"]
};

export const regeneratePostIdeas = async (strategy: Strategy): Promise<PostIdea[]> => {
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

    const jsonText = response.text.trim();
    try {
        const parsedJson = JSON.parse(jsonText);
        return parsedJson.postIdeas as PostIdea[];
    } catch (e) {
        console.error("Failed to parse JSON from Gemini for regenerating ideas:", jsonText);
        throw new Error("Received an invalid format from the AI. Please try again.");
    }
};

// Helper function to parse the text response for trends
const parseTrendsFromText = (text: string): Trend[] => {
    const trends: Trend[] = [];
    const trendRegex = /Title: (.*?)\nSummary: (.*?)(?=\n\nTitle:|\n\n$|$)/gs;
    let match;
    while ((match = trendRegex.exec(text)) !== null) {
        trends.push({
            title: match[1].trim(),
            summary: match[2].trim(),
        });
    }
    return trends;
};

export const fetchLinkedInTrends = async (strategy: Strategy): Promise<TrendsResult> => {
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
      .filter((web, index, self) => index === self.findIndex(t => t.uri === web.uri)); // Deduplicate sources by URI

    if (trends.length === 0 && text.length > 0) {
      // Fallback if regex fails, just make a single trend item from the whole text
      trends.push({
        title: "Latest Insights",
        summary: text
      });
    }

    return { trends, sources };
};

const commentRepliesSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "A list of 3 distinct reply suggestions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    style: { type: Type.STRING, description: "The style of the reply, e.g., 'Insightful', 'Friendly & Appreciative', 'Question-based'." },
                    reply: { type: Type.STRING, description: "The suggested reply text." }
                },
                required: ["style", "reply"]
            }
        }
    },
    required: ["suggestions"]
};

export const generateCommentReplies = async (postContent: string, comment: string, strategy: Strategy): Promise<CommentReplySuggestion[]> => {
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

    const jsonText = response.text.trim();
    try {
        const parsedJson = JSON.parse(jsonText);
        return parsedJson.suggestions as CommentReplySuggestion[];
    } catch (e) {
        console.error("Failed to parse JSON from Gemini for comment replies:", jsonText);
        throw new Error("Received an invalid format from the AI. Please try again.");
    }
};


export const generateDM = async (connectionProfile: string, strategy: Strategy): Promise<string> => {
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

    return response.text;
};