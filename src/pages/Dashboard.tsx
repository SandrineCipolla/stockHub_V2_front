"use client"

import { useState, useEffect } from "react"
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

export function Dashboard() {
    const { theme } = useTheme();
    const themeClasses = getThemeClasses(theme);
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <div className={`min-h-screen ${themeClasses.background}`}>
            <Header />
            <NavigationSection />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Métriques principales */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {mockMetrics.map((metric) => (
                        <MetricsCard key={metric.id} metric={metric} />
                    ))}
                </section>

                {/* Recherche */}
                <section className="mb-8">
                    <div className="max-w-md">
                        <Input
                            type="text"
                            placeholder="Rechercher un produit..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={Search}
                        />
                    </div>
                </section>

                {/* Section titre stocks */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Mes Stocks Récents</h2>
                    <Button variant="ghost" icon={Download}>
                        Exporter
                    </Button>
                </div>

                {/* Grid des stocks */}
                <StockGrid stocks={mockStocks} isLoaded={isLoaded} />
            </main>

            <Footer />
        </div>
    )
}
