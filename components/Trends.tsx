"use client";

import React from 'react';
import type { TrendsResult } from '@/types';
import { ChartTrendingUpIcon, LoadingIcon } from '@/constants';

interface TrendsProps {
    onFetchTrends: () => void;
    trendsResult: TrendsResult | null;
    isLoading: boolean;
}

export const Trends: React.FC<TrendsProps> = ({ onFetchTrends, trendsResult, isLoading }) => {
    const hasFetched = trendsResult !== null;

    return (
        <div className="bg-brand-card border border-brand-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-brand-text-primary mb-4 flex items-center gap-2">
                <ChartTrendingUpIcon className="w-7 h-7" />
                LinkedIn Trends
            </h2>

            {!hasFetched && !isLoading && (
                <>
                    <p className="text-brand-text-secondary mb-4 text-sm">
                        Discover what's currently trending on LinkedIn for your specific industry and audience.
                    </p>
                    <button
                        onClick={onFetchTrends}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChartTrendingUpIcon className="w-5 h-5" />
                        <span>Discover Trends</span>
                    </button>
                </>
            )}

            {isLoading && (
                <div className="flex items-center justify-center h-48">
                    <LoadingIcon className="w-8 h-8 text-brand-primary" />
                </div>
            )}
            
            {hasFetched && !isLoading && (
                 <>
                    <div className="space-y-4 mb-6">
                        {trendsResult.trends.length > 0 ? (
                            trendsResult.trends.map((trend, index) => (
                                <div key={index} className="bg-brand-surface/70 border border-brand-border p-3 rounded-md">
                                    <h3 className="font-semibold text-brand-primary">{trend.title}</h3>
                                    <p className="text-brand-text-secondary mt-1 text-sm">{trend.summary}</p>
                                </div>
                            ))
                        ) : (
                           <p className="text-brand-text-secondary text-sm">Could not identify specific trends, but check out the latest sources below for ideas.</p>
                        )}
                    </div>
                    
                    {trendsResult.sources.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-brand-text-primary mb-2">Sources</h4>
                            <ul className="space-y-2">
                                {trendsResult.sources.map((source, index) => (
                                    <li key={index}>
                                        <a 
                                            href={source.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm text-brand-text-secondary hover:text-brand-primary hover:underline truncate block"
                                            title={source.uri}
                                        >
                                            - {source.title || source.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={onFetchTrends}
                        disabled={isLoading}
                        className="w-full mt-6 flex items-center justify-center gap-2 bg-brand-secondary text-brand-text-primary font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>Refresh Trends</span>
                    </button>
                </>
            )}
        </div>
    );
};