"use client";

import React, { useState } from 'react';
import { SparklesIcon } from '@/constants';

interface ProfileInputScreenProps {
  onSubmit: (url: string) => void;
  error: string | null;
}

export const ProfileInputScreen: React.FC<ProfileInputScreenProps> = ({ onSubmit, error }) => {
  const [linkedInUrl, setLinkedInUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const linkedInRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/;
    if (linkedInRegex.test(linkedInUrl)) {
      onSubmit(linkedInUrl);
    } else {
        alert('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname).');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <SparklesIcon className="w-12 h-12 mx-auto text-brand-primary"/>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-brand-text-primary">
            Let's Start with Your Profile
          </h2>
          <p className="mt-2 text-center text-md text-brand-text-secondary">
             Enter your public LinkedIn profile URL to begin.
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-brand-card border border-brand-border p-8 rounded-lg shadow-2xl" onSubmit={handleSubmit}>
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
                className="block w-full rounded-md border-brand-border bg-brand-surface p-3 text-brand-text-primary shadow-sm ring-1 ring-transparent focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6 transition"
                placeholder="https://www.linkedin.com/in/your-name"
              />
            </div>
            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
            <div className="pt-2">
              <button
                type="submit"
                className="flex w-full justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary transition-colors"
              >
                <SparklesIcon className="w-5 h-5" />
                Scrape Profile & Continue
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};