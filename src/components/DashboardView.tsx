import React, { useMemo, useState } from 'react';
import {
  Check,
  Clock,
  Edit3,
  HeartHandshake,
  RefreshCw,
  ShieldCheck,
  Sun,
  Sunrise,
  Sunset,
  Wind,
} from 'lucide-react';
import heroHomeImg from '../assets/images/hero_clean_air_home_1794924987684.jpg';
import type {
  AirQualityData,
  HabitProgress,
  Language,
  UserProfile,
} from '../types/cleanAir.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { getAQILevelId, getAQIVisualMeta } from '../utils/aqi.ts';
import { generateDailyPlan } from '../utils/planGenerator.ts';
import { WEEKLY_HABITS } from '../data/personas.ts';
import { AQIIcon, AQIScaleLegend } from './AQIIcon.tsx';
import { ImpactExplainer } from './ImpactExplainer.tsx';

interface DashboardViewProps {
  profile: UserProfile;
  airQuality: AirQualityData;
  isLoadingAqi: boolean;
  aqiError: string | null;
  language: Language;
  habitProgress: HabitProgress;
  onRefreshAqi: (city?: string) => void;
  onManualAqi: (aqi: number) => void;
  onToggleHabit: (dateKey: string, habitId: string) => void;
  onOpenSetup: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  airQuality,
  isLoadingAqi,
  aqiError,
  language,
  habitProgress,
  onRefreshAqi,
  onManualAqi,
  onToggleHabit,
  onOpenSetup,
}) => {
  const t = TRANSLATIONS[language];
  const [cityInput, setCityInput] = useState(profile.city);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualValue, setManualValue] = useState(String(airQuality.aqi));
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const levelId = getAQILevelId(airQuality.aqi);
  const visual = getAQIVisualMeta(airQuality.aqi);
  const levelText = t.aqiLevels[levelId];

  const planActions = useMemo(
    () => generateDailyPlan(profile, airQuality),
    [profile, airQuality]
  );

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayCompleted = habitProgress.completedByDate[todayKey] || [];

  // Calculate streak & weekly totals from last 7 days
  const { streakDays, weeklyCo2, weeklyExposureCut } = useMemo(() => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const list = habitProgress.completedByDate[key] || [];
      if (list.length > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    let co2 = 0;
    let exposureSum = 0;
    let daysWithActions = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const list = habitProgress.completedByDate[key] || [];
      if (list.length > 0) daysWithActions++;
      for (const id of list) {
        const habit = WEEKLY_HABITS.find((h) => h.id === id);
        if (habit) {
          co2 += habit.weeklyCo2Kg / 7;
          exposureSum += habit.weeklyExposurePct;
        }
      }
    }
    const avgExposureCut =
      daysWithActions > 0 ? Math.min(60, Math.round(exposureSum / Math.max(1, daysWithActions))) : 0;

    return {
      streakDays: streak,
      weeklyCo2: Math.round(co2 * 10) / 10,
      weeklyExposureCut: avgExposureCut,
    };
  }, [habitProgress]);

  const formattedUpdated = useMemo(() => {
    try {
      return new Date(airQuality.lastUpdated).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Just now';
    }
  }, [airQuality.lastUpdated]);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      onRefreshAqi(cityInput.trim());
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(manualValue);
    if (Number.isFinite(num) && num >= 1 && num <= 500) {
      onManualAqi(Math.round(num));
      setShowManualForm(false);
    }
  };

  const priorityCount =
    (profile.children > 0 ? 1 : 0) +
    (profile.elderly > 0 ? 1 : 0) +
    profile.conditions.length;

  return (
    <div className="space-y-8">
      {/* Hero Split: Current AQI Dashboard + Calm Household Context */}
      <section aria-labelledby="today-air-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1
                  id="today-air-heading"
                  className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-balance"
                >
                  {airQuality.city}
                  {profile.area ? ` — ${profile.area}` : ''}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t.sourceLabel}: {airQuality.source} · {t.lastUpdated}:{' '}
                  <span className="font-mono tabular-nums">{formattedUpdated}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onRefreshAqi()}
                  disabled={isLoadingAqi}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[40px]"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isLoadingAqi ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  <span>{t.refreshAqi}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualForm((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[40px]"
                >
                  <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.manualOverride}</span>
                </button>
              </div>
            </div>

            {/* Quick city switch + manual override */}
            <form onSubmit={handleCitySubmit} className="mt-4 flex flex-wrap gap-2">
              <label htmlFor="dashboard-city-search" className="sr-only">
                Change city
              </label>
              <input
                id="dashboard-city-search"
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder={language === 'hi' ? 'शहर बदलें (उदा. Delhi, Mumbai)' : 'Check another city...'}
                className="flex-1 min-w-[180px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-2 focus:outline-teal-600"
              />
              <button
                type="submit"
                disabled={isLoadingAqi}
                className="rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity min-h-[40px]"
              >
                {language === 'hi' ? 'अपडेट करें' : 'Check City'}
              </button>
            </form>

            {showManualForm && (
              <form
                onSubmit={handleManualSubmit}
                className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3"
              >
                <label htmlFor="manual-aqi-input" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {language === 'hi' ? 'अपना AQI दर्ज करें (1–500):' : 'Local meter / manual US AQI (1–500):'}
                </label>
                <input
                  id="manual-aqi-input"
                  type="number"
                  min={1}
                  max={500}
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                  className="w-24 font-mono tabular-nums rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 text-xs font-semibold min-h-[36px]"
                >
                  {language === 'hi' ? 'लागू करें' : 'Apply'}
                </button>
              </form>
            )}

            {aqiError && (
              <p className="mt-3 text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                {aqiError}
              </p>
            )}

            {/* Primary AQI readout box */}
            <div className={`mt-5 rounded-2xl border p-5 ${visual.bgClass} ${visual.borderClass}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {t.currentAqi}
                  </div>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className={`text-5xl font-bold font-mono tabular-nums tracking-tight ${visual.textClass}`}>
                      {airQuality.aqi}
                    </span>
                    <div className={`flex items-center gap-1.5 text-base font-bold ${visual.textClass}`}>
                      <AQIIcon levelId={levelId} className="w-5 h-5 shrink-0" />
                      <span>{levelText.label}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-left sm:text-right">
                  <div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      {t.mainPollutant}
                    </div>
                    <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                      {airQuality.mainPollutant}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">PM2.5</div>
                    <div className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {airQuality.pm25} µg/m³
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">PM10</div>
                    <div className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {airQuality.pm10} µg/m³
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {levelText.summary}
              </p>
            </div>
          </div>

          <AQIScaleLegend currentAqi={airQuality.aqi} />
        </div>

        {/* Right Hero Column: Calm Home Illustration + Household Profile Summary */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="relative h-52 sm:h-60 lg:flex-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
            {!heroImgFailed ? (
              <img
                src={heroHomeImg}
                alt="Sunlit winter apartment window with sealed glass and indoor plants"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-500 dark:text-slate-400">
                <Wind className="w-10 h-10 mb-2" aria-hidden="true" />
                <span className="text-sm font-medium">Clean Indoor Sanctuary</span>
              </div>
            )}
          </div>

          <div className="p-5 space-y-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'आपकी पारिवारिक प्रोफ़ाइल' : 'Tailored to your household'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onOpenSetup}
                className="text-xs font-semibold text-teal-700 dark:text-teal-300 hover:underline min-h-[36px] px-1"
              >
                {language === 'hi' ? 'बदलें' : 'Edit'}
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <span>
                {profile.adults} {language === 'hi' ? 'वयस्क' : 'adult(s)'}
                {profile.children > 0
                  ? ` · ${profile.children} ${language === 'hi' ? 'बच्चे' : 'child(ren)'}`
                  : ''}
                {profile.elderly > 0
                  ? ` · ${profile.elderly} ${language === 'hi' ? 'बुजुर्ग' : 'elderly'}`
                  : ''}
              </span>
              <span aria-hidden="true"> · </span>
              <span>
                {profile.homeType === 'apartment'
                  ? language === 'hi'
                    ? 'अपार्टमेंट'
                    : 'Apartment'
                  : language === 'hi'
                    ? 'घर'
                    : 'House'}
              </span>
              <span aria-hidden="true"> · </span>
              <span>
                {language === 'hi' ? 'बजट: ' : 'Budget: '}
                {profile.budget}
              </span>
              {priorityCount > 0 && (
                <span className="block mt-1 font-medium text-teal-800 dark:text-teal-300">
                  {language === 'hi'
                    ? 'संवेदनशील सदस्यों (बच्चे/बुजुर्ग/श्वसन) के लिए प्राथमिकता सुरक्षा लागू है।'
                    : 'Priority respiratory protection active for children, elderly, or sensitive conditions.'}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3-Day Outlook Strip */}
      <section aria-labelledby="outlook-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="outlook-heading" className="text-base font-bold text-slate-900 dark:text-white">
            {t.threeDayOutlook}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'दोपहर के समय हल्की धूप में हवा अपेक्षाकृत साफ रहती है'
              : 'Midday sun generally brings the briefest smog dip'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {airQuality.outlook.map((day) => {
            const dVisual = getAQIVisualMeta(day.aqi);
            const dText = t.aqiLevels[day.levelId];
            return (
              <div
                key={day.date}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {day.dayLabel} · <span className="font-mono tabular-nums">{day.date}</span>
                  </div>
                  <div className={`mt-1 flex items-center gap-1.5 text-sm font-bold ${dVisual.textClass}`}>
                    <AQIIcon levelId={day.levelId} className="w-4 h-4 shrink-0" />
                    <span>{dText.label}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {t.bestWindowLabel}: <span className="font-mono tabular-nums">{day.bestWindow}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-2xl font-bold font-mono tabular-nums ${dVisual.textClass}`}>
                    {day.aqi}
                  </div>
                  <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    ~{day.pm25} µg/m³
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Personalised Daily Plan (Morning / Afternoon / Evening) */}
      <section aria-labelledby="daily-plan-heading" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="daily-plan-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            {t.dailyPlanTitle}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'हर सुझाव के नीचे "यह क्यों ज़रूरी है" खोलकर प्रभाव देखें'
              : 'Tap "Why this matters" on any step to see health, emission & community impact'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {(
            [
              { key: 'morning' as const, label: t.morning, Icon: Sunrise },
              { key: 'afternoon' as const, label: t.afternoon, Icon: Sun },
              { key: 'evening' as const, label: t.evening, Icon: Sunset },
            ] as const
          ).map(({ key, label, Icon }) => {
            const slotItems = planActions.filter((a) => a.timeOfDay === key);
            return (
              <div key={key} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <Icon className="w-4 h-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{label}</h3>
                </div>

                {slotItems.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
                  >
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {item.priority === 'high'
                        ? language === 'hi'
                          ? 'उच्च प्राथमिकता'
                          : 'Priority step'
                        : language === 'hi'
                          ? 'अनुशंसित'
                          : 'Recommended'}{' '}
                      · {item.category}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {language === 'hi' ? item.titleHi : item.title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {language === 'hi' ? item.detailHi : item.detail}
                    </p>
                    <ImpactExplainer impact={item.impact} language={language} />
                  </article>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* Weekly Progress & Habit Tracker */}
      <section
        aria-labelledby="weekly-progress-heading"
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 id="weekly-progress-heading" className="text-lg font-bold text-slate-900 dark:text-white">
              {t.weeklyProgressTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {language === 'hi'
                ? 'हर छोटा कदम मायने रखता है — कोई दबाव नहीं, अपनी गति से आदतें चुनें।'
                : 'Every small habit helps protect your family and clear neighbourhood air. Log what you managed today.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.streakLabel}</div>
              <div className="text-xl font-bold font-mono tabular-nums text-teal-700 dark:text-teal-400">
                {streakDays} {t.daysSuffix}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.estCo2Avoided}</div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                ~{weeklyCo2} kg
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.estExposureReduced}
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                ~{weeklyExposureCut}%
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {WEEKLY_HABITS.map((habit) => {
            const done = todayCompleted.includes(habit.id);
            return (
              <button
                key={habit.id}
                type="button"
                onClick={() => onToggleHabit(todayKey, habit.id)}
                aria-pressed={done}
                className="w-full py-3.5 px-2 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-colors min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                      done
                        ? 'bg-teal-700 border-teal-700 text-white'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950'
                    }`}
                    aria-hidden="true"
                  >
                    {done && <Check className="w-4 h-4" />}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      done
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {language === 'hi' ? habit.labelHi : habit.label}
                  </span>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                  ~{habit.weeklyExposurePct}% PM · ~{habit.weeklyCo2Kg} kg CO2/wk
                </span>
              </button>
            );
          })}
        </div>

        {todayCompleted.length > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 px-4 py-3 text-xs font-medium text-teal-900 dark:text-teal-200">
            <HeartHandshake className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              {language === 'hi'
                ? `बहुत बढ़िया! आपने आज ${todayCompleted.length} स्वच्छ वायु कदम पूरे किए।`
                : `Great steady progress — you logged ${todayCompleted.length} clean-air habit(s) today.`}
            </span>
          </div>
        )}
      </section>
    </div>
  );
};
