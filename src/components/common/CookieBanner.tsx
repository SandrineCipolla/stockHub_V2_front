import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

const CONSENT_KEY = 'stockhub_consent';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(() => !localStorage.getItem(CONSENT_KEY));
  const { theme } = useTheme();

  if (!visible) return null;

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const handleRefuse = () => {
    localStorage.setItem(CONSENT_KEY, 'refused');
    setVisible(false);
  };

  const bgClass = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const textClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const mutedClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const linkClass =
    theme === 'dark'
      ? 'underline text-purple-400 hover:text-purple-300'
      : 'underline text-purple-600 hover:text-purple-800';

  return (
    <div
      role="dialog"
      aria-label="Bandeau de consentement aux cookies"
      aria-modal="false"
      className={`fixed bottom-0 left-0 right-0 z-50 border-t ${bgClass} px-6 py-4 shadow-lg`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className={`text-sm ${textClass}`}>
          Cette application utilise <strong>Azure Application Insights</strong> pour mesurer les
          performances (données anonymisées, aucun cookie tiers).{' '}
          <Link to="/privacy" className={linkClass}>
            En savoir plus
          </Link>
          <span className={`ml-1 ${mutedClass}`}>
            — Vous pouvez refuser sans impact sur l'utilisation.
          </span>
        </p>

        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleRefuse}
            className={`rounded px-4 py-2 text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              theme === 'dark'
                ? 'border-slate-600 text-gray-300 hover:bg-slate-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Refuser
          </button>
          <button
            onClick={handleAccept}
            className="rounded px-4 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};
