
import React, { useState, useEffect } from 'react';
import { PaperAirplaneIcon, LoadingIcon, SparklesIcon, CopyIcon, CheckIcon } from '../constants';

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
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-2 flex items-center gap-2">
        <PaperAirplaneIcon className="w-7 h-7" />
        DM Draft Assistant
      </h2>
      <p className="text-text-tertiary mb-6">Break the ice with new connections. Draft personalized, non-salesy intros in seconds.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="profileText" className="block text-sm font-medium leading-6 text-text-secondary">New Connection's "About" Section</label>
          <textarea
            id="profileText"
            rows={7}
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            className="mt-2 block w-full rounded-md border-0 bg-surface-secondary p-2 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
            placeholder="Paste the 'About' section from your new connection's profile..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !profileText.trim()}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="mt-6 border-t border-border pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-text-primary">Generated DM Draft</h3>
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm bg-secondary text-text-primary font-semibold py-1.5 px-3 rounded-md hover:bg-secondary-hover transition-colors"
            >
                {hasCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                {hasCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-surface-secondary p-4 rounded-md whitespace-pre-wrap text-text-secondary text-sm">
            {draft}
          </div>
        </div>
      )}
    </div>
  );
};