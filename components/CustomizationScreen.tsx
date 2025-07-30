
import React, { useState } from 'react';
import type { UserProfileData, OnboardingData } from '../types';
import { LoadingIcon, SparklesIcon } from '../constants';

const InputField: React.FC<{ id: keyof OnboardingData | 'linkedInUrl'; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; required?: boolean }> = ({ id, label, value, onChange, placeholder, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-text-secondary">{label}</label>
        <div className="mt-2">
            <input
                type="text"
                name={id}
                id={id}
                value={value}
                onChange={onChange}
                className="block w-full rounded-md border-0 bg-background p-2.5 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition"
                placeholder={placeholder}
                required={required}
            />
        </div>
    </div>
);

const TextAreaField: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder: string; rows: number }> = ({ id, label, value, onChange, placeholder, rows }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-text-secondary">{label}</label>
        <div className="mt-2">
            <textarea
                id={id}
                name={id}
                rows={rows}
                value={value}
                onChange={onChange}
                className="block w-full rounded-md border-0 bg-background p-2.5 text-text-primary shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition"
                placeholder={placeholder}
                required
            />
        </div>
    </div>
);


const SelectField: React.FC<{ id: keyof OnboardingData; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ id, label, value, onChange, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-text-secondary">{label}</label>
        <div className="mt-2">
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className="block w-full rounded-md border-0 bg-background py-2.5 pl-3 pr-10 text-text-primary ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 [&>option]:text-black"
                required
            >
                {children}
            </select>
        </div>
    </div>
);


interface CustomizationScreenProps {
  userProfile: UserProfileData;
  onSave: (updatedData: { linkedInUrl: string; profileText: string; onboardingData: OnboardingData }) => Promise<void>;
  isSaving: boolean;
  error: string | null;
}

export const CustomizationScreen: React.FC<CustomizationScreenProps> = ({ userProfile, onSave, isSaving, error }) => {
  const [linkedInUrl, setLinkedInUrl] = useState(userProfile.linkedInUrl);
  const [profileText, setProfileText] = useState(userProfile.profileText);
  const [onboardingData, setOnboardingData] = useState(userProfile.onboardingData);

  const handleOnboardingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOnboardingData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      linkedInUrl,
      profileText,
      onboardingData,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Customize Your Profile & Strategy</h2>
        <p className="mt-2 text-sm text-text-tertiary">
          Update your details below. Saving will regenerate your strategy to match your new settings.
        </p>
      </div>
      <form className="space-y-6 bg-surface p-8 rounded-lg shadow-2xl" onSubmit={handleSubmit}>
        
        <div className="space-y-6 border-b border-border pb-6">
            <h3 className="text-xl font-semibold text-text-primary">Your Profile Information</h3>
            <InputField id="linkedInUrl" label="Your LinkedIn Profile URL" value={linkedInUrl} onChange={(e) => setLinkedInUrl(e.target.value)} placeholder="https://linkedin.com/in/yourname" />
            <TextAreaField id="profileText" label="Your LinkedIn 'About' Section" value={profileText} onChange={(e) => setProfileText(e.target.value)} placeholder="Paste your 'About' section here..." rows={8} />
        </div>

        <div className="space-y-6 pt-6">
            <h3 className="text-xl font-semibold text-text-primary">Your Strategy Settings</h3>
            <InputField id="industry" label="Your primary industry or field" value={onboardingData.industry} onChange={handleOnboardingChange} placeholder="e.g., SaaS, Healthcare, FinTech" />
            <InputField id="targetAudience" label="Your target audience" value={onboardingData.targetAudience} onChange={handleOnboardingChange} placeholder="e.g., CTOs at early-stage startups" />
            <SelectField id="goal" label="Your main goal on LinkedIn" value={onboardingData.goal} onChange={handleOnboardingChange}>
                <option>Build a personal brand</option>
                <option>Generate leads for my business</option>
                <option>Find a new job</option>
                <option>Network with peers and experts</option>
            </SelectField>
            <InputField id="topics" label="Topics you're passionate about (comma-separated)" value={onboardingData.topics} onChange={handleOnboardingChange} placeholder="e.g., AI in marketing, remote work culture" />
            <SelectField id="tone" label="Your desired tone of voice" value={onboardingData.tone} onChange={handleOnboardingChange}>
                <option>Professional</option>
                <option>Casual & Humorous</option>
                <option>Inspirational & Motivational</option>
                <option>Technical & Educational</option>
            </SelectField>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="pt-4">
            <button
                type="submit"
                disabled={isSaving}
                className="flex w-full justify-center items-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isSaving ? <LoadingIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                {isSaving ? 'Saving & Regenerating...' : 'Save and Regenerate Strategy'}
            </button>
        </div>
      </form>
    </div>
  );
};
