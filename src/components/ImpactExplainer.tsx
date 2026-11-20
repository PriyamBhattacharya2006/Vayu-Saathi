import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp, HeartPulse, Leaf, Users } from 'lucide-react';
import type { ImpactInfo, Language } from '../types/cleanAir.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';

interface ImpactExplainerProps {
  impact: ImpactInfo;
  language: Language;
  defaultOpen?: boolean;
}

export const ImpactExplainer: React.FC<ImpactExplainerProps> = ({
  impact,
  language,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const t = TRANSLATIONS[language];

  const health = language === 'hi' ? impact.healthEffectHi : impact.healthEffect;
  const emission = language === 'hi' ? impact.emissionEffectHi : impact.emissionEffect;
  const community = language === 'hi' ? impact.communityEffectHi : impact.communityEffect;
  const assumptions = language === 'hi' ? impact.assumptionsHi : impact.assumptions;

  return (
    <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 py-1.5 text-left text-sm font-semibold text-teal-800 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 rounded-md min-h-[40px]"
      >
        <span>{t.whyThisMatters}</span>
        <span className="flex items-center gap-1.5 text-xs font-normal text-slate-500 dark:text-slate-400">
          <span>{t.estimateBadge.split('—')[0].trim()}</span>
          {open ? (
            <ChevronUp className="w-4 h-4 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
        </span>
      </button>

      {open && (
        <div className="mt-2 space-y-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-3.5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <HeartPulse className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" aria-hidden="true" />
                <span>{t.healthEffect}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">{health}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Leaf className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                <span>{t.emissionEffect}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">{emission}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Users className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400 shrink-0" aria-hidden="true" />
                <span>{t.communityEffect}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">{community}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.estimateBadge}
            </span>
            <button
              type="button"
              onClick={() => setShowAssumptions((prev) => !prev)}
              aria-expanded={showAssumptions}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 py-1 px-2 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.howCalculated}</span>
              {showAssumptions ? (
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>

          {showAssumptions && (
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
              {assumptions}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
