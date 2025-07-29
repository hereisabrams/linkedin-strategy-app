

export interface User {
  email: string;
  name: string;
  picture?: string;
}

export interface OnboardingData {
  industry: string;
  goal: string;
  topics: string;
  tone: string;
  targetAudience: string;
}

export interface PostIdea {
  title: string;
  description: string;
}

export interface PostDraft {
  title: string;
  keyPoints: string;
}

export interface Strategy {
  summary: string;
  contentPillars: string[];
  tone: string;
  targetAudience: string;
  postIdeas: PostIdea[];
}

// New types for Calendar and Scheduling
export interface PostingSuggestion {
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    time: string; // e.g., "9:00 AM - 11:00 AM EST"
}

export interface ScheduledPost {
    id: string; // A unique ID for the post
    title: string;
    content: string;
    scheduledDate: string; // ISO string for the date and time
}

export interface ScheduleSuggestion {
  postTitle: string; // The title of the recommended post, must match one of the PostIdea titles.
  reason: string; // A brief explanation for why this post is recommended now.
}

// New types for Trends
export interface Trend {
  title: string;
  summary: string;
}

export interface TrendSource {
  uri: string;
  title:string;
}

export interface TrendsResult {
  trends: Trend[];
  sources: TrendSource[];
}

// New types for Assistants
export interface CommentReplySuggestion {
  style: string; // e.g., "Insightful", "Friendly", "Question-based"
  reply: string;
}