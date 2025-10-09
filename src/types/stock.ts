// ========================================
// TYPES DOMAINE MÉTIER - STOCK
// ========================================

export type StockStatus = "optimal" | "low" | "critical";

export interface Stock {
    id: number;
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
    id: number;
}

export interface StockEvent {
    readonly id: string;
    stockId: number;
    type: 'created' | 'updated' | 'deleted' | 'low_stock' | 'critical_stock';
    timestamp: Date;
    userId: string;
    details: Record<string, unknown>;
}

// Constantes et type guards pour Stock
export const STOCK_STATUSES = ['optimal', 'low', 'critical'] as const;

export const isStockStatus = (status: string): status is StockStatus => {
    return STOCK_STATUSES.includes(status as StockStatus);
};
