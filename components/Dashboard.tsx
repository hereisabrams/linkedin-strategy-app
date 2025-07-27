import React, { useState } from 'react';
import type { Strategy, PostIdea, User } from '../types';
import { ContentIdeas } from './ContentIdeas';
import { StrategyCard } from './StrategyCard';
import { TaskTracker } from './TaskTracker';
import { generatePost } from '../services/geminiService';
import { PostModal } from './PostModal';

interface DashboardProps {
  strategy: Strategy;
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ strategy, user, onLogout }) => {
  const [selectedPost, setSelectedPost] = useState<PostIdea | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePost = async (idea: PostIdea) => {
    setSelectedPost(idea);
    setIsGenerating(true);
    setIsModalOpen(true);
    try {
      const content = await generatePost(idea, strategy);
      setGeneratedContent(content);
    } catch (error) {
      console.error("Failed to generate post:", error);
      setGeneratedContent("Sorry, we couldn't generate the post. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setGeneratedContent('');
    setSelectedPost(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your LinkedIn Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {(user.name || '').split(' ')[0]}!</p>
          </div>
          <div className="flex items-center gap-4">
            {user.picture && (
              <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
            )}
            <button
              onClick={onLogout}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <StrategyCard summary={strategy.summary} contentPillars={strategy.contentPillars} tone={strategy.tone} />
            <ContentIdeas 
              ideas={strategy.postIdeas} 
              onGeneratePost={handleGeneratePost} 
              isGenerating={isGenerating}
              generatingIdea={selectedPost}
            />
          </div>
          <div className="lg:col-span-1">
            <TaskTracker user={user} />
          </div>
        </main>
      </div>
      {isModalOpen && (
        <PostModal
          isOpen={isModalOpen}
          onClose={closeModal}
          isLoading={isGenerating}
          content={generatedContent}
          title={selectedPost?.title || "Generated Post"}
        />
      )}
    </>
  );
};