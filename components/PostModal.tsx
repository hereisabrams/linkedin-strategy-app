"use client";

import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon, LoadingIcon, CalendarIcon, XMarkIcon } from '@/constants';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  content: string;
  title: string;
  onSchedule: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, isLoading, content, title, onSchedule }) => {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setHasCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
      <div className="bg-brand-card border border-brand-border rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-brand-text-primary">{title}</h2>
            <button onClick={onClose} className="text-brand-text-secondary hover:text-brand-text-primary p-1 rounded-full hover:bg-brand-surface">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-brand-text-primary">
              <LoadingIcon className="w-10 h-10 mb-4" />
              <p>Generating your post...</p>
            </div>
          ) : (
            <div className="bg-brand-surface p-4 rounded-md whitespace-pre-wrap text-brand-text-secondary font-mono text-sm border border-brand-border">
              {content}
            </div>
          )}
        </div>
        
        <div className="bg-brand-surface/50 border-t border-brand-border p-4 rounded-b-lg flex justify-end gap-4">
            <button
                onClick={onSchedule}
                disabled={isLoading || !content}
                className="flex items-center gap-2 bg-brand-secondary text-brand-text-primary font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <CalendarIcon className="w-5 h-5" />
                Schedule Post
            </button>
            <button
                onClick={handleCopy}
                disabled={isLoading || !content}
                className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {hasCopied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                {hasCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
        </div>
      </div>
    </div>
  );
};