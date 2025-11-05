/**
 * Props de test réutilisables pour les composants
 * Centralise les configurations communes utilisées dans les tests
 */

import type { MetricCardProps } from '@/types';

/**
 * Props pour désactiver les animations dans les tests
 * Utilisé pour éviter les problèmes de timing et rendre les tests déterministes
 */
export const DISABLE_ANIMATION_PROPS: Partial<MetricCardProps> = {
    enableAnimation: false,
};

/**
 * Helper type pour les props de test avec animations désactivées
 */
export type TestPropsWithoutAnimation<T> = T & typeof DISABLE_ANIMATION_PROPS;

