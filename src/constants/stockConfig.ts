// ========================================
// CONFIGURATION VISUELLE DES STOCKS
// Séparée des types métier pour respecter la séparation des responsabilités
// ========================================

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  type LucideIcon,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import type { StockStatus } from '@/types/stock';

/**
 * Configuration complète d'un statut de stock
 * Ajoute la couche visuelle (couleurs, icônes) + animations
 */
export interface StockStatusConfig {
  label: string;
  icon: LucideIcon;
  colors: {
    light: {
      background: string;
      border: string;
      text: string;
      badge: string;
      hover: string;
    };
    dark: {
      background: string;
      border: string;
      text: string;
      badge: string;
      hover: string;
    };
  };
  priority: number;
  animate?: boolean;
}

/**
 * Configuration visuelle pour les 5 statuts
 * Ordre de priorité : Rupture > Critique > Attention > Normal > Surstockage
 */
export const STOCK_STATUS_CONFIG: Record<StockStatus, StockStatusConfig> = {
  outOfStock: {
    label: 'Out of Stock',
    icon: XCircle,
    colors: {
      light: {
        background: 'bg-gray-50',
        border: 'border-gray-500',
        text: 'text-gray-800',
        badge: 'bg-gray-100 text-gray-700 border-gray-300',
        hover: 'hover:bg-gray-100 hover:border-gray-600',
      },
      dark: {
        background: 'bg-gray-950/40',
        border: 'border-gray-500/50',
        text: 'text-gray-300',
        badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        hover: 'hover:bg-gray-950/60 hover:border-gray-500/70',
      },
    },
    priority: 1,
    animate: true,
  },

  critical: {
    label: 'Critical',
    icon: AlertTriangle,
    colors: {
      light: {
        background: 'bg-red-50',
        border: 'border-red-400',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-700 border-red-300',
        hover: 'hover:bg-red-100 hover:border-red-500',
      },
      dark: {
        background: 'bg-red-950/30',
        border: 'border-red-500/40',
        text: 'text-red-400',
        badge: 'bg-red-500/20 text-red-400 border-red-500/30',
        hover: 'hover:bg-red-950/50 hover:border-red-500/60',
      },
    },
    priority: 2,
    animate: true,
  },

  low: {
    label: 'Low',
    icon: AlertCircle,
    colors: {
      light: {
        background: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-700',
        badge: 'bg-amber-100 text-amber-700 border-amber-300',
        hover: 'hover:bg-amber-100 hover:border-amber-400',
      },
      dark: {
        background: 'bg-amber-950/30',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        hover: 'hover:bg-amber-950/50 hover:border-amber-500/50',
      },
    },
    priority: 3,
    animate: false,
  },

  optimal: {
    label: 'Optimal',
    icon: CheckCircle,
    colors: {
      light: {
        background: 'bg-emerald-50',
        border: 'border-emerald-300',
        text: 'text-emerald-700',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        hover: 'hover:bg-emerald-100 hover:border-emerald-400',
      },
      dark: {
        background: 'bg-emerald-950/30',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        hover: 'hover:bg-emerald-950/50 hover:border-emerald-500/50',
      },
    },
    priority: 4,
    animate: false,
  },

  overstocked: {
    label: 'Overstocked',
    icon: TrendingUp,
    colors: {
      light: {
        background: 'bg-blue-50',
        border: 'border-blue-300',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-700 border-blue-300',
        hover: 'hover:bg-blue-100 hover:border-blue-400',
      },
      dark: {
        background: 'bg-blue-950/30',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        hover: 'hover:bg-blue-950/50 hover:border-blue-500/50',
      },
    },
    priority: 5,
    animate: false,
  },
};

export const STOCK_STATUS_BG_COLORS: Record<string, string> = {
  optimal: '16 185 129', // emerald-500
  low: '245 158 11', // amber-500
  critical: '239 68 68', // red-500
  outOfStock: '107 114 128', // gray-500
  overstocked: '59 130 246', // blue-500
};
