// ========================================
// TYPES API ET ÉTAT ASYNCHRONE
// ========================================

/**
 * État asynchrone générique pour les opérations API
 */
export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

/**
 * Structure d'erreur de validation
 */
export interface ValidationError {
    field: string;
    message: string;
    code?: string;
}
