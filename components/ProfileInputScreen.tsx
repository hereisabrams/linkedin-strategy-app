
import React, { useState } from 'react';
import { LoadingIcon, SparklesIcon } from '../constants';

interface ProfileInputScreenProps {
  onSubmit: (profileText: string) => void;
  error: string | null;
}

export const ProfileInputScreen: React.FC<ProfileInputScreenProps> = ({ onSubmit, error }) => {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [showAboutInput, setShowAboutInput] = useState(false);
  
  const [profileText, setProfileText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError('');
    // Simple regex to validate a linkedin profile URL
    const linkedInRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/;
    if (linkedInRegex.test(linkedInUrl)) {
      setShowAboutInput(true);
    } else {
      setUrlError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname).');
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileText.trim()) {
      setIsLoading(true);
      onSubmit(profileText);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <SparklesIcon className="w-12 h-12 mx-auto text-primary"/>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-text-primary">
            {showAboutInput ? "Great! Let's import your summary" : "Let's Start with Your Profile"}
          </h2>
          <p className="mt-2 text-center text-sm text-text-tertiary">
             {showAboutInput 
                ? "To protect your privacy, we need you to copy/paste your 'About' section."
                : "Enter your LinkedIn profile URL to begin."
             }
          </p>
        </div>
        
        {!showAboutInput ? (
          <form className="mt-8 space-y-6 bg-surface p-8 rounded-lg shadow-2xl" onSubmit={handleUrlSubmit}>
            <div>
              <label htmlFor="linkedInUrl" className="sr-only">LinkedIn Profile URL</label>
              <input
                id="linkedInUrl"
                name="linkedInUrl"
                type="url"
                autoComplete="url"
                required
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
                className="block w-full rounded-md border-0 bg-background p-2.5 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition"
                placeholder="https://www.linkedin.com/in/your-name"
              />
            </div>
            {urlError && <p className="text-sm text-red-400 mt-2">{urlError}</p>}
            <div className="pt-2">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6 bg-surface p-8 rounded-lg shadow-2xl" onSubmit={handleProfileSubmit}>
              <div className="text-sm text-text-secondary bg-surface-secondary p-4 rounded-md space-y-2">
                  <p className="font-semibold">Just 3 quick steps:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>
                      Click this link to open your profile: {' '}
                      <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                        View Profile
                      </a>
                    </li>
                    <li>Find and copy the text in your "About" section.</li>
                    <li>Paste it into the text box below.</li>
                  </ol>
              </div>
              <div>
                 <label htmlFor="profileText" className="sr-only">Your LinkedIn "About" Section</label>
                <textarea
                    id="profileText"
                    name="profileText"
                    rows={10}
                    value={profileText}
                    onChange={(e) => setProfileText(e.target.value)}
                    className="block w-full rounded-md border-0 bg-background p-2.5 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition"
                    placeholder="Go to your profile, copy your 'About' section, and paste it here..."
                    required
                />
            </div>
           
            {error && <p className="text-sm text-red-400">{error}</p>}

            <div>
                <button
                    type="submit"
                    disabled={isLoading || !profileText.trim()}
                    className="flex w-full justify-center items-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <LoadingIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                    {isLoading ? 'Analyzing...' : 'Analyze & Get Suggestions'}
                </button>
            </div>
        </form>
        )}
      </div>
    </div>
  );
};