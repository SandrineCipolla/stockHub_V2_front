import {Stock} from '@/types';

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
        status: "optimal",
        lastUpdate: "3j",
        category: "Peinture",
        minThreshold: 20,
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
        status: "low",
        lastUpdate: "1sem",
        category: "Peinture",
        minThreshold: 20,
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
        status: "optimal",
        lastUpdate: "2j",
        category: "Peinture",
        minThreshold: 20,
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
        status: "critical",
        lastUpdate: "2sem",
        category: "Peinture",
        minThreshold: 20,
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
        status: "optimal",
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
        status: "optimal",
        lastUpdate: "1mois",
        category: "Peinture",
        minThreshold: 5,
        maxThreshold: 15,
        description: "Set de pinceaux diverses tailles"
    },

    // ===== COUTURE & TISSU =====
    {
        id: 8,
        name: "Tissu Coton Fleuri",
        quantity: 3.5,
        unit: 'meter',
        value: 35,
        status: "optimal",
        lastUpdate: "1sem",
        category: "Tissu",
        minThreshold: 1,
        maxThreshold: 10,
        description: "Coton 100% pour projets couture"
    },
    {
        id: 9,
        name: "Feutrine Rouge",
        quantity: 0.5,
        unit: 'meter',
        value: 8,
        status: "low",
        lastUpdate: "4j",
        category: "Tissu",
        minThreshold: 1,
        maxThreshold: 10,
        description: "Reste de feutrine"
    },
    {
        id: 10,
        name: "Tissu Jersey Gris",
        quantity: 2.0,
        unit: 'meter',
        value: 24,
        status: "optimal",
        lastUpdate: "2sem",
        category: "Tissu",
        minThreshold: 1,
        maxThreshold: 10,
        description: "Jersey stretch pour vêtements"
    },
    {
        id: 11,
        name: "Bobines de Fil",
        quantity: 12,
        unit: 'piece',
        value: 18,
        status: "optimal",
        lastUpdate: "3sem",
        category: "Tissu",
        minThreshold: 5,
        maxThreshold: 20,
        description: "Fil à coudre couleurs variées"
    },

    // ===== CELLIER / CUISINE =====
    {
        id: 12,
        name: "Farine T55",
        quantity: 2.5,
        unit: 'kg',
        value: 5,
        status: "optimal",
        lastUpdate: "3j",
        category: "Cellier",
        minThreshold: 1,
        maxThreshold: 5,
        description: "Farine blanche tout usage"
    },
    {
        id: 13,
        name: "Levure Chimique",
        quantity: 80,
        unit: 'g',
        value: 3,
        status: "low",
        lastUpdate: "1sem",
        category: "Cellier",
        minThreshold: 100,
        maxThreshold: 500,
        description: "Levure pour pâtisserie"
    },
    {
        id: 14,
        name: "Sucre Blanc",
        quantity: 1.8,
        unit: 'kg',
        value: 3,
        status: "optimal",
        lastUpdate: "5j",
        category: "Cellier",
        minThreshold: 1,
        maxThreshold: 3,
        description: "Sucre en poudre"
    },
    {
        id: 15,
        name: "Huile d'Olive",
        quantity: 0.75,
        unit: 'liter',
        value: 12,
        status: "optimal",
        lastUpdate: "1sem",
        category: "Cellier",
        minThreshold: 0.5,
        maxThreshold: 2,
        description: "Huile d'olive extra vierge"
    },
    {
        id: 16,
        name: "Pâtes Sèches",
        quantity: 6,
        unit: 'piece',
        value: 9,
        status: "optimal",
        lastUpdate: "4j",
        category: "Cellier",
        minThreshold: 3,
        maxThreshold: 12,
        description: "Paquets de pâtes 500g"
    },
    {
        id: 17,
        name: "Riz Basmati",
        quantity: 0.3,
        unit: 'kg',
        value: 4,
        status: "critical",
        lastUpdate: "2j",
        category: "Cellier",
        minThreshold: 1,
        maxThreshold: 5,
        description: "Presque épuisé"
    },
    {
        id: 18,
        name: "Conserves Tomates",
        quantity: 15,
        unit: 'piece',
        value: 22,
        status: "overstocked",
        lastUpdate: "3sem",
        category: "Cellier",
        minThreshold: 3,
        maxThreshold: 8,
        description: "Stock important de conserves"
    }
];

// Statistiques métrique
// export const metricsData = [
//     {
//         id: 1,
//         title: "Total Produits",
//         value: "248",
//         change: "+8",
//         isPositive: true,
//         iconType: "success" as const,
//         icon: "Package"
//     },
//     {
//         id: 2,
//         title: "Stock Faible",
//         value: "12",
//         change: "-3",
//         isPositive: false,
//         iconType: "warning" as const,
//         icon: "AlertTriangle"
//     },
//     {
//         id: 3,
//         title: "Ce mois",
//         value: "+15%",
//         change: "+2%",
//         isPositive: true,
//         iconType: "info" as const,
//         icon: "TrendingUp"
//     }
// ];