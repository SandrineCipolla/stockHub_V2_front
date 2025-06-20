import React, {useCallback, useState} from 'react';


// ===== TYPES POUR ERREURS FRONT-END =====
export type FrontendErrorType =
    | 'validation'
    | 'storage'
    | 'permission'
    | 'file_upload'
    | 'export'
    | 'unknown';

export interface FrontendError {
    readonly id: string;
    type: FrontendErrorType;
    message: string;
    field?: string; // Pour erreurs de validation
    timestamp: Date;
    details?: Record<string, unknown>;
}

// ===== TYPES POUR ÉTATS DE CHARGEMENT =====
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncFrontendState<T> {
    data: T | null;
    loading: boolean;
    error: FrontendError | null;
    status: LoadingState;
}

// ===== HOOK PRINCIPAL POUR GESTION D'ÉTATS =====
export const useFrontendState = <T>(initialData: T | null = null) => {
    const [state, setState] = useState<AsyncFrontendState<T>>({
        data: initialData,
        loading: false,
        error: null,
        status: 'idle'
    });

    const setLoading = useCallback((loading: boolean): void => {
        setState(prev => ({
            ...prev,
            loading,
            status: loading ? 'loading' : prev.status,
            error: loading ? null : prev.error // Clear errors when loading
        }));
    }, []);

    const setData = useCallback((data: T): void => {
        setState({
            data,
            loading: false,
            error: null,
            status: 'success'
        });
    }, []);

    const setError = useCallback((error: FrontendError): void => {
        setState(prev => ({
            ...prev,
            loading: false,
            error,
            status: 'error'
        }));
    }, []);

    const reset = useCallback((): void => {
        setState({
            data: initialData,
            loading: false,
            error: null,
            status: 'idle'
        });
    }, [initialData]);

    return {
        ...state,
        setLoading,
        setData,
        setError,
        reset,
        isIdle: state.status === 'idle',
        isLoading: state.status === 'loading',
        isSuccess: state.status === 'success',
        isError: state.status === 'error'
    };
};

// ===== HOOK POUR ACTIONS ASYNCHRONES SIMULÉES =====
export const useAsyncAction = <T, P extends any[] = []>(
    action: (...args: P) => Promise<T> | T,
    options: {
        onSuccess?: (data: T) => void;
        onError?: (error: FrontendError) => void;
        simulateDelay?: number; // Pour simuler une API
    } = {}
) => {
    const { simulateDelay = 0, onSuccess, onError } = options;
    const frontendState = useFrontendState<T>();

    const execute = useCallback(async (...args: P): Promise<T | null> => {
        frontendState.setLoading(true);

        try {
            // Simuler un délai (comme une vraie API)
            if (simulateDelay > 0) {
                await new Promise(resolve => setTimeout(resolve, simulateDelay));
            }

            const result = await Promise.resolve(action(...args));

            frontendState.setData(result);
            onSuccess?.(result);
            return result;
        } catch (error) {
            const frontendError = createFrontendError(
                'unknown',     // ← type en 1er
                error instanceof Error ? error.message : 'Une erreur est survenue', // ← message en 2ème
                undefined,     // ← field (optionnel)
                { originalError: error }  // ← details
            );

            frontendState.setError(frontendError);
            onError?.(frontendError);
            return null;
        }
    }, [action, frontendState, onSuccess, onError, simulateDelay]);

    return {
        ...frontendState,
        execute
    };
};

// ===== FONCTION UTILITAIRE POUR CRÉER DES ERREURS =====
export const createFrontendError = (
    type: FrontendErrorType,
    message: string,
    field?: string,                    // ✅ Peut ne pas être fourni
    details?: Record<string, unknown>  // ✅ Peut ne pas être fourni
): FrontendError => {
    const error: FrontendError = {
        id: Math.random().toString(36).substring(2, 9),
        type,
        message,
        timestamp: new Date()
    };

    // ✅ Ajout conditionnel
    if (field) error.field = field;
    if (details) error.details = details;

    return error;
};

// ===== HOOK POUR VALIDATION DE FORMULAIRES =====
export interface ValidationRule<T> {
    validator: (value: T) => boolean;
    message: string;
}

export const useFormValidation = <T extends Record<string, any>>(
    initialData: T,
    validationRules: Partial<Record<keyof T, ValidationRule<T[keyof T]>[]>>
) => {
    const [formData, setFormData] = useState<T>(initialData);
    const [errors, setErrors] = useState<Record<keyof T, FrontendError[]>>({} as Record<keyof T, FrontendError[]>);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateField = useCallback((field: keyof T, value: T[keyof T]): FrontendError[] => {
        const rules = validationRules[field];
        if (!rules) return [];

        const fieldErrors: FrontendError[] = [];
        for (const rule of rules) {
            if (!rule.validator(value)) {
                fieldErrors.push(createFrontendError(
                    'validation',
                    rule.message,
                    String(field),
                    { field: String(field), value },
                ));
            }
        }
        return fieldErrors;
    }, [validationRules]);

    const updateField = useCallback((field: keyof T, value: T[keyof T]): void => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Validation en temps réel
        const fieldErrors = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: fieldErrors }));
    }, [validateField]);

    const validateAll = useCallback((): boolean => {
        const allErrors: Record<keyof T, FrontendError[]> = {} as Record<keyof T, FrontendError[]>;
        let hasErrors = false;

        for (const field in formData) {
            const fieldErrors = validateField(field, formData[field]);
            allErrors[field] = fieldErrors;
            if (fieldErrors.length > 0) hasErrors = true;
        }

        setErrors(allErrors);
        return !hasErrors;
    }, [formData, validateField]);

    const submit = useCallback(async (
        onSubmit: (data: T) => Promise<void> | void
    ): Promise<boolean> => {
        setIsSubmitting(true);

        try {
            const isValid = validateAll();
            if (!isValid) {
                setIsSubmitting(false);
                return false;
            }

            await Promise.resolve(onSubmit(formData));
            setIsSubmitting(false);
            return true;
        } catch (error) {
            setIsSubmitting(false);
            throw error;
        }
    }, [formData, validateAll]);

    const reset = useCallback((): void => {
        setFormData(initialData);
        setErrors({} as Record<keyof T, FrontendError[]>);
        setIsSubmitting(false);
    }, [initialData]);

    const hasErrors = Object.values(errors).some(fieldErrors => fieldErrors.length > 0);
    const getFieldError = (field: keyof T): string | undefined =>
        errors[field]?.[0]?.message;

    return {
        formData,
        errors,
        isSubmitting,
        hasErrors,
        updateField,
        validateAll,
        submit,
        reset,
        getFieldError
    };
};

