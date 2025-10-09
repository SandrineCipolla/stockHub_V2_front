// components/common/StatusBadge.tsx
import React from 'react';
import {STOCK_STATUS_CONFIG} from '@/types/stock';
import {useTheme} from '@/hooks/useTheme';
import type {ComponentSize} from '@/types/ui';
import {StatusBadgeProps} from "@/types";


/**
 * Badge de statut de stock avec couleurs et icône différenciées
 * Composant spécialisé pour afficher les statuts de stocks (5 statuts)
 *
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
                                                            status,
                                                            showIcon = true,
                                                            size = 'md',
                                                            className = ''
                                                        }) => {
    const { theme } = useTheme();
    const config = STOCK_STATUS_CONFIG[status];
    const Icon = config.icon;

    // Classes de taille
    const sizeClasses: Record<ComponentSize, string> = {
        sm: 'px-2 py-0.5 text-xs gap-1',
        md: 'px-3 py-1 text-sm gap-1.5',
        lg: 'px-4 py-1.5 text-base gap-2'
    };

    const iconSizes: Record<ComponentSize, string> = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    // Récupération des classes de couleur selon le thème
    const colorClasses = theme === 'dark'
        ? config.colors.dark.badge
        : config.colors.light.badge;

    return (
        <span
            className={`
        inline-flex items-center
        rounded-full font-medium border
        transition-all duration-200
        ${sizeClasses[size]}
        ${colorClasses}
        ${className}
      `}
            role="status"
            aria-label={`Statut: ${config.label}`}
        >
      {showIcon && <Icon className={iconSizes[size]} aria-hidden="true" />}
            <span>{config.label}</span>
    </span>
    );
};

StatusBadge.displayName = 'StatusBadge';