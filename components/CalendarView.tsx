import React, { useState, useMemo } from 'react';
import type { ScheduledPost, PostingSuggestion } from '../types';
import { PlusIcon, TrashIcon, CalendarIcon } from '../constants';

interface CalendarViewProps {
  scheduledPosts: ScheduledPost[];
  postingSuggestions: PostingSuggestion[];
  onViewPost: (post: ScheduledPost) => void;
  onDeletePost: (postId: string) => void;
  onAddPost: (date: string) => void;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarView: React.FC<CalendarViewProps> = ({ scheduledPosts, postingSuggestions, onViewPost, onDeletePost, onAddPost }) => {
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
      days.push(<div key={`blank-${i}`} className="border-r border-b border-border"></div>);
    }

    // Actual days
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = date.toISOString().split('T')[0];
        const dayOfWeekName = daysOfWeek[date.getDay()] as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

        const postsForDay = scheduledPosts.filter(p => p.scheduledDate.startsWith(dateString));
        const suggestionsForDay = suggestionMap.get(dayOfWeekName);
        
        const isToday = new Date().toISOString().split('T')[0] === dateString;

        days.push(
            <div key={day} className="relative group/cell border-r border-b border-border p-2 min-h-[120px] flex flex-col hover:bg-surface-secondary/30 transition-colors">
                <time dateTime={dateString} className={`font-semibold ${isToday ? 'bg-primary text-white rounded-full flex items-center justify-center w-6 h-6' : 'text-text-primary'}`}>
                    {day}
                </time>
                {suggestionsForDay && (
                    <div className="absolute top-1 right-1 text-xs text-primary/70" title={`Suggested: ${suggestionsForDay.join(', ')}`}>
                      💡
                    </div>
                )}
                <div className="flex-grow mt-1 space-y-1 overflow-y-auto">
                    {postsForDay.map(post => (
                         <div 
                            key={post.id} 
                            className="group/post relative bg-primary/20 text-blue-200 text-xs p-2 rounded-md cursor-pointer hover:bg-primary/40 hover:shadow-lg transition-all"
                            onClick={() => onViewPost(post)}
                        >
                            <p className="font-semibold truncate pr-4">{post.title}</p>
                            <p className="truncate opacity-80">{new Date(post.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeletePost(post.id); }}
                                className="absolute top-1 right-1 p-0.5 bg-red-600/80 rounded-full text-white opacity-0 group-hover/post:opacity-100 transition-opacity hover:bg-red-500/90"
                                title="Delete Post"
                            >
                                <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => onAddPost(dateString)}
                    className="absolute bottom-1 right-1 h-6 w-6 flex items-center justify-center bg-primary rounded-full text-white opacity-0 group-hover/cell:opacity-100 hover:bg-primary-hover focus:opacity-100 transition-all"
                    title="Add new post"
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
            </div>
        );
    }
    return days;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-surface rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center gap-2">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-secondary">&lt;</button>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-secondary">&gt;</button>
                    <button 
                        onClick={() => onAddPost(new Date().toISOString().split('T')[0])}
                        className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-3 rounded-md hover:bg-primary-hover transition-colors text-sm ml-4"
                    >
                        <CalendarIcon className="w-5 h-5" />
                        <span>Schedule Post</span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 border-t border-l border-border">
                {daysOfWeek.map(day => (
                <div key={day} className="text-center font-semibold text-text-tertiary text-sm py-2 border-r border-b border-border bg-surface-secondary/50">{day}</div>
                ))}
                {renderCalendarDays()}
            </div>
             {postingSuggestions.length > 0 && (
                <div className="mt-4 text-xs text-text-tertiary">
                💡 Best times to post suggested by AI for your audience. Hover over a day and click the '+' to add a new post.
                </div>
            )}
        </div>
        <div className="lg:col-span-1 bg-surface rounded-lg shadow-lg p-6 sticky top-8">
            <h3 className="text-xl font-bold text-text-primary mb-3">AI Scheduling Assistant</h3>
            <p className="text-text-tertiary text-sm mb-4">
                Based on your industry, audience, and timezone ({Intl.DateTimeFormat().resolvedOptions().timeZone}), here are the best times to post for maximum engagement.
            </p>
            {postingSuggestions.length > 0 ? (
                <ul className="space-y-2">
                    {postingSuggestions.map((s, i) => (
                        <li key={i} className="flex items-center gap-3 bg-surface-secondary p-3 rounded-md">
                            <span className="text-primary text-xl font-bold">💡</span>
                            <div>
                                <p className="font-semibold text-text-primary">{s.day}</p>
                                <p className="text-sm text-text-tertiary">{s.time}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-text-tertiary text-sm">Loading suggestions...</p>
            )}
        </div>
    </div>
  );
};