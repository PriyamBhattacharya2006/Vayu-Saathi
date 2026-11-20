import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bell,
  BellOff,
  Home,
  Leaf,
  MessageSquare,
  Moon,
  SlidersHorizontal,
  Sun,
  Users,
  Wind,
} from 'lucide-react';
import type {
  AirQualityData,
  HabitProgress,
  Language,
  UserProfile,
} from './types/cleanAir.ts';
import {
  buildSampleAirQuality,
  DEFAULT_PROFILE,
  EXAMPLE_PERSONAS,
} from './data/personas.ts';
import { TRANSLATIONS } from './i18n/translations.ts';
import { getAQILevelId } from './utils/aqi.ts';
import { DashboardView } from './components/DashboardView.tsx';
import { IndoorHacksView } from './components/IndoorHacksView.tsx';
import { AlternativesView } from './components/AlternativesView.tsx';
import { AssistantView } from './components/AssistantView.tsx';
import { CommunityView } from './components/CommunityView.tsx';
import { OnboardingWizard } from './components/OnboardingWizard.tsx';
import { PWAInstallButton } from './components/PWAInstallButton.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { AqiAlertBanner } from './components/AqiAlertBanner.tsx';
import { useAqiAlert } from './hooks/useAqiAlert.ts';

type TabId = 'today' | 'indoor' | 'alternatives' | 'assistant' | 'community';

const STORAGE_KEYS = {
  profile: 'cleanair_profile_v1',
  aqi: 'cleanair_last_aqi_v1',
  habits: 'cleanair_habits_v1',
  lang: 'cleanair_lang_v1',
  theme: 'cleanair_theme_v1',
};

function readJsonStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T | null;
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function loadSafeProfile(): UserProfile {
  const stored = readJsonStorage<Partial<UserProfile>>(STORAGE_KEYS.profile, {});
  return {
    ...DEFAULT_PROFILE,
    ...stored,
    conditions: Array.isArray(stored.conditions) ? stored.conditions : DEFAULT_PROFILE.conditions,
  };
}

