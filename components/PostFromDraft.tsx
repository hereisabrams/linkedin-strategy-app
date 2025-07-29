"use client";

import React, { useState } from 'react';
import type { PostDraft } from '@/types';
import { LoadingIcon, PencilSquareIcon, SparklesIcon } from '@/constants';

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
    <div className="bg-brand-card border border-brand-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-brand-text-primary mb-2 flex items-center gap-3">
        <PencilSquareIcon className="w-6 h-6" />
        Write Post from Draft
      </h2>
      <p className="text-brand-text-secondary mb-6">Have an idea? Jot down a title and some key points, and let AI write the full post for you.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="draftTitle" className="block text-sm font-medium leading-6 text-brand-text-secondary">Post Title</label>
          <input
            id="draftTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 block w-full rounded-md border-brand-border bg-brand-surface p-3 text-brand-text-primary shadow-sm ring-1 ring-transparent focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm"
            placeholder="e.g., The Future of Remote Collaboration"
            required
          />
        </div>
        <div>
          <label htmlFor="draftKeyPoints" className="block text-sm font-medium leading-6 text-brand-text-secondary">Key Points / Draft</label>
          <textarea
            id="draftKeyPoints"
            rows={5}
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            className="mt-2 block w-full rounded-md border-brand-border bg-brand-surface p-3 text-brand-text-primary shadow-sm ring-1 ring-transparent focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm"
            placeholder="- New tools for virtual whiteboarding&#10;- The importance of asynchronous communication&#10;- How to maintain team culture"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !title.trim() || !keyPoints.trim()}
          className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold py-2.5 px-4 rounded-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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