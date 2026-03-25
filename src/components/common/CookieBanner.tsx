import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { ButtonWrapper } from '@/components/common/ButtonWrapper';

const CONSENT_KEY = 'stockhub_consent';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(CONSENT_KEY));
  const { theme } = useTheme();

  if (!visible) return null;

  const handleAccept = () => {
    sessionStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const handleRefuse = () => {
    sessionStorage.setItem(CONSENT_KEY, 'refused');
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
          <ButtonWrapper variant="ghost" size="sm" onClick={handleRefuse}>
            Refuser
          </ButtonWrapper>
          <ButtonWrapper variant="primary" size="sm" onClick={handleAccept}>
            Accepter
          </ButtonWrapper>
        </div>
      </div>
    </div>
  );
};
