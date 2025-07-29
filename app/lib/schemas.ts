
import { Type } from "@google/genai";

export const onboardingAnalysisSchema = {
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

export const strategySchema = {
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

export const postingSuggestionsSchema = {
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
};

export const scheduleSuggestionSchema = {
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

export const postIdeasListSchema = {
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

export const commentRepliesSchema = {
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
