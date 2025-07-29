
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon, LoadingIcon, CalendarIcon, XMarkIcon } from '../constants';

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
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl transform transition-all flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-text-primary">{title}</h2>
            <button onClick={onClose} className="text-text-tertiary hover:text-text-primary p-1 rounded-full hover:bg-surface-secondary">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-text-primary">
              <LoadingIcon className="w-10 h-10 mb-4 text-primary" />
              <p>Generating your post...</p>
            </div>
          ) : (
            <div className="bg-background p-4 rounded-md whitespace-pre-wrap text-text-secondary font-mono text-sm">
              {content}
            </div>
          )}
        </div>
        
        <div className="bg-background/50 p-4 rounded-b-lg flex justify-end gap-4 mt-auto">
            <button
                onClick={onSchedule}
                disabled={isLoading || !content}
                className="flex items-center gap-2 bg-secondary text-text-primary font-semibold py-2 px-4 rounded-md hover:bg-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <CalendarIcon className="w-5 h-5" />
                Schedule Post
            </button>
            <button
                onClick={handleCopy}
                disabled={isLoading || !content}
                className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {hasCopied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                {hasCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
        </div>
      </div>
    </div>
  );
};