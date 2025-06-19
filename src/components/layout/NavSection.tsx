// NAVIGATIONSECTION.TSX AVEC HOME NAVIGABLE - Remplace le contenu de src/components/layout/NavigationSection.tsx par :

"use client"

import { Home, ChevronRight, Plus, BarChart3, Search } from "lucide-react"
import { Button } from "@/components/common/Button"
import { useTheme } from "@/hooks/useTheme"
import { getThemeClasses } from "@/utils/theme"

export function NavigationSection() {
    const { theme } = useTheme()
    const themeClasses = getThemeClasses(theme)

    // ✅ NOUVEAU : Gestionnaire pour icône Home
    const handleHomeClick = () => {
        console.log('🏠 Navigation vers accueil');
        // Ici tu ajouteras ta logique de navigation vers l'accueil
        // Exemple : router.push('/')
    };

    return (
        <section className={themeClasses.navSection}>
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* ✅ AMÉLIORÉ : Breadcrumb avec Home navigable */}
                <nav
                    className={`flex items-center gap-2 text-sm mb-6 ${themeClasses.text}`}
                    aria-label="Fil d'Ariane"
                    role="navigation"
                >
                    <button
                        onClick={handleHomeClick}
                        onKeyDown={(e) => {
                            if (['Enter', ' '].includes(e.key)) {
                                e.preventDefault();
                                handleHomeClick();
                            }
                        }}
                        className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors hover:bg-white/10"
                        aria-label="Retourner à la page d'accueil"
                    >
                        <Home className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 opacity-50" aria-hidden="true" />
                    <span className="font-medium">Dashboard</span>
                </nav>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h2 className={`text-3xl font-bold mb-2 ${themeClasses.text}`}>
                            Tableau de Bord
                        </h2>
                        <p className={themeClasses.textMuted}>
                            Bienvenue dans votre espace de gestion de stocks intelligent
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="primary"
                            icon={Plus}
                            aria-label="Ajouter un nouveau stock à l'inventaire"
                            onClick={() => console.log('➕ Ajouter stock')}
                        >
                            Ajouter un Stock
                        </Button>
                        <Button
                            variant="secondary"
                            icon={BarChart3}
                            aria-label="Générer et télécharger un rapport détaillé des stocks"
                            onClick={() => console.log('📊 Rapport détaillé')}
                        >
                            Rapport Détaillé
                        </Button>
                        <Button
                            variant="secondary"
                            icon={Search}
                            aria-label="Ouvrir la page de recherche avancée de stocks"
                            onClick={() => console.log('🔍 Recherche avancée')}
                        >
                            Recherche Avancée
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}