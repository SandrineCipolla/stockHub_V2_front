import React from 'react';
import {Bell, Moon, Sun, User} from 'lucide-react';
import {Button} from '@/components/common/Button';
import {useTheme} from '@/hooks/useTheme.ts';
import type {HeaderProps} from '@/types';

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
    const handleNotifications = () => {
        console.log('🔔 Clic notifications - ici tu ouvriras le panneau notifications');

    };

    return (
        <header
            className={`sticky top-0 z-50 ${themeClasses.header} backdrop-blur-xl border-b ${className}`}
            role="banner"
        >
            {/* Container responsive avec padding adaptatif */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between gap-2">

                    {/* Logo avec tailles responsives */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <div
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                            aria-label="Logo StockHub"
                        >
                            <span className="text-sm sm:text-base">SH</span>
                        </div>
                        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                            StockHub
                        </h1>
                    </div>

                    {/* Actions utilisateur avec navigation accessible et responsive */}
                    <nav
                        className="flex items-center gap-1 sm:gap-4"
                        role="navigation"
                        aria-label="Actions utilisateur"
                    >
                        {/* Notifications - masqué sur très petits écrans */}
                        <button
                            onClick={handleNotifications}
                            className={`
                                relative p-1.5 sm:p-2 rounded-lg transition-colorsMore actions
                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                                ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}
                            `}
                            aria-label={`Notifications (${notificationCount} non lues)`}
                            aria-describedby="notifications-count"
                            onKeyDown={(e) => {
                                if (['Enter', ' '].includes(e.key)) {
                                    e.preventDefault();
                                    handleNotifications();
                                }
                            }}
                        >
                            <Bell className={`w-4 h-4 sm:w-5 sm:h-5 ${themeClasses.textMuted}`} aria-hidden="true" />
                                <span
                                    className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                                    aria-label={`${notificationCount} notifications non lues`}
                                >
                                    <span className="text-xs">{notificationCount}</span>
                                </span>

                        </button>

                        {/* Toggle thème avec taille responsive */}
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={theme === 'dark' ? Sun : Moon}
                            onClick={toggleTheme}
                            aria-label={`Changer vers le thème ${theme === 'dark' ? 'clair' : 'sombre'}`}
                            className="p-1.5 sm:p-2"
                        />

                        {/* Section utilisateur avec adaptations mobile/desktop */}
                        <div className="flex items-center gap-1 sm:gap-3">
                            {/* Nom utilisateur - masqué sur mobile et tablette */}
                            <span className={`hidden sm:block text-sm ${themeClasses.textMuted}`}
                                aria-label="Utilisateur connecté"
                                title={userName}
                            >
                                {userName}
                            </span>

                            {/* Bouton Logout avec versions responsive */}

                            <Button
                                variant="primary"
                                size="sm"
                                icon={User}
                                className="px-2 sm:px-3"
                                aria-label="Se déconnecter de l'application StockHub"
                            >

                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};