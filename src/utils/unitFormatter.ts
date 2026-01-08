/**
 * @fileoverview Unit formatting utilities for creative/family usage
 * @description Formats quantities with their units for display
 *
 * @module unitFormatter
 * @category Utilities
 */

import type { StockUnit } from '@/types/stock';

/**
 * Configuration for unit display
 */
interface UnitConfig {
  symbol: string; // Symbole affiché (%, m, kg, etc.)
  position: 'before' | 'after'; // Position du symbole
  space: boolean; // Espace entre nombre et symbole
  decimals: number; // Nombre de décimales à afficher
  label: string; // Label complet pour formulaires
}

/**
 * Configuration de toutes les unités supportées
 */
export const UNIT_CONFIG: Record<StockUnit, UnitConfig> = {
  piece: {
    symbol: '',
    position: 'after',
    space: false,
    decimals: 0,
    label: 'pièce(s)',
  },
  percentage: {
    symbol: '%',
    position: 'after',
    space: false,
    decimals: 0,
    label: 'pourcentage',
  },
  ml: {
    symbol: 'ml',
    position: 'after',
    space: false,
    decimals: 0,
    label: 'millilitres',
  },
  g: {
    symbol: 'g',
    position: 'after',
    space: false,
    decimals: 0,
    label: 'grammes',
  },
  meter: {
    symbol: 'm',
    position: 'after',
    space: false,
    decimals: 2,
    label: 'mètres',
  },
  liter: {
    symbol: 'L',
    position: 'after',
    space: false,
    decimals: 2,
    label: 'litres',
  },
  kg: {
    symbol: 'kg',
    position: 'after',
    space: false,
    decimals: 2,
    label: 'kilogrammes',
  },
};

/**
 * Formate une quantité avec son unité pour l'affichage
 *
 * @param quantity - Quantité numérique
 * @param unit - Unité de mesure (défaut: 'piece')
 * @returns Chaîne formatée avec l'unité
 *
 * @example
 * ```ts
 * formatQuantityWithUnit(65, 'percentage')  // "65%"
 * formatQuantityWithUnit(0.5, 'meter')      // "0.5m"
 * formatQuantityWithUnit(150, 'ml')         // "150ml"
 * formatQuantityWithUnit(2, 'piece')        // "2"
 * ```
 */
export function formatQuantityWithUnit(quantity: number, unit: StockUnit = 'piece'): string {
  // Gérer les valeurs undefined/null
  if (quantity === undefined || quantity === null || isNaN(quantity)) {
    return '-';
  }

  const config = UNIT_CONFIG[unit];

  // Arrondir selon le nombre de décimales configuré
  const rounded = Number(quantity.toFixed(config.decimals));

  // Formater le nombre
  const formattedNumber = rounded.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: config.decimals,
  });

  // Construire la chaîne finale
  if (!config.symbol) {
    return formattedNumber;
  }

  if (config.position === 'before') {
    return `${config.symbol}${config.space ? ' ' : ''}${formattedNumber}`;
  } else {
    return `${formattedNumber}${config.space ? ' ' : ''}${config.symbol}`;
  }
}

/**
 * Récupère le label complet d'une unité
 *
 * @param unit - Unité de mesure
 * @returns Label complet de l'unité
 *
 * @example
 * ```ts
 * getUnitLabel('meter')       // "mètres"
 * getUnitLabel('percentage')  // "pourcentage"
 * ```
 */
export function getUnitLabel(unit: StockUnit = 'piece'): string {
  return UNIT_CONFIG[unit].label;
}

/**
 * Parse une valeur saisie pour extraire quantité et unité potentielle
 * Utile pour permettre à l'utilisateur de taper "65%" ou "2.5m"
 *
 * @param input - Valeur saisie par l'utilisateur
 * @returns Objet avec quantité et unité détectée
 *
 * @example
 * ```ts
 * parseQuantityInput("65%")    // { quantity: 65, unit: 'percentage' }
 * parseQuantityInput("2.5m")   // { quantity: 2.5, unit: 'meter' }
 * parseQuantityInput("150")    // { quantity: 150, unit: undefined }
 * ```
 */
export function parseQuantityInput(input: string): {
  quantity: number;
  unit?: StockUnit;
} {
  const trimmed = input.trim();

  // Détection pourcentage
  if (trimmed.endsWith('%')) {
    const quantity = parseFloat(trimmed.slice(0, -1));
    return { quantity, unit: 'percentage' };
  }

  // Détection mètre
  if (trimmed.toLowerCase().endsWith('m') && !trimmed.toLowerCase().endsWith('ml')) {
    const quantity = parseFloat(trimmed.slice(0, -1));
    return { quantity, unit: 'meter' };
  }

  // Détection millilitres
  if (trimmed.toLowerCase().endsWith('ml')) {
    const quantity = parseFloat(trimmed.slice(0, -2));
    return { quantity, unit: 'ml' };
  }

  // Détection grammes
  if (trimmed.toLowerCase().endsWith('g') && !trimmed.toLowerCase().endsWith('kg')) {
    const quantity = parseFloat(trimmed.slice(0, -1));
    return { quantity, unit: 'g' };
  }

  // Détection kilogrammes
  if (trimmed.toLowerCase().endsWith('kg')) {
    const quantity = parseFloat(trimmed.slice(0, -2));
    return { quantity, unit: 'kg' };
  }

  // Détection litres
  if (trimmed.toLowerCase().endsWith('l')) {
    const quantity = parseFloat(trimmed.slice(0, -1));
    return { quantity, unit: 'liter' };
  }

  // Pas d'unité détectée, juste un nombre
  return { quantity: parseFloat(trimmed), unit: undefined };
}

/**
 * Récupère la liste de toutes les unités disponibles
 * Utile pour les dropdowns de sélection
 *
 * @returns Array d'objets { value, label } pour chaque unité
 */
export function getAvailableUnits(): Array<{ value: StockUnit; label: string }> {
  return Object.keys(UNIT_CONFIG).map(value => ({
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    value: value as StockUnit,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    label: UNIT_CONFIG[value as StockUnit].label,
  }));
}
