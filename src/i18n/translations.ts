import type { AQILevelId, Language } from '../types/cleanAir.ts';

export const TRANSLATIONS: Record<
  Language,
  {
    appName: string;
    navToday: string;
    navIndoor: string;
    navAlternatives: string;
    navAssistant: string;
    navCommunity: string;
    myHousehold: string;
    setupPlan: string;
    privacyNote: string;
    medicalDisclaimer: string;
    emergencyNote: string;
    estimateBadge: string;
    whyThisMatters: string;
    howCalculated: string;
    healthEffect: string;
    emissionEffect: string;
    communityEffect: string;
    currentAqi: string;
    mainPollutant: string;
    lastUpdated: string;
    sourceLabel: string;
    threeDayOutlook: string;
    bestWindowLabel: string;
    manualOverride: string;
    refreshAqi: string;
    dailyPlanTitle: string;
    morning: string;
    afternoon: string;
    evening: string;
    weeklyProgressTitle: string;
    streakLabel: string;
    daysSuffix: string;
    estCo2Avoided: string;
    estExposureReduced: string;
    aqiLevels: Record<AQILevelId, { label: string; summary: string }>;
  }
> = {
  en: {
    appName: 'CleanAir Companion',
    navToday: 'Today',
    navIndoor: 'Indoor Hacks',
    navAlternatives: 'Alternatives',
    navAssistant: 'Ask AI',
    navCommunity: 'Community',
    myHousehold: 'Household',
    setupPlan: 'Setup Plan',
    privacyNote: 'Your household profile stays privately on this device. No account required.',
    medicalDisclaimer:
      'General guidance only — not medical advice. Consult a doctor for health decisions.',
    emergencyNote:
      'Seek urgent medical care for breathlessness, chest pain, severe wheezing, or dizziness.',
    estimateBadge: 'Rough estimate — assumes typical urban household',
    whyThisMatters: 'Why this matters',
    howCalculated: 'How we calculated this',
    healthEffect: 'Health effect',
    emissionEffect: 'Emission effect',
    communityEffect: 'If 100 households do this',
    currentAqi: 'Current US AQI',
    mainPollutant: 'Main pollutant',
    lastUpdated: 'Last updated',
    sourceLabel: 'Data source',
    threeDayOutlook: '3-day outlook',
    bestWindowLabel: 'Best vent window',
    manualOverride: 'Enter AQI manually',
    refreshAqi: 'Refresh',
    dailyPlanTitle: 'Personalised Daily Plan',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    weeklyProgressTitle: 'Weekly Habit Progress',
    streakLabel: 'Active streak',
    daysSuffix: 'days',
    estCo2Avoided: 'Est. weekly CO2 avoided',
    estExposureReduced: 'Est. indoor PM exposure cut',
    aqiLevels: {
      good: {
        label: 'Good',
        summary: 'Air is clean. Great time to open windows and enjoy outdoor play.',
      },
      moderate: {
        label: 'Moderate',
        summary: 'Acceptable for most people; sensitive groups should pace heavy outdoor exercise.',
      },
      sensitive: {
        label: 'Unhealthy for Sensitive Groups',
        summary: 'Children, elderly, and people with asthma should shorten strenuous outdoor time.',
      },
      unhealthy: {
        label: 'Unhealthy',
        summary: 'Keep windows closed during rush hours. Use N95 masks outdoors if commuting.',
      },
      'very-unhealthy': {
        label: 'Very Unhealthy',
        summary: 'Move play and exercise indoors. Seal drafts and run filtration if available.',
      },
      hazardous: {
        label: 'Hazardous',
        summary: 'Severe winter smog. Stay indoors as much as possible and protect vulnerable family members.',
      },
    },
  },
  hi: {
    appName: 'CleanAir Companion',
    navToday: 'आज',
    navIndoor: 'घर के उपाय',
    navAlternatives: 'विकल्प',
    navAssistant: 'AI से पूछें',
    navCommunity: 'समुदाय',
    myHousehold: 'मेरा परिवार',
    setupPlan: 'योजना बनाएं',
    privacyNote: 'आपकी पारिवारिक जानकारी केवल आपके फोन/ब्राउज़र में सुरक्षित रहती है।',
    medicalDisclaimer:
      'यह केवल सामान्य मार्गदर्शन है — चिकित्सीय सलाह नहीं। लक्षण बढ़ने पर डॉक्टर से मिलें।',
    emergencyNote:
      'सांस फूलने, सीने में दर्द या तेज घरघराहट होने पर तुरंत डॉक्टर या आपातकालीन सेवा से संपर्क करें।',
    estimateBadge: 'अनुमानित आंकड़ा — सामान्य शहरी परिवार के आधार पर',
    whyThisMatters: 'यह क्यों ज़रूरी है',
    howCalculated: 'हमने यह अनुमान कैसे लगाया',
    healthEffect: 'स्वास्थ्य प्रभाव',
    emissionEffect: 'उत्सर्जन में कमी',
    communityEffect: 'यदि 100 परिवार ऐसा करें',
    currentAqi: 'वर्तमान US AQI',
    mainPollutant: 'मुख्य प्रदूषक',
    lastUpdated: 'अंतिम अपडेट',
    sourceLabel: 'डेटा स्रोत',
    threeDayOutlook: '3-दिन का अनुमान',
    bestWindowLabel: 'हवा का सही समय',
    manualOverride: 'AQI स्वयं दर्ज करें',
    refreshAqi: 'रीफ्रेश',
    dailyPlanTitle: 'आपकी व्यक्तिगत दैनिक योजना',
    morning: 'सुबह',
    afternoon: 'दोपहर',
    evening: 'शाम / रात',
    weeklyProgressTitle: 'साप्ताहिक आदत प्रगति',
    streakLabel: 'सक्रिय स्ट्रीक',
    daysSuffix: 'दिन',
    estCo2Avoided: 'अनुमानित साप्ताहिक CO2 बचत',
    estExposureReduced: 'अनुमानित घर के अंदर PM कमी',
    aqiLevels: {
      good: {
        label: 'अच्छा (Good)',
        summary: 'हवा साफ है। खिड़कियां खोलने और बाहर खेलने का बढ़िया समय।',
      },
      moderate: {
        label: 'मध्यम (Moderate)',
        summary: 'अधिकांश लोगों के लिए ठीक; संवेदनशील लोग भारी व्यायाम कम रखें।',
      },
      sensitive: {
        label: 'संवेदनशील समूहों के लिए अस्वस्थ',
        summary: 'बच्चे, बुजुर्ग और अस्थमा रोगी बाहर की कड़ी मेहनत कम करें।',
      },
      unhealthy: {
        label: 'अस्वस्थ (Unhealthy)',
        summary: 'भीड़भाड़ के समय खिड़कियां बंद रखें। बाहर निकलते समय N95 मास्क पहनें।',
      },
      'very-unhealthy': {
        label: 'बेहद अस्वस्थ',
        summary: 'खेल और व्यायाम घर के अंदर करें। खिड़कियों की दरारें सील करें।',
      },
      hazardous: {
        label: 'खतरनाक (Hazardous)',
        summary: 'गंभीर सर्दी की धुंध। जितना हो सके घर के अंदर रहें और बच्चों व बुजुर्गों को बचाएं।',
      },
    },
  },
};
