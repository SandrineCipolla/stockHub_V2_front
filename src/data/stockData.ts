import {CRITICAL, LOW, OPTIMAL, OVERSTOCKED, Stock} from '@/types';

// Données de stock mockées
export const stockData: Stock[] = [
    {
        id: 1,
        name: "MyFirstStock",
        quantity: 156,
        value: 2450,
        status: OPTIMAL,
        lastUpdate: "2h",
        category: "Électronique",
        minThreshold: 10,
        maxThreshold: 100,
    },
    {
        id: 2,
        name: "MonTest",
        quantity: 89,
        value: 1780,
        status: OPTIMAL,
        lastUpdate: "1h",
        category: "Accessoires",
        minThreshold: 10,
        maxThreshold: 100,
    },
    {
        id: 3,
        name: "StockFaible",
        quantity: 3,
        value: 150,
        status: LOW,
        lastUpdate: "30min",
        category: "Fournitures",
        minThreshold: 10,
        maxThreshold: 100,
    },
    {
        id: 4,
        name: "Stock Critique",
        quantity: 0,
        value: 0,
        status: CRITICAL,
        lastUpdate: "5min",
        category: "Urgence",
        minThreshold: 10,
        maxThreshold: 100,
    },
    {
        id: 6,
        name: 'SurStock',
        quantity: 250,  // > maxThreshold
        value: 3750,
        status: OVERSTOCKED,
        lastUpdate: '1h',
        category: 'Bureau',
        minThreshold: 10,
        maxThreshold: 100,
        description: 'Stock en surstockage'
    }
];
