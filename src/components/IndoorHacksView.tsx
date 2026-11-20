import React, { useMemo, useState } from 'react';
import { Home, Info } from 'lucide-react';
import indoorFilterImg from '../assets/images/indoor_filter_guide_1794924988721.jpg';
import type { IndoorHack, Language } from '../types/cleanAir.ts';
import { INDOOR_HACKS } from '../data/indoorAndAlternatives.ts';
import { ImpactExplainer } from './ImpactExplainer.tsx';

interface IndoorHacksViewProps {
  language: Language;
  budgetHint: string;
}

export const IndoorHacksView: React.FC<IndoorHacksViewProps> = ({ language, budgetHint }) => {
  const [costFilter, setCostFilter] = useState<'all' | IndoorHack['costTier']>('all');
  const [imgFailed, setImgFailed] = useState(false);

  const filtered = useMemo(() => {
    const rankScore = (h: IndoorHack) => {
      const eff = h.effectiveness === 'high' ? 3 : h.effectiveness === 'moderate' ? 2 : 1;
      const cost = h.costTier === 'free' ? 3 : h.costTier === 'low' ? 2 : 1;
      return eff * 10 + cost;
    };
    return INDOOR_HACKS.filter((h) => costFilter === 'all' || h.costTier === costFilter).sort(
      (a, b) => rankScore(b) - rankScore(a)
    );
  }, [costFilter]);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="lg:col-span-7 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
              {language === 'hi'
                ? 'घर के अंदर की हवा साफ रखने के व्यावहारिक उपाय'
                : 'Indoor Air Quality Hacks (Ranked by Cost & Effectiveness)'}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
              {language === 'hi'
                ? 'मुफ्त और कम खर्च वाले तरीकों से शुरुआत करें। हर उपाय के साथ उसकी वास्तविक सीमाएं ईमानदारी से बताई गई हैं।'
                : 'Start with free, high-impact habits before buying hardware. Every option states honest limits—including what plants and purifiers can and cannot do.'}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {language === 'hi'
                ? `आपकी प्रोफ़ाइल बजट प्राथमिकता: ${budgetHint}`
                : `Your current profile preference: ${budgetHint} budget`}
            </p>
          </div>

          <div
            className="mt-5 inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl w-fit"
            role="group"
            aria-label="Filter indoor hacks by cost"
          >
            {(
              [
                { id: 'all', en: 'All options', hi: 'सभी' },
                { id: 'free', en: 'Free only', hi: 'केवल मुफ्त' },
                { id: 'low', en: 'Low cost', hi: 'कम खर्च' },
                { id: 'investment', en: 'HEPA / Investment', hi: 'HEPA / निवेश' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCostFilter(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[38px] ${
                  costFilter === tab.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {language === 'hi' ? tab.hi : tab.en}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-100 dark:bg-slate-800 min-h-[200px]">
          {!imgFailed ? (
            <img
              src={indoorFilterImg}
              alt="Clean living room with HEPA air purifier beside sealed window and houseplants"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6 text-slate-500">
              <Home className="w-10 h-10" aria-hidden="true" />
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((hack, idx) => (
          <article
            key={hack.id}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                0{idx + 1} · {language === 'hi' ? hack.costEstimateHi : hack.costEstimate} ·{' '}
                {language === 'hi' ? 'प्रभाव: ' : 'Effectiveness: '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {hack.effectiveness}
                </span>
              </div>

              <h2 className="mt-1.5 text-base font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? hack.titleHi : hack.title}
              </h2>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'hi' ? hack.summaryHi : hack.summary}
              </p>

              <ul className="mt-3 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                {(language === 'hi' ? hack.stepsHi : hack.steps).map((step, i) => (
                  <li key={i} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ul>

              <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-3 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {language === 'hi' ? 'ईमानदार सीमा: ' : 'Honest expectation: '}
                  </span>
                  {language === 'hi' ? hack.honestCaveatHi : hack.honestCaveat}
                </div>
              </div>
            </div>

            <ImpactExplainer impact={hack.impact} language={language} />
          </article>
        ))}
      </div>
    </div>
  );
};
