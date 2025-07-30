
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '../constants';
import type { ScheduledPost } from '../types';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPost: ScheduledPost) => void;
  post: ScheduledPost;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, onClose, onSave, post }) => {
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  useEffect(() => {
    if (post) {
      setContent(post.content);
      // Format for datetime-local input
      const d = new Date(post.scheduledDate);
      // Adjust for timezone offset to display correctly in user's local time
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      setScheduledDate(d.toISOString().slice(0, 16));
    }
  }, [post]);

  const handleSave = () => {
    if (content && scheduledDate) {
      onSave({
        ...post,
        content,
        scheduledDate: new Date(scheduledDate).toISOString(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-text-primary">Edit Scheduled Post</h2>
            <button onClick={onClose} className="text-text-tertiary hover:text-text-primary p-1 rounded-full hover:bg-surface-secondary">
                <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
           <div>
            <label htmlFor="postContent" className="block text-sm font-medium leading-6 text-text-secondary">Post Content</label>
             <textarea
                id="postContent"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 bg-background p-2.5 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                required
            />
           </div>
           <div>
            <label htmlFor="scheduleDate" className="block text-sm font-medium leading-6 text-text-secondary">Schedule Date & Time</label>
            <input
                id="scheduleDate"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="mt-2 w-full rounded-md border-0 bg-background p-2 text-text-primary ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary"
                min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                required
            />
           </div>
        </div>
        <div className="bg-background/50 p-4 rounded-b-lg flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-secondary text-text-primary font-semibold py-2 px-4 rounded-md hover:bg-secondary-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!content || !scheduledDate}
            className="bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
