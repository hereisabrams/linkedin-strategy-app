
import React, { useState } from 'react';
import type { PostDraft } from '../types';
import { LoadingIcon, PencilSquareIcon, SparklesIcon } from '../constants';

interface PostFromDraftProps {
  onGenerate: (draft: PostDraft) => void;
  isLoading: boolean;
}

export const PostFromDraft: React.FC<PostFromDraftProps> = ({ onGenerate, isLoading }) => {
  const [title, setTitle] = useState('');
  const [keyPoints, setKeyPoints] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && keyPoints.trim()) {
      onGenerate({ title, keyPoints });
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-2 flex items-center gap-2">
        <PencilSquareIcon className="w-7 h-7" />
        Write Post from Draft
      </h2>
      <p className="text-text-tertiary mb-6">Have an idea? Jot down a title and some key points, and let AI write the full post for you.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="draftTitle" className="block text-sm font-medium leading-6 text-text-secondary">Post Title</label>
          <input
            id="draftTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 block w-full rounded-md border-0 bg-surface-secondary p-2 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
            placeholder="e.g., The Future of Remote Collaboration"
            required
          />
        </div>
        <div>
          <label htmlFor="draftKeyPoints" className="block text-sm font-medium leading-6 text-text-secondary">Key Points / Draft</label>
          <textarea
            id="draftKeyPoints"
            rows={5}
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            className="mt-2 block w-full rounded-md border-0 bg-surface-secondary p-2 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
            placeholder="- New tools for virtual whiteboarding&#10;- The importance of asynchronous communication&#10;- How to maintain team culture"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !title.trim() || !keyPoints.trim()}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoadingIcon className="w-5 h-5" />
              <span>Writing...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              <span>Generate Full Post</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};