"use client";

import React, { useState, useCallback, useEffect } from 'react';
import type { OnboardingData, Strategy, User, ScrapedProfileData } from '@/types';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { Dashboard } from '@/components/Dashboard';
import { analyzeProfileForOnboarding, generateStrategy, scrapeProfile } from '@/services/apiService';
import { LoadingIcon } from '@/constants';
import { ProfileInputScreen } from '@/components/ProfileInputScreen';
import { OnboardingReviewScreen } from '@/components/OnboardingReviewScreen';
import { ScrapeReviewScreen } from '@/components/ScrapeReviewScreen';

type AppStep = 'profileInput' | 'scrapingProfile' | 'scrapeReview' | 'loadingSuggestions' | 'onboardingReview' | 'loadingStrategy' | 'dashboard';

const GUEST_EMAIL = 'guest_user';
const GUEST_USER: User = { email: GUEST_EMAIL, name: 'Guest', picture: undefined };

const Page: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<AppStep>('profileInput');
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [onboardingSuggestions, setOnboardingSuggestions] = useState<OnboardingData | null>(null);
  const [scrapedProfileData, setScrapedProfileData] = useState<ScrapedProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for logged-in user or guest session on initial load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('linkedin_strategy_user');
      if (storedUser) {
        const userData: User = JSON.parse(storedUser);
        const storedStrategy = localStorage.getItem(`linkedin_strategy_${userData.email}`);
        setUser(userData);
        if (storedStrategy) {
          setStrategy(JSON.parse(storedStrategy));
          setStep('dashboard');
        } else {
          setStep('profileInput');
        }
      } else {
        const guestStrategy = localStorage.getItem(`linkedin_strategy_${GUEST_EMAIL}`);
        if (guestStrategy) {
          setUser(GUEST_USER);
          setStrategy(JSON.parse(guestStrategy));
          setStep('dashboard');
        }
      }
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
      localStorage.removeItem('linkedin_strategy_user');
      localStorage.removeItem(`linkedin_strategy_${GUEST_EMAIL}`);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    localStorage.setItem('linkedin_strategy_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    
    try {
        const storedStrategy = localStorage.getItem(`linkedin_strategy_${loggedInUser.email}`);
        if (storedStrategy) {
            setStrategy(JSON.parse(storedStrategy));
            setStep('dashboard');
        } else {
            setStrategy(null);
            setOnboardingSuggestions(null);
            setError(null);
            setStep('profileInput');
        }
    } catch (e) {
        console.error("Failed to parse strategy from localStorage", e);
        setStep('profileInput');
        setStrategy(null);
    }
  };
  
  const handleStartAsGuest = () => {
    setUser(GUEST_USER);
    setStrategy(null);
    setOnboardingSuggestions(null);
    setError(null);
    setStep('profileInput');
  };

  const handleLogout = () => {
    if (user && user.email !== GUEST_EMAIL) {
        localStorage.removeItem('linkedin_strategy_user');
    }
    setUser(null);
    setStrategy(null);
  };
  
  const handleStartOver = () => {
      if (window.confirm("Are you sure you want to start over? This will clear your current strategy and all related data.")) {
        if (user) {
            localStorage.removeItem(`linkedin_strategy_${user.email}`);
            localStorage.removeItem(`scheduled_posts_${user.email}`);
            localStorage.removeItem(`lastFollowVisit_${user.email}`);
            localStorage.removeItem(`followCount_${user.email}`);
        }
        setStrategy(null);
        setOnboardingSuggestions(null);
        setScrapedProfileData(null);
        setError(null);
        setStep('profileInput');
      }
  };
  
  const handleUrlSubmit = useCallback(async (url: string) => {
    setStep('scrapingProfile');
    setError(null);
    try {
      const result = await scrapeProfile(url);
      setScrapedProfileData(result);
      setStep('scrapeReview');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'There was an issue scraping the profile. Please check the URL and ensure the profile is public.');
      setStep('profileInput');
    }
  }, []);

  const handleProfileSubmit = useCallback(async (profileText: string) => {
    setStep('loadingSuggestions');
    setError(null);
    try {
      const suggestions = await analyzeProfileForOnboarding(profileText);
      if (suggestions) {
        setOnboardingSuggestions(suggestions);
        setStep('onboardingReview');
      } else {
          setError("Couldn't generate suggestions from your profile. Please try again with a different profile or ensure the 'About' section is filled out.");
          setStep('scrapeReview');
      }
    } catch (err) {
      console.error(err);
      setError('There was an issue analyzing your profile. Please try again.');
      setStep('scrapeReview');
    }
  }, []);

  const handleReviewSubmit = useCallback(async (finalData: OnboardingData) => {
      if (!user) {
          setError("Something went wrong, user data is missing.");
          setUser(null);
          return;
      }
      setStep('loadingStrategy');
      setError(null);
      try {
          const result = await generateStrategy(finalData);
          setStrategy(result);
          localStorage.setItem(`linkedin_strategy_${user.email}`, JSON.stringify(result));
          setStep('dashboard');
      } catch (err) {
          console.error(err);
          setError('There was an issue generating your final strategy. Please try again.');
          setStep('onboardingReview');
      }
  }, [user]);

  const handleBackToStart = () => {
      setStep('profileInput');
      setError(null);
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center text-brand-text-primary">
            <LoadingIcon className="w-12 h-12" />
        </div>
    );
  }
  
  if (!user) {
    return <WelcomeScreen onLoginSuccess={handleLoginSuccess} onStartAsGuest={handleStartAsGuest} />;
  }

  const renderContent = () => {
    switch (step) {
      case 'profileInput':
        return <ProfileInputScreen onSubmit={handleUrlSubmit} error={error} />;
      case 'scrapingProfile':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center text-brand-text-primary">
            <LoadingIcon className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-semibold">Scraping Your Profile...</h2>
            <p className="text-brand-text-secondary mt-2">This may take a moment. Please wait.</p>
          </div>
        );
      case 'scrapeReview':
        return <ScrapeReviewScreen
                  scrapedData={scrapedProfileData}
                  onConfirm={() => {
                    if (scrapedProfileData?.about) {
                      handleProfileSubmit(scrapedProfileData.about)
                    } else {
                      setError("The 'About' section was not found. Cannot proceed.");
                    }
                  }}
                  onRetry={handleBackToStart}
                />
      case 'loadingSuggestions':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center text-brand-text-primary">
            <LoadingIcon className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-semibold">Analyzing Your Profile...</h2>
            <p className="text-brand-text-secondary mt-2">Deducing your industry, goals, and audience.</p>
          </div>
        );
      case 'onboardingReview':
          return <OnboardingReviewScreen
                    suggestions={onboardingSuggestions}
                    onSubmit={handleReviewSubmit}
                    onBack={() => setStep('scrapeReview')}
                    error={error}
                 />;
      case 'loadingStrategy':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center text-brand-text-primary">
            <LoadingIcon className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-semibold">Crafting Your Full Strategy...</h2>
            <p className="text-brand-text-secondary mt-2">Personalizing your LinkedIn blueprint.</p>
          </div>
        );
      case 'dashboard':
        if (strategy && user) {
          return <Dashboard 
                    strategy={strategy} 
                    user={user}
                    isGuest={user.email === GUEST_EMAIL}
                    onLogout={handleLogout}
                    onStartOver={handleStartOver}
                    onLoginRequest={() => setUser(null)}
                 />;
        }
        setStep('profileInput');
        return <ProfileInputScreen onSubmit={handleUrlSubmit} error={error} />;
      default:
        setStep('profileInput');
        return <ProfileInputScreen onSubmit={handleUrlSubmit} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-background text-brand-text-primary">
      {renderContent()}
    </div>
  );
};

export default Page;