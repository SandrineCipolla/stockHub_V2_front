import React from 'react';
import { useTheme } from '@/hooks/useTheme';

export interface CardProps {
    /** Variante visuelle de la carte */
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
    /** Taille de la carte */
    size?: 'sm' | 'md' | 'lg';
    /** Si la carte est cliquable */
    clickable?: boolean;
    /** Si la carte est sélectionnée/active */
    selected?: boolean;
    /** Désactiver la carte */
    disabled?: boolean;
    /** Classes CSS additionnelles */
    className?: string;
    /** Contenu de la carte */
    children?: React.ReactNode;
    /** Handler de clic */
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    /** Attributs HTML additionnels */
    [key: string]: unknown;
}

/**
 * Wrapper React pour le web component sh-card
 * Mappe les props React vers les attributs du web component
 */
export const CardWrapper: React.FC<CardProps> = ({
    variant = 'default',
    size = 'md',
    clickable = false,
    selected = false,
    disabled = false,
    className = '',
    children,
    onClick,
    ...props
}) => {
    const { theme } = useTheme();

    // Handler pour l'événement sh-card-click
    const handleClick = (e: Event) => {
        if (onClick && !disabled) {
            // Convertir Event natif en React MouseEvent
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            onClick(e as unknown as React.MouseEvent<HTMLElement>);
        }
    };

    return React.createElement('sh-card', {
        variant,
        size,
        clickable,
        selected,
        disabled,
        'data-theme': theme,
        className,
        'onsh-card-click': handleClick,
        ...props
    }, children);
};
