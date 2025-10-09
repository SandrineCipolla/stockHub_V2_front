// ========================================
// TYPES API ET ÉTAT ASYNCHRONE
// ========================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
    status: LoadingState;
    data: T | null;
    error: ApiError | null;
}

export interface ApiError {
    readonly code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: Date;
    statusCode?: number;
}

export interface ValidationError {
    field: string;
    message: string;
    code: 'required' | 'invalid' | 'min' | 'max' | 'pattern';
}
