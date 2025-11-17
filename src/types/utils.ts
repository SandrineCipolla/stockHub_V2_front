// ========================================
// TYPES UTILITAIRES ET GÉNÉRIQUES
// ========================================

// Utility types génériques
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type WithId<T> = T & { readonly id: string | number };

// Types pour les fonctions de callback courantes
export type EventHandler<T = void> = () => T;
export type ValueChangeHandler<T> = (value: T) => void;
export type FormSubmitHandler<T> = (data: T) => void | Promise<void>;

// Types pour les hooks personnalisés
export interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: unknown[]) => Promise<T>;
  reset: () => void;
}
