import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AirQualityData, Language, UserProfile } from '../types/cleanAir.ts';
import { getAQILevelId } from '../utils/aqi.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';

const ALERT_PREFS_KEY = 'cleanair_alert_prefs_v1';

interface AlertPrefs {
  customThreshold: number | null;
  notificationsEnabled: boolean;
  dismissedLevelKey: string | null;
}

function readPrefs(): AlertPrefs {
  try {
    const raw = localStorage.getItem(ALERT_PREFS_KEY);
    if (raw) return JSON.parse(raw) as AlertPrefs;
  } catch {
    // Ignore storage errors
  }
  return {
    customThreshold: null,
    notificationsEnabled: false,
    dismissedLevelKey: null,
  };
}

export function useAqiAlert(params: {
  profile: UserProfile;
  airQuality: AirQualityData;
  language: Language;
}) {
  const { profile, airQuality, language } = params;
  const [prefs, setPrefs] = useState<AlertPrefs>(readPrefs);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });
  const [jumpInfo, setJumpInfo] = useState<{ from: number; to: number } | null>(null);

  const prevReadingRef = useRef<{ city: string; aqi: number } | null>(null);

  const hasSensitiveMember =
    profile.children > 0 || profile.elderly > 0 || profile.conditions.length > 0;

  // Smart default threshold: 101 for sensitive households, 151 otherwise
  const activeThreshold = prefs.customThreshold ?? (hasSensitiveMember ? 101 : 151);

  const currentLevelId = getAQILevelId(airQuality.aqi);
  const currentLevelKey = `${airQuality.city.toLowerCase()}::${currentLevelId}::${activeThreshold}`;
  const isAboveThreshold = airQuality.aqi >= activeThreshold;
  const isDismissed = prefs.dismissedLevelKey === currentLevelKey;

  useEffect(() => {
    try {
      localStorage.setItem(ALERT_PREFS_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors
    }
  }, [prefs]);

  const sendBrowserNotification = useCallback(
    (aqiData: AirQualityData, jumpedFrom: number | null) => {
      if (
        typeof window === 'undefined' ||
        !('Notification' in window) ||
        Notification.permission !== 'granted' ||
        !prefs.notificationsEnabled
      ) {
        return;
      }

      const t = TRANSLATIONS[language];
      const levelLabel = t.aqiLevels[getAQILevelId(aqiData.aqi)].label;
      const title =
        language === 'hi'
          ? `${aqiData.city}: AQI ${aqiData.aqi} (${levelLabel})`
          : `CleanAir Alert — ${aqiData.city}: AQI ${aqiData.aqi} (${levelLabel})`;

      const body =
        jumpedFrom !== null
          ? language === 'hi'
            ? `AQI ${jumpedFrom} से बढ़कर ${aqiData.aqi} हो गया है। खिड़कियां बंद रखें और बाहर निकलते समय N95 मास्क पहनें।`
            : `Air quality jumped from ${jumpedFrom} to ${aqiData.aqi}. Keep windows shut and shift strenuous outdoor activity indoors.`
          : language === 'hi'
            ? `आपके शहर में वायु गुणवत्ता ${aqiData.aqi} (${levelLabel}) पर है। परिवार की सुरक्षा के लिए अपनी दैनिक योजना देखें।`
            : `Air quality in ${aqiData.city} is ${aqiData.aqi} (${levelLabel}). Check your household daily plan for protection steps.`;

      try {
        new Notification(title, {
          body,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: `cleanair-aqi-${aqiData.city.toLowerCase()}`,
        });
      } catch {
        // Ignore if browser blocks Notification constructor (e.g. mobile SW-only contexts)
      }
    },
    [language, prefs.notificationsEnabled]
  );

  // Detect AQI crossing threshold or sudden unhealthy spike for saved location
  useEffect(() => {
    const prev = prevReadingRef.current;
    const sameCity = prev && prev.city.toLowerCase() === airQuality.city.toLowerCase();

    if (sameCity && prev) {
      const crossedThreshold = prev.aqi < activeThreshold && airQuality.aqi >= activeThreshold;
      const jumpedSharply = airQuality.aqi >= activeThreshold && airQuality.aqi - prev.aqi >= 35;

      if (crossedThreshold || jumpedSharply) {
        setJumpInfo({ from: prev.aqi, to: airQuality.aqi });
        // Re-open banner on a fresh jump even if an earlier alert was dismissed
        setPrefs((p) => (p.dismissedLevelKey ? { ...p, dismissedLevelKey: null } : p));
        sendBrowserNotification(airQuality, prev.aqi);
      } else if (airQuality.aqi < activeThreshold) {
        setJumpInfo(null);
      }
    } else if (airQuality.aqi >= activeThreshold && airQuality.isLive) {
      // Initial live reading on app open already above threshold -> notify once if enabled & not dismissed
      if (prefs.dismissedLevelKey !== currentLevelKey) {
        sendBrowserNotification(airQuality, null);
      }
    }

    prevReadingRef.current = { city: airQuality.city, aqi: airQuality.aqi };
  }, [
    airQuality,
    activeThreshold,
    currentLevelKey,
    prefs.dismissedLevelKey,
    sendBrowserNotification,
  ]);

  const requestNotifications = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setPrefs((p) => ({ ...p, notificationsEnabled: true }));
        const t = TRANSLATIONS[language];
        const levelLabel = t.aqiLevels[getAQILevelId(airQuality.aqi)].label;
        new Notification(
          language === 'hi'
            ? 'CleanAir अलर्ट सक्रिय हो गए हैं'
            : 'CleanAir AQI alerts enabled',
          {
            body:
              language === 'hi'
                ? `${airQuality.city} में AQI ${activeThreshold}+ होने पर आपको स्थानीय सूचना मिलेगी (वर्तमान: ${airQuality.aqi} · ${levelLabel})।`
                : `You will receive a local alert when ${airQuality.city} reaches AQI ${activeThreshold}+ (currently ${airQuality.aqi} · ${levelLabel}).`,
            icon: '/pwa-192x192.png',
            tag: 'cleanair-alerts-enabled',
          }
        );
        return true;
      }
      setPrefs((p) => ({ ...p, notificationsEnabled: false }));
      return false;
    } catch {
      return false;
    }
  }, [airQuality.aqi, airQuality.city, activeThreshold, language]);

  const toggleNotifications = useCallback(async () => {
    if (prefs.notificationsEnabled && permission === 'granted') {
      setPrefs((p) => ({ ...p, notificationsEnabled: false }));
      return;
    }
    await requestNotifications();
  }, [prefs.notificationsEnabled, permission, requestNotifications]);

  const setThreshold = useCallback((threshold: number | null) => {
    setPrefs((p) => ({ ...p, customThreshold: threshold, dismissedLevelKey: null }));
  }, []);

  const dismissBanner = useCallback(() => {
    setPrefs((p) => ({ ...p, dismissedLevelKey: currentLevelKey }));
  }, [currentLevelKey]);

  const shouldShowBanner = useMemo(
    () => isAboveThreshold && !isDismissed,
    [isAboveThreshold, isDismissed]
  );

  return {
    activeThreshold,
    customThreshold: prefs.customThreshold,
    hasSensitiveMember,
    isAboveThreshold,
    shouldShowBanner,
    jumpInfo,
    permission,
    notificationsEnabled: prefs.notificationsEnabled && permission === 'granted',
    setThreshold,
    toggleNotifications,
    dismissBanner,
  };
}
