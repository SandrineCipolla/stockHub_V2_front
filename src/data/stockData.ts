import { Stock } from '@/types';

// Données de stock mockées
export const stockData: Stock[] = [
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
];

// Statistiques métrique
export const metricsData = [
    {
        id: 1,
        title: "Total Produits",
        value: "248",
        change: "+8",
        isPositive: true,
        iconType: "success" as const,
        icon: "Package"
    },
    {
        id: 2,
        title: "Stock Faible",
        value: "12",
        change: "-3",
        isPositive: false,
        iconType: "warning" as const,
        icon: "AlertTriangle"
    },
    {
        id: 3,
        title: "Ce mois",
        value: "+15%",
        change: "+2%",
        isPositive: true,
        iconType: "info" as const,
        icon: "TrendingUp"
    }
];