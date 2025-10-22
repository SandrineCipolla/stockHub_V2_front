// ========================================
// TYPES DOMAINE MÉTIER - STOCK
// Types purs sans configuration visuelle
// ========================================

/**
 * Constantes pour les statuts de stock
 * Single source of truth - le type est dérivé de ces constantes
 */
export const OPTIMAL = 'optimal';
export const LOW = 'low';
export const CRITICAL = 'critical';
export const OUT_OF_STOCK = 'outOfStock';
export const OVERSTOCKED = 'overstocked';

/**
 * Type union basé sur les constantes
 * Garantit la cohérence entre les constantes et le type
 */
export type StockStatus =
    | typeof OPTIMAL      // Stock dans la plage idéale
    | typeof LOW          // Stock faible, attention requise
    | typeof CRITICAL     // Stock critique, réapprovisionnement urgent
    | typeof OUT_OF_STOCK // Rupture de stock
    | typeof OVERSTOCKED; // Surstockage

/**
 * Objet regroupant toutes les constantes pour faciliter l'import
 * Usage: STOCK_STATUS.OPTIMAL ou directement OPTIMAL
 */
export const STOCK_STATUS = {
    OPTIMAL,
    LOW,
    CRITICAL,
    OUT_OF_STOCK,
    OVERSTOCKED,
};

export interface Stock {
    id: number | string; // Accepte number (BD) ou string (temporaire avant sauvegarde)
    name: string;
    quantity: number;
    value: number;
    status: StockStatus;
    lastUpdate: string;
    category?: string;
    sku?: string;
    description?: string;
    supplier?: string;
    minThreshold?: number;
    maxThreshold?: number;
}

export interface SearchFilters {
    query?: string;
    status?: StockStatus[];
    category?: string[];
    minValue?: number;
    maxValue?: number;
    sortBy?: 'name' | 'quantity' | 'value' | 'lastUpdate';
    sortOrder?: 'asc' | 'desc';
}

export interface StockStats {
    total: number;
    optimal: number;
    low: number;
    critical: number;
    outOfStock: number;
    overstocked: number;
    totalValue: number;
    averageValue: number;
}

export interface CreateStockData {
    name: string;
    quantity: number;
    value: number;
    description?: string;
    category?: string;
    supplier?: string;
    minThreshold?: number;
    maxThreshold?: number;
}

export interface UpdateStockData extends Partial<CreateStockData> {
    id: number | string; // Accepte number (BD) ou string (temporaire)
}

export interface StockEvent {
    readonly id: string;
    stockId: number | string; // Accepte number (BD) ou string (temporaire)
    type: 'created' | 'updated' | 'deleted' | 'low_stock' | 'critical_stock';
    timestamp: Date;
    userId: string;
    details: Record<string, unknown>;
}


export const STOCK_STATUSES: readonly StockStatus[] = [OPTIMAL, LOW, CRITICAL, OUT_OF_STOCK, OVERSTOCKED];

export const isStockStatus = (status: string): status is StockStatus => {
    return STOCK_STATUSES.some(validStatus => validStatus === status);
};

/**
 * Calcule le statut d'un stock basé sur sa quantité et ses seuils
 * Logique enrichie avec les 5 statuts
 *
 * @param quantity - Quantité actuelle en stock
 * @param minThreshold - Seuil minimum (défaut: 10)
 * @param maxThreshold - Seuil maximum (défaut: 100)
 * @returns Le statut calculé parmi les 5 possibles
 */
export const calculateStockStatus = (
    quantity: number,
    minThreshold: number = 10,
    maxThreshold: number = 100
): StockStatus => {
    // Priorité 1 : Rupture de stock
    if (quantity === 0) return 'outOfStock';

    // Priorité 2 : Critique (< 50% du seuil minimum)
    if (quantity < minThreshold * 0.5) return 'critical';

    // Priorité 3 : Attention (< seuil minimum)
    if (quantity < minThreshold) return 'low';

    // Priorité 4 : Surstockage (> seuil maximum)
    if (quantity > maxThreshold) return 'overstocked';

    // Priorité 5 : Normal (entre min et max)
    return 'optimal';
};
