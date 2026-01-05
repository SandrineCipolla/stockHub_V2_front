// ========================================
// TYPES ERREURS FRONTEND
// ========================================

/**
 * Types d'erreurs possibles dans l'application
 */
export type FrontendErrorType =
  | 'validation'
  | 'storage'
  | 'permission'
  | 'file_upload'
  | 'export'
  | 'network'
  | 'unknown';

/**
 * Interface pour les erreurs frontend structurées
 */
export interface FrontendError {
  readonly id: string;
  type: FrontendErrorType;
  message: string;
  field?: string; // Pour erreurs de validation
  timestamp: Date;
  details?: Record<string, unknown>;
}

/**
 * État de chargement asynchrone
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * État asynchrone avec données, chargement et erreur
 */
export interface AsyncFrontendState<T> {
  data: T | null;
  loading: boolean;
  error: FrontendError | null;
  status: LoadingState;
}
