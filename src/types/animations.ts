// ========================================
// TYPES ANIMATIONS - FRAMER MOTION
// ========================================

/**
 * Types d'easing supportés par Framer Motion
 */
export type EasingType =
    | 'linear'
    | 'easeIn'
    | 'easeOut'
    | 'easeInOut'
    | 'circIn'
    | 'circOut'
    | 'circInOut'
    | 'backIn'
    | 'backOut'
    | 'backInOut'
    | 'anticipate';

/**
 * Configuration de transition pour Framer Motion
 */
export interface AnimationTransition {
    duration?: number;
    delay?: number;
    ease?: EasingType | number[];
    type?: 'spring' | 'tween' | 'inertia';
    stiffness?: number;
    damping?: number;
    mass?: number;
}

/**
 * Variantes d'animation pour un composant
 */
export interface AnimationVariants {
    hidden?: Record<string, unknown>;
    visible?: Record<string, unknown>;
    exit?: Record<string, unknown>;
    hover?: Record<string, unknown>;
}
