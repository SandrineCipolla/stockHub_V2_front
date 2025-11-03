// ========================================
// TYPES UTILITAIRES ET GÉNÉRIQUES
// ========================================

// Utility types génériques
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type WithId<T> = T & { readonly id: string | number };

// Types pour les fonctions de callback courantes
export type EventHandler<T = void> = () => T;
