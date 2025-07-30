
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon, TrashIcon, XMarkIcon, PencilSquareIcon } from '../constants';
import type { ScheduledPost } from '../types';

interface ViewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (postId: string) => void;
  post: ScheduledPost;
  onEdit: () => void;
}

export const ViewPostModal: React.FC<ViewPostModalProps> = ({ isOpen, onClose, onDelete, post, onEdit }) => {
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
  
  const formattedDate = new Date(post.scheduledDate).toLocaleString(undefined, {
      dateStyle: 'full',
      timeStyle: 'short',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl transform transition-all flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-start">
            <div>
                <h2 className="text-xl font-bold text-text-primary">{post.title}</h2>
                <p className="text-sm text-text-tertiary mt-1">Scheduled for: {formattedDate}</p>
            </div>
            <button onClick={onClose} className="text-text-tertiary hover:text-text-primary p-1 rounded-full hover:bg-surface-secondary">
                <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          <div className="bg-background p-4 rounded-md whitespace-pre-wrap text-text-secondary font-mono text-sm">
            {post.content}
          </div>
        </div>
        
        <div className="bg-background/50 p-4 rounded-b-lg flex justify-between items-center mt-auto">
             <button
                onClick={() => onDelete(post.id)}
                className="flex items-center gap-2 bg-red-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
                <TrashIcon className="w-5 h-5" />
                Delete
            </button>
            <div className="flex items-center gap-4">
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 bg-secondary text-text-primary font-semibold py-2 px-4 rounded-md hover:bg-secondary-hover transition-colors"
                >
                    <PencilSquareIcon className="w-5 h-5" />
                    Edit
                </button>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors"
                >
                    {hasCopied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                    {hasCopied ? 'Copied!' : 'Copy Content'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
