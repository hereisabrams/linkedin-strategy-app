import React, { useState } from 'react';
import type { ProfileAnalysisResult } from '../types';
import { DocumentMagnifyingGlassIcon, LoadingIcon, SparklesIcon } from '../constants';

interface ProfileAnalyzerProps {
    onAnalyze: (aboutText: string) => void;
    analysisResult: ProfileAnalysisResult | null;
    isLoading: boolean;
}

export const ProfileAnalyzer: React.FC<ProfileAnalyzerProps> = ({ onAnalyze, analysisResult, isLoading }) => {
    const [aboutText, setAboutText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (aboutText.trim()) {
            onAnalyze(aboutText);
        }
    };

    return (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 sticky top-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <DocumentMagnifyingGlassIcon className="w-7 h-7" />
                Profile Analysis
            </h2>
            <p className="text-gray-400 mb-4 text-sm">
                Paste your current LinkedIn "About" section below to get AI-powered feedback on how to improve it.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    rows={8}
                    className="block w-full rounded-md border-0 bg-slate-900 p-2.5 text-gray-200 shadow-sm ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 transition"
                    placeholder="Paste your 'About' section here..."
                    required
                />
                <button
                    type="submit"
                    disabled={isLoading || !aboutText.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <LoadingIcon className="w-5 h-5" />
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            <span>Analyze My Profile</span>
                        </>
                    )}
                </button>
            </form>

            {analysisResult && (
                <div className="mt-6 border-t border-slate-700 pt-6 space-y-4 animate-fade-in">
                    <div>
                        <h3 className="font-semibold text-brand-blue">Overall Impression</h3>
                        <p className="text-gray-300 mt-1 text-sm">{analysisResult.overallImpression}</p>
                    </div>
                    {analysisResult.feedback.map((item, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-brand-blue">{item.category}</h3>
                            <p className="text-gray-300 mt-1 text-sm whitespace-pre-wrap">{item.feedback}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
