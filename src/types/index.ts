export type Theme = "dark" | "light"

export type StockStatus = "optimal" | "low" | "critical"

export interface Stock {
    id: number
    name: string
    quantity: number
    value: number
    status: StockStatus
    lastUpdate: string
    category?: string
    sku?: string
    description?: string
    supplier?: string
    minThreshold?: number
    maxThreshold?: number
}

export interface MetricData {
    id: string
    label: string
    value: string | number
    change: number
    changeType: "increase" | "decrease"
    icon: string
    color: "success" | "warning" | "info"
}

export type ButtonVariant = "primary" | "secondary" | "ghost"
export type ButtonSize = "sm" | "md" | "lg"
export type BadgeVariant = "success" | "warning" | "danger"

export interface SearchFilters {
    query?: string;
    status?: StockStatus[];
    category?: string[];
    minValue?: number;
    maxValue?: number;
    sortBy?: 'name' | 'quantity' | 'value' | 'lastUpdate';
    sortOrder?: 'asc' | 'desc';
}

// Types pour les statistiques (utilisés par useStocks)
export interface StockStats {
    total: number;
    optimal: number;
    low: number;
    critical: number;
    totalValue: number;
    averageValue: number;
}

// Types pour les formulaires
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

// Types pour les composants
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
    'data-testid'?: string;
}

export interface AccessibleComponentProps extends BaseComponentProps {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-hidden'?: boolean;
    role?: string;
}

// Constantes typées
export const STOCK_STATUSES = ['optimal', 'low', 'critical'] as const;
export const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost'] as const;
export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;
export const THEMES = ['light', 'dark'] as const;

// Type guards
export const isStockStatus = (status: string): status is StockStatus => {
    return STOCK_STATUSES.includes(status as StockStatus);
};

export const isTheme = (theme: string): theme is Theme => {
    return THEMES.includes(theme as Theme);
};