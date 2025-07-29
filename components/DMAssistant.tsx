"use client";

import React, { useState, useEffect } from 'react';
import { PaperAirplaneIcon, LoadingIcon, SparklesIcon, CopyIcon, CheckIcon } from '@/constants';

interface DMAssistantProps {
  onGenerate: (profileText: string) => void;
  draft: string | null;
  isLoading: boolean;
}

export const DMAssistant: React.FC<DMAssistantProps> = ({ onGenerate, draft, isLoading }) => {
  const [profileText, setProfileText] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileText.trim()) {
      onGenerate(profileText);
    }
  };

  useEffect(() => {
    if (draft) {
      setHasCopied(false);
    }
  }, [draft]);

  const handleCopy = () => {
    if (draft) {
        navigator.clipboard.writeText(draft);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-brand-text-primary mb-2 flex items-center gap-3">
        <PaperAirplaneIcon className="w-6 h-6" />
        DM Draft Assistant
      </h2>
      <p className="text-brand-text-secondary mb-6">Break the ice with new connections. Draft personalized, non-salesy intros in seconds.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="profileText" className="block text-sm font-medium leading-6 text-brand-text-secondary">New Connection's "About" Section</label>
          <textarea
            id="profileText"
            rows={7}
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            className="mt-2 block w-full rounded-md border-brand-border bg-brand-surface p-3 text-brand-text-primary shadow-sm ring-1 ring-transparent focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm"
            placeholder="Paste the 'About' section from your new connection's profile..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !profileText.trim()}
          className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold py-2.5 px-4 rounded-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoadingIcon className="w-5 h-5" />
              <span>Drafting DM...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              <span>Draft Intro DM</span>
            </>
          )}
        </button>
      </form>

      {draft && (
        <div className="mt-6 border-t border-brand-border pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-brand-text-primary">Generated DM Draft</h3>
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm bg-brand-secondary text-brand-text-primary font-semibold py-1.5 px-3 rounded-md hover:bg-brand-secondary-hover transition-colors"
            >
                {hasCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                {hasCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-brand-surface p-4 rounded-md whitespace-pre-wrap text-brand-text-secondary text-sm border border-brand-border">
            {draft}
          </div>
        </div>
      )}
    </div>
  );
};