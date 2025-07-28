import React, { useState, useMemo } from 'react';
import type { ScheduledPost, PostingSuggestion } from '../types';

interface CalendarViewProps {
  scheduledPosts: ScheduledPost[];
  postingSuggestions: PostingSuggestion[];
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarView: React.FC<CalendarViewProps> = ({ scheduledPosts, postingSuggestions }) => {
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
      days.push(<div key={`blank-${i}`} className="border-r border-b border-slate-700"></div>);
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
            <div key={day} className="relative border-r border-b border-slate-700 p-2 min-h-[120px] flex flex-col">
                <time dateTime={dateString} className={`font-semibold ${isToday ? 'bg-brand-blue text-white rounded-full flex items-center justify-center w-6 h-6' : 'text-white'}`}>
                    {day}
                </time>
                {suggestionsForDay && (
                    <div className="absolute top-1 right-1 text-xs text-blue-300 opacity-70" title={`Suggested: ${suggestionsForDay.join(', ')}`}>
                      💡
                    </div>
                )}
                <div className="flex-grow mt-1 space-y-1 overflow-y-auto">
                    {postsForDay.map(post => (
                         <div 
                            key={post.id} 
                            className="bg-blue-900/50 text-blue-200 text-xs p-1 rounded-md truncate cursor-pointer hover:bg-blue-800/70 transition-colors"
                            title={`${new Date(post.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${post.title}`}
                            onClick={() => alert(`Post: ${post.title}\n\nScheduled for: ${new Date(post.scheduledDate).toLocaleString()}`)}
                        >
                            {new Date(post.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {post.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return days;
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-700">&lt;</button>
        <h2 className="text-xl font-bold text-white">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-700">&gt;</button>
      </div>
      <div className="grid grid-cols-7">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-semibold text-gray-400 text-sm py-2 border-b border-slate-700">{day}</div>
        ))}
        {renderCalendarDays()}
      </div>
       {postingSuggestions.length > 0 && (
        <div className="mt-4 text-xs text-gray-400">
           💡 Best times to post suggested by AI for your audience.
        </div>
      )}
    </div>
  );
};
