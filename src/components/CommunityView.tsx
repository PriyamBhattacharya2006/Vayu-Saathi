import React, { useEffect, useState } from 'react';
import { Check, ClipboardCopy, Printer, Trees, Users } from 'lucide-react';
import communityNeighborhoodImg from '../assets/images/community_clean_neighborhood_1794924989184.jpg';
import type { CommunityPledge, Language } from '../types/cleanAir.ts';

interface CommunityViewProps {
  city: string;
  aqi: number;
  language: Language;
}

const RWA_ACTIONS = [
  {
    id: 'no-burn',
    en: 'No-burning patrol & warm coats for night guards (stops trash/leaf fires)',
    hi: 'खुले में कचरा/पत्ते न जलाने का संकल्प व रात के चौकीदारों को गर्म जैकेट देना',
  },
  {
    id: 'carpool',
    en: 'Weekly Carpool Day & zero-idling school/gate drop-off zone',
    hi: 'साप्ताहिक कारपूल दिवस और गेट/स्कूल के बाहर इंजन बंद रखने का नियम',
  },
  {
    id: 'wet-sweep',
    en: 'Water-sprinkle / damp sweeping in lanes & covered construction dust',
    hi: 'गलियों में पानी छिड़ककर सफाई और निर्माण सामग्री को ढककर रखना',
  },
  {
    id: 'trees',
    en: 'Native roadside dust-buffer trees & community leaf composting pit',
    hi: 'सड़क किनारे देसी पेड़ लगाना और सूखे पत्तों के लिए कम्पोस्ट गड्ढा बनाना',
  },
];

const EVENT_CHECKLIST = [
  {
    id: 'ev-1',
    en: 'Schedule outdoor sports/fairs between 1:00 PM and 4:00 PM (lowest winter inversion smog).',
    hi: 'बाहरी खेल या कार्यक्रम दोपहर 1:00 से 4:00 बजे के बीच रखें।',
  },
  {
    id: 'ev-2',
    en: 'Check AQI at 8:00 AM; move children’s events indoors if US AQI > 200.',
    hi: 'सुबह 8 बजे AQI जांचें; AQI 200+ होने पर बच्चों का कार्यक्रम हॉल के अंदर रखें।',
  },
  {
    id: 'ev-3',
    en: 'Ban fireworks, open bonfires, and diesel generator idling near guest seating.',
    hi: 'समारोह में पटाखे, खुले अलाव और डीजल जनरेटर का धुआं बैठने की जगह से दूर रखें।',
  },
  {
    id: 'ev-4',
    en: 'Keep spare N95 masks & clean drinking water at the venue desk.',
    hi: 'प्रवेश डेस्क पर अतिरिक्त N95 मास्क और पीने का साफ पानी रखें।',
  },
];

