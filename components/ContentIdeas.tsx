
import React from 'react';
import type { PostIdea, ScheduleSuggestion } from '../types';
import { SparklesIcon, LoadingIcon, ArrowPathIcon } from '../constants';

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
    <div className="bg-surface rounded-lg shadow-lg p-6">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-text-primary">Content Ideas</h2>
        <button
          onClick={onReloadIdeas}
          disabled={isReloading || isGenerating}
          className="flex items-center gap-2 text-sm bg-secondary text-text-primary font-semibold py-2 px-3 rounded-md hover:bg-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isReloading ? (
            <LoadingIcon className="w-5 h-5" />
          ) : (
            <ArrowPathIcon className="w-5 h-5" />
          )}
          <span>{isReloading ? 'Generating...' : 'New Ideas'}</span>
        </button>
      </div>
      <p className="text-text-tertiary mb-6">Here are 5 post ideas to get you started. AI has recommended the best one to post next.</p>
      <div className="space-y-4">
        {ideas.map((idea, index) => {
          const isRecommended = suggestion?.postTitle === idea.title;
          return (
            <div key={index} className={`bg-surface-secondary border border-transparent p-4 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${isRecommended ? '!border-primary' : ''}`}>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-text-primary">{idea.title}</h3>
                  {isRecommended && (
                    <div className="group relative">
                      <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full cursor-help">Recommended</span>
                      <div className="absolute bottom-full mb-2 w-64 bg-background text-text-primary text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg pointer-events-none">
                        <span className="font-bold text-primary">AI Suggestion:</span> {suggestion.reason}
                        <svg className="absolute text-background h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-text-secondary mt-1">{idea.description}</p>
              </div>
              <button
                onClick={() => onGeneratePost(idea)}
                disabled={isGenerating || isReloading}
                className="flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex-shrink-0"
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