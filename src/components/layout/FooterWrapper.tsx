import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

export const FooterWrapper: React.FC = () => {
  const { theme } = useTheme();

  const textClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const bgClass = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50';
  const linkClass =
    theme === 'dark'
      ? 'underline text-gray-400 hover:text-gray-200'
      : 'underline text-gray-500 hover:text-gray-700';

  return (
    <>
      {React.createElement('sh-footer', {
        'app-name': 'STOCK HUB',
        year: '2025',
        'data-theme': theme,
      })}
      <div className={`${bgClass} ${textClass} px-6 py-3 text-center text-xs`}>
        <span>Aucun cookie tiers.</span>
        {' · '}
        <Link to="/privacy" className={linkClass}>
          Politique de confidentialité
        </Link>
      </div>
    </>
  );
};
