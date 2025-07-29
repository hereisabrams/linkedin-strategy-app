
import React from 'react';

interface StrategyCardProps {
  summary: string;
  contentPillars: string[];
  tone: string;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({ summary, contentPillars, tone }) => {
  return (
    <div className="bg-brand-card border border-brand-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-brand-text-primary mb-6">Your AI-Powered Strategy</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-brand-primary">Strategy Summary</h3>
          <p className="text-brand-text-secondary mt-2">{summary}</p>
        </div>
        <div>
          <h3 className="font-semibold text-brand-primary">Core Content Pillars</h3>
          <ul className="list-disc list-inside mt-2 text-brand-text-secondary space-y-1">
            {contentPillars.map((pillar, index) => <li key={index}>{pillar}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-brand-primary">Tone of Voice</h3>
          <p className="text-brand-text-secondary mt-2 font-medium bg-brand-surface px-3 py-1 rounded-full inline-block">{tone}</p>
        </div>
      </div>
    </div>
  );
};