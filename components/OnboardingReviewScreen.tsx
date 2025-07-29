
import React, { useState, useEffect } from 'react';
import type { OnboardingData } from '../types';
import { LoadingIcon } from '../constants';

interface OnboardingReviewScreenProps {
  suggestions: OnboardingData | null;
  onSubmit: (data: OnboardingData) => void;
  onBack: () => void;
  error: string | null;
}

const InputField: React.FC<{ id: keyof OnboardingData; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }> = ({ id, label, value, onChange, placeholder }) => (
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


export const OnboardingReviewScreen: React.FC<OnboardingReviewScreenProps> = ({ suggestions, onSubmit, onBack, error }) => {
  const [formData, setFormData] = useState<OnboardingData | null>(suggestions);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(suggestions);
  }, [suggestions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
        setIsLoading(true);
        onSubmit(formData);
    }
  };

  if (!formData) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-text-primary p-4 text-center">
            <p>No suggestions found. Please go back and try again.</p>
             <button onClick={onBack} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">
                Go Back
            </button>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-text-primary">Review Your AI Suggestions</h2>
          <p className="mt-2 text-center text-sm text-text-tertiary">
            We've created a starting point. Feel free to edit any field to perfectly match your vision.
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-surface p-8 rounded-lg shadow-2xl" onSubmit={handleSubmit}>
            <InputField id="industry" label="Your primary industry or field" value={formData.industry} onChange={handleChange} placeholder="e.g., SaaS, Healthcare, FinTech" />
            <InputField id="targetAudience" label="Your target audience" value={formData.targetAudience} onChange={handleChange} placeholder="e.g., CTOs at early-stage startups" />
            <SelectField id="goal" label="Your main goal on LinkedIn" value={formData.goal} onChange={handleChange}>
                <option>Build a personal brand</option>
                <option>Generate leads for my business</option>
                <option>Find a new job</option>
                <option>Network with peers and experts</option>
            </SelectField>
             <InputField id="topics" label="Topics you're passionate about (comma-separated)" value={formData.topics} onChange={handleChange} placeholder="e.g., AI in marketing, remote work culture" />
             <SelectField id="tone" label="Your desired tone of voice" value={formData.tone} onChange={handleChange}>
                <option>Professional</option>
                <option>Casual & Humorous</option>
                <option>Inspirational & Motivational</option>
                <option>Technical & Educational</option>
            </SelectField>
           
            {error && <p className="text-sm text-red-400">{error}</p>}

             <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-secondary px-3 py-2.5 text-sm font-semibold leading-6 text-text-primary shadow-sm hover:bg-secondary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-50 transition-colors"
                >
                Back
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center items-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <LoadingIcon className="w-5 h-5" /> : 'Create My Full Strategy'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};