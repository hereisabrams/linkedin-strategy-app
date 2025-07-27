
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { InitialOnboardingData, Strategy, User } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OnboardingForm } from './components/OnboardingForm';
import { AudienceSelectionScreen } from './components/AudienceSelectionScreen';
import { Dashboard } from './components/Dashboard';
import { generateAudienceSuggestions, generateStrategy } from './services/geminiService';
import { LoadingIcon } from './constants';
import { AuthScreen } from './components/AuthScreen';

type AppStep = 'welcome' | 'onboarding' | 'loadingAudience' | 'audienceSelection' | 'loadingStrategy' | 'dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<AppStep>('welcome');
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<InitialOnboardingData | null>(null);
  const [audienceSuggestions, setAudienceSuggestions] = useState<string[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check for logged-in user on initial load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('linkedin_strategy_user');
      if (storedUser) {
        const userData: User = JSON.parse(storedUser);
        setUser(userData);
        
        const storedStrategy = localStorage.getItem(`linkedin_strategy_${userData.email}`);
        if (storedStrategy) {
          setStrategy(JSON.parse(storedStrategy));
          setStep('dashboard');
        } else {
          setStep('welcome');
        }
      }
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
      localStorage.removeItem('linkedin_strategy_user');
    }
    setIsAuthLoading(false);
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
            setStep('welcome');
            setStrategy(null);
            setInitialData(null);
            setError(null);
        }
    } catch (e) {
        console.error("Failed to parse strategy from localStorage", e);
        setStep('welcome');
        setStrategy(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('linkedin_strategy_user');
    setUser(null);
    setStrategy(null);
    setStep('welcome');
  };
  
  const handleStart = () => {
    setStep('onboarding');
    setError(null);
    setInitialData(null);
    setAudienceSuggestions([]);
    setStrategy(null);
  };

  const handleOnboardingSubmit = useCallback(async (data: InitialOnboardingData) => {
    setInitialData(data);
    setStep('loadingAudience');
    setError(null);
    try {
      const suggestions = await generateAudienceSuggestions(data);
      if (suggestions && suggestions.length > 0) {
        setAudienceSuggestions(suggestions);
        setStep('audienceSelection');
      } else {
          setError("Couldn't generate audience suggestions. Please try adjusting your topics.");
          setStep('onboarding');
      }
    } catch (err) {
      console.error(err);
      setError('There was an issue generating audience suggestions. Please check your API key and try again.');
      setStep('onboarding');
    }
  }, []);

  const handleAudienceSelect = useCallback(async (selectedAudience: string) => {
      if (!initialData || !user) {
          setError("Something went wrong, initial data is missing. Please start over.");
          setStep('onboarding');
          return;
      }
      setStep('loadingStrategy');
      setError(null);
      const fullData = { ...initialData, targetAudience: selectedAudience };
      try {
          const result = await generateStrategy(fullData);
          setStrategy(result);
          localStorage.setItem(`linkedin_strategy_${user.email}`, JSON.stringify(result));
          setStep('dashboard');
      } catch (err) {
          console.error(err);
          setError('There was an issue generating your final strategy. Please try again.');
          setStep('audienceSelection');
      }
  }, [initialData, user]);

  const handleBackToOnboarding = () => {
      setStep('onboarding');
      setError(null);
  };
  
  if (isAuthLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 text-center">
            <LoadingIcon className="w-12 h-12" />
        </div>
    );
  }

  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (step) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />;
      case 'onboarding':
        return <OnboardingForm onSubmit={handleOnboardingSubmit} error={error} />;
      case 'loadingAudience':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 text-center">
            <LoadingIcon className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-semibold">Analyzing Your Profile...</h2>
            <p className="text-gray-400 mt-2">Finding the perfect audience for you.</p>
          </div>
        );
      case 'audienceSelection':
          return <AudienceSelectionScreen 
                    suggestions={audienceSuggestions} 
                    onSubmit={handleAudienceSelect} 
                    onBack={handleBackToOnboarding}
                    error={error}
                 />;
      case 'loadingStrategy':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 text-center">
            <LoadingIcon className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-semibold">Crafting Your Full Strategy...</h2>
            <p className="text-gray-400 mt-2">Personalizing your LinkedIn blueprint based on your choice.</p>
          </div>
        );
      case 'dashboard':
        if (strategy && user) {
          return <Dashboard strategy={strategy} user={user} onLogout={handleLogout} />;
        }
        // Fallback in case strategy is null but step is dashboard
        handleStart(); // Go back to start of flow
        return <WelcomeScreen onStart={handleStart} />;
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID || ''}>
      <div className="min-h-screen bg-brand-dark font-sans text-white">
        {renderContent()}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
