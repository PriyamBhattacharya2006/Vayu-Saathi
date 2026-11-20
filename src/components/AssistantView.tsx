import React, { useRef, useState } from 'react';
import { AlertCircle, Send, ShieldAlert, Trash2 } from 'lucide-react';
import type { AirQualityData, ChatMessage, Language, UserProfile } from '../types/cleanAir.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';

interface AssistantViewProps {
  profile: UserProfile;
  airQuality: AirQualityData;
  language: Language;
}

const STARTER_PROMPTS = {
  en: [
    'Is it safe for my child to play outside today?',
    'Should I buy a HEPA air purifier on my budget?',
    'Are cloth masks enough for winter smog?',
    'What should we do if someone develops a persistent cough?',
  ],
  hi: [
    'क्या आज मेरे बच्चे का बाहर खेलना सुरक्षित है?',
    'क्या मुझे अपने बजट में HEPA एयर प्यूरीफायर खरीदना चाहिए?',
    'क्या सर्दियों की धुंध में कपड़े का मास्क काफी है?',
    'यदि घर में किसी को लगातार खांसी हो तो क्या करें?',
  ],
};

export const AssistantView: React.FC<AssistantViewProps> = ({
  profile,
  airQuality,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
          profile,
          airQuality,
          language,
        }),
      });

      const data = (await res.json()) as { reply?: string; message?: string; error?: string };

      if (!res.ok || !data.reply) {
        const errorText =
          data.message ||
          (language === 'hi'
            ? 'अभी AI सहायक से संपर्क नहीं हो पा रहा है। कृपया अपना इंटरनेट या API कुंजी जांचें, या "आज" और "घर के उपाय" टैब देखें।'
            : 'Unable to reach the AI assistant right now. Please check your connection or API key configuration, or browse the offline-ready Today and Indoor Hacks tabs.');
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: errorText,
            timestamp: new Date().toISOString(),
            isError: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: data.reply!,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            language === 'hi'
              ? 'नेटवर्क उपलब्ध नहीं है। ऑफ़लाइन मोड में आपकी दैनिक योजना और घर के उपाय बिना इंटरनेट के काम करते हैं।'
              : 'You appear to be offline or the server is unreachable. Your Daily Plan and Indoor Hacks remain fully available offline.',
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
      setTimeout(() => listEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left column: Context & Medical Safety Banner */}
      <aside className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'CleanAir सहायक से पूछें' : 'Ask CleanAir Assistant'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === 'hi'
              ? 'यह सहायक आपके शहर के AQI, परिवार के सदस्यों और बजट के हिसाब से आसान और व्यावहारिक जवाब देता है।'
              : 'Get calm, plain-language answers tailored to your local AQI, household members, home setup, and budget.'}
          </p>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {language === 'hi' ? 'वर्तमान संदर्भ:' : 'Active context:'}
              </span>{' '}
              {airQuality.city} · AQI{' '}
              <span className="font-mono tabular-nums font-semibold">{airQuality.aqi}</span>
            </div>
            <div>
              {profile.adults} {language === 'hi' ? 'वयस्क' : 'adult(s)'}
              {profile.children > 0
                ? `, ${profile.children} ${language === 'hi' ? 'बच्चे' : 'child(ren)'}`
                : ''}
              {profile.elderly > 0
                ? `, ${profile.elderly} ${language === 'hi' ? 'बुजुर्ग' : 'elderly'}`
                : ''}{' '}
              · {profile.budget} {language === 'hi' ? 'बजट' : 'budget'}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 space-y-2 text-xs text-amber-950 dark:text-amber-100">
          <div className="flex items-center gap-2 font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{language === 'hi' ? 'सुरक्षा और चिकित्सा सूचना' : 'Safety & Medical Note'}</span>
          </div>
          <p className="leading-relaxed">{t.medicalDisclaimer}</p>
          <p className="leading-relaxed font-semibold">{t.emergencyNote}</p>
        </div>
      </aside>

      {/* Right column: Chat Window */}
      <section
        aria-label="CleanAir AI chat"
        className="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col min-h-[520px] max-h-[75vh]"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {language === 'hi'
              ? 'सरल भाषा में व्यक्तिगत सुझाव (अनुमान स्पष्ट रूप से चिह्नित)'
              : 'Plain-language tailored guidance · Estimates clearly labelled'}
          </span>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => setMessages([])}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded-lg"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{language === 'hi' ? 'साफ करें' : 'Clear'}</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-4 py-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {language === 'hi'
                  ? 'शुरू करने के लिए नीचे से एक प्रश्न चुनें या अपना सवाल लिखें:'
                  : 'Try a common question or type your own below:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STARTER_PROMPTS[language].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-teal-600 dark:hover:border-teal-500 p-3.5 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors min-h-[48px]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-teal-700 text-white'
                      : msg.isError
                        ? 'bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {msg.isError && (
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{language === 'hi' ? 'सूचना' : 'Notice'}</span>
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {isSending && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                {language === 'hi'
                  ? 'आपके परिवार और AQI के अनुसार जवाब तैयार हो रहा है...'
                  : 'Preparing practical steps for your household...'}
              </div>
            </div>
          )}
          <div ref={listEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <label htmlFor="assistant-input" className="sr-only">
            Ask CleanAir Assistant
          </label>
          <input
            id="assistant-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'मास्क, प्यूरीफायर, बाहर खेलने या खांसी के बारे में पूछें...'
                : 'Ask about outdoor play, masks, cooking, purifiers...'
            }
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-2 focus:outline-teal-600 min-h-[44px]"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white px-4 py-2.5 text-sm font-semibold transition-colors min-h-[44px] shrink-0"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>{language === 'hi' ? 'भेजें' : 'Send'}</span>
          </button>
        </form>
      </section>
    </div>
  );
};
