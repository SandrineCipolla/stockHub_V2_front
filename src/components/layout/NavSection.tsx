import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme.ts';
import type { NavSectionProps } from '@/types';

export const NavSection: React.FC<NavSectionProps> = ({
  children,
  breadcrumbs = [
    { icon: Home, href: '/', label: 'Accueil' },
    { label: 'Dashboard', current: true },
  ],
  className = '',
}) => {
  const { theme } = useTheme();

  const themeClasses = {
    navSection:
      theme === 'dark'
        ? 'bg-gradient-to-r from-purple-900/30 to-purple-800/20'
        : 'bg-gradient-to-r from-purple-100/80 to-purple-50',
  };

  return (
    <section className={`${themeClasses.navSection} ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb conforme RGAA */}
        <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Fil d'Ariane">
          <ol className="flex items-center gap-2">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <li className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4" aria-hidden="true" />}
                  {item.href && !item.current ? (
                    <a
                      href={item.href}
                      className="hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      className={item.current ? 'font-medium' : ''}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
                {index < breadcrumbs.length - 1 && (
                  <li aria-hidden="true">
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </li>
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>

        {children}
      </div>
    </section>
  );
};
