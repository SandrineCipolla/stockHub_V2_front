import {CRITICAL, LOW, OPTIMAL, OVERSTOCKED, Stock} from '@/types';

/**
 * Données de démonstration pour usage familial/créatif
 * Représente un mix réaliste de stocks : peinture, couture, cellier
 */
export const stockData: Stock[] = [
    // ===== PEINTURE & ARTS CRÉATIFS =====
    {
        id: 1,

        name: "Acrylique Bleu Cobalt",
        quantity: 65,
        unit: 'percentage',
        containerCapacity: 100,    // Tube de 100ml
        containersOwned: 1,        // 1 tube possédé
        value: 12,
        lastUpdate: "3j",
        category: "Peinture",
        status: OPTIMAL,
        minThreshold: 10,
        maxThreshold: 100,
        description: "Tube d'acrylique 100ml - environ 5 sessions"
    },
    {
        id: 2,
        name: "Acrylique Rouge Vermillon",
        quantity: 15,
        unit: 'percentage',
        containerCapacity: 100,    // Tube de 100ml
        containersOwned: 1,        // 1 tube possédé
        value: 12,
        status: OPTIMAL,
        lastUpdate: "1sem",
        category: "Peinture",
        minThreshold: 10,
        maxThreshold: 100,
        description: "Tube presque vide - 1 session restante"
    },
    {
        id: 3,
        name: "Acrylique Blanc Titane",
        quantity: 90,
        unit: 'percentage',
        containerCapacity: 100,    // Tube de 100ml
        containersOwned: 1,        // 1 tube possédé
        value: 12,
        status: LOW,
        lastUpdate: "2j",
        category: "Peinture",
        minThreshold: 10,
        maxThreshold: 100,
        description: "Tube presque neuf - 7 sessions"
    },
    {
        id: 4,
        name: "Acrylique Jaune Cadmium",
        quantity: 5,
        unit: 'percentage',
        containerCapacity: 100,    // Tube de 100ml
        containersOwned: 1,        // 1 tube possédé
        value: 12,
        status: CRITICAL,
        lastUpdate: "2sem",
        category: "Peinture",
        minThreshold: 10,
        maxThreshold: 100,
        description: "URGENT : tube presque vide"
    },
    {
        id: 5,
        name: "Vernis Acrylique Mat",
        quantity: 150,
        unit: 'ml',
        value: 15,
        status: "optimal",
        lastUpdate: "5j",
        category: "Peinture",
        minThreshold: 50,
        maxThreshold: 500,
        description: "Flacon de vernis"
    },
    {
        id: 6,
        name: "Médium Gel",
        quantity: 1.2,
        unit: 'liter',
        value: 28,
        status: OPTIMAL,
        lastUpdate: "2sem",
        category: "Peinture",
        minThreshold: 0.5,
        maxThreshold: 2,
        description: "Médium pour mélange"
    },
    {
        id: 7,
        name: "Pinceaux Synthétiques",
        quantity: 8,
        unit: 'piece',
        value: 45,
        status: OPTIMAL,
        lastUpdate: "1mois",
        category: "Peinture",
        minThreshold: 5,
        maxThreshold: 15,
        description: "Set de pinceaux diverses tailles"
    },

    
];
