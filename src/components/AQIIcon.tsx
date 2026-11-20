import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  CloudSun,
  OctagonAlert,
  ShieldAlert,
} from 'lucide-react';
import type { AQILevelId } from '../types/cleanAir.ts';

interface AQIIconProps {
  levelId: AQILevelId;
  className?: string;
}

export const AQIIcon: React.FC<AQIIconProps> = ({ levelId, className = 'w-5 h-5' }) => {
  switch (levelId) {
    case 'good':
      return <CheckCircle2 className={className} aria-hidden="true" />;
    case 'moderate':
      return <CloudSun className={className} aria-hidden="true" />;
    case 'sensitive':
      return <AlertTriangle className={className} aria-hidden="true" />;
    case 'unhealthy':
      return <ShieldAlert className={className} aria-hidden="true" />;
    case 'very-unhealthy':
      return <OctagonAlert className={className} aria-hidden="true" />;
    case 'hazardous':
      return <AlertOctagon className={className} aria-hidden="true" />;
  }
};

export const AQIScaleLegend: React.FC<{ currentAqi: number }> = ({ currentAqi }) => {
  const tiers: { id: AQILevelId; label: string; range: string; color: string; max: number }[] = [
    { id: 'good', label: 'Good', range: '0–50', color: '#15803D', max: 50 },
    { id: 'moderate', label: 'Moderate', range: '51–100', color: '#CA8A04', max: 100 },
    { id: 'sensitive', label: 'Sensitive', range: '101–150', color: '#EA580C', max: 150 },
    { id: 'unhealthy', label: 'Unhealthy', range: '151–200', color: '#DC2626', max: 200 },
    { id: 'very-unhealthy', label: 'Very Unhealthy', range: '201–300', color: '#7E22CE', max: 300 },
    { id: 'hazardous', label: 'Hazardous', range: '301+', color: '#881337', max: 999 },
  ];

  const activeIndex = tiers.findIndex((t) => currentAqi <= t.max);

  return (
    <div className="mt-4" aria-label="AQI colour and icon risk scale">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {tiers.map((tier, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={tier.id}
              className={`rounded-lg px-2 py-1.5 border transition-colors ${
                isActive
                  ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800'
                  : 'border-slate-200 dark:border-slate-800 bg-transparent opacity-80'
              }`}
            >
              <div
                className="h-1.5 w-full rounded-sm mb-1.5"
                style={{ backgroundColor: tier.color }}
                aria-hidden="true"
              />
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">
                <AQIIcon levelId={tier.id} className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tier.label}</span>
              </div>
              <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                {tier.range}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
