
import React from 'react';

interface StrategyCardProps {
  summary: string;
  contentPillars: string[];
  tone: string;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({ summary, contentPillars, tone }) => {
  return (
    <div className="bg-surface rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Your AI-Powered Strategy</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-primary">Strategy Summary</h3>
          <p className="text-text-secondary mt-1">{summary}</p>
        </div>
        <div>
          <h3 className="font-semibold text-primary">Core Content Pillars</h3>
          <ul className="list-disc list-inside mt-2 text-text-secondary space-y-1">
            {contentPillars.map((pillar, index) => <li key={index}>{pillar}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-primary">Tone of Voice</h3>
          <p className="text-text-secondary mt-1">{tone}</p>
        </div>
      </div>
    </div>
  );
};