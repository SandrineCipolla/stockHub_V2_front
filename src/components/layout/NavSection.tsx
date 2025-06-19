"use client"

import { Home, ChevronRight, Plus, BarChart3, Search } from "lucide-react"
import { Button } from "@/components/common/Button"
import { useTheme } from "@/hooks/useTheme"
import { getThemeClasses } from "@/utils/theme"

export function NavigationSection() {
    const { theme } = useTheme()
    const themeClasses = getThemeClasses(theme)

    return (
        <section className={themeClasses.navSection}>
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <nav className={`flex items-center gap-2 text-sm mb-6 ${themeClasses.text}`} aria-label="Fil d'Ariane">
                    <Home className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4 opacity-50" />
                    <span className="font-medium">Dashboard</span>
                </nav>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h1 className={`text-3xl font-bold mb-2 ${themeClasses.text}`}>Tableau de Bord</h1>
                        <p className={themeClasses.textMuted}>Bienvenue dans votre espace de gestion de stocks intelligent</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button variant="primary" icon={Plus}>
                            Ajouter un Stock
                        </Button>
                        <Button variant="secondary" icon={BarChart3}>
                            Rapport Détaillé
                        </Button>
                        <Button variant="secondary" icon={Search}>
                            Recherche Avancée
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
