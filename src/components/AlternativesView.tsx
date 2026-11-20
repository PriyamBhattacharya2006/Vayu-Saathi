import React, { useMemo, useState } from 'react';
import { Flame, Leaf, Recycle, TrainFront } from 'lucide-react';
import type { Language, SustainableAlternative } from '../types/cleanAir.ts';
import { SUSTAINABLE_ALTERNATIVES } from '../data/indoorAndAlternatives.ts';
import { ImpactExplainer } from './ImpactExplainer.tsx';

interface AlternativesViewProps {
  language: Language;
}

export const AlternativesView: React.FC<AlternativesViewProps> = ({ language }) => {
  const [domainFilter, setDomainFilter] = useState<'all' | SustainableAlternative['domain']>('all');

  const items = useMemo(
    () =>
      SUSTAINABLE_ALTERNATIVES.filter(
        (item) => domainFilter === 'all' || item.domain === domainFilter
      ),
    [domainFilter]
  );

  const DomainIcon = (domain: SustainableAlternative['domain']) => {
    switch (domain) {
      case 'cooking':
        return Flame;
      case 'heating':
        return Leaf;
      case 'transport':
        return TrainFront;
      case 'waste':
        return Recycle;
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
          {language === 'hi'
            ? 'स्वच्छ और टिकाऊ दैनिक विकल्प'
            : 'Sustainable Low-Emission Alternatives'}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'खाना पकाने, सर्दी की हीटिंग, यात्रा और कचरा प्रबंधन में व्यावहारिक बदलाव—वास्तविक खर्च और सीमाओं के साथ।'
            : 'Practical switches across cooking, winter heating, daily travel, and waste handling—shown with upfront costs, realistic trade-offs, and estimated emissions avoided.'}
        </p>

        <div
          className="mt-5 inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl"
          role="group"
          aria-label="Filter alternatives by category"
        >
          {(
            [
              { id: 'all', en: 'All', hi: 'सभी' },
              { id: 'cooking', en: 'Cooking', hi: 'खाना पकाना' },
              { id: 'heating', en: 'Heating', hi: 'हीटिंग' },
              { id: 'transport', en: 'Transport', hi: 'यातायात' },
              { id: 'waste', en: 'No Open Burning', hi: 'कचरा प्रबंधन' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDomainFilter(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[38px] ${
                domainFilter === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {language === 'hi' ? tab.hi : tab.en}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((alt) => {
          const Icon = DomainIcon(alt.domain);
          return (
            <article
              key={alt.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <Icon className="w-4 h-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                  <span className="capitalize">{alt.domain}</span>
                  <span aria-hidden="true">·</span>
                  <span>{language === 'hi' ? alt.costRangeHi : alt.costRange}</span>
                </div>

                <h2 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? alt.titleHi : alt.title}
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? 'किसका विकल्प: ' : 'Replaces: '}
                  {language === 'hi' ? alt.replacesHi : alt.replaces}
                </p>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'hi' ? alt.descriptionHi : alt.description}
                </p>

                <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {language === 'hi' ? 'वास्तविक चुनौतियाँ: ' : 'Realistic trade-offs: '}
                  </span>
                  {language === 'hi' ? alt.tradeOffsHi : alt.tradeOffs}
                </div>
              </div>

              <ImpactExplainer impact={alt.impact} language={language} />
            </article>
          );
        })}
      </div>
    </div>
  );
};
