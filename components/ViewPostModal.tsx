"use client";

import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon, TrashIcon, XMarkIcon } from '@/constants';
import type { ScheduledPost } from '@/types';

interface ViewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (postId: string) => void;
  post: ScheduledPost;
}

export const ViewPostModal: React.FC<ViewPostModalProps> = ({ isOpen, onClose, onDelete, post }) => {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setHasCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(post.content);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleDelete = () => {
    onDelete(post.id);
  };
  
  const formattedDate = new Date(post.scheduledDate).toLocaleString(undefined, {
      dateStyle: 'full',
      timeStyle: 'short',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
      <div className="bg-brand-card border border-brand-border rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
                <h2 className="text-xl font-bold text-brand-text-primary">{post.title}</h2>
                <p className="text-sm text-brand-text-secondary mt-1">Scheduled for: {formattedDate}</p>
            </div>
            <button onClick={onClose} className="text-brand-text-secondary hover:text-brand-text-primary p-1 rounded-full hover:bg-brand-surface">
                <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
          <div className="bg-brand-surface p-4 rounded-md whitespace-pre-wrap text-brand-text-secondary font-mono text-sm border border-brand-border">
            {post.content}
          </div>
        </div>
        
        <div className="bg-brand-surface/50 border-t border-brand-border p-4 rounded-b-lg flex justify-between items-center">
             <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-brand-danger text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-danger-hover transition-colors"
            >
                <TrashIcon className="w-5 h-5" />
                Delete
            </button>
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary-hover transition-colors"
            >
                {hasCopied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                {hasCopied ? 'Copied!' : 'Copy Content'}
            </button>
        </div>
      </div>
    </div>
  );
};