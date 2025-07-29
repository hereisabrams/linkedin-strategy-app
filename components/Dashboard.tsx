
import React, { useState, useEffect, useCallback } from 'react';
import type { Strategy, PostIdea, User, ScheduledPost, PostingSuggestion, ScheduleSuggestion, TrendsResult, PostDraft, CommentReplySuggestion } from '../types';
import { ContentIdeas } from './ContentIdeas';
import { StrategyCard } from './StrategyCard';
import { TaskTracker } from './TaskTracker';
import { generatePost, getPostingSuggestions, getScheduleSuggestion, regeneratePostIdeas, fetchLinkedInTrends, generatePostFromDraft, generateCommentReplies, generateDM } from '../services/geminiService';
import { PostModal } from './PostModal';
import { CalendarIcon, ChatBubbleLeftRightIcon, SparklesIcon } from '../constants';
import { CalendarView } from './CalendarView';
import { SchedulePostModal } from './SchedulePostModal';
import { Trends } from './Trends';
import { ViewPostModal } from './ViewPostModal';
import { PostFromDraft } from './PostFromDraft';
import { CommentAssistant } from './CommentAssistant';
import { DMAssistant } from './DMAssistant';

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

interface AdSenseUnitProps {
    adSlot: string;
    className?: string;
}

const AdSenseUnit: React.FC<AdSenseUnitProps> = ({ adSlot, className }) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, [adSlot]);

    return (
        <div className={`bg-surface rounded-lg shadow-lg p-4 text-center ${className}`}>
             <ins className="adsbygoogle"
                style={{ display: 'block', width: '100%', minHeight: '100px' }}
                data-ad-client="ca-pub-8258399315362229"
                data-ad-slot={adSlot}
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
            <div className="text-xs text-text-tertiary mt-2">Advertisement</div>
        </div>
    );
};

interface DashboardProps {
  strategy: Strategy;
  user: User;
  isGuest: boolean;
  onLogout: () => void;
  onStartOver: () => void;
  onLoginRequest: () => void;
}

type ActiveTab = 'strategy' | 'calendar' | 'assistants';

