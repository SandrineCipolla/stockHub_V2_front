// ========================================
// TYPES DOMAINE MÉTIER - STOCK
// ========================================

import {AlertCircle, AlertTriangle, CheckCircle, LucideIcon, TrendingUp, XCircle} from "lucide-react";

export type StockStatus =
    | 'optimal'      // Stock dans la plage idéale
    | 'low'          // Stock faible, attention requise
    | 'critical'     // Stock critique, réapprovisionnement urgent
    | 'outOfStock'   // Rupture de stock
    | 'overstocked'; // Surstockage

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


export const STOCK_STATUSES: readonly StockStatus[] = ['optimal', 'low', 'critical', 'outOfStock', 'overstocked'];

export const isStockStatus = (status: string): status is StockStatus => {
    return STOCK_STATUSES.includes(status as StockStatus);
};

/**
 * Configuration complète d'un statut de stock
 * Ajoute la couche visuelle (couleurs, icônes) + animations
 */
export interface StockStatusConfig {
    label: string;
    icon: LucideIcon;
    colors: {
        // Thème clair
        light: {
            background: string;
            border: string;
            text: string;
            badge: string;
            hover: string; // Pour hover effects
        };
        // Thème sombre
        dark: {
            background: string;
            border: string;
            text: string;
            badge: string;
            hover: string;
        };
    };
    priority: number; // Pour le tri (1 = plus urgent)
    animate?: boolean; // Animation pulse pour statuts critiques
}

/**
 * Configuration visuelle pour les 5 statuts
 * Ordre de priorité : Rupture > Critique > Attention > Normal > Surstockage
 */
export const STOCK_STATUS_CONFIG: Record<StockStatus, StockStatusConfig> = {
    // ⛔ RUPTURE DE STOCK - Gris (priorité 1 - LA PLUS URGENTE)
    outOfStock: {
        label: 'Out of Stock',
        icon: XCircle,
        colors: {
            light: {
                background: 'bg-gray-50',
                border: 'border-gray-500',
                text: 'text-gray-800',
                badge: 'bg-gray-100 text-gray-700 border-gray-300',
                hover: 'hover:bg-gray-100 hover:border-gray-600'
            },
            dark: {
                background: 'bg-gray-950/40',
                border: 'border-gray-500/50',
                text: 'text-gray-300',
                badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
                hover: 'hover:bg-gray-950/60 hover:border-gray-500/70'
            }
        },
        priority: 1,
        animate: true
    },

    // 🔴 CRITIQUE - Rouge (priorité 2)
    critical: {
        label: 'Critical',
        icon: AlertTriangle,
        colors: {
            light: {
                background: 'bg-red-50',
                border: 'border-red-400',
                text: 'text-red-700',
                badge: 'bg-red-100 text-red-700 border-red-300',
                hover: 'hover:bg-red-100 hover:border-red-500'
            },
            dark: {
                background: 'bg-red-950/30',
                border: 'border-red-500/40',
                text: 'text-red-400',
                badge: 'bg-red-500/20 text-red-400 border-red-500/30',
                hover: 'hover:bg-red-950/50 hover:border-red-500/60'
            }
        },
        priority: 2,
        animate: true 
    },

    // ⚠️ ATTENTION - Orange (priorité 3)
    low: {
        label: 'Low',
        icon: AlertCircle,
        colors: {
            light: {
                background: 'bg-amber-50',
                border: 'border-amber-300',
                text: 'text-amber-700',
                badge: 'bg-amber-100 text-amber-700 border-amber-300',
                hover: 'hover:bg-amber-100 hover:border-amber-400'
            },
            dark: {
                background: 'bg-amber-950/30',
                border: 'border-amber-500/30',
                text: 'text-amber-400',
                badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                hover: 'hover:bg-amber-950/50 hover:border-amber-500/50'
            }
        },
        priority: 3,
        animate: false
    },

    // ✅ NORMAL/OPTIMAL - Vert (priorité 4)
    optimal: {
        label: 'Optimal',
        icon: CheckCircle,
        colors: {
            light: {
                background: 'bg-emerald-50',
                border: 'border-emerald-300',
                text: 'text-emerald-700',
                badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
                hover: 'hover:bg-emerald-100 hover:border-emerald-400'
            },
            dark: {
                background: 'bg-emerald-950/30',
                border: 'border-emerald-500/30',
                text: 'text-emerald-400',
                badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                hover: 'hover:bg-emerald-950/50 hover:border-emerald-500/50'
            }
        },
        priority: 4,
        animate: false
    },

    // 📈 SURSTOCKAGE - Bleu (priorité 5)
    overstocked: {
        label: 'Overstocked',
        icon: TrendingUp,
        colors: {
            light: {
                background: 'bg-blue-50',
                border: 'border-blue-300',
                text: 'text-blue-700',
                badge: 'bg-blue-100 text-blue-700 border-blue-300',
                hover: 'hover:bg-blue-100 hover:border-blue-400'
            },
            dark: {
                background: 'bg-blue-950/30',
                border: 'border-blue-500/30',
                text: 'text-blue-400',
                badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                hover: 'hover:bg-blue-950/50 hover:border-blue-500/50'
            }
        },
        priority: 5,
        animate: false
    }
};

/**
 * Récupère la configuration visuelle d'un statut
 */
export const getStatusConfig = (status: StockStatus): StockStatusConfig => {
    return STOCK_STATUS_CONFIG[status];
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

/**
 * Trie les stocks par priorité de statut (rupture en premier)
 */
export const sortByStatusPriority = <T extends { status: StockStatus }>(
    items: T[]
): T[] => {
    return [...items].sort((a, b) => {
        const priorityA = STOCK_STATUS_CONFIG[a.status].priority;
        const priorityB = STOCK_STATUS_CONFIG[b.status].priority;
        return priorityA - priorityB;
    });
};