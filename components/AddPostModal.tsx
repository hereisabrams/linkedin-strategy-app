
import React, { useState, useEffect } from 'react';
import { XMarkIcon, SparklesIcon, LoadingIcon } from '../constants';
import { generatePostFromDraft } from '../services/geminiService';
import type { Strategy, PostDraft } from '../types';


interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: { title: string; content: string; scheduledDate: string }) => void;
  initialDate: string; // YYYY-MM-DD
  strategy: Strategy;
}

export const AddPostModal: React.FC<AddPostModalProps> = ({ isOpen, onClose, onSave, initialDate, strategy }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  const [activeTab, setActiveTab] = useState<'manual' | 'generate'>('manual');
  const [generationTitle, setGenerationTitle] = useState('');
  const [generationInput, setGenerationInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialDate) {
      // Set to 9:00 AM on the selected day
      const d = new Date(`${initialDate}T09:00:00`);
      // Adjust for timezone offset to display correctly in user's local time
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      setScheduledDate(d.toISOString().slice(0, 16));
    }
  }, [initialDate]);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
        setTitle('');
        setContent('');
        setActiveTab('manual');
        setGenerationTitle('');
        setGenerationInput('');
        setIsGenerating(false);
        setGenerationError(null);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (title && content && scheduledDate) {
      onSave({
        title,
        content,
        scheduledDate: new Date(scheduledDate).toISOString(),
      });
    }
  };

  const handleGenerate = async () => {
    if (!generationTitle.trim() || !generationInput.trim()) return;

    setIsGenerating(true);
    setGenerationError(null);
    try {
        const draft: PostDraft = {
            title: generationTitle,
            keyPoints: generationInput,
        };
        const generatedPostContent = await generatePostFromDraft(draft, strategy);
        setTitle(generationTitle);
        setContent(generatedPostContent);
        setActiveTab('manual'); // Switch to manual tab to show the result
    } catch (err) {
        console.error("Failed to generate post:", err);
        setGenerationError("Sorry, we couldn't generate the post. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
        isActive
          ? 'bg-surface text-primary'
          : 'bg-transparent text-text-tertiary hover:bg-surface-secondary/50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl transform transition-all flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-text-primary">Schedule a New Post</h2>
            <button onClick={onClose} className="text-text-tertiary hover:text-text-primary p-1 rounded-full hover:bg-surface-secondary">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="bg-surface-secondary/30 px-6 pt-3">
          <div className="flex border-b-0 border-border">
            <TabButton label="Write Manually" isActive={activeTab === 'manual'} onClick={() => setActiveTab('manual')} />
            <TabButton label="Generate with AI" isActive={activeTab === 'generate'} onClick={() => setActiveTab('generate')} />
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto bg-surface">
          {activeTab === 'manual' && (
            <>
              <div>
                <label htmlFor="newPostTitle" className="block text-sm font-medium leading-6 text-text-secondary">Post Title</label>
                <input
                  id="newPostTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 block w-full rounded-md border-0 bg-background p-2 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  placeholder="A catchy title for your post"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPostContent" className="block text-sm font-medium leading-6 text-text-secondary">Post Content</label>
                <textarea
                  id="newPostContent"
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-2 block w-full rounded-md border-0 bg-background p-2.5 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  placeholder="Write your LinkedIn post content here. You can use markdown for formatting."
                  required
                />
              </div>
              <div>
                <label htmlFor="newPostScheduleDate" className="block text-sm font-medium leading-6 text-text-secondary">Schedule Date & Time</label>
                <input
                  id="newPostScheduleDate"
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="mt-2 w-full rounded-md border-0 bg-background p-2 text-text-primary ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary"
                  min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                  required
                />
              </div>
            </>
          )}

          {activeTab === 'generate' && (
            <>
              <div>
                <label htmlFor="generationTitle" className="block text-sm font-medium leading-6 text-text-secondary">Post Title / Idea</label>
                <input
                  id="generationTitle"
                  type="text"
                  value={generationTitle}
                  onChange={(e) => setGenerationTitle(e.target.value)}
                  className="mt-2 block w-full rounded-md border-0 bg-background p-2 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  placeholder="e.g., The Biggest Mistake in Personal Branding"
                  required
                />
              </div>
              <div>
                <label htmlFor="generationInput" className="block text-sm font-medium leading-6 text-text-secondary">Key Points or Description</label>
                <textarea
                  id="generationInput"
                  rows={8}
                  value={generationInput}
                  onChange={(e) => setGenerationInput(e.target.value)}
                  className="mt-2 block w-full rounded-md border-0 bg-background p-2.5 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  placeholder="Provide a brief description of the post or list out the key points you want to cover."
                  required
                />
              </div>
              {generationError && <p className="text-sm text-red-400">{generationError}</p>}
              <div className="pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !generationTitle.trim() || !generationInput.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <LoadingIcon className="w-5 h-5" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      <span>Generate Post</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
        <div className="bg-surface-secondary/30 p-4 rounded-b-lg flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-secondary text-text-primary font-semibold py-2 px-4 rounded-md hover:bg-secondary-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title || !content || !scheduledDate}
            className="bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            Schedule Post
          </button>
        </div>
      </div>
    </div>
  );
};
