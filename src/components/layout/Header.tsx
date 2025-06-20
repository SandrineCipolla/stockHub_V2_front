import React from 'react';
import {Bell, Moon, Sun, User} from 'lucide-react';
import {Button} from '@/components/common/Button';
import {useTheme} from '@/hooks/useTheme.ts';

// Types pour les props du composant
interface HeaderProps {
    className?: string;
    userName?: string;
    notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
                                                  className = '',
                                                  userName = 'Sandrine Cipolla',
                                                  notificationCount = 3
                                              }) => {
    const { theme, toggleTheme } = useTheme();

    const themeClasses = {
        header: theme === 'dark'
            ? 'bg-slate-900/90 border-white/10'
            : 'bg-white/95 border-gray-200',
        textMuted: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    };

    return (
        <header
            className={`sticky top-0 z-50 ${themeClasses.header} backdrop-blur-xl border-b ${className}`}
            role="banner"
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo avec rôle et aria-label pour accessibilité */}
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                            aria-label="Logo StockHub"
                        >
                            SH
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                            StockHub
                        </h1>
                    </div>

                    {/* Actions utilisateur avec navigation accessible */}
                    <nav
                        className="flex items-center gap-4"
                        role="navigation"
                        aria-label="Actions utilisateur"
                    >
                        <button
                            className={`relative p-2 rounded-lg transition-colors ${
                                theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            aria-label={`Notifications (${notificationCount} non lues)`}
                            aria-describedby="notifications-count"
                        >
                            <Bell className="w-5 h-5" aria-hidden="true" />
                            {notificationCount > 0 && (
                                <span
                                    id="notifications-count"
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                                    aria-label={`${notificationCount} notifications non lues`}
                                >
                  {notificationCount}
                </span>
                            )}
                        </button>

                        <Button
                            variant="ghost"
                            size="sm"
                            icon={theme === 'dark' ? Sun : Moon}
                            onClick={toggleTheme}
                            aria-label={`Changer vers le thème ${theme === 'dark' ? 'clair' : 'sombre'}`}
                        />

                        <div className="flex items-center gap-3">
              <span
                  className={`text-sm ${themeClasses.textMuted}`}
                  aria-label="Utilisateur connecté"
              >
                {userName}
              </span>
                            <Button variant="primary" size="sm" icon={User}>
                                Logout
                            </Button>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};