// ===== HOOK POUR GESTION DE FICHIERS =====
export const useFileHandler = () => {
    const fileState = useFrontendState<File[]>([]);

    const validateFile = useCallback((file: File): FrontendError | null => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/csv'];

        if (file.size > maxSize) {
            return createFrontendError(
                'file_upload',
                'Le fichier est trop volumineux (max 10MB)',
                undefined,
                { fileName: file.name, size: file.size }


            );
        }

        if (!allowedTypes.includes(file.type)) {
            return createFrontendError(
                'file_upload',
                'Type de fichier non autorisé',
                undefined,
                { fileName: file.name, type: file.type }
            );
        }

        return null;
    }, []);

    const handleFiles = useCallback(async (files: FileList | File[]): Promise<File[]> => {
        fileState.setLoading(true);

        try {
            const fileArray = Array.from(files);
            const validFiles: File[] = [];

            for (const file of fileArray) {
                const error = validateFile(file);
                if (error) {
                    throw error;
                }
                validFiles.push(file);
            }

            // Simuler un délai de traitement
            await new Promise(resolve => setTimeout(resolve, 500));

            fileState.setData(validFiles);
            return validFiles;
        } catch (error) {
            if (error instanceof Object && 'type' in error) {
                fileState.setError(error as FrontendError);
            } else {
                fileState.setError(createFrontendError(
                    'file_upload',
                    'Erreur lors du traitement des fichiers',
                    undefined,
                    { error }
                ));
            }
            return [];
        }
    }, [fileState, validateFile]);

    return {
        ...fileState,
        handleFiles,
        validateFile
    };
};

// ===== HOOK POUR EXPORT DE DONNÉES =====
export const useDataExport = () => {
    const exportState = useFrontendState<Blob>();

    const exportToCsv = useCallback(async <T extends Record<string, any>>(
        data: T[],
        filename: string = 'export.csv'
    ): Promise<boolean> => {
        exportState.setLoading(true);

        try {
            if (data.length === 0) {
                throw createFrontendError(
                    'export',
                    'Aucune donnée à exporter',
                );
            }

            // Simuler le temps de génération
            await new Promise(resolve => setTimeout(resolve, 800));

            // Créer CSV
            const headers = Object.keys(data[0]);
            const csvContent = [
                headers.join(','),
                ...data.map(row => headers.map(header =>
                    `"${String(row[header]).replace(/"/g, '""')}"`
                ).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

            // Télécharger le fichier
            const link = document.createElement('a');
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }

            exportState.setData(blob);
            return true;
        } catch (error) {
            if (error instanceof Object && 'type' in error) {
                exportState.setError(error as FrontendError);
            } else {
                exportState.setError(createFrontendError(
                    'export',
                    'Erreur lors de l\'export',
                    undefined,
                    { error }
                ));
            }
            return false;
        }
    }, [exportState]);

    return {
        ...exportState,
        exportToCsv
    };
};

// ===== HOOK POUR LOCAL STORAGE AVEC GESTION D'ERREURS =====
export const useLocalStorageState = <T>(
    key: string,
    initialValue: T
) => {
    const storageState = useFrontendState<T>(initialValue);

    const setValue = useCallback((value: T | ((prev: T) => T)): void => {
        try {
            const valueToStore = value instanceof Function ? value(storageState.data || initialValue) : value;

            localStorage.setItem(key, JSON.stringify(valueToStore));
            storageState.setData(valueToStore);
        } catch (error) {
            storageState.setError(createFrontendError(
                'storage',
                'Impossible de sauvegarder dans le stockage local',
                undefined,
                { key, error }
            ));
        }
    }, [key, storageState, initialValue]);

    const removeValue = useCallback((): void => {
        try {
            localStorage.removeItem(key);
            storageState.setData(initialValue);
        } catch (error) {
            storageState.setError(createFrontendError(
                'storage',
                'Impossible de supprimer du stockage local',
                undefined,
                { key, error }
            ));
        }
    }, [key, storageState, initialValue]);

    // Initialiser depuis localStorage
    React.useEffect(() => {
        try {
            const item = localStorage.getItem(key);
            if (item) {
                const parsed = JSON.parse(item);
                storageState.setData(parsed);
            }
        } catch (error) {
            storageState.setError(createFrontendError(
                'storage',
                'Impossible de lire depuis le stockage local',
                undefined,
                { key, error }
            ));
        }
    }, [key, storageState]);

    return {
        value: storageState.data,
        setValue,
        removeValue,
        loading: storageState.loading,
        error: storageState.error
    };
};