
import React, { useState, useEffect } from 'react';
import type { CommentReplySuggestion } from '../types';
import { ChatBubbleOvalLeftEllipsisIcon, LoadingIcon, SparklesIcon, CopyIcon, CheckIcon } from '../constants';

interface CommentAssistantProps {
  onGenerate: (postContent: string, comment: string) => void;
  suggestions: CommentReplySuggestion[] | null;
  isLoading: boolean;
}

const SuggestionCard: React.FC<{ suggestion: CommentReplySuggestion }> = ({ suggestion }) => {
    const [hasCopied, setHasCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(suggestion.reply);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className="bg-surface-secondary p-3 rounded-md">
            <div className="flex justify-between items-start gap-2">
                <div>
                    <h4 className="font-semibold text-primary text-sm">{suggestion.style}</h4>
                    <p className="text-text-secondary mt-1 text-sm whitespace-pre-wrap">{suggestion.reply}</p>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex-shrink-0 p-2 rounded-md hover:bg-secondary-hover transition-colors"
                    title="Copy reply"
                >
                    {hasCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4 text-text-tertiary" />}
                </button>
            </div>
        </div>
    );
};

export const CommentAssistant: React.FC<CommentAssistantProps> = ({ onGenerate, suggestions, isLoading }) => {
  const [postContent, setPostContent] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim() && comment.trim()) {
      onGenerate(postContent, comment);
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-2 flex items-center gap-2">
        <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7" />
        Comment Reply Assistant
      </h2>
      <p className="text-text-tertiary mb-6">Never get stuck on a reply. Get smart, engaging suggestions to keep conversations going.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="postContent" className="block text-sm font-medium leading-6 text-text-secondary">Your Original Post Content</label>
          <textarea
            id="postContent"
            rows={4}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="mt-2 block w-full rounded-md border-0 bg-surface-secondary p-2 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
            placeholder="Paste the text of your post here..."
            required
          />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium leading-6 text-text-secondary">Comment Received</label>
          <textarea
            id="comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-2 block w-full rounded-md border-0 bg-surface-secondary p-2 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
            placeholder="Paste the comment you want to reply to..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !postContent.trim() || !comment.trim()}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoadingIcon className="w-5 h-5" />
              <span>Getting Suggestions...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              <span>Suggest Replies</span>
            </>
          )}
        </button>
      </form>

       {suggestions && (
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Reply Suggestions</h3>
          <div className="space-y-4">
            {suggestions.map((s, i) => <SuggestionCard key={i} suggestion={s} />)}
          </div>
        </div>
      )}
    </div>
  );
};