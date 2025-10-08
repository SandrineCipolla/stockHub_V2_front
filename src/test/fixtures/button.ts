import type {ButtonVariant} from '@/types';

/**
 * Variantes de button disponibles pour les tests
 */
export const buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'ghost'];

/**
 * Cas d'usage métier StockHub pour les boutons
 */
export const stockHubButtonUseCases: Record<string, { variant: ButtonVariant; label: string }> = {
    addStock: {
        variant: 'primary',
        label: 'Ajouter Stock',
    },
    export: {
        variant: 'secondary',
        label: 'Exporter',
    },
    viewDetails: {
        variant: 'ghost',
        label: 'Voir Détails',
    },
};