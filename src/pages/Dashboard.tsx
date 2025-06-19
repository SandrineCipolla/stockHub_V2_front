"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Download } from "lucide-react"

import type { Stock, MetricData } from "@/types"
import {Header} from "@/components/layout/Header.tsx";
import { NavigationSection } from "@/components/layout/NavSection";
import {MetricsCard} from "@/components/dashboard/MetricCard.tsx";
import {Input} from "@/components/common/Input.tsx";
import {Button} from "@/components/common/Button.tsx";
import {StockGrid} from "@/components/dashboard/StockGrid.tsx";
import {Footer} from "@/components/layout/Footer.tsx";
import { useTheme } from "@/hooks/useTheme";
import {getThemeClasses} from "@/utils/theme.ts";

const mockStocks: Stock[] = [
    {
        id: 1,
        name: "MyFirstStock",
        quantity: 156,
        value: 2450,
        status: "optimal",
        lastUpdate: "2h",
    },
    {
        id: 2,
        name: "MonTest",
        quantity: 89,
        value: 1780,
        status: "optimal",
        lastUpdate: "1h",
    },
    {
        id: 3,
        name: "StockVide",
        quantity: 3,
        value: 150,
        status: "low",
        lastUpdate: "30min",
    },
    {
        id: 4,
        name: "Stock Critique",
        quantity: 0,
        value: 0,
        status: "critical",
        lastUpdate: "5min",
    },
]

const mockMetrics: MetricData[] = [
    {
        id: "total-products",
        label: "Total Produits",
        value: 248,
        change: 8,
        changeType: "increase",
        icon: "package",
        color: "success",
    },
    {
        id: "low-stock",
        label: "Stock Faible",
        value: 12,
        change: -3,
        changeType: "decrease",
        icon: "alert-triangle",
        color: "warning",
    },
    {
        id: "growth",
        label: "Ce mois",
        value: "+15%",
        change: 2,
        changeType: "increase",
        icon: "trending-up",
        color: "info",
    },
]

// ✅ Skip Links améliorés
const SkipLinks = () => (
    <div className="sr-only focus-within:not-sr-only">
        <a
            href="#main-content"
            className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
            Aller au contenu principal
        </a>
        <a
            href="#stock-list"
            className="absolute top-4 left-48 bg-purple-600 text-white px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
            Aller à la liste des stocks
        </a>
    </div>
);

export function Dashboard() {
    const { theme } = useTheme();
    const themeClasses = getThemeClasses(theme);
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoaded, setIsLoaded] = useState(false)
    // 🔴 AJOUT : État pour les notifications accessibles
    const [notification, setNotification] = useState("")

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsLoaded(true)
        // 🔴 AJOUT : Annoncer le chargement
        setNotification("Tableau de bord chargé, 248 produits disponibles")
        setTimeout(() => setNotification(""), 3000)
    }, [])

    // Raccourci global Ctrl+K pour recherche
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
                setNotification("Focus placé sur la recherche")
                setTimeout(() => setNotification(""), 2000)
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    // 🔴 AMÉLIORÉ : Gestionnaire pour la recherche avec notifications
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch(e.key) {
            case 'Escape':
                setSearchTerm('');
                e.currentTarget.blur();
                setNotification("Recherche effacée")
                setTimeout(() => setNotification(""), 2000)
                break;
            case 'Enter':
                e.preventDefault();
                const resultCount = mockStocks.filter(stock =>
                    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).length;
                setNotification(`${resultCount} résultats trouvés pour "${searchTerm}"`)
                setTimeout(() => setNotification(""), 3000)
                break;
        }
    };

    // 🔴 AMÉLIORÉ : Gestionnaire de changement de recherche
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 2) {
            const resultCount = mockStocks.filter(stock =>
                stock.name.toLowerCase().includes(e.target.value.toLowerCase())
            ).length;
            setNotification(`${resultCount} résultats en temps réel`)
            setTimeout(() => setNotification(""), 1500)
        }
    };

    return (
        <div className={`min-h-screen ${themeClasses.background}`}>
            {/* 🔴 AJOUT : Titre principal de page caché mais présent pour les lecteurs d'écran */}
            <h1 className="sr-only">StockHub - Tableau de bord de gestion des stocks</h1>

            <SkipLinks />
            <Header />
            <NavigationSection />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8" id="main-content">
                {/* 🔴 AMÉLIORÉ : Section métriques avec titre et description */}
                <section aria-labelledby="metrics-heading" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <h2 id="metrics-heading" className="sr-only">Indicateurs clés de performance</h2>
                    {mockMetrics.map((metric) => (
                        <MetricsCard key={metric.id} metric={metric} />
                    ))}
                </section>

                {/* 🔴 AMÉLIORÉ : Section recherche avec titre et aide contextuelle */}
                <section aria-labelledby="search-heading" className="mb-8">
                    <h2 id="search-heading" className="sr-only">Recherche dans l'inventaire</h2>
                    <div className="max-w-md">
                        <label htmlFor="product-search" className="sr-only">
                            Rechercher un produit par nom ou référence
                        </label>
                        <Input
                            id="product-search"
                            ref={searchInputRef}
                            type="text"
                            placeholder="Rechercher un produit... (Ctrl+K)"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                            icon={Search}
                            aria-label="Rechercher un produit par nom ou référence. Utilisez Ctrl+K pour accéder rapidement, Échap pour effacer, Entrée pour valider"
                            aria-describedby="search-help"
                        />
                        <div id="search-help" className="sr-only">
                            Tapez au moins 3 caractères pour voir les résultats en temps réel.
                            Utilisez les flèches pour naviguer dans les résultats.
                        </div>
                    </div>
                </section>

                {/* 🔴 AMÉLIORÉ : Section titre stocks avec structure sémantique */}
                <section aria-labelledby="stocks-heading">
                    <div className="flex items-center justify-between mb-6">
                        <h2 id="stocks-heading" className="text-2xl font-bold text-white">
                            Mes Stocks Récents
                        </h2>
                        <Button
                            variant="ghost"
                            icon={Download}
                            aria-label="Exporter la liste des stocks récents au format CSV"
                            aria-describedby="export-help"
                            onClick={() => {
                                console.log('Export CSV')
                                setNotification("Export des stocks en cours...")
                                setTimeout(() => setNotification("Export terminé"), 2000)
                            }}
                        >
                            Exporter
                        </Button>
                        <div id="export-help" className="sr-only">
                            Télécharge un fichier CSV contenant tous les stocks affichés
                        </div>
                    </div>

                    {/* 🔴 AMÉLIORÉ : Grid des stocks avec compteur et filtrage */}
                    <div aria-live="polite" aria-label={`${mockStocks.filter(stock =>
                        searchTerm.length < 3 || stock.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length} stocks affichés sur ${mockStocks.length} au total`}>
                        <StockGrid
                            stocks={mockStocks.filter(stock =>
                                searchTerm.length < 3 || stock.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )}
                            isLoaded={isLoaded}
                            id="stock-list"
                        />
                    </div>
                </section>
            </main>

            <Footer />

            {/* 🔴 AJOUT OBLIGATOIRE : Live regions pour les annonces */}
            <div
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
                id="status-announcements"
            >
                {notification}
            </div>

            {/* 🔴 AJOUT : Zone pour les erreurs critiques */}
            <div
                aria-live="assertive"
                aria-atomic="true"
                className="sr-only"
                id="error-announcements"
            >
                {/* Les erreurs critiques seront annoncées ici */}
            </div>
        </div>
    )
}