import React from 'react';
import type { PostIdea } from '../types';
import { SparklesIcon, LoadingIcon } from '../constants';

interface ContentIdeasProps {
  ideas: PostIdea[];
  onGeneratePost: (idea: PostIdea) => void;
  isGenerating: boolean;
  generatingIdea: PostIdea | null;
}

export const ContentIdeas: React.FC<ContentIdeasProps> = ({ ideas, onGeneratePost, isGenerating, generatingIdea }) => {

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Content Ideas</h2>
      <p className="text-gray-400 mb-6">Here are 5 post ideas to get you started. Click "Write Post" and let AI do the heavy lifting.</p>
      <div className="space-y-4">
        {ideas.map((idea, index) => (
          <div key={index} className="bg-slate-700 p-4 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white">{idea.title}</h3>
              <p className="text-sm text-gray-300 mt-1">{idea.description}</p>
            </div>
            <button
              onClick={() => onGeneratePost(idea)}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed w-full sm:w-auto flex-shrink-0"
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
        ))}
      </div>
    </div>
  );
};