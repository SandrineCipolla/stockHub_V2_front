import React from "react";

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

// Types pour les breadcrumbs
export interface BreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
    icon?: React.ElementType;
}

// Types pour les liens
export interface FooterLink {
    label: string;
    href: string;
    external?: boolean;
}

// Types pour les métriques
export interface MetricCardData {
    id: string;
    label: string;
    value: string | number;
    change: number;
    changeType: 'increase' | 'decrease';
    icon: 'package' | 'alert-triangle' | 'trending-up';
    color: 'success' | 'warning' | 'info';
}

// Constantes typées
export const STOCK_STATUSES = ['optimal', 'low', 'critical'] as const;
export const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost'] as const;
export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;
export const BADGE_VARIANTS = ['success', 'warning', 'danger'] as const;
export const THEMES = ['light', 'dark'] as const;

// Type guards
export const isStockStatus = (status: string): status is StockStatus => {
    return STOCK_STATUSES.includes(status as StockStatus);
};

export const isTheme = (theme: string): theme is Theme => {
    return THEMES.includes(theme as Theme);
};

export const isButtonVariant = (variant: string): variant is ButtonVariant => {
    return BUTTON_VARIANTS.includes(variant as ButtonVariant);
};

// Utility types
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type WithId<T> = T & { readonly id: string | number };

// Types pour les événements
export interface StockEvent {
    readonly id: string;
    stockId: number;
    type: 'created' | 'updated' | 'deleted' | 'low_stock' | 'critical_stock';
    timestamp: Date;
    userId: string;
    details: Record<string, unknown>;
}

// Types pour les erreurs API
export interface ApiError {
    readonly code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: Date;
    statusCode?: number;
}

// Types pour la validation
export interface ValidationError {
    field: string;
    message: string;
    code: 'required' | 'invalid' | 'min' | 'max' | 'pattern';
}

// Types pour les états asynchrones
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
    status: LoadingState;
    data: T | null;
    error: ApiError | null;
}