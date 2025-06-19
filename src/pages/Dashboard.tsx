// "use client"
//
// import { useState, useEffect } from "react"
// import { Search, Download } from "lucide-react"
//
// import type { Stock, MetricData } from "@/types"
// import {Header} from "@/components/layout/Header.tsx";
// import { NavigationSection } from "@/components/layout/NavSection";
// import {MetricsCard} from "@/components/dashboard/MetricCard.tsx";
// import {Input} from "@/components/common/Input.tsx";
// import {Button} from "@/components/common/Button.tsx";
// import {StockGrid} from "@/components/dashboard/StockGrid.tsx";
// import {Footer} from "@/components/layout/Footer.tsx";
// import { useTheme } from "@/hooks/useTheme";
// import {getThemeClasses} from "@/utils/theme.ts";
//
// const mockStocks: Stock[] = [
//     {
//         id: 1,
//         name: "MyFirstStock",
//         quantity: 156,
//         value: 2450,
//         status: "optimal",
//         lastUpdate: "2h",
//     },
//     {
//         id: 2,
//         name: "MonTest",
//         quantity: 89,
//         value: 1780,
//         status: "optimal",
//         lastUpdate: "1h",
//     },
//     {
//         id: 3,
//         name: "StockVide",
//         quantity: 3,
//         value: 150,
//         status: "low",
//         lastUpdate: "30min",
//     },
//     {
//         id: 4,
//         name: "Stock Critique",
//         quantity: 0,
//         value: 0,
//         status: "critical",
//         lastUpdate: "5min",
//     },
// ]
//
// const mockMetrics: MetricData[] = [
//     {
//         id: "total-products",
//         label: "Total Produits",
//         value: 248,
//         change: 8,
//         changeType: "increase",
//         icon: "package",
//         color: "success",
//     },
//     {
//         id: "low-stock",
//         label: "Stock Faible",
//         value: 12,
//         change: -3,
//         changeType: "decrease",
//         icon: "alert-triangle",
//         color: "warning",
//     },
//     {
//         id: "growth",
//         label: "Ce mois",
//         value: "+15%",
//         change: 2,
//         changeType: "increase",
//         icon: "trending-up",
//         color: "info",
//     },
// ]
//
// export function Dashboard() {
//     const { theme } = useTheme();
//     const themeClasses = getThemeClasses(theme);
//     const [searchTerm, setSearchTerm] = useState("")
//     const [isLoaded, setIsLoaded] = useState(false)
//
//     useEffect(() => {
//         setIsLoaded(true)
//     }, [])
//
//     return (
//         <div className={`min-h-screen ${themeClasses.background}`}>
//             <Header />
//             <NavigationSection />
//
//             <main className="max-w-7xl mx-auto px-6 py-8" role="main">
//                 {/* Métriques principales */}
//                 <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     {mockMetrics.map((metric) => (
//                         <MetricsCard key={metric.id} metric={metric} />
//                     ))}
//                 </section>
//
//                 {/* Recherche */}
//                 <section className="mb-8">
//                     <div className="max-w-md">
//                         <Input
//                             type="text"
//                             placeholder="Rechercher un produit..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             icon={Search}
//                             aria-label="Rechercher un produit par nom ou reference"
//                         />
//                     </div>
//                 </section>
//
//                 {/* Section titre stocks */}
//                 <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-2xl font-bold text-white">Mes Stocks Récents</h2>
//                     <Button variant="ghost" icon={Download} aria-label="Télécharger">
//                         Exporter
//                     </Button>
//                 </div>
//
//                 {/* Grid des stocks */}
//                 <StockGrid stocks={mockStocks} isLoaded={isLoaded} />
//             </main>
//
//             <Footer />
//         </div>
//     )
// }
// ÉTAPE 2 : Remplace le contenu de src/pages/Dashboard.tsx par :

"use client"

import { useState, useEffect, useRef } from "react"  // ✅ AJOUTÉ useRef
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

// ✅ NOUVEAU : Component Skip Links
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

    // ✅ NOUVEAU : Référence pour la recherche
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    // ✅ NOUVEAU : Raccourci global Ctrl+K pour recherche
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    // ✅ NOUVEAU : Gestionnaire pour la recherche
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch(e.key) {
            case 'Escape':
                setSearchTerm('');
                e.currentTarget.blur();
                break;
            case 'Enter':
                e.preventDefault();
                console.log('🔍 Recherche pour:', searchTerm);
                // Ici tu ajouteras ta logique de recherche
                break;
        }
    };

    return (
        <div className={`min-h-screen ${themeClasses.background}`}>
            {/* ✅ NOUVEAU : Skip Links */}
            <SkipLinks />

            <Header />
            <NavigationSection />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8" role="main" id="main-content">

            {/* Métriques principales */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {mockMetrics.map((metric) => (
                        <MetricsCard key={metric.id} metric={metric} />
                    ))}
                </section>

                {/* ✅ AMÉLIORÉ : Recherche avec raccourcis clavier */}
                <section className="mb-8">
                    <div className="max-w-md">
                        <Input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Rechercher un produit... (Ctrl+K)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            icon={Search}
                            aria-label="Rechercher un produit par nom ou référence. Utilisez Ctrl+K pour accéder rapidement, Échap pour effacer"
                        />
                    </div>
                </section>

                {/* Section titre stocks */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Mes Stocks Récents</h2>
                    <Button
                        variant="ghost"
                        icon={Download}
                        aria-label="Exporter la liste des stocks récents au format CSV"
                        onClick={() => console.log('Export CSV')}
                    >
                        Exporter
                    </Button>

                </div>

                {/* ✅ AMÉLIORÉ : Grid des stocks avec ID pour skip link */}
                <StockGrid
                    stocks={mockStocks}
                    isLoaded={isLoaded}
                    id="stock-list"
                />
            </main>

            <Footer />
        </div>
    )
}