function loadSafeAirQuality(city: string): AirQualityData {
  const fallback = buildSampleAirQuality(city);
  const stored = readJsonStorage<Partial<AirQualityData>>(STORAGE_KEYS.aqi, {});
  return {
    ...fallback,
    ...stored,
    aqi: typeof stored.aqi === 'number' && Number.isFinite(stored.aqi) ? stored.aqi : fallback.aqi,
    outlook: Array.isArray(stored.outlook) && stored.outlook.length > 0 ? stored.outlook : fallback.outlook,
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [language, setLanguage] = useState<Language>(() => {
    const stored = readJsonStorage<string>(STORAGE_KEYS.lang, 'en');
    return stored === 'hi' ? 'hi' : 'en';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.theme);
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(loadSafeProfile);
  const [airQuality, setAirQuality] = useState<AirQualityData>(() =>
    loadSafeAirQuality(loadSafeProfile().city)
  );
  const [habitProgress, setHabitProgress] = useState<HabitProgress>(() => {
    const stored = readJsonStorage<Partial<HabitProgress>>(STORAGE_KEYS.habits, {});
    return {
      completedByDate:
        stored.completedByDate && typeof stored.completedByDate === 'object'
          ? stored.completedByDate
          : {},
    };
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(
    () => !loadSafeProfile().onboardingCompleted
  );
  const [isLoadingAqi, setIsLoadingAqi] = useState(false);
  const [aqiError, setAqiError] = useState<string | null>(null);
  const skipNextCityFetchRef = useRef(false);

  const t = TRANSLATIONS[language];

  const aqiAlert = useAqiAlert({
    profile,
    airQuality,
    language,
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem(STORAGE_KEYS.theme, darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.lang, JSON.stringify(language));
    } catch {
      // Ignore
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.aqi, JSON.stringify(airQuality));
    } catch {
      // Ignore
    }
  }, [airQuality]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(habitProgress));
    } catch {
      // Ignore
    }
  }, [habitProgress]);

  const fetchAqi = useCallback(
    async (cityOverride?: string, lat?: number, lon?: number) => {
      const targetCity = cityOverride ?? profile.city;
      setIsLoadingAqi(true);
      setAqiError(null);
      try {
        const params = new URLSearchParams({ city: targetCity });
        if (lat !== undefined && lon !== undefined) {
          params.set('lat', String(lat));
          params.set('lon', String(lon));
        }
        const res = await fetch(`/api/aqi?${params.toString()}`);
        if (!res.ok) throw new Error('API request failed');
        const data = (await res.json()) as AirQualityData;
        setAirQuality(data);
        if (cityOverride && cityOverride !== profile.city) {
          setProfile((prev) => ({ ...prev, city: cityOverride }));
        }
      } catch {
        try {
          let resolvedLat = lat;
          let resolvedLon = lon;
          let resolvedName = targetCity;
          if (resolvedLat === undefined || resolvedLon === undefined) {
            const geoRes = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                targetCity
              )}&count=1&language=en&format=json`
            );
            const geoJson = (await geoRes.json()) as {
              results?: { name: string; country?: string; latitude: number; longitude: number }[];
            };
            const first = geoJson.results?.[0];
            if (!first) throw new Error('City lookup failed');
            resolvedLat = first.latitude;
            resolvedLon = first.longitude;
            resolvedName = first.country ? `${first.name}, ${first.country}` : first.name;
          }
          const aqRes = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${resolvedLat}&longitude=${resolvedLon}&current=us_aqi,pm10,pm2_5,nitrogen_dioxide&timezone=auto`
          );
          if (!aqRes.ok) throw new Error('Direct Open-Meteo failed');
          const aqJson = (await aqRes.json()) as {
            current?: { us_aqi?: number; pm2_5?: number; pm10?: number; nitrogen_dioxide?: number };
          };
          const cur = aqJson.current;
          if (!cur || typeof cur.us_aqi !== 'number') throw new Error('Missing current AQI');
          const fallbackData = buildSampleAirQuality(resolvedName, Math.round(cur.us_aqi));
          setAirQuality({
            ...fallbackData,
            pm25: Math.round((cur.pm2_5 ?? fallbackData.pm25) * 10) / 10,
            pm10: Math.round((cur.pm10 ?? fallbackData.pm10) * 10) / 10,
            no2: Math.round((cur.nitrogen_dioxide ?? fallbackData.no2) * 10) / 10,
            source: 'Open-Meteo Air Quality (direct)',
            isLive: true,
            lastUpdated: new Date().toISOString(),
          });
          if (cityOverride && cityOverride !== profile.city) {
            setProfile((prev) => ({ ...prev, city: cityOverride }));
          }
        } catch {
          setAqiError(
            language === 'hi'
              ? 'लाइव AQI उपलब्ध नहीं हो सका — सहेजे गए या नमूना डेटा का उपयोग किया जा रहा है।'
              : 'Could not reach live AQI feed — showing cached or sample winter smog data.'
          );
        }
      } finally {
        setIsLoadingAqi(false);
      }
    },
    [profile.city, language]
  );

  // Initial live AQI sync on mount + 15-minute live background check for saved location
  useEffect(() => {
    if (skipNextCityFetchRef.current) {
      skipNextCityFetchRef.current = false;
    } else {
      fetchAqi(profile.city, profile.lat, profile.lon);
    }
    const intervalId = window.setInterval(() => {
      if (navigator.onLine) {
        fetchAqi(profile.city, profile.lat, profile.lon);
      }
    }, 15 * 60 * 1000);
    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.city, profile.lat, profile.lon]);

  const handleSaveOnboarding = (nextProfile: UserProfile, sampleAqiOverride?: number) => {
    const locationChanged =
      nextProfile.city !== profile.city ||
      nextProfile.lat !== profile.lat ||
      nextProfile.lon !== profile.lon;
    skipNextCityFetchRef.current = locationChanged;
    setProfile(nextProfile);
    setShowOnboarding(false);
    if (typeof sampleAqiOverride === 'number') {
      setAirQuality(buildSampleAirQuality(nextProfile.city, sampleAqiOverride));
      setAqiError(null);
    } else {
      fetchAqi(nextProfile.city, nextProfile.lat, nextProfile.lon);
    }
  };

  const handleManualAqi = (aqiValue: number) => {
    const pm25 = Math.round(aqiValue * 0.52);
    setAirQuality((prev) => ({
      ...prev,
      aqi: aqiValue,
      pm25,
      pm10: Math.round(pm25 * 1.45),
      source: 'Manual local reading',
      isLive: false,
      isManual: true,
      lastUpdated: new Date().toISOString(),
      outlook: prev.outlook.map((d, idx) => ({
        ...d,
        aqi: Math.max(25, aqiValue - (idx + 1) * 10),
        levelId: getAQILevelId(Math.max(25, aqiValue - (idx + 1) * 10)),
      })),
    }));
  };

  const handleToggleHabit = (dateKey: string, habitId: string) => {
    setHabitProgress((prev) => {
      const existing = prev.completedByDate[dateKey] || [];
      const nextList = existing.includes(habitId)
        ? existing.filter((id) => id !== habitId)
        : [...existing, habitId];
      return {
        completedByDate: {
          ...prev.completedByDate,
          [dateKey]: nextList,
        },
      };
    });
  };

  const navItems: { id: TabId; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'today', label: t.navToday, Icon: Wind },
    { id: 'indoor', label: t.navIndoor, Icon: Home },
    { id: 'alternatives', label: t.navAlternatives, Icon: Leaf },
    { id: 'assistant', label: t.navAssistant, Icon: MessageSquare },
    { id: 'community', label: t.navCommunity, Icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Desktop & Mobile Top Navigation Bar (Strict 3-zone Top Bar Contract) */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-13 sm:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('today');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
          >
            {t.appName}
          </a>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {navItems.map(({ id, label }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                    active
                      ? 'text-teal-700 dark:text-teal-400 border-teal-700 dark:border-teal-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single primary action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setShowOnboarding(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[38px]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{profile.onboardingCompleted ? t.myHousehold : t.setupPlan}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Utility Bar (Language, Theme, Persona Scenarios, PWA Install) */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {language === 'hi' ? 'उदाहरण परिदृश्य:' : 'Try scenario:'}
            </span>
            {EXAMPLE_PERSONAS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSaveOnboarding(p.profile, p.sampleAqi)}
                className={`px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  profile.city === p.profile.city && profile.budget === p.profile.budget && profile.area === p.profile.area
                    ? 'border-teal-700 dark:border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                {language === 'hi' ? p.nameHi.split('(')[0].trim() : p.name.split('(')[0].trim()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div
              className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-0.5"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  language === 'hi'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                हिंदी
              </button>
            </div>

            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[34px]"
            >
              {darkMode ? (
                <Sun className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Moon className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            {aqiAlert.permission !== 'unsupported' && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={aqiAlert.toggleNotifications}
                  title={
                    aqiAlert.permission === 'denied'
                      ? 'Notifications are blocked in browser settings'
                      : 'Toggle local AQI spike notifications'
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors min-h-[34px] whitespace-nowrap shrink-0 ${
                    aqiAlert.notificationsEnabled
                      ? 'border-teal-600/40 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {aqiAlert.notificationsEnabled ? (
                    <Bell className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                  ) : (
                    <BellOff className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">
                    {aqiAlert.notificationsEnabled
                      ? language === 'hi'
                        ? 'अलर्ट चालू'
                        : 'Alerts On'
                      : language === 'hi'
                        ? 'अलर्ट'
                        : 'Alerts'}
                  </span>
                </button>
                <label htmlFor="alert-threshold-select" className="sr-only">
                  AQI alert threshold
                </label>
                <select
                  id="alert-threshold-select"
                  value={aqiAlert.activeThreshold}
                  onChange={(e) => aqiAlert.setThreshold(Number(e.target.value))}
                  aria-label={language === 'hi' ? 'AQI चेतावनी सीमा' : 'AQI alert threshold'}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs font-mono tabular-nums text-slate-700 dark:text-slate-200 min-h-[34px]"
                >
                  <option value={101}>101+ (Sensitive)</option>
                  <option value={151}>151+ (Unhealthy)</option>
                  <option value={201}>201+ (Very Unhealthy)</option>
                </select>
              </div>
            )}

            <PWAInstallButton />
          </div>
        </div>
      </div>

      {/* Persistent High-AQI Banner */}
      {aqiAlert.shouldShowBanner && (
        <AqiAlertBanner
          airQuality={airQuality}
          profile={profile}
          language={language}
          activeThreshold={aqiAlert.activeThreshold}
          jumpInfo={aqiAlert.jumpInfo}
          permission={aqiAlert.permission}
          notificationsEnabled={aqiAlert.notificationsEnabled}
          onToggleNotifications={aqiAlert.toggleNotifications}
          onDismiss={aqiAlert.dismissBanner}
          onViewPlan={() => setActiveTab('today')}
        />
      )}

      {/* Main Content */}
      <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {activeTab === 'today' && (
          <DashboardView
            profile={profile}
            airQuality={airQuality}
            isLoadingAqi={isLoadingAqi}
            aqiError={aqiError}
            language={language}
            habitProgress={habitProgress}
            onRefreshAqi={(c) => fetchAqi(c)}
            onManualAqi={handleManualAqi}
            onToggleHabit={handleToggleHabit}
            onOpenSetup={() => setShowOnboarding(true)}
          />
        )}
        {activeTab === 'indoor' && (
          <IndoorHacksView language={language} budgetHint={profile.budget} />
        )}
        {activeTab === 'alternatives' && <AlternativesView language={language} />}
        {activeTab === 'assistant' && (
          <AssistantView profile={profile} airQuality={airQuality} language={language} />
        )}
        {activeTab === 'community' && (
          <CommunityView city={airQuality.city} aqi={airQuality.aqi} language={language} />
        )}
      </main>

      {/* Footer with Privacy & Medical Disclaimer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 pb-24 md:pb-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>{t.medicalDisclaimer}</p>
          <p>{t.privacyNote}</p>
        </div>
      </footer>

      {/* Mobile Bottom Tab Bar (56px height, keeping total sticky bars <= 15% mobile height) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 items-center no-print"
      >
        {navItems.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] px-1 transition-colors ${
                active
                  ? 'text-teal-700 dark:text-teal-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-full">
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      <OfflineIndicator language={language} />

      {showOnboarding && (
        <OnboardingWizard
          initialProfile={profile}
          language={language}
          onSave={handleSaveOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}
