// ========================================
// TYPES API ET ÉTAT ASYNCHRONE
// ========================================

import type {LoadingState} from './error';

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
