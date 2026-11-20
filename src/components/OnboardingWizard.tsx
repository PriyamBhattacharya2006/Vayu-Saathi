import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Lock, MapPin, Users, X } from 'lucide-react';
import type {
  BudgetLevel,
  CommuteMode,
  CookingFuel,
  HeatingMethod,
  HomeType,
  Language,
  RespiratoryCondition,
  UserProfile,
  WindowSeal,
} from '../types/cleanAir.ts';
import { EXAMPLE_PERSONAS, POPULAR_CITIES } from '../data/personas.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';

interface OnboardingWizardProps {
  initialProfile: UserProfile;
  language: Language;
  onSave: (profile: UserProfile, sampleAqiOverride?: number) => void;
  onClose: () => void;
}

const CONDITIONS: { id: RespiratoryCondition; en: string; hi: string }[] = [
  { id: 'asthma', en: 'Asthma', hi: 'अस्थमा' },
  { id: 'allergies', en: 'Allergies / Sinus', hi: 'एलर्जी / साइनस' },
  { id: 'copd_or_lung', en: 'Chronic lung / COPD', hi: 'फेफड़ों की समस्या / COPD' },
  { id: 'heart_condition', en: 'Heart condition', hi: 'हृदय रोग' },
  { id: 'pregnancy', en: 'Pregnancy', hi: 'गर्भावस्था' },
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialProfile,
  language,
  onSave,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<UserProfile>(initialProfile);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const t = TRANSLATIONS[language];

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDraft((prev) => ({
          ...prev,
          city: prev.city || 'My Current Location',
          lat: Number(pos.coords.latitude.toFixed(4)),
          lon: Number(pos.coords.longitude.toFixed(4)),
        }));
        setGeoStatus('idle');
      },
      () => {
        setGeoStatus('error');
      },
      { timeout: 6000 }
    );
  };

  const toggleCondition = (id: RespiratoryCondition) => {
    setDraft((prev) => {
      const exists = prev.conditions.includes(id);
      return {
        ...prev,
        conditions: exists
          ? prev.conditions.filter((c) => c !== id)
          : [...prev.conditions, id],
      };
    });
  };

  const finish = () => {
    onSave({ ...draft, onboardingCompleted: true });
  };

  const skip = () => {
    onSave({ ...draft, onboardingCompleted: true });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl my-auto">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 id="onboarding-title" className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'hi'
                ? 'अपनी वायु सुरक्षा योजना सेट करें'
                : 'Personalise your CleanAir plan'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
              {language === 'hi' ? `चरण ${step} / 5` : `Step ${step} of 5`} ·{' '}
              <button
                type="button"
                onClick={skip}
                className="underline hover:text-slate-800 dark:hover:text-slate-200 font-medium"
              >
                {language === 'hi' ? 'अभी छोड़ें' : 'Skip for now'}
              </button>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close setup"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step progress bar */}
        <div className="grid grid-cols-5 gap-1 px-6 pt-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setStep(n)}
              aria-label={`Go to step ${n}`}
              className={`h-1.5 rounded-full transition-colors ${
                n <= step
                  ? 'bg-teal-700 dark:bg-teal-500'
                  : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Quick Example Personas */}
          {step === 1 && (
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Users className="w-4 h-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                <span>
                  {language === 'hi'
                    ? 'या एक उदाहरण परिवार चुनें:'
                    : 'Or load an example household scenario:'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {EXAMPLE_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSave(p.profile, p.sampleAqi)}
                    className="text-left rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 hover:border-teal-600 dark:hover:border-teal-500 transition-colors"
                  >
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      {language === 'hi' ? p.nameHi : p.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {language === 'hi' ? p.scenarioHi : p.scenario}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {language === 'hi' ? '1. आपका शहर या इलाका' : '1. Your city & neighbourhood'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="onboard-city"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    {language === 'hi' ? 'शहर' : 'City'}
                  </label>
                  <input
                    id="onboard-city"
                    type="text"
                    value={draft.city}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        city: e.target.value,
                        lat: undefined,
                        lon: undefined,
                      }))
                    }
                    placeholder="e.g. New Delhi, Lahore, London"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-2 focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="onboard-area"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    {language === 'hi' ? 'इलाका (वैकल्पिक)' : 'Area / Ward (optional)'}
                  </label>
                  <input
                    id="onboard-area"
                    type="text"
                    value={draft.area || ''}
                    onChange={(e) => setDraft((prev) => ({ ...prev, area: e.target.value }))}
                    placeholder="e.g. Lajpat Nagar"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-2 focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleGeolocate}
                  disabled={geoStatus === 'loading'}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-teal-700/30 dark:border-teal-500/40 bg-teal-50 dark:bg-teal-950/50 px-3.5 py-2 text-xs font-semibold text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/60 min-h-[40px]"
                >
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {geoStatus === 'loading'
                      ? language === 'hi'
                        ? 'लोकेशन खोजी जा रही है...'
                        : 'Finding location...'
                      : language === 'hi'
                        ? 'मेरी वर्तमान लोकेशन उपयोग करें'
                        : 'Use my location'}
                  </span>
                </button>
                {draft.lat && draft.lon && (
                  <span className="text-xs font-mono tabular-nums text-teal-700 dark:text-teal-300">
                    GPS: {draft.lat}, {draft.lon}
                  </span>
                )}
                {geoStatus === 'error' && (
                  <span className="text-xs text-amber-700 dark:text-amber-300">
                    {language === 'hi'
                      ? 'लोकेशन अनुमति नहीं मिली — कृपया शहर का नाम लिखें।'
                      : 'Location unavailable — please enter your city name.'}
                  </span>
                )}
              </div>

              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  {language === 'hi' ? 'लोकप्रिय शहर:' : 'Quick city select:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CITIES.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          city: c.name,
                          lat: c.lat,
                          lon: c.lon,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors min-h-[36px] ${
                        draft.city.toLowerCase() === c.name.toLowerCase()
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-600'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {language === 'hi'
                  ? '2. परिवार के सदस्य और स्वास्थ्य संवेदनशीलता'
                  : '2. Household members & respiratory sensitivity'}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'adults' as const, en: 'Adults', hi: 'वयस्क', min: 1 },
                  { key: 'children' as const, en: 'Children', hi: 'बच्चे', min: 0 },
                  { key: 'elderly' as const, en: 'Elderly (60+)', hi: 'बुजुर्ग (60+)', min: 0 },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-3"
                  >
                    <label
                      htmlFor={`count-${item.key}`}
                      className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5"
                    >
                      {language === 'hi' ? item.hi : item.en}
                    </label>
                    <input
                      id={`count-${item.key}`}
                      type="number"
                      min={item.min}
                      max={15}
                      value={draft[item.key]}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          [item.key]: Math.max(item.min, Number(e.target.value) || 0),
                        }))
                      }
                      className="w-full font-mono tabular-nums text-base font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-slate-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'hi'
                    ? 'क्या परिवार में किसी को इनमें से कोई स्थिति है?'
                    : 'Any respiratory or vulnerable conditions in the home?'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map((cond) => {
                    const active = draft.conditions.includes(cond.id);
                    return (
                      <button
                        key={cond.id}
                        type="button"
                        onClick={() => toggleCondition(cond.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors min-h-[40px] ${
                          active
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-600'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                        <span>{language === 'hi' ? cond.hi : cond.en}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {language === 'hi' ? '3. घर और वेंटिलेशन' : '3. Home type, windows & heating'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'hi' ? 'घर का प्रकार' : 'Home type'}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { id: 'apartment', en: 'Apartment', hi: 'अपार्टमेंट' },
                        { id: 'house', en: 'House', hi: 'स्वतंत्र घर' },
                      ] as { id: HomeType; en: string; hi: string }[]
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDraft((p) => ({ ...p, homeType: opt.id }))}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border min-h-[44px] ${
                          draft.homeType === opt.id
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {language === 'hi' ? opt.hi : opt.en}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'hi' ? 'खिड़की की सील' : 'Window sealing'}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'tight', en: 'Tight', hi: 'कसी हुई' },
                        { id: 'average', en: 'Average', hi: 'सामान्य' },
                        { id: 'drafty', en: 'Drafty', hi: 'दरारें हैं' },
                      ] as { id: WindowSeal; en: string; hi: string }[]
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDraft((p) => ({ ...p, windowSeal: opt.id }))}
                        className={`py-2.5 px-2 rounded-xl text-xs font-semibold border min-h-[44px] ${
                          draft.windowSeal === opt.id
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {language === 'hi' ? opt.hi : opt.en}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3 cursor-pointer min-h-[48px]">
                  <input
                    type="checkbox"
                    checked={draft.hasExhaustFan}
                    onChange={(e) => setDraft((p) => ({ ...p, hasExhaustFan: e.target.checked }))}
                    className="w-4 h-4 accent-teal-700"
                  />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {language === 'hi'
                      ? 'रसोई में चिमनी / एग्जॉस्ट फैन है'
                      : 'We have a kitchen exhaust fan / chimney'}
                  </span>
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3 cursor-pointer min-h-[48px]">
                  <input
                    type="checkbox"
                    checked={draft.hasAirPurifier}
                    onChange={(e) => setDraft((p) => ({ ...p, hasAirPurifier: e.target.checked }))}
                    className="w-4 h-4 accent-teal-700"
                  />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {language === 'hi'
                      ? 'घर में HEPA एयर प्यूरीफायर है'
                      : 'We already own a HEPA air purifier'}
                  </span>
                </label>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'hi' ? 'सर्दियों में हीटिंग का तरीका' : 'Winter heating method'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: 'none', en: 'None / layers', hi: 'कोई नहीं / ऊनी कपड़े' },
                      { id: 'electric', en: 'Electric', hi: 'इलेक्ट्रिक' },
                      { id: 'gas', en: 'Gas', hi: 'गैस' },
                      { id: 'wood', en: 'Wood', hi: 'लकड़ी' },
                      { id: 'coal', en: 'Coal / Angithi', hi: 'कोयला / अंगीठी' },
                    ] as { id: HeatingMethod; en: string; hi: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDraft((p) => ({ ...p, heatingMethod: opt.id }))}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border min-h-[40px] ${
                        draft.heatingMethod === opt.id
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {language === 'hi' ? opt.hi : opt.en}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {language === 'hi'
                  ? '4. रोज़ की यात्रा और खाना पकाने का ईंधन'
                  : '4. Commute & cooking fuel'}
              </h3>
              <div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'hi' ? 'मुख्य यात्रा तरीका' : 'Primary daily commute'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'walk', en: 'Walk', hi: 'पैदल' },
                      { id: 'cycle', en: 'Cycle', hi: 'साइकिल' },
                      { id: 'transit', en: 'Bus / Metro', hi: 'बस / मेट्रो' },
                      { id: 'two-wheeler', en: 'Two-wheeler', hi: 'दोपहिया' },
                      { id: 'car', en: 'Car', hi: 'कार' },
                      { id: 'wfh', en: 'Work from home', hi: 'घर से काम' },
                    ] as { id: CommuteMode; en: string; hi: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setDraft((p) => ({
                          ...p,
                          commuteMode: opt.id,
                          workFromHome: opt.id === 'wfh' ? true : p.workFromHome,
                        }))
                      }
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border min-h-[44px] ${
                        draft.commuteMode === opt.id
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {language === 'hi' ? opt.hi : opt.en}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'hi' ? 'खाना पकाने का ईंधन' : 'Cooking fuel'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'lpg', en: 'LPG / Piped Gas', hi: 'LPG / पाइप गैस' },
                      { id: 'electric', en: 'Electric / Induction', hi: 'इंडक्शन / बिजली' },
                      { id: 'biomass', en: 'Wood / Biomass', hi: 'लकड़ी / चूल्हा' },
                    ] as { id: CookingFuel; en: string; hi: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDraft((p) => ({ ...p, cookingFuel: opt.id }))}
                      className={`py-2.5 px-2.5 rounded-xl text-xs font-semibold border min-h-[44px] ${
                        draft.cookingFuel === opt.id
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {language === 'hi' ? opt.hi : opt.en}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={draft.workFromHome}
                  onChange={(e) => setDraft((p) => ({ ...p, workFromHome: e.target.checked }))}
                  className="w-4 h-4 accent-teal-700"
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {language === 'hi'
                    ? 'अधिकतर दिन घर से काम / पढ़ाई'
                    : 'Primarily work or study from home'}
                </span>
              </label>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {language === 'hi'
                  ? '5. खर्च की प्राथमिकता (बजट स्तर)'
                  : '5. Budget preference for tips'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(
                  [
                    {
                      id: 'free',
                      en: 'Free tips only',
                      hi: 'केवल मुफ्त उपाय',
                      descEn: 'Schedule shifts, wet mopping, lid cooking, damp cloth sealing.',
                      descHi: 'समय बदलाव, गीला पोंछा, ढककर पकाना और कपड़े से दरारें बंद करना।',
                    },
                    {
                      id: 'low',
                      en: 'Low cost',
                      hi: 'कम खर्च',
                      descEn: 'Includes foam window tape, N95 masks, or DIY box-fan filter.',
                      descHi: 'फोम टेप, N95 मास्क और कम कीमत वाला DIY बॉक्स-फैन फ़िल्टर।',
                    },
                    {
                      id: 'flexible',
                      en: 'Flexible',
                      hi: 'लचीला बजट',
                      descEn: 'Includes True HEPA purifiers & induction upgrades when worthwhile.',
                      descHi: 'जरूरत होने पर True HEPA प्यूरीफायर और इंडक्शन विकल्प भी।',
                    },
                  ] as { id: BudgetLevel; en: string; hi: string; descEn: string; descHi: string }[]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDraft((p) => ({ ...p, budget: opt.id }))}
                    className={`text-left rounded-xl p-4 border transition-colors ${
                      draft.budget === opt.id
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-700 dark:border-teal-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-teal-600'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'hi' ? opt.hi : opt.en}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                      {language === 'hi' ? opt.descHi : opt.descEn}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-600 dark:text-slate-400">
            <Lock className="w-4 h-4 shrink-0 mt-0.5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
            <span>{t.privacyNote}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(5, s + 1))}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-teal-700 hover:bg-teal-800 text-white min-h-[44px]"
            >
              <span>{language === 'hi' ? 'आगे बढ़ें' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-teal-700 hover:bg-teal-800 text-white min-h-[44px]"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>{language === 'hi' ? 'मेरी योजना दिखाएं' : 'Save & View Plan'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
