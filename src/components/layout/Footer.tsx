"use client"

import { useTheme } from "@/hooks/useTheme"
import { getThemeClasses } from "@/utils/theme"

export function Footer() {
    const { theme } = useTheme()
    const themeClasses = getThemeClasses(theme)

    return (
        <footer className={`mt-16 border-t py-8 ${themeClasses.footer}`} role="contentinfo">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center">
                    <p className={`text-sm mb-4 ${themeClasses.textSubtle}`}>STOCK HUB - ALL RIGHTS RESERVED ©</p>
                    <nav className="flex flex-wrap justify-center gap-6 text-sm" aria-label="Liens légaux">
                        <a
                            href="#"
                            className={`${themeClasses.textSubtle} hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded`}
                            aria-label="Consulter les mentions légales"
                        >
                            Mentions Légales
                        </a>
                        <a
                            href="#"
                            className={`${themeClasses.textSubtle} hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded`}
                            aria-label="Consulter la politique de Confidentialité"
                        >
                            Politique de Confidentialité
                        </a>
                        <a
                            href="#"
                            className={`${themeClasses.textSubtle} hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded`}
                            aria-label="Consulter les CGU"
                        >
                            CGU
                        </a>
                        <a
                            href="#"
                            className={`${themeClasses.textSubtle} hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded`}
                            aria-label="Consulter la politique de Cookies"
                        >
                            Politique de Cookies
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    )
}
