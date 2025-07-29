// This file contains functions to call our Next.js API routes.
// It will be used by client components to interact with the backend.

import type { OnboardingData, Strategy, PostIdea, PostingSuggestion, ScheduleSuggestion, TrendsResult, PostDraft, CommentReplySuggestion, ScrapedProfileData } from '@/types';

async function fetcher(url: string, { arg }: { arg: any }) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
    });

    if (!res.ok) {
        const errorInfo = await res.json().catch(() => ({ error: 'An unexpected error occurred.' }));
        const error = new Error(errorInfo.error) as any;
        error.status = res.status;
        console.error(`API Error (${url}):`, errorInfo);
        throw error;
    }

    return res.json();
}

export const scrapeProfile = (url: string): Promise<ScrapedProfileData> => {
    return fetcher('/api/scrape-profile', { arg: { url } });
};

export const analyzeProfileForOnboarding = (profileText: string): Promise<OnboardingData> => {
    return fetcher('/api/onboarding/analyze', { arg: { profileText } });
};

export const generateStrategy = (data: OnboardingData): Promise<Strategy> => {
    return fetcher('/api/onboarding/strategy', { arg: { data } });
};

export const generatePost = (data: {postIdea: PostIdea, strategy: Strategy}): Promise<{ content: string }> => {
    return fetcher('/api/posts/generate', { arg: data });
};

export const generatePostFromDraft = (data: {draft: PostDraft, strategy: Strategy}): Promise<{ content: string }> => {
    return fetcher('/api/posts/generate-from-draft', { arg: data });
};

export const getPostingSuggestions = (strategy: Strategy): Promise<{suggestions: PostingSuggestion[]}> => {
    return fetcher('/api/suggestions/posting-times', { arg: { strategy } });
};

export const getScheduleSuggestion = (strategy: Strategy): Promise<ScheduleSuggestion | null> => {
    return fetcher('/api/suggestions/schedule', { arg: { strategy } });
};

export const regeneratePostIdeas = (strategy: Strategy): Promise<{ postIdeas: PostIdea[] }> => {
    return fetcher('/api/posts/regenerate-ideas', { arg: { strategy } });
};

export const fetchLinkedInTrends = (strategy: Strategy): Promise<TrendsResult> => {
    return fetcher('/api/trends', { arg: { strategy } });
};

export const generateCommentReplies = (data: {postContent: string, comment: string, strategy: Strategy}): Promise<{ suggestions: CommentReplySuggestion[] }> => {
    return fetcher('/api/comments/generate-replies', { arg: data });
};

export const generateDM = (data: { connectionProfile: string, strategy: Strategy }): Promise<{ content: string }> => {
    return fetcher('/api/dms/generate', { arg: data });
};
