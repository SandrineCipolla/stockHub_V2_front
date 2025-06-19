"use client"

import { Bell, Sun, Moon, User } from "lucide-react"
import { Button } from "@/components/common/Button"
import { useTheme } from "@/hooks/useTheme"
import { getThemeClasses } from "@/utils/theme"

export function Header() {
    const { theme, toggleTheme } = useTheme()
    const themeClasses = getThemeClasses(theme)

    return (
        <header className={`sticky top-0 z-50 ${themeClasses.header} backdrop-blur-xl border-b`} role="banner">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                            SH
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                            StockHub
                        </h1>
                    </div>

                    {/* Actions utilisateur */}
                    <div className="flex items-center gap-4">
                        <button
                            className={`relative p-2 rounded-lg transition-colors ${
                                theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"
                            }`}
                            aria-label="Voir les notifications"
                        >
                            <Bell className={`w-5 h-5 ${themeClasses.text}`} />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                                  aria-label="Nombre de notifications non lues"
                            >

                3
              </span>
                        </button>

                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-colors ${
                                theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"
                            }`}
                            aria-label="Changer le thème"
                        >
                            {theme === "dark" ? <Sun className={`w-5 h-5 ${themeClasses.text}`} /> : <Moon className={`w-5 h-5 ${themeClasses.text}`} />}
                        </button>

                        <div className="flex items-center gap-3">
                            <span className={`text-sm ${themeClasses.textMuted}`}>Sandrine Cipolla</span>
                            <Button variant="primary" size="sm" icon={User} aria-label="Se déconnecter de l'application">
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
