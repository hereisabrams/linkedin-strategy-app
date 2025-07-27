
import React, { useState } from 'react';
import { LoadingIcon } from '../constants';

interface AudienceSelectionScreenProps {
  suggestions: string[];
  onSubmit: (selectedAudience: string) => void;
  onBack: () => void;
  error: string | null;
}

export const AudienceSelectionScreen: React.FC<AudienceSelectionScreenProps> = ({ suggestions, onSubmit, onBack, error }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      setIsSubmitting(true);
      onSubmit(selected);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">Who Do You Want to Reach?</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Based on your info, we think these audiences would be a great fit. Select one to build your strategy around.
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-gray-900/50 p-8 rounded-lg shadow-2xl backdrop-blur-sm" onSubmit={handleSubmit}>
          <fieldset>
            <legend className="sr-only">Target Audience</legend>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <label
                  key={index}
                  htmlFor={`audience-${index}`}
                  className={`relative flex items-center rounded-lg border p-4 cursor-pointer transition ${
                    selected === suggestion ? 'bg-brand-blue border-blue-400 ring-2 ring-brand-blue' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    id={`audience-${index}`}
                    name="audience-suggestion"
                    value={suggestion}
                    checked={selected === suggestion}
                    onChange={() => setSelected(suggestion)}
                    className="sr-only"
                    aria-describedby={`audience-description-${index}`}
                  />
                  <div className="flex-1 text-sm">
                    <p id={`audience-description-${index}`} className="font-medium text-white">
                      {suggestion}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
          
          {error && <p className="text-sm text-red-400 mt-4">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-slate-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:opacity-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!selected || isSubmitting}
              className="flex w-full justify-center rounded-md bg-brand-blue px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? <LoadingIcon className="w-5 h-5" /> : 'Create My Full Strategy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
