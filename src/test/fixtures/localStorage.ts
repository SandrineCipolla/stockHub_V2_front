/**
 * Mock localStorage pour les tests
 * Simule le comportement de localStorage avec un store en mémoire
 */

export interface LocalStorageMock {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
    clear: () => void;
}

/**
 * Crée une instance mock de localStorage avec un store isolé
 */
export const createLocalStorageMock = (): LocalStorageMock => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
};

/**
 * Mock localStorage par défaut pour les tests
 */
export const localStorageMock = createLocalStorageMock();
