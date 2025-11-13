import React from 'react';
import { CardWrapper } from '@/components/common/CardWrapper';

export interface StatCardProps {
    /** Valeur numérique à afficher */
    value: number;
    /** Label descriptif */
    label: string;
    /** Variante visuelle selon le niveau de risque */
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
    /** Si la carte est sélectionnée/active */
    selected?: boolean;
    /** Handler de clic */
    onClick?: () => void;
    /** Classes CSS additionnelles */
    className?: string;
}

/**
 * Composant StatCard pour afficher les statistiques avec filtres
 * Utilisé dans la page Analytics pour afficher Total, Critical, High, Medium, Low
 */
export const StatCard: React.FC<StatCardProps> = ({
    value,
    label,
    variant = 'default',
    selected = false,
    onClick,
    className = '',
}) => {
    // Mapper les couleurs de texte selon la variante
    const textColorClass = {
        default: '',
        primary: 'text-purple-600 dark:text-purple-400',
        success: 'text-emerald-600 dark:text-emerald-400',
        warning: 'text-amber-600 dark:text-amber-400',
        error: 'text-red-600 dark:text-red-400',
        info: 'text-blue-600 dark:text-blue-400',
    }[variant];

    return (
        <CardWrapper
            variant={variant}
            clickable={true}
            selected={selected}
            onClick={onClick}
            className={className}
        >
            <div className="text-center py-2">
                <div className={`text-2xl font-bold ${textColorClass}`}>
                    {value}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {label}
                </div>
            </div>
        </CardWrapper>
    );
};
