
import React from 'react';
import { SparklesIcon } from '../constants';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-brand-dark">
      <div className="max-w-3xl">
        <SparklesIcon className="w-16 h-16 mx-auto text-brand-blue" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Build Your LinkedIn Presence, Powered by AI
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Stop guessing what to post. Answer a few simple questions, and our AI will generate a personalized LinkedIn strategy, content ideas, and a daily growth plan to help you stand out.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={onStart}
            className="rounded-md bg-brand-blue px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            Create My Free Strategy
          </button>
        </div>
      </div>
    </div>
  );
};
