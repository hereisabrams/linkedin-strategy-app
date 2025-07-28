
import React from 'react';
import type { TrendsResult } from '../types';
import { ChartTrendingUpIcon, LoadingIcon } from '../constants';

interface TrendsProps {
    onFetchTrends: () => void;
    trendsResult: TrendsResult | null;
    isLoading: boolean;
}

export const Trends: React.FC<TrendsProps> = ({ onFetchTrends, trendsResult, isLoading }) => {
    const hasFetched = trendsResult !== null;

    return (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <ChartTrendingUpIcon className="w-7 h-7" />
                LinkedIn Trends
            </h2>

            {!hasFetched && !isLoading && (
                <>
                    <p className="text-gray-400 mb-4 text-sm">
                        Discover what's currently trending on LinkedIn for your specific industry and audience.
                    </p>
                    <button
                        onClick={onFetchTrends}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        <ChartTrendingUpIcon className="w-5 h-5" />
                        <span>Discover Trends</span>
                    </button>
                </>
            )}

            {isLoading && (
                <div className="flex items-center justify-center h-48">
                    <LoadingIcon className="w-8 h-8 text-brand-blue" />
                </div>
            )}
            
            {hasFetched && !isLoading && (
                 <>
                    <div className="space-y-4 mb-6">
                        {trendsResult.trends.length > 0 ? (
                            trendsResult.trends.map((trend, index) => (
                                <div key={index} className="bg-slate-700/50 p-3 rounded-md">
                                    <h3 className="font-semibold text-brand-blue">{trend.title}</h3>
                                    <p className="text-gray-300 mt-1 text-sm">{trend.summary}</p>
                                </div>
                            ))
                        ) : (
                           <p className="text-gray-400 text-sm">Could not identify specific trends, but check out the latest sources below for ideas.</p>
                        )}
                    </div>
                    
                    {trendsResult.sources.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-white mb-2">Sources</h4>
                            <ul className="space-y-2">
                                {trendsResult.sources.map((source, index) => (
                                    <li key={index}>
                                        <a 
                                            href={source.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm text-gray-400 hover:text-brand-blue hover:underline truncate block"
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
                        className="w-full mt-6 flex items-center justify-center gap-2 bg-slate-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        <span>Refresh Trends</span>
                    </button>
                </>
            )}
        </div>
    );
};