export const Dashboard: React.FC<DashboardProps> = ({ strategy, user, isGuest, onLogout, onStartOver, onLoginRequest }) => {
  const [currentStrategy, setCurrentStrategy] = useState<Strategy>(strategy);
  const [activeTab, setActiveTab] = useState<ActiveTab>('strategy');
  
  // Content Generation State
  const [selectedPost, setSelectedPost] = useState<PostIdea | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReloadingIdeas, setIsReloadingIdeas] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>('');

  // Scheduling State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [postToSchedule, setPostToSchedule] = useState<{title: string, content: string} | null>(null);
  const [viewedPost, setViewedPost] = useState<ScheduledPost | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [postingSuggestions, setPostingSuggestions] = useState<PostingSuggestion[]>([]);
  const [scheduleSuggestion, setScheduleSuggestion] = useState<ScheduleSuggestion | null>(null);

  // Trends State
  const [trendsResult, setTrendsResult] = useState<TrendsResult | null>(null);
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);

  // Assistants State
  const [commentReplySuggestions, setCommentReplySuggestions] = useState<CommentReplySuggestion[] | null>(null);
  const [isGeneratingReplies, setIsGeneratingReplies] = useState(false);
  const [dmDraft, setDmDraft] = useState<string | null>(null);
  const [isGeneratingDM, setIsGeneratingDM] = useState(false);


  const userEmail = user.email;

  // Load data from localStorage and fetch suggestions on mount
  useEffect(() => {
    try {
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
                { time: 10 * 60 * 1000, label: '10 minutes' },
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
    setModalTitle(idea.title);
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

  const handleGeneratePostFromDraft = useCallback(async (draft: PostDraft) => {
    setSelectedPost(null);
    setModalTitle(draft.title);
    setIsGenerating(true);
    setGeneratedContent('');
    setIsPostModalOpen(true);
    try {
        const content = await generatePostFromDraft(draft, currentStrategy);
        setGeneratedContent(content);
    } catch (error) {
        console.error("Failed to generate post from draft:", error);
        setGeneratedContent("Sorry, we couldn't generate the post from your draft. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  }, [currentStrategy]);

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

  const handleDeletePost = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this scheduled post?")) {
        const updatedPosts = scheduledPosts.filter(p => p.id !== postId);
        setScheduledPosts(updatedPosts);
        localStorage.setItem(`scheduled_posts_${userEmail}`, JSON.stringify(updatedPosts));
        closeViewModal();
    }
  };

  const handleViewPost = (post: ScheduledPost) => {
      setViewedPost(post);
      setIsViewModalOpen(true);
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

  const handleGenerateReplies = useCallback(async (postContent: string, comment: string) => {
    setIsGeneratingReplies(true);
    setCommentReplySuggestions(null);
    try {
      const result = await generateCommentReplies(postContent, comment, currentStrategy);
      setCommentReplySuggestions(result);
    } catch (error) {
      console.error("Failed to generate replies:", error);
      alert("Sorry, we couldn't generate comment replies. Please try again.");
    } finally {
      setIsGeneratingReplies(false);
    }
  }, [currentStrategy]);
  
  const handleGenerateDM = useCallback(async (profileText: string) => {
    setIsGeneratingDM(true);
    setDmDraft(null);
    try {
      const result = await generateDM(profileText, currentStrategy);
      setDmDraft(result);
    } catch (error) {
      console.error("Failed to generate DM:", error);
      alert("Sorry, we couldn't generate the DM draft. Please try again.");
    } finally {
      setIsGeneratingDM(false);
    }
  }, [currentStrategy]);

  const openScheduleModal = () => {
    if (!modalTitle || !generatedContent) return;
    setPostToSchedule({ title: modalTitle, content: generatedContent });
    setIsScheduleModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setPostToSchedule(null);
  };
  
  const closeViewModal = () => {
      setIsViewModalOpen(false);
      setViewedPost(null);
  }

  const closePostModal = () => {
    setIsPostModalOpen(false);
    setGeneratedContent('');
    setSelectedPost(null);
    setModalTitle('');
  };

  return (
    <>
      <div className="min-h-screen bg-background text-text-primary p-4 sm:p-6 lg:p-8">
        <header className="mb-6 pb-6 border-b border-border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your LinkedIn Dashboard</h1>
            <p className="text-text-tertiary mt-1">
              {isGuest ? 'Welcome, Guest!' : `Welcome back, ${(user.name || '').split(' ')[0]}!`}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <button
                onClick={onStartOver}
                className="bg-red-800 hover:bg-red-700 text-text-primary font-semibold py-2 px-3 rounded-md transition-colors text-sm"
                title="This will clear your current strategy and all related data."
             >
                Start Over
            </button>
            {isGuest ? (
              <button
                onClick={onLoginRequest}
                className="bg-primary hover:bg-primary-hover text-text-primary font-semibold py-2 px-4 rounded-md transition-colors"
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
                  className="bg-secondary hover:bg-secondary-hover text-text-primary font-semibold py-2 px-4 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('strategy')}
              className={`${
                activeTab === 'strategy' ? 'border-primary text-primary' : 'border-transparent text-text-tertiary hover:text-text-primary hover:border-border'
              } flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <SparklesIcon className="w-5 h-5"/>
              Strategy & Content
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`${
                activeTab === 'calendar' ? 'border-primary text-primary' : 'border-transparent text-text-tertiary hover:text-text-primary hover:border-border'
              } flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <CalendarIcon className="w-5 h-5"/>
              Content Calendar
            </button>
             <button
              onClick={() => setActiveTab('assistants')}
              className={`${
                activeTab === 'assistants' ? 'border-primary text-primary' : 'border-transparent text-text-tertiary hover:text-text-primary hover:border-border'
              } flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5"/>
              Assistants
            </button>
          </nav>
        </div>

        <main>
          {activeTab === 'strategy' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-8">
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
              <div className="lg:col-span-2 space-y-8">
                <TaskTracker user={user} />
                <Trends
                  onFetchTrends={handleFetchTrends}
                  trendsResult={trendsResult}
                  isLoading={isFetchingTrends}
                />
                <PostFromDraft onGenerate={handleGeneratePostFromDraft} isLoading={isGenerating && !selectedPost} />
                <AdSenseUnit adSlot="5434383635" />
              </div>
            </div>
          )}
          {activeTab === 'calendar' && (
             <div className="grid grid-cols-1 gap-8">
                <CalendarView 
                    scheduledPosts={scheduledPosts} 
                    postingSuggestions={postingSuggestions}
                    onViewPost={handleViewPost}
                    onDeletePost={handleDeletePost}
                />
            </div>
          )}
          {activeTab === 'assistants' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <CommentAssistant 
                  onGenerate={handleGenerateReplies}
                  suggestions={commentReplySuggestions}
                  isLoading={isGeneratingReplies}
                />
                <DMAssistant 
                  onGenerate={handleGenerateDM}
                  draft={dmDraft}
                  isLoading={isGeneratingDM}
                />
              </div>
              <AdSenseUnit adSlot="5322923756" />
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
          title={modalTitle || "Generated Post"}
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
      {isViewModalOpen && viewedPost && (
        <ViewPostModal
            isOpen={isViewModalOpen}
            onClose={closeViewModal}
            onDelete={handleDeletePost}
            post={viewedPost}
        />
      )}
    </>
  );
};