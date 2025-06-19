// HEADER.TSX RESPONSIVE MOBILE FIRST - Remplace le contenu de src/components/layout/Header.tsx par :

"use client"

import { useState } from "react"
import { Bell, Sun, Moon, User } from "lucide-react"
import { Button } from "@/components/common/Button"
import { useTheme } from "@/hooks/useTheme"
import { getThemeClasses } from "@/utils/theme"

export function Header() {
    const { theme, toggleTheme } = useTheme()
    const themeClasses = getThemeClasses(theme)

    const [themeChangeAnnouncement, setThemeChangeAnnouncement] = useState('')

    const handleThemeChange = () => {
        toggleTheme();
        const newTheme = theme === "dark" ? "light" : "dark";
        setThemeChangeAnnouncement(`Thème changé vers ${newTheme === 'dark' ? 'sombre' : 'clair'}`);

        setTimeout(() => setThemeChangeAnnouncement(''), 3000);
    };

    const handleLogoClick = () => {
        console.log('🏠 Retour à l\'accueil');
    };

    return (
        <header className={`sticky top-0 z-50 ${themeClasses.header} backdrop-blur-xl border-b`} role="banner">
            {/* ✅ RESPONSIVE : Padding adaptatif mobile first */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">

                    {/* ✅ RESPONSIVE : Logo adaptatif */}
                    <button
                        onClick={handleLogoClick}
                        onKeyDown={(e) => {
                            if (['Enter', ' '].includes(e.key)) {
                                e.preventDefault();
                                handleLogoClick();
                            }
                        }}
                        className="flex items-center gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-1 transition-colors hover:bg-white/5"
                        aria-label="Retourner à la page d'accueil de StockHub"
                    >
                        {/* ✅ Logo responsive */}
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                            <span className="text-sm sm:text-base">SH</span>
                        </div>
                        {/* ✅ Titre responsive */}
                        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                            StockHub
                        </h1>
                    </button>

                    {/* ✅ RESPONSIVE : Actions utilisateur Mobile First */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* ✅ Notifications avec taille responsive */}
                        <button
                            className={`
                                relative p-1.5 sm:p-2 rounded-lg transition-colors
                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                                ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}
                            `}
                            aria-label="Voir les notifications (3 nouvelles notifications)"
                            onKeyDown={(e) => {
                                if (['Enter', ' '].includes(e.key)) {
                                    e.preventDefault();
                                    console.log('🔔 Ouverture notifications');
                                }
                            }}
                        >
                            <Bell className={`w-4 h-4 sm:w-5 sm:h-5 ${themeClasses.text}`} aria-hidden="true" />
                            <span
                                className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                                aria-label="3 notifications non lues"
                            >
                                3
                            </span>
                        </button>

                        {/* ✅ Bouton thème responsive */}
                        <button
                            onClick={handleThemeChange}
                            onKeyDown={(e) => {
                                if (['Enter', ' '].includes(e.key)) {
                                    e.preventDefault();
                                    handleThemeChange();
                                }
                            }}
                            className={`
                                p-1.5 sm:p-2 rounded-lg transition-colors
                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                                ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}
                            `}
                            aria-label={`Basculer vers le thème ${theme === "dark" ? "clair" : "sombre"}`}
                        >
                            {theme === "dark" ? (
                                <Sun className={`w-4 h-4 sm:w-5 sm:h-5 ${themeClasses.text}`} aria-hidden="true" />
                            ) : (
                                <Moon className={`w-4 h-4 sm:w-5 sm:h-5 ${themeClasses.text}`} aria-hidden="true" />
                            )}

                            {themeChangeAnnouncement && (
                                <span className="sr-only" aria-live="polite">
                                    {themeChangeAnnouncement}
                                </span>
                            )}
                        </button>

                        {/* ✅ RESPONSIVE : Utilisateur adaptatif Mobile First */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* ✅ NOUVEAU : Nom caché sur mobile, visible sur sm+ */}
                            <span className={`hidden sm:block text-sm ${themeClasses.textMuted}`}>
                                Sandrine Cipolla
                            </span>

                            {/* ✅ NOUVEAU : Bouton logout responsive */}
                            <Button
                                variant="primary"
                                size="sm"
                                icon={User}
                                className="px-2 sm:px-3"  // Padding adaptatif
                                aria-label="Se déconnecter de l'application StockHub"
                            >
                                {/* ✅ Texte adaptatif : icône seule sur mobile, texte sur desktop */}
                                <span className="sm:hidden" aria-hidden="true">👤</span>
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}