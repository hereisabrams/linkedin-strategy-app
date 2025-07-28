import React, { useState } from 'react';

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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Schedule Post</h2>
          <p className="text-gray-300 mb-4 text-sm">Select a date and time to schedule this post.</p>
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="w-full rounded-md border-0 bg-slate-900 p-2 text-white ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-brand-blue"
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
        <div className="bg-slate-700 p-4 rounded-b-lg flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={!scheduleDate}
            className="bg-brand-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
