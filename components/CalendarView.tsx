"use client";

import React, { useState, useMemo } from 'react';
import type { ScheduledPost, PostingSuggestion } from '@/types';
import { TrashIcon } from '@/constants';

interface CalendarViewProps {
  scheduledPosts: ScheduledPost[];
  postingSuggestions: PostingSuggestion[];
  onViewPost: (post: ScheduledPost) => void;
  onDeletePost: (postId: string) => void;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayNames: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


export const CalendarView: React.FC<CalendarViewProps> = ({ scheduledPosts, postingSuggestions, onViewPost, onDeletePost }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startingDayOfWeek = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const suggestionMap = useMemo(() => {
    const map = new Map<string, string[]>();
    postingSuggestions.forEach(s => {
      const times = map.get(s.day) || [];
      times.push(s.time);
      map.set(s.day, times);
    });
    return map;
  }, [postingSuggestions]);

  const renderCalendarDays = () => {
    const days = [];
    // Blank days for the start of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`blank-${i}`} className="border-r border-b border-brand-border"></div>);
    }

    // Actual days
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = date.toISOString().split('T')[0];
        const dayOfWeekName = dayNames[date.getDay()];

        const postsForDay = scheduledPosts.filter(p => p.scheduledDate.startsWith(dateString));
        const suggestionsForDay = suggestionMap.get(dayOfWeekName);
        
        const isToday = new Date().toISOString().split('T')[0] === dateString;

        days.push(
            <div key={day} className="relative border-r border-b border-brand-border p-2 min-h-[120px] flex flex-col transition-colors hover:bg-brand-surface">
                <time dateTime={dateString} className={`font-semibold ${isToday ? 'bg-brand-primary text-white rounded-full flex items-center justify-center w-6 h-6' : 'text-brand-text-primary'}`}>
                    {day}
                </time>
                {suggestionsForDay && (
                    <div className="absolute top-2 right-2 text-xs text-brand-primary opacity-70" title={`Suggested: ${suggestionsForDay.join(', ')}`}>
                      💡
                    </div>
                )}
                <div className="flex-grow mt-2 space-y-1 overflow-y-auto">
                    {postsForDay.map(post => (
                         <div 
                            key={post.id} 
                            className="group relative bg-brand-primary/20 text-brand-primary text-xs p-2 rounded-md cursor-pointer hover:bg-brand-primary/40 hover:shadow-lg transition-all"
                            onClick={() => onViewPost(post)}
                        >
                            <p className="font-semibold truncate pr-4 text-brand-text-primary">{post.title}</p>
                            <p className="truncate text-brand-text-secondary">{new Date(post.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeletePost(post.id); }}
                                className="absolute top-1 right-1 p-0.5 bg-brand-danger/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-danger"
                                title="Delete Post"
                            >
                                <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return days;
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-brand-surface">&lt;</button>
        <h2 className="text-xl font-bold text-brand-text-primary">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-brand-surface">&gt;</button>
      </div>
      <div className="grid grid-cols-7 border-t border-l border-brand-border">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-semibold text-brand-text-secondary text-sm py-2 border-r border-b border-brand-border bg-brand-surface">{day}</div>
        ))}
        {renderCalendarDays()}
      </div>
       {postingSuggestions.length > 0 && (
        <div className="mt-4 text-xs text-brand-text-secondary">
           💡 Best times to post suggested by AI for your audience.
        </div>
      )}
    </div>
  );
};