import React from 'react';
import {STOCK_STATUS_CONFIG} from '@/constants/stockConfig';
import {useTheme} from '@/hooks/useTheme';

import {StatusBadgeProps} from "@/types";
import {
    STATUS_BADGE_ARIA_ROLE,
    STATUS_BADGE_BASE_CLASSES,
    STATUS_BADGE_ICON_SIZE_CLASSES,
    STATUS_BADGE_LABEL_CLASS,
    STATUS_BADGE_SIZE_CLASSES
} from '@/constants/statusBadge';
import '@/styles/StatusBadge.css';

/**
 * Badge de statut de stock avec couleurs et icône différenciées
 * Composant spécialisé pour afficher les statuts de stocks (5 statuts)
 *
 * @remarks
 * Utilise des classes CSS custom pour une meilleure maintenabilité
 * au lieu de strings Tailwind inline répétées
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

    // Récupération des classes de couleur selon le thème
    const colorClasses = theme === 'dark'
        ? config.colors.dark.badge
        : config.colors.light.badge;

    // Construction des classes CSS avec les constantes
    const badgeClasses = [
        STATUS_BADGE_BASE_CLASSES,
        STATUS_BADGE_SIZE_CLASSES[size],
        colorClasses,
        className
    ].filter(Boolean).join(' ');

    return (
        <span
            className={badgeClasses}
            role={STATUS_BADGE_ARIA_ROLE}
            aria-label={`Statut: ${config.label}`}
        >
            {showIcon && (
                <Icon
                    className={STATUS_BADGE_ICON_SIZE_CLASSES[size]}
                    aria-hidden="true"
                />
            )}
            <span className={STATUS_BADGE_LABEL_CLASS}>
                {config.label}
            </span>
        </span>
    );
};

StatusBadge.displayName = 'StatusBadge';