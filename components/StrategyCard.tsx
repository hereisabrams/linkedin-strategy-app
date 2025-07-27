
import React from 'react';

interface StrategyCardProps {
  summary: string;
  contentPillars: string[];
  tone: string;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({ summary, contentPillars, tone }) => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Your AI-Powered Strategy</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-brand-blue">Strategy Summary</h3>
          <p className="text-gray-300 mt-1">{summary}</p>
        </div>
        <div>
          <h3 className="font-semibold text-brand-blue">Core Content Pillars</h3>
          <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
            {contentPillars.map((pillar, index) => <li key={index}>{pillar}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-brand-blue">Tone of Voice</h3>
          <p className="text-gray-300 mt-1">{tone}</p>
        </div>
      </div>
    </div>
  );
};
