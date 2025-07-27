
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon, LoadingIcon } from '../constants';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  content: string;
  title: string;
}

export const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, isLoading, content, title }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>
        </div>

        <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-white">
              <LoadingIcon className="w-10 h-10 mb-4" />
              <p>Generating your post...</p>
            </div>
          ) : (
            <div className="bg-slate-900 p-4 rounded-md whitespace-pre-wrap text-gray-200 font-mono text-sm">
              {content}
            </div>
          )}
        </div>
        
        <div className="bg-slate-700 p-4 rounded-b-lg flex justify-end">
            <button
                onClick={handleCopy}
                disabled={isLoading || !content}
                className="flex items-center gap-2 bg-brand-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
                {hasCopied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                {hasCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
        </div>
      </div>
    </div>
  );
};
