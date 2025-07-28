
import React, { useState, useEffect, useCallback } from 'react';
import type { Strategy, PostIdea, User, ProfileAnalysisResult, ScheduledPost, PostingSuggestion, ScheduleSuggestion, TrendsResult } from '../types';
import { ContentIdeas } from './ContentIdeas';
import { StrategyCard } from './StrategyCard';
import { TaskTracker } from './TaskTracker';
import { generatePost, analyzeProfile, getPostingSuggestions, getScheduleSuggestion, regeneratePostIdeas, fetchLinkedInTrends } from '../services/geminiService';
import { PostModal } from './PostModal';
import { CalendarIcon, LoadingIcon, SparklesIcon } from '../constants';
import { CalendarView } from './CalendarView';
import { ProfileAnalyzer } from './ProfileAnalyzer';
import { SchedulePostModal } from './SchedulePostModal';
import { Trends } from './Trends';

interface DashboardProps {
  strategy: Strategy;
  user: User;
  isGuest: boolean;
  onLogout: () => void;
  onStartOver: () => void;
  onLoginRequest: () => void;
}

type ActiveTab = 'strategy' | 'calendar';

export const Dashboard: React.FC<DashboardProps> = ({ strategy, user, isGuest, onLogout, onStartOver, onLoginRequest }) => {
  const [currentStrategy, setCurrentStrategy] = useState<Strategy>(strategy);
  const [activeTab, setActiveTab] = useState<ActiveTab>('strategy');
  
  // Content Generation State
  const [selectedPost, setSelectedPost] = useState<PostIdea | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReloadingIdeas, setIsReloadingIdeas] = useState(false);

  // Profile Analysis State
  const [analysis, setAnalysis] = useState<ProfileAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Scheduling State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [postToSchedule, setPostToSchedule] = useState<{title: string, content: string} | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [postingSuggestions, setPostingSuggestions] = useState<PostingSuggestion[]>([]);
  const [scheduleSuggestion, setScheduleSuggestion] = useState<ScheduleSuggestion | null>(null);

  // Trends State
  const [trendsResult, setTrendsResult] = useState<TrendsResult | null>(null);
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);


  const userEmail = user.email;

  // Load data from localStorage and fetch suggestions on mount
  useEffect(() => {
    try {
      const storedAnalysis = localStorage.getItem(`analysis_${userEmail}`);
      if (storedAnalysis) setAnalysis(JSON.parse(storedAnalysis));

      const storedScheduledPosts = localStorage.getItem(`scheduled_posts_${userEmail}`);
      if (storedScheduledPosts) setScheduledPosts(JSON.parse(storedScheduledPosts));
      
      // Fetch suggestions from AI
      getPostingSuggestions(currentStrategy).then(setPostingSuggestions).catch(err => console.error(err));
      getScheduleSuggestion(currentStrategy).then(setScheduleSuggestion).catch(err => console.error(err));
      
    } catch(e) {
      console.error("Failed to parse data from localStorage", e);
    }
  }, [userEmail, currentStrategy]);

    // Effect for handling notifications
  useEffect(() => {
    // Check if notifications are supported and permission is granted
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }

    const scheduledTimeouts = new Map<string, number[]>();

    scheduledPosts.forEach(post => {
        const postDate = new Date(post.scheduledDate);
        const now = new Date();
        const timeouts: number[] = [];

        // Schedule notifications only for future posts
        if (postDate > now) {
            const timeUntilPost = postDate.getTime() - now.getTime();

            // Notification intervals in milliseconds
            const intervals = [
                { time: 24 * 60 * 60 * 1000, label: '24 hours' },
                { time: 60 * 60 * 1000, label: '1 hour' },
                { time: 5 * 60 * 1000, label: '5 minutes' },
            ];
            
            intervals.forEach(interval => {
                const timeoutDelay = timeUntilPost - interval.time;
                if (timeoutDelay > 0) {
                    const timeoutId = window.setTimeout(() => {
                        new Notification('LinkedIn Post Reminder', {
                            body: `Your post "${post.title}" is scheduled in ${interval.label}.`,
                            icon: '/favicon.svg'
                        });
                    }, timeoutDelay);
                    timeouts.push(timeoutId);
                }
            });
        }
        if (timeouts.length > 0) {
            scheduledTimeouts.set(post.id, timeouts);
        }
    });

    // Cleanup function to clear timeouts when component unmounts or posts change
    return () => {
        scheduledTimeouts.forEach(timeouts => {
            timeouts.forEach(window.clearTimeout);
        });
    };
  }, [scheduledPosts]);

  const handleReloadIdeas = useCallback(async () => {
    setIsReloadingIdeas(true);
    setScheduleSuggestion(null); // Clear old suggestion
    try {
      const newIdeas = await regeneratePostIdeas(currentStrategy);
      const newStrategy = { ...currentStrategy, postIdeas: newIdeas };
      setCurrentStrategy(newStrategy);
      localStorage.setItem(`linkedin_strategy_${user.email}`, JSON.stringify(newStrategy));
      // Fetch new schedule suggestion for the new ideas
      getScheduleSuggestion(newStrategy).then(setScheduleSuggestion).catch(err => console.error(err));
    } catch (error) {
      console.error("Failed to reload ideas:", error);
      alert("Sorry, we couldn't get new ideas. Please try again.");
    } finally {
      setIsReloadingIdeas(false);
    }
  }, [currentStrategy, user.email]);

  const handleGeneratePost = useCallback(async (idea: PostIdea) => {
    setSelectedPost(idea);
    setIsGenerating(true);
    setGeneratedContent('');
    setIsPostModalOpen(true);
    try {
      const content = await generatePost(idea, currentStrategy);
      setGeneratedContent(content);
    } catch (error) {
      console.error("Failed to generate post:", error);
      setGeneratedContent("Sorry, we couldn't generate the post. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [currentStrategy]);

  const handleAnalyzeProfile = useCallback(async (aboutText: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeProfile(aboutText);
      setAnalysis(result);
      localStorage.setItem(`analysis_${userEmail}`, JSON.stringify(result));
    } catch(error) {
      console.error("Failed to analyze profile", error);
      alert("There was an error analyzing your profile. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [userEmail]);

  const handleSchedulePost = (date: string) => {
    // Request notification permission on first schedule
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
      
    if (!postToSchedule) return;
    const newScheduledPost: ScheduledPost = {
      id: crypto.randomUUID(),
      title: postToSchedule.title,
      content: postToSchedule.content,
      scheduledDate: date,
    };
    const updatedPosts = [...scheduledPosts, newScheduledPost];
    setScheduledPosts(updatedPosts);
    localStorage.setItem(`scheduled_posts_${userEmail}`, JSON.stringify(updatedPosts));
    closeScheduleModal();
    closePostModal();
  };

    const handleFetchTrends = useCallback(async () => {
    setIsFetchingTrends(true);
    try {
      const result = await fetchLinkedInTrends(currentStrategy);
      setTrendsResult(result);
    } catch (error) {
      console.error("Failed to fetch trends:", error);
      alert("Sorry, we couldn't fetch LinkedIn trends. Please try again.");
    } finally {
      setIsFetchingTrends(false);
    }
  }, [currentStrategy]);

  const openScheduleModal = () => {
    if (!selectedPost || !generatedContent) return;
    setPostToSchedule({ title: selectedPost.title, content: generatedContent });
    setIsScheduleModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setPostToSchedule(null);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
    setGeneratedContent('');
    setSelectedPost(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your LinkedIn Dashboard</h1>
            <p className="text-gray-400 mt-1">
              {isGuest ? 'Welcome, Guest!' : `Welcome back, ${(user.name || '').split(' ')[0]}!`}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <button
                onClick={onStartOver}
                className="bg-red-800 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-md transition-colors text-sm"
                title="This will clear your current strategy and all related data."
             >
                Start Over
            </button>
            {isGuest ? (
              <button
                onClick={onLoginRequest}
                className="bg-brand-blue hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
              >
                Sign In to Sync
              </button>
            ) : (
              <>
                {user.picture && (
                  <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                )}
                <button
                  onClick={onLogout}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-700">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('strategy')}
              className={`${
                activeTab === 'strategy' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <SparklesIcon className="w-5 h-5"/>
              Strategy & Content
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`${
                activeTab === 'calendar' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <CalendarIcon className="w-5 h-5"/>
              Analysis & Calendar
            </button>
          </nav>
        </div>

        <main>
          {activeTab === 'strategy' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <StrategyCard summary={currentStrategy.summary} contentPillars={currentStrategy.contentPillars} tone={currentStrategy.tone} />
                <ContentIdeas 
                  ideas={currentStrategy.postIdeas} 
                  onGeneratePost={handleGeneratePost} 
                  isGenerating={isGenerating}
                  generatingIdea={selectedPost}
                  suggestion={scheduleSuggestion}
                  onReloadIdeas={handleReloadIdeas}
                  isReloading={isReloadingIdeas}
                />
              </div>
              <div className="lg:col-span-1 space-y-8">
                <TaskTracker user={user} />
                <Trends
                  onFetchTrends={handleFetchTrends}
                  trendsResult={trendsResult}
                  isLoading={isFetchingTrends}
                />
              </div>
            </div>
          )}
          {activeTab === 'calendar' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CalendarView scheduledPosts={scheduledPosts} postingSuggestions={postingSuggestions} />
                </div>
                 <div className="lg:col-span-1">
                    <ProfileAnalyzer onAnalyze={handleAnalyzeProfile} analysisResult={analysis} isLoading={isAnalyzing} />
                 </div>
            </div>
          )}
        </main>
      </div>

      {isPostModalOpen && (
        <PostModal
          isOpen={isPostModalOpen}
          onClose={closePostModal}
          isLoading={isGenerating}
          content={generatedContent}
          title={selectedPost?.title || "Generated Post"}
          onSchedule={openScheduleModal}
        />
      )}
      {isScheduleModalOpen && (
        <SchedulePostModal 
            isOpen={isScheduleModalOpen}
            onClose={closeScheduleModal}
            onSchedule={handleSchedulePost}
        />
      )}
    </>
  );
};