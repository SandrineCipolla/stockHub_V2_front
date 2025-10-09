import type {Stock, StockStatus} from '@/types';

/**
 * Statuts de stock disponibles pour les tests
 */
export const stockStatuses: StockStatus[] = ['optimal', 'low', 'critical'];

/**
 * Catégories de stock pour les tests
 */
export const stockCategories: Record<string, string> = {
    food: 'Alimentaire',
    electronics: 'Électronique',
    clothing: 'Vêtements',
    furniture: 'Mobilier',
    tools: 'Outillage',
    office: 'Bureau',
};

/**
 * Fournisseurs pour les tests
 */
export const stockSuppliers: Record<string, string> = {
    supplier1: 'Fournisseur A',
    supplier2: 'Fournisseur B',
    supplier3: 'Fournisseur International',
    local: 'Fournisseur Local',
};

/**
 * Noms de produits pour les tests
 */
export const productNames: Record<string, string> = {
    apple: 'Pommes Golden',
    laptop: 'Ordinateur Portable HP',
    chair: 'Chaise de Bureau',
    printer: 'Imprimante Laser',
    table: 'Table de Réunion',
    phone: 'Téléphone Samsung',
};

/**
 * Cas d'usage métier StockHub : stocks avec différents statuts
 */
export const stockHubStockUseCases: Record<string, Stock> = {
    optimalStock: {
        id: 1,
        name: productNames.apple,
        quantity: 150,
        value: 225.5,
        status: 'optimal',
        lastUpdate: '2024-10-08T10:30:00Z',
        category: stockCategories.food,
        sku: 'FOOD-001',
        description: 'Pommes Golden de qualité premium',
        supplier: stockSuppliers.local,
        minThreshold: 50,
        maxThreshold: 200,
    },
    lowStock: {
        id: 2,
        name: productNames.laptop,
        quantity: 8,
        value: 7200.0,
        status: 'low',
        lastUpdate: '2024-10-08T09:15:00Z',
        category: stockCategories.electronics,
        sku: 'ELEC-042',
        description: 'Ordinateur portable 15 pouces, 16GB RAM',
        supplier: stockSuppliers.supplier2,
        minThreshold: 10,
        maxThreshold: 50,
    },
    criticalStock: {
        id: 3,
        name: productNames.printer,
        quantity: 2,
        value: 450.0,
        status: 'critical',
        lastUpdate: '2024-10-08T08:00:00Z',
        category: stockCategories.electronics,
        sku: 'ELEC-089',
        description: 'Imprimante laser noir et blanc',
        supplier: stockSuppliers.supplier1,
        minThreshold: 5,
        maxThreshold: 20,
    },
    highValueStock: {
        id: 4,
        name: productNames.table,
        quantity: 25,
        value: 12500.0,
        status: 'optimal',
        lastUpdate: '2024-10-07T16:45:00Z',
        category: stockCategories.furniture,
        sku: 'FURN-015',
        description: 'Table de réunion 8 personnes en chêne',
        supplier: stockSuppliers.supplier3,
        minThreshold: 5,
        maxThreshold: 30,
    },
    minimalStock: {
        id: 5,
        name: productNames.chair,
        quantity: 100,
        value: 4500.0,
        status: 'optimal',
        lastUpdate: '2024-10-08T11:00:00Z',
        category: stockCategories.furniture,
        sku: 'FURN-023',
    },
    stockWithoutThresholds: {
        id: 6,
        name: productNames.phone,
        quantity: 30,
        value: 9000.0,
        status: 'optimal',
        lastUpdate: '2024-10-08T07:30:00Z',
        category: stockCategories.electronics,
        sku: 'ELEC-156',
        description: 'Smartphone dernière génération',
        supplier: stockSuppliers.supplier2,
    },
    recentlyUpdatedStock: {
        id: 7,
        name: 'Stylos Bille',
        quantity: 500,
        value: 150.0,
        status: 'optimal',
        lastUpdate: new Date().toISOString(),
        category: stockCategories.office,
        sku: 'OFF-001',
        description: 'Stylos bille bleu, pack de 10',
        supplier: stockSuppliers.local,
        minThreshold: 100,
        maxThreshold: 1000,
    },
    criticalLowQuantity: {
        id: 8,
        name: 'Câble HDMI',
        quantity: 1,
        value: 15.0,
        status: 'critical',
        lastUpdate: '2024-10-08T06:00:00Z',
        category: stockCategories.electronics,
        sku: 'ELEC-200',
        description: 'Câble HDMI 2.0, 2 mètres',
        supplier: stockSuppliers.supplier1,
        minThreshold: 10,
        maxThreshold: 50,
    },
};

/**
 * Collection de stocks pour tests de tableau complet
 */
export const dashboardStocks: Stock[] = [
    stockHubStockUseCases.optimalStock,
    stockHubStockUseCases.lowStock,
    stockHubStockUseCases.criticalStock,
    stockHubStockUseCases.highValueStock,
    stockHubStockUseCases.minimalStock,
];

/**
 * Stocks filtrés par statut
 */
export const stocksByStatus: Record<StockStatus, Stock[]> = {
    optimal: [
        stockHubStockUseCases.optimalStock,
        stockHubStockUseCases.highValueStock,
        stockHubStockUseCases.minimalStock,
        stockHubStockUseCases.stockWithoutThresholds,
        stockHubStockUseCases.recentlyUpdatedStock,
    ],
    low: [stockHubStockUseCases.lowStock],
    critical: [
        stockHubStockUseCases.criticalStock,
        stockHubStockUseCases.criticalLowQuantity,
    ],
};

/**
 * Stocks filtrés par catégorie
 */
export const stocksByCategory: Record<string, Stock[]> = {
    [stockCategories.food]: [stockHubStockUseCases.optimalStock],
    [stockCategories.electronics]: [
        stockHubStockUseCases.lowStock,
        stockHubStockUseCases.criticalStock,
        stockHubStockUseCases.stockWithoutThresholds,
        stockHubStockUseCases.criticalLowQuantity,
    ],
    [stockCategories.furniture]: [
        stockHubStockUseCases.highValueStock,
        stockHubStockUseCases.minimalStock,
    ],
    [stockCategories.office]: [stockHubStockUseCases.recentlyUpdatedStock],
};

/**
 * Factory function pour créer un stock personnalisé
 */
export const createMockStock = (overrides: Partial<Stock> = {}): Stock => ({
    id: 999,
    name: 'Stock de Test',
    quantity: 50,
    value: 100.0,
    status: 'optimal',
    lastUpdate: new Date().toISOString(),
    category: stockCategories.office,
    sku: 'TEST-001',
    description: 'Stock créé pour les tests',
    supplier: stockSuppliers.local,
    minThreshold: 10,
    maxThreshold: 100,
    ...overrides,
});
