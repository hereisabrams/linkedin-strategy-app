
import React, { useState } from 'react';
import type { InitialOnboardingData } from '../types';
import { LoadingIcon } from '../constants';

interface OnboardingFormProps {
  onSubmit: (data: InitialOnboardingData) => void;
  error: string | null;
}

const InputField: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }> = ({ id, label, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-200">{label}</label>
        <div className="mt-2">
            <input
                type="text"
                name={id}
                id={id}
                value={value}
                onChange={onChange}
                className="block w-full rounded-md border-0 bg-white/5 p-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 transition"
                placeholder={placeholder}
                required
            />
        </div>
    </div>
);

const SelectField: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ id, label, value, onChange, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-200">{label}</label>
        <div className="mt-2">
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className="block w-full rounded-md border-0 bg-white/5 py-2.5 pl-3 pr-10 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 [&>option]:text-black"
                required
            >
                {children}
            </select>
        </div>
    </div>
);


export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState<InitialOnboardingData>({
    industry: '',
    goal: 'Build a personal brand',
    topics: '',
    tone: 'Professional',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">Tell Us About Yourself</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            This information will help us craft the perfect LinkedIn strategy for you.
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-gray-900/50 p-8 rounded-lg shadow-2xl backdrop-blur-sm" onSubmit={handleSubmit}>
            <InputField id="industry" label="What is your primary industry or field?" value={formData.industry} onChange={handleChange} placeholder="e.g., SaaS, Healthcare, FinTech" />
            <SelectField id="goal" label="What is your main goal on LinkedIn?" value={formData.goal} onChange={handleChange}>
                <option>Build a personal brand</option>
                <option>Generate leads for my business</option>
                <option>Find a new job</option>
                <option>Network with peers and experts</option>
            </SelectField>
            <div>
                 <label htmlFor="topics" className="block text-sm font-medium leading-6 text-gray-200">What topics are you knowledgeable or passionate about?</label>
                <div className="mt-2">
                    <textarea
                        id="topics"
                        name="topics"
                        rows={3}
                        value={formData.topics}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 bg-white/5 p-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 transition"
                        placeholder="e.g., AI in marketing, remote work culture, JavaScript frameworks"
                        required
                    />
                </div>
            </div>
             <SelectField id="tone" label="What is your desired tone of voice?" value={formData.tone} onChange={handleChange}>
                <option>Professional</option>
                <option>Casual & Humorous</option>
                <option>Inspirational & Motivational</option>
                <option>Technical & Educational</option>
            </SelectField>
           
            {error && <p className="text-sm text-red-400">{error}</p>}

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md bg-brand-blue px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <LoadingIcon className="w-5 h-5" /> : 'Suggest My Target Audience'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};
