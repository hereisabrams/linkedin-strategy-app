"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';

interface TaskTrackerProps {
  user: User;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

export const TaskTracker: React.FC<TaskTrackerProps> = ({ user }) => {
  const [followCount, setFollowCount] = useState<number>(0);
  const dailyFollowGoal = 25;
  
  // User-specific localStorage keys
  const lastVisitKey = `lastFollowVisit_${user.email}`;
  const followCountKey = `followCount_${user.email}`;

  const resetIfNewDay = useCallback(() => {
    const today = getTodayString();
    const lastVisit = localStorage.getItem(lastVisitKey);
    if (lastVisit !== today) {
      setFollowCount(0);
      localStorage.setItem(followCountKey, '0');
      localStorage.setItem(lastVisitKey, today);
    } else {
      const storedCount = parseInt(localStorage.getItem(followCountKey) || '0', 10);
      setFollowCount(storedCount);
    }
  }, [lastVisitKey, followCountKey]);

  useEffect(() => {
    resetIfNewDay();
  }, [resetIfNewDay]);

  const handleIncrement = () => {
    if (followCount < dailyFollowGoal) {
      const newCount = followCount + 1;
      setFollowCount(newCount);
      localStorage.setItem(followCountKey, newCount.toString());
    }
  };
  
  const handleReset = () => {
      setFollowCount(0);
      localStorage.setItem(followCountKey, '0');
  }

  const progressPercentage = (followCount / dailyFollowGoal) * 100;
  const isComplete = followCount >= dailyFollowGoal;

  return (
    <div className="bg-brand-card border border-brand-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-brand-text-primary mb-6">Daily Growth Tasks</h2>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="font-semibold text-brand-text-primary">Follow New Connections</h3>
            <span className={`text-sm font-bold ${isComplete ? 'text-green-400' : 'text-brand-text-secondary'}`}>
              {followCount} / {dailyFollowGoal}
            </span>
          </div>
          <div className="w-full bg-brand-surface rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-brand-primary'}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex gap-2 mt-4">
             <button
              onClick={handleIncrement}
              disabled={isComplete}
              className="w-full bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary-hover transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
            >
              {isComplete ? "Goal Reached!" : "+1 Follow"}
            </button>
             <button
              onClick={handleReset}
              title="Reset today's follow count"
              className="bg-brand-secondary text-brand-text-primary font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary-hover transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="border-t border-brand-border pt-6">
            <h3 className="font-semibold text-brand-text-primary">Engage with 5 Posts</h3>
            <p className="text-sm text-brand-text-secondary mt-1">Leave a thoughtful comment on 5 posts from people in your target audience. (Manual Tracking)</p>
        </div>
      </div>
    </div>
  );
};