import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';
import type { Language } from '../types/cleanAir.ts';

export const OfflineIndicator: React.FC<{ language: Language }> = ({ language }) => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 md:bottom-4 left-4 z-40 flex items-center gap-2 rounded-xl bg-amber-700 text-white px-3.5 py-2 text-xs font-semibold shadow-lg"
    >
      <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>
        {language === 'hi'
          ? 'ऑफ़लाइन मोड — सहेजी गई अंतिम योजना दिखाई जा रही है।'
          : 'Offline mode — showing your saved daily plan.'}
      </span>
    </div>
  );
};
