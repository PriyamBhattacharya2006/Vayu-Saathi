import React from 'react';
import { Bell, BellOff, ArrowRight, X } from 'lucide-react';
import type { AirQualityData, Language, UserProfile } from '../types/cleanAir.ts';
import { getAQILevelId, getAQIVisualMeta } from '../utils/aqi.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { AQIIcon } from './AQIIcon.tsx';

interface AqiAlertBannerProps {
  airQuality: AirQualityData;
  profile: UserProfile;
  language: Language;
  activeThreshold: number;
  jumpInfo: { from: number; to: number } | null;
  permission: NotificationPermission | 'unsupported';
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onDismiss: () => void;
  onViewPlan: () => void;
}

export const AqiAlertBanner: React.FC<AqiAlertBannerProps> = ({
  airQuality,
  profile,
  language,
  activeThreshold,
  jumpInfo,
  permission,
  notificationsEnabled,
  onToggleNotifications,
  onDismiss,
  onViewPlan,
}) => {
  const t = TRANSLATIONS[language];
  const levelId = getAQILevelId(airQuality.aqi);
  const visual = getAQIVisualMeta(airQuality.aqi);
  const levelLabel = t.aqiLevels[levelId].label;

  const hasSensitive =
    profile.children > 0 || profile.elderly > 0 || profile.conditions.length > 0;

  const headline = jumpInfo
    ? language === 'hi'
      ? `${airQuality.city} में AQI ${jumpInfo.from} से बढ़कर ${jumpInfo.to} (${levelLabel}) हो गया है`
      : `AQI in ${airQuality.city} jumped from ${jumpInfo.from} to ${jumpInfo.to} (${levelLabel})`
    : language === 'hi'
      ? `${airQuality.city} में वायु गुणवत्ता अस्वस्थ स्तर (${airQuality.aqi} · ${levelLabel}) पर है`
      : `Air quality alert for ${airQuality.city}: US AQI ${airQuality.aqi} (${levelLabel})`;

  const guidance = hasSensitive
    ? language === 'hi'
      ? 'बच्चों, बुजुर्गों व अस्थमा सदस्यों के लिए खिड़कियां बंद रखें और बाहर की गतिविधियाँ दोपहर तक टालें।'
      : 'Keep windows shut for children, elderly, or sensitive household members and shift outdoor play indoors.'
    : language === 'hi'
      ? 'खिड़कियां बंद रखें, दोपहर के छोटे अंतराल का उपयोग करें और बाहर यात्रा में N95 मास्क पहनें।'
      : 'Keep windows closed during smog peaks, wear a snug N95 mask outdoors, and limit heavy exertion.';

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label={language === 'hi' ? 'वायु गुणवत्ता चेतावनी' : 'Air quality alert'}
      className={`border-b ${visual.bgClass} ${visual.borderClass} no-print`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`mt-0.5 shrink-0 ${visual.textClass}`}>
            <AQIIcon levelId={levelId} className="w-5 h-5" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <p className={`text-sm font-bold ${visual.textClass} tabular-nums`}>{headline}</p>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-mono tabular-nums">
                · {language === 'hi' ? `सीमा: ${activeThreshold}+` : `Alert threshold: ${activeThreshold}+`}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              {guidance}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onViewPlan}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 min-h-[36px]"
          >
            <span>{language === 'hi' ? 'दैनिक योजना देखें' : 'View Daily Plan'}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          {permission !== 'unsupported' && permission !== 'denied' && (
            <button
              type="button"
              onClick={onToggleNotifications}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 min-h-[36px]"
            >
              {notificationsEnabled ? (
                <>
                  <Bell className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                  <span>{language === 'hi' ? 'अलर्ट चालू' : 'Alerts On'}</span>
                </>
              ) : (
                <>
                  <BellOff className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{language === 'hi' ? 'ब्राउज़र अलर्ट चालू करें' : 'Enable Alerts'}</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onDismiss}
            aria-label={language === 'hi' ? 'चेतावनी बंद करें' : 'Dismiss alert banner'}
            className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 min-w-[36px] min-h-[36px]"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