export const CommunityView: React.FC<CommunityViewProps> = ({ city, aqi, language }) => {
  const [pledges, setPledges] = useState<CommunityPledge[]>([]);
  const [totalHouseholds, setTotalHouseholds] = useState(162);
  const [totalWeeklyCo2Kg, setTotalWeeklyCo2Kg] = useState(2090);
  const [isLoading, setIsLoading] = useState(true);
  const [imgFailed, setImgFailed] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [householdsCount, setHouseholdsCount] = useState(10);
  const [selectedActions, setSelectedActions] = useState<string[]>([
    RWA_ACTIONS[0].en,
    RWA_ACTIONS[1].en,
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checkedChecklist, setCheckedChecklist] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/community/pledges')
      .then((r) => r.json())
      .then((data: { pledges?: CommunityPledge[]; totalHouseholds?: number; totalWeeklyCo2Kg?: number }) => {
        if (!active) return;
        if (Array.isArray(data.pledges)) setPledges(data.pledges);
        if (typeof data.totalHouseholds === 'number') setTotalHouseholds(data.totalHouseholds);
        if (typeof data.totalWeeklyCo2Kg === 'number') setTotalWeeklyCo2Kg(data.totalWeeklyCo2Kg);
      })
      .catch(() => {
        // Keep clean initial community numbers when offline
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const toggleAction = (label: string) => {
    setSelectedActions((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedActions.length === 0 || submitting) return;
    setSubmitting(true);
    setPledgeSuccess(false);

    try {
      const res = await fetch('/api/community/pledges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName: groupName.trim(),
          city,
          households: householdsCount,
          actions: selectedActions,
        }),
      });
      const data = (await res.json()) as {
        pledges?: CommunityPledge[];
        totalHouseholds?: number;
        totalWeeklyCo2Kg?: number;
      };
      if (res.ok && Array.isArray(data.pledges)) {
        setPledges(data.pledges);
        if (typeof data.totalHouseholds === 'number') setTotalHouseholds(data.totalHouseholds);
        if (typeof data.totalWeeklyCo2Kg === 'number') setTotalWeeklyCo2Kg(data.totalWeeklyCo2Kg);
        setGroupName('');
        setPledgeSuccess(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const shareSummaryText =
    language === 'hi'
      ? `हमारे मोहल्ले की स्वच्छ हवा योजना (${city}, वर्तमान AQI ~${aqi}):\n1. खुले में पत्ते/कचरा न जलाएं (चौकीदारों को गर्म जैकेट दें)\n2. सुबह-शाम के बजाय दोपहर 1–4 बजे बाहरी खेल रखें\n3. सप्ताह में 1 दिन कारपूल और गेट पर इंजन बंद\n4. गलियों में पानी छिड़ककर सफाई\n(अनुमान: 100 परिवारों से हर सप्ताह ~1,100+ kg CO2e और भारी धुएं में कमी)`
      : `Neighbourhood CleanAir Action Plan (${city}, Current AQI ~${aqi}):\n• Zero open leaf/trash burning (provide warm coats for night guards)\n• Shift outdoor school/RWA events to 1–4 PM; move indoors if AQI > 200\n• Weekly Carpool Day & zero-idling gate drop-off\n• Damp sweeping in lanes & leaf composting\n(Rough estimate: 100 participating households avoid ~1,100+ kg CO2e/week and cut local PM2.5 spikes.)`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareSummaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback ignored
    }
  };

  return (
    <div className="space-y-6">
      {/* Neighbourhood Hero + Impact Counter */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="lg:col-span-7 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
              {language === 'hi'
                ? 'मोहल्ला, RWA और स्कूल कार्य योजना'
                : 'Neighbourhood & RWA Action Plan'}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'इस एक-पृष्ठ योजना को कॉपी या प्रिंट करके अपने RWA ग्रुप, स्कूल या ऑफिस में साझा करें।'
                : 'A shareable one-page action plan for Resident Welfare Associations, schools, and local offices. Small block-level rules protect everyone’s lungs.'}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? 'संकल्पित परिवार' : 'Pledged households'}
                </div>
                <div className="text-3xl font-bold font-mono tabular-nums text-teal-700 dark:text-teal-400 mt-0.5">
                  {totalHouseholds}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? 'अनुमानित साप्ताहिक CO2 बचत' : 'Est. weekly CO2 avoided'}
                </div>
                <div className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                  ~{totalWeeklyCo2Kg} kg
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'hi'
                    ? 'अनुमान (साझा परिवहन + न जलाने पर आधारित)'
                    : 'Rough estimate from shared transit & no-burning pledges'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5 no-print">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 text-xs font-semibold transition-colors min-h-[42px]"
            >
              {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
              <span>
                {copied
                  ? language === 'hi'
                    ? 'कॉपी हो गया!'
                    : 'Copied summary!'
                  : language === 'hi'
                    ? 'व्हाट्सएप संदेश कॉपी करें'
                    : 'Copy Shareable Plan'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[42px]"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>{language === 'hi' ? 'एक-पृष्ठ प्रिंट करें' : 'Print 1-Page Poster'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-100 dark:bg-slate-800 min-h-[210px]">
          {!imgFailed ? (
            <img
              src={communityNeighborhoodImg}
              alt="Tree-lined neighborhood street with cyclists, pedestrians, and electric tram"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6 text-slate-500">
              <Trees className="w-10 h-10" aria-hidden="true" />
            </div>
          )}
        </div>
      </section>

      {/* Two-Column Action Plan + Pledge Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-5">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'hi'
                ? '4 मुख्य सामुदायिक कदम'
                : '4 Core Neighbourhood Actions'}
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
              {RWA_ACTIONS.map((act, i) => (
                <li
                  key={act.id}
                  className="flex items-start gap-2.5 pb-2.5 border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                >
                  <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400 mt-0.5">
                    0{i + 1}.
                  </span>
                  <span>{language === 'hi' ? act.hi : act.en}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'hi'
                ? 'स्कूल व RWA कार्यक्रम आयोजक चेकलिस्ट'
                : 'Event & School Organiser Checklist'}
            </h2>
            <div className="mt-3 space-y-2">
              {EVENT_CHECKLIST.map((item) => {
                const checked = checkedChecklist.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setCheckedChecklist((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((x) => x !== item.id)
                          : [...prev, item.id]
                      )
                    }
                    className="w-full flex items-start gap-3 text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 min-h-[44px]"
                  >
                    <span
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                        checked
                          ? 'bg-teal-700 border-teal-700 text-white'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {language === 'hi' ? item.hi : item.en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-5">
          <form
            onSubmit={handlePledgeSubmit}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 no-print"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'hi'
                  ? 'अपना परिवार या RWA संकल्प जोड़ें'
                  : 'Log a Household, School, or RWA Pledge'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="pledge-group"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  {language === 'hi' ? 'परिवार / RWA / स्कूल का नाम' : 'Group or family name'}
                </label>
                <input
                  id="pledge-group"
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Green Park Block B RWA"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="pledge-households"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  {language === 'hi' ? 'परिवार संख्या' : 'Households'}
                </label>
                <input
                  id="pledge-households"
                  type="number"
                  min={1}
                  max={2000}
                  value={householdsCount}
                  onChange={(e) => setHouseholdsCount(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full font-mono tabular-nums rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {language === 'hi' ? 'चयनित कदम:' : 'Committed actions:'}
              </div>
              {RWA_ACTIONS.map((act) => {
                const label = act.en;
                const active = selectedActions.includes(label);
                return (
                  <label
                    key={act.id}
                    className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer py-1"
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleAction(label)}
                      className="mt-0.5 w-4 h-4 accent-teal-700"
                    />
                    <span>{language === 'hi' ? act.hi : act.en}</span>
                  </label>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={submitting || !groupName.trim() || selectedActions.length === 0}
              className="w-full rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white py-2.5 text-sm font-semibold transition-colors min-h-[44px]"
            >
              {submitting
                ? language === 'hi'
                  ? 'सहेजा जा रहा है...'
                  : 'Recording pledge...'
                : language === 'hi'
                  ? 'संकल्प दर्ज करें'
                  : 'Add Community Pledge'}
            </button>

            {pledgeSuccess && (
              <p className="text-xs font-medium text-teal-800 dark:text-teal-300">
                {language === 'hi'
                  ? 'धन्यवाद! आपका संकल्प सामुदायिक प्रभाव में जोड़ दिया गया है।'
                  : 'Thank you! Your pledge has been added to the community counter.'}
              </p>
            )}
          </form>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              {language === 'hi' ? 'ताज़ा सामुदायिक संकल्प' : 'Recent Community Pledges'}
            </h3>
            {isLoading ? (
              <p className="text-xs text-slate-500">Loading pledges...</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {pledges.slice(0, 5).map((p) => (
                  <div key={p.id} className="py-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {p.groupName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {p.city} · <span className="font-mono tabular-nums">{p.households}</span>{' '}
                        households · {p.actions.length} actions
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold font-mono tabular-nums text-teal-700 dark:text-teal-400">
                        ~{p.estimatedWeeklyCo2Kg} kg CO2/wk
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
