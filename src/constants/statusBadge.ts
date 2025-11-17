/**
 * Constantes pour le composant StatusBadge
 * Centralise toutes les classes CSS pour éviter les "magic strings"
 */

import type { ComponentSize } from '@/types/ui';

/**
 * Classes de base pour tous les badges de statut
 */
export const STATUS_BADGE_BASE_CLASSES = 'status-badge';

/**
 * Mapping des tailles vers les classes CSS
 * Utilise des classes CSS custom au lieu de strings Tailwind inline
 */
export const STATUS_BADGE_SIZE_CLASSES: Record<ComponentSize, string> = {
  sm: 'status-badge--sm',
  md: 'status-badge--md',
  lg: 'status-badge--lg',
};

/**
 * Mapping des tailles d'icônes vers les classes CSS
 */
export const STATUS_BADGE_ICON_SIZE_CLASSES: Record<ComponentSize, string> = {
  sm: 'status-badge__icon--sm',
  md: 'status-badge__icon--md',
  lg: 'status-badge__icon--lg',
};

/**
 * Classes pour le texte du label
 */
export const STATUS_BADGE_LABEL_CLASS = 'status-badge__label';

/**
 * Role ARIA pour l'accessibilité
 */
export const STATUS_BADGE_ARIA_ROLE = 'status';
