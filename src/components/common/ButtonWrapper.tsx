import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { ButtonProps } from '@/types';
import type { LucideIcon } from 'lucide-react';
import { Plus, Download, BarChart3, Search } from 'lucide-react';

// Mapping manuel des composants Lucide vers leurs noms
const iconMap = new Map<LucideIcon, string>([
    [Plus, 'Plus'],
    [Download, 'Download'],
    [BarChart3, 'BarChart3'],
    [Search, 'Search'],
]);

// Mapping des composants Lucide vers leurs noms (pour sh-button icon-before)
const getIconName = (IconComponent: LucideIcon | undefined): string | undefined => {
    if (!IconComponent) return undefined;

    // Chercher dans le mapping manuel
    const mappedName = iconMap.get(IconComponent);
    if (mappedName) return mappedName;

    // Fallback sur displayName si disponible
    return IconComponent.displayName || undefined;
};

/**
 * Wrapper React pour le web component sh-button
 * Mappe les props React vers les attributs du web component
 */
export const ButtonWrapper: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    icon,
    loading = false,
    children,
    className = '',
    disabled = false,
    onClick,
    ...props
}) => {
    const { theme } = useTheme();

    // Convertir le composant d'icône Lucide en nom de string
    const iconName = getIconName(icon);

    // Handler pour l'événement sh-button-click
    const handleClick = (e: Event) => {
        if (onClick && !disabled && !loading) {
            // Créer un event synthétique React-like pour compatibilité
            onClick(e as any);
        }
    };

    return React.createElement('sh-button', {
        variant,
        size,
        'icon-before': iconName,
        loading,
        disabled,
        'data-theme': theme,
        className,
        'onsh-button-click': handleClick,
        ...props
    }, children);
};
