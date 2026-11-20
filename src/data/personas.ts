import type { AirQualityData, HabitItem, PersonaPreset, UserProfile } from '../types/cleanAir.ts';
import { getAQILevelId } from '../utils/aqi.ts';

export const DEFAULT_PROFILE: UserProfile = {
  city: 'New Delhi',
  area: 'Lajpat Nagar',
  adults: 2,
  children: 1,
  elderly: 1,
  conditions: ['asthma'],
  homeType: 'apartment',
  windowSeal: 'average',
  hasExhaustFan: true,
  hasAirPurifier: false,
  heatingMethod: 'electric',
  commuteMode: 'transit',
  cookingFuel: 'lpg',
  workFromHome: false,
  budget: 'low',
  onboardingCompleted: false,
};

export const EXAMPLE_PERSONAS: PersonaPreset[] = [
  {
    id: 'sharma-delhi',
    name: 'Sharma Family (Delhi, tight budget)',
    nameHi: 'शर्मा परिवार (दिल्ली, कम बजट)',
    scenario: 'Apartment with a 7-year-old child with asthma, elderly grandparent, drafty windows, free/low-cost tips only.',
    scenarioHi: 'अपार्टमेंट, 7 साल का अस्थमा प्रभावित बच्चा, बुजुर्ग दादा-दादी, खिड़कियों में दरारें, केवल मुफ्त/कम खर्च वाले उपाय।',
    sampleAqi: 312,
    profile: {
      city: 'New Delhi',
      area: 'Patparganj',
      adults: 2,
      children: 1,
      elderly: 1,
      conditions: ['asthma'],
      homeType: 'apartment',
      windowSeal: 'drafty',
      hasExhaustFan: false,
      hasAirPurifier: false,
      heatingMethod: 'none',
      commuteMode: 'transit',
      cookingFuel: 'lpg',
      workFromHome: false,
      budget: 'free',
      onboardingCompleted: true,
    },
  },
  {
    id: 'meera-gurugram',
    name: 'Meera & Elderly Mother (Gurugram)',
    nameHi: 'मीरा और बुजुर्ग माँ (गुरुग्राम)',
    scenario: 'Works from home, cares for elderly mother with allergies, owns one bedroom purifier, low-cost routine.',
    scenarioHi: 'घर से काम, एलर्जी से पीड़ित बुजुर्ग माँ की देखभाल, बेडरूम में एक एयर प्यूरीफायर, कम खर्च वाली दिनचर्या।',
    sampleAqi: 245,
    profile: {
      city: 'Gurugram',
      area: 'Sector 45',
      adults: 1,
      children: 0,
      elderly: 1,
      conditions: ['allergies', 'heart_condition'],
      homeType: 'apartment',
      windowSeal: 'average',
      hasExhaustFan: true,
      hasAirPurifier: true,
      heatingMethod: 'electric',
      commuteMode: 'wfh',
      cookingFuel: 'lpg',
      workFromHome: true,
      budget: 'low',
      onboardingCompleted: true,
    },
  },
  {
    id: 'rohan-bengaluru',
    name: 'Rohan (Bengaluru, cyclist)',
    nameHi: 'रोहन (बेंगलुरु, साइकिल यात्री)',
    scenario: 'Independent house, cycles 6 km to office, uses induction cooking, flexible budget.',
    scenarioHi: 'स्वतंत्र घर, 6 किमी साइकिल से ऑफिस, इंडक्शन कुकिंग, लचीला बजट।',
    sampleAqi: 108,
    profile: {
      city: 'Bengaluru',
      area: 'Indiranagar',
      adults: 2,
      children: 0,
      elderly: 0,
      conditions: [],
      homeType: 'house',
      windowSeal: 'tight',
      hasExhaustFan: true,
      hasAirPurifier: false,
      heatingMethod: 'none',
      commuteMode: 'cycle',
      cookingFuel: 'electric',
      workFromHome: false,
      budget: 'flexible',
      onboardingCompleted: true,
    },
  },
];

export const POPULAR_CITIES: { name: string; lat: number; lon: number; sampleAqi: number }[] = [
  { name: 'New Delhi', lat: 28.6139, lon: 77.209, sampleAqi: 312 },
  { name: 'Gurugram', lat: 28.4595, lon: 77.0266, sampleAqi: 268 },
  { name: 'Lahore', lat: 31.5204, lon: 74.3587, sampleAqi: 294 },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777, sampleAqi: 142 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, sampleAqi: 96 },
  { name: 'London', lat: 51.5072, lon: -0.1276, sampleAqi: 42 },
];

export function buildSampleAirQuality(city: string, aqiOverride?: number): AirQualityData {
  const matched = POPULAR_CITIES.find(
    (c) => c.name.toLowerCase() === city.trim().toLowerCase()
  );
  const baseAqi = aqiOverride ?? matched?.sampleAqi ?? 185;
  const pm25 = Math.round(baseAqi * 0.52);
  const pm10 = Math.round(pm25 * 1.48);
  const no2 = Math.round(Math.max(18, baseAqi * 0.21));

  const dayOffsets = [1, 2, 3];
  const dayNames = ['Tomorrow', 'Day +2', 'Day +3'];
  const outlook = dayOffsets.map((offset, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const delta = idx === 0 ? -12 : idx === 1 ? -28 : 8;
    const forecastAqi = Math.max(35, Math.min(480, baseAqi + delta));
    return {
      date: d.toISOString().slice(0, 10),
      dayLabel: dayNames[idx],
      aqi: forecastAqi,
      pm25: Math.round(forecastAqi * 0.5),
      levelId: getAQILevelId(forecastAqi),
      bestWindow: forecastAqi > 200 ? '13:00 – 15:30' : '11:00 – 16:00',
    };
  });

  return {
    city: city || 'New Delhi',
    aqi: baseAqi,
    mainPollutant: 'PM2.5',
    pm25,
    pm10,
    no2,
    source: 'Sample Winter Smog Profile (offline fallback)',
    isLive: false,
    lastUpdated: new Date().toISOString(),
    outlook,
  };
}

export const WEEKLY_HABITS: HabitItem[] = [
  {
    id: 'damp-mop',
    label: 'Damp mopped floors instead of dry sweeping',
    labelHi: 'सूखी झाड़ू की जगह गीला पोंछा लगाया',
    weeklyCo2Kg: 0.2,
    weeklyExposurePct: 14,
  },
  {
    id: 'exhaust-cook',
    label: 'Used kitchen exhaust / covered pots while cooking',
    labelHi: 'खाना बनाते समय चिमनी/एग्जॉस्ट चलाया और बर्तन ढके',
    weeklyCo2Kg: 1.4,
    weeklyExposurePct: 18,
  },
  {
    id: 'no-incense',
    label: 'Skipped incense, candles, or coils indoors today',
    labelHi: 'आज घर के अंदर अगरबत्ती, मोमबत्ती या कॉइल नहीं जलाई',
    weeklyCo2Kg: 0.5,
    weeklyExposurePct: 15,
  },
  {
    id: 'low-emission-trip',
    label: 'Walked, cycled, used metro/bus, or carpooled',
    labelHi: 'पैदल, साइकिल, मेट्रो/बस या कारपूल का उपयोग किया',
    weeklyCo2Kg: 8.5,
    weeklyExposurePct: 10,
  },
  {
    id: 'afternoon-vent',
    label: 'Opened windows only during afternoon lowest-smog window',
    labelHi: 'खिड़कियां केवल दोपहर के कम धुंध वाले समय में खोलीं',
    weeklyCo2Kg: 0.0,
    weeklyExposurePct: 16,
  },
];
