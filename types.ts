
export interface User {
  email: string;
  name: string;
  picture?: string;
}

export interface InitialOnboardingData {
  industry: string;
  goal: string;
  topics: string;
  tone: string;
}

export interface OnboardingData extends InitialOnboardingData {
  targetAudience: string;
}

export interface PostIdea {
  title: string;
  description: string;
}

export interface Strategy {
  summary: string;
  contentPillars: string[];
  tone: string;
  targetAudience: string;
  postIdeas: PostIdea[];
}
