
import React, { useState } from 'react';
import { XMarkIcon } from '../constants';

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string) => void;
}

export const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ isOpen, onClose, onSchedule }) => {
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().slice(0, 16));

  const handleSchedule = () => {
    if (scheduleDate) {
        // Convert local datetime-local value to a full ISO string
        const isoDate = new Date(scheduleDate).toISOString();
        onSchedule(isoDate);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-text-primary">Schedule Post</h2>
             <button onClick={onClose} className="text-text-tertiary hover:text-text-primary p-1 rounded-full hover:bg-surface-secondary">
                <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <p className="text-text-secondary mb-4 text-sm">Select a date and time to schedule this post.</p>
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="w-full rounded-md border-0 bg-background p-2 text-text-primary ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary"
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
        <div className="bg-background/50 p-4 rounded-b-lg flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-secondary text-text-primary font-semibold py-2 px-4 rounded-md hover:bg-secondary-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={!scheduleDate}
            className="bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};