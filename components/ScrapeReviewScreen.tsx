"use client";

import React from 'react';
import type { ScrapedProfileData } from '@/types';
import { SparklesIcon, ArrowPathIcon } from '@/constants';

interface ScrapeReviewScreenProps {
  scrapedData: ScrapedProfileData | null;
  onConfirm: () => void;
  onRetry: () => void;
}

export const ScrapeReviewScreen: React.FC<ScrapeReviewScreenProps> = ({ scrapedData, onConfirm, onRetry }) => {
  if (!scrapedData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-brand-text-primary p-4 text-center">
        <p>Could not load scraped data. Please try again.</p>
        <button onClick={onRetry} className="mt-4 rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-brand-text-primary">Please Confirm Your Details</h2>
          <p className="mt-2 text-center text-md text-brand-text-secondary">
            We've scraped the following information from your profile. Does this look correct?
          </p>
        </div>
        <div className="bg-brand-card border border-brand-border p-8 rounded-lg shadow-2xl space-y-6">
          <div>
            <label className="block text-sm font-semibold text-brand-primary">Name</label>
            <p className="mt-1 text-brand-text-primary">{scrapedData.name || "Not found"}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-primary">Headline</label>
            <p className="mt-1 text-brand-text-secondary">{scrapedData.headline || "Not found"}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-primary">About Section</label>
            <div className="mt-2 p-4 bg-brand-surface rounded-md max-h-60 overflow-y-auto border border-brand-border">
              <p className="text-brand-text-secondary whitespace-pre-wrap">{scrapedData.about || "Not found"}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onRetry}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-secondary hover:bg-brand-secondary-hover px-3 py-3 text-sm font-semibold leading-6 text-brand-text-primary shadow-sm transition-colors"
            >
              <ArrowPathIcon className="w-5 h-5"/>
              Scrape Again / Enter URL
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand-primary-hover transition-colors"
            >
              <SparklesIcon className="w-5 h-5"/>
              Confirm & Create Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};