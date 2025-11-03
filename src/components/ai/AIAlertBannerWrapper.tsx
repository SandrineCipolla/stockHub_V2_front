import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { AISuggestion } from '@/utils/aiPredictions';

// Type pour les alertes IA du web component
interface IaAlert {
    product: string;
    message: string;
    severity: 'critical' | 'warning' | 'info';
}

export interface AIAlertBannerWrapperProps {
    suggestions: AISuggestion[];
    className?: string;
}

/**
 * Convertit une priorité en severity
 */
const priorityToSeverity = (priority: string): 'critical' | 'warning' | 'info' => {
    if (priority === 'critical') return 'critical';
    if (priority === 'high') return 'warning';
    return 'info';
};

/**
 * Détermine la severity dominante d'un ensemble de suggestions
 */
const getDominantSeverity = (suggestions: AISuggestion[]): 'critical' | 'warning' | 'info' => {
    const hasCritical = suggestions.some(s => s.priority === 'critical');
    const hasHigh = suggestions.some(s => s.priority === 'high');

    if (hasCritical) return 'critical';
    if (hasHigh) return 'warning';
    return 'info';
};

/**
 * Wrapper React pour le web component sh-ia-alert-banner
 * Transforme les AISuggestion en format compatible IaAlert
 */
export const AIAlertBannerWrapper: React.FC<AIAlertBannerWrapperProps> = ({
    suggestions,
    className = ''
}) => {
    const { theme } = useTheme();

    // Si aucune suggestion, ne rien afficher
    if (suggestions.length === 0) {
        return null;
    }

    // Convertir les suggestions en alertes pour le DS
    const alerts: IaAlert[] = suggestions.map(suggestion => ({
        product: suggestion.stockName,
        message: suggestion.title,
        severity: priorityToSeverity(suggestion.priority)
    }));

    // Calculer la severity dominante
    const dominantSeverity = getDominantSeverity(suggestions);

    // Message personnalisé selon le nombre
    const message = suggestions.length === 1
        ? 'stock nécessite votre attention'
        : 'stocks nécessitent votre attention';

    // Handler pour le clic sur un item
    const handleItemClick = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        console.log('🤖 Alert item clicked:', detail);
        // TODO: Navigation vers le stock concerné
    };

    return React.createElement('sh-ia-alert-banner', {
        count: suggestions.length,
        severity: dominantSeverity,
        message,
        alerts: alerts,
        expanded: false, // Repliée par défaut
        'data-theme': theme,
        className,
        'onsh-ia-alert-item-click': handleItemClick
    });
};
