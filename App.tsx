
import React, { useState, useCallback, useEffect } from 'react';
import { OnboardingData, Strategy, User, UserProfileData } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { analyzeProfileForOnboarding, generateStrategy } from './services/geminiService';
import { LoadingIcon } from './constants';
import { ProfileInputScreen } from './components/ProfileInputScreen';
import { OnboardingReviewScreen } from './components/OnboardingReviewScreen';

type AppStep = 'profileInput' | 'loadingSuggestions' | 'onboardingReview' | 'loadingStrategy' | 'dashboard';

const GUEST_EMAIL = 'guest_user';
const GUEST_USER: User = { email: GUEST_EMAIL, name: 'Guest', picture: undefined };

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<AppStep>('profileInput');
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [onboardingSuggestions, setOnboardingSuggestions] = useState<OnboardingData | null>(null);
  const [onboardingState, setOnboardingState] = useState<{ linkedInUrl: string, profileText: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegeneratingStrategy, setIsRegeneratingStrategy] = useState(false);


  // Check for logged-in user or guest session on initial load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('linkedin_strategy_user');
      const profileKey = storedUser ? `linkedin_profile_${JSON.parse(storedUser).email}` : `linkedin_profile_${GUEST_EMAIL}`;
      const storedProfile = localStorage.getItem(profileKey);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (storedProfile) {
        setUser(GUEST_USER);
      }
      
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
        setStep('dashboard');
      }

    } catch (e) {
      console.error("Failed to parse from localStorage", e);
      localStorage.clear(); // Clear potentially corrupted data
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    localStorage.setItem('linkedin_strategy_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    
    try {
        const storedProfile = localStorage.getItem(`linkedin_profile_${loggedInUser.email}`);
        if (storedProfile) {
            setUserProfile(JSON.parse(storedProfile));
            setStep('dashboard');
        } else {
            setUserProfile(null);
            setOnboardingSuggestions(null);
            setError(null);
            setStep('profileInput');
        }
    } catch (e) {
        console.error("Failed to parse profile from localStorage", e);
        setStep('profileInput');
        setUserProfile(null);
    }
  };
  
  const handleStartAsGuest = () => {
    setUser(GUEST_USER);
    setUserProfile(null);
    setOnboardingSuggestions(null);
    setError(null);
    setStep('profileInput');
  };

  const handleLogout = () => {
    if (user && user.email !== GUEST_EMAIL) {
        localStorage.removeItem('linkedin_strategy_user');
    }
    setUser(null);
    setUserProfile(null);
  };
  
  const handleStartOver = () => {
      if (window.confirm("Are you sure you want to start over? This will clear your current strategy and all related data.")) {
        if (user) {
            localStorage.removeItem(`linkedin_profile_${user.email}`);
            localStorage.removeItem(`scheduled_posts_${user.email}`);
            localStorage.removeItem(`lastFollowVisit_${user.email}`);
            localStorage.removeItem(`followCount_${user.email}`);
        }
        setUserProfile(null);
        setOnboardingSuggestions(null);
        setError(null);
        setStep('profileInput');
      }
  };

  const handleProfileSubmit = useCallback(async (profileText: string, linkedInUrl: string) => {
    setStep('loadingSuggestions');
    setError(null);
    setOnboardingState({ profileText, linkedInUrl });
    try {
      const suggestions = await analyzeProfileForOnboarding(profileText);
      if (suggestions) {
        setOnboardingSuggestions(suggestions);
        setStep('onboardingReview');
      } else {
          setError("Couldn't generate suggestions from your profile. Please try pasting a more detailed 'About' section.");
          setStep('profileInput');
      }
    } catch (err) {
      console.error(err);
      setError('There was an issue analyzing your profile. Please check your API key and try again.');
      setStep('profileInput');
    }
  }, []);

  const handleReviewSubmit = useCallback(async (finalData: OnboardingData) => {
      if (!user || !onboardingState) {
          setError("Something went wrong, user data is missing.");
          setUser(null);
          return;
      }
      setStep('loadingStrategy');
      setError(null);
      try {
          const strategy = await generateStrategy(finalData);
          const newUserProfile: UserProfileData = {
            strategy,
            onboardingData: finalData,
            profileText: onboardingState.profileText,
            linkedInUrl: onboardingState.linkedInUrl
          };
          setUserProfile(newUserProfile);
          localStorage.setItem(`linkedin_profile_${user.email}`, JSON.stringify(newUserProfile));
          setStep('dashboard');
      } catch (err) {
          console.error(err);
          setError('There was an issue generating your final strategy. Please try again.');
          setStep('onboardingReview');
      }
  }, [user, onboardingState]);

  const handleBackToStart = () => {
      setStep('profileInput');
      setError(null);
  };

  const handleProfileUpdate = useCallback((updatedProfile: UserProfileData) => {
    if (!user) return;
    setUserProfile(updatedProfile);
    localStorage.setItem(`linkedin_profile_${user.email}`, JSON.stringify(updatedProfile));
  }, [user]);

  const handleRegenerateStrategy = useCallback(async (updatedData: { linkedInUrl: string, profileText: string, onboardingData: OnboardingData }) => {
    if (!user) return;
    setIsRegeneratingStrategy(true);
    setError(null);
    try {
        const { linkedInUrl, profileText, onboardingData } = updatedData;
        const newStrategy = await generateStrategy(onboardingData);
        const newProfile: UserProfileData = {
            linkedInUrl,
            profileText,
            onboardingData,
            strategy: newStrategy,
        };
        handleProfileUpdate(newProfile);
    } catch (err) {
        console.error(err);
        setError('There was an issue regenerating your strategy. Please try again.');
        // The error will be displayed on the customization screen
    } finally {
        setIsRegeneratingStrategy(false);
    }
  }, [user, handleProfileUpdate]);
  
  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-text-primary p-4 text-center">
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
        return <ProfileInputScreen onSubmit={handleProfileSubmit} error={error} />;
      case 'loadingSuggestions':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-text-primary p-4 text-center">
            <LoadingIcon className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-semibold">Analyzing Your Profile...</h2>
            <p className="text-text-tertiary mt-2">Deducing your industry, goals, and audience.</p>
          </div>
        );
      case 'onboardingReview':
          return <OnboardingReviewScreen
                    suggestions={onboardingSuggestions}
                    onSubmit={handleReviewSubmit}
                    onBack={handleBackToStart}
                    error={error}
                 />;
      case 'loadingStrategy':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-text-primary p-4 text-center">
            <LoadingIcon className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-semibold">Crafting Your Full Strategy...</h2>
            <p className="text-text-tertiary mt-2">Personalizing your LinkedIn blueprint.</p>
          </div>
        );
      case 'dashboard':
        if (userProfile && user) {
          return <Dashboard 
                    userProfile={userProfile} 
                    user={user}
                    isGuest={user.email === GUEST_EMAIL}
                    onLogout={handleLogout}
                    onStartOver={handleStartOver}
                    onLoginRequest={() => setUser(null)}
                    onProfileUpdate={handleProfileUpdate}
                    onRegenerateStrategy={handleRegenerateStrategy}
                    isRegeneratingStrategy={isRegeneratingStrategy}
                    regenerationError={error}
                 />;
        }
        setStep('profileInput');
        return <ProfileInputScreen onSubmit={handleProfileSubmit} error={error} />;
      default:
        setStep('profileInput');
        return <ProfileInputScreen onSubmit={handleProfileSubmit} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-text-primary">
      {renderContent()}
    </div>
  );
};

export default App;