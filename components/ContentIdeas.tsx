"use client";

import React from 'react';
import type { PostIdea, ScheduleSuggestion } from '@/types';
import { SparklesIcon, LoadingIcon, ArrowPathIcon } from '@/constants';

interface ContentIdeasProps {
  ideas: PostIdea[];
  onGeneratePost: (idea: PostIdea) => void;
  isGenerating: boolean;
  generatingIdea: PostIdea | null;
  suggestion: ScheduleSuggestion | null;
  onReloadIdeas: () => void;
  isReloading: boolean;
}

export const ContentIdeas: React.FC<ContentIdeasProps> = ({ ideas, onGeneratePost, isGenerating, generatingIdea, suggestion, onReloadIdeas, isReloading }) => {

  return (
    <div className="bg-brand-card border border-brand-border rounded-lg p-6">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-brand-text-primary">Content Ideas</h2>
        <button
          onClick={onReloadIdeas}
          disabled={isReloading || isGenerating}
          className="flex items-center gap-2 text-sm bg-brand-secondary hover:bg-brand-secondary-hover text-brand-text-primary font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isReloading ? (
            <LoadingIcon className="w-5 h-5" />
          ) : (
            <ArrowPathIcon className="w-5 h-5" />
          )}
          <span>{isReloading ? 'Generating...' : 'New Ideas'}</span>
        </button>
      </div>
      <p className="text-brand-text-secondary mb-6">Here are 5 post ideas to get you started. AI has recommended the best one to post next.</p>
      <div className="space-y-4">
        {ideas.map((idea, index) => {
          const isRecommended = suggestion?.postTitle === idea.title;
          return (
            <div key={index} className={`bg-brand-surface border border-brand-border p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${isRecommended ? 'ring-2 ring-brand-primary' : ''}`}>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-brand-text-primary">{idea.title}</h3>
                  {isRecommended && (
                    <div className="group relative">
                      <span className="bg-brand-primary/20 text-brand-primary text-xs font-bold px-2.5 py-1 rounded-full cursor-help">Recommended</span>
                      <div className="absolute bottom-full mb-2 w-64 bg-brand-card border border-brand-border text-brand-text-secondary text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg pointer-events-none">
                        <span className="font-bold text-brand-text-primary">AI Suggestion:</span> {suggestion.reason}
                        <svg className="absolute text-brand-card h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-brand-text-secondary mt-1">{idea.description}</p>
              </div>
              <button
                onClick={() => onGeneratePost(idea)}
                disabled={isGenerating || isReloading}
                className="flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary-hover transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex-shrink-0"
              >
                {isGenerating && generatingIdea?.title === idea.title ? (
                  <>
                    <LoadingIcon className="w-5 h-5" />
                    <span>Writing...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Write Post</span>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
};