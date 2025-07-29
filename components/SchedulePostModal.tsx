"use client";

import React, { useState } from 'react';
import { XMarkIcon } from '@/constants';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-brand-card border border-brand-border rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-text-primary">Schedule Post</h2>
             <button onClick={onClose} className="text-brand-text-secondary hover:text-brand-text-primary p-1 rounded-full hover:bg-brand-surface">
                <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <p className="text-brand-text-secondary mb-4 text-sm">Select a date and time to schedule this post.</p>
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="w-full rounded-md border-brand-border bg-brand-surface p-2 text-brand-text-primary ring-1 ring-transparent focus:ring-2 focus:ring-inset focus:ring-brand-primary"
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
        <div className="bg-brand-surface/50 border-t border-brand-border p-4 rounded-b-lg flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-brand-secondary text-brand-text-primary font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={!scheduleDate}
            className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};