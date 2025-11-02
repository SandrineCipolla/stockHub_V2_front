import React, {useEffect, useRef} from 'react';
import {useTheme} from '@/hooks/useTheme';
import type {StockCardProps} from '@/types';
import type {WebComponentStatus} from '@/types/web-component-events';
import type {StockStatus} from '@/types/stock';
import {formatQuantityWithUnit} from '@/utils/unitFormatter';

// Conversion du format StockStatus vers le format du web component
const convertStatusToWebComponent = (status: StockStatus): WebComponentStatus => {
    const statusMap: Record<StockStatus, WebComponentStatus> = {
        optimal: 'optimal',
        low: 'low',
        critical: 'critical',
        outOfStock: 'out-of-stock',
        overstocked: 'overstocked'
    };
    return statusMap[status];
};

/**
 * Wrapper React pour le web component sh-stock-card
 * Mappe les props React vers les attributs du web component
 */
export const StockCardWrapper: React.FC<StockCardProps> = ({
    stock,
    onView,
    onEdit,
    onDelete,
    className = '',
    aiSuggestions = []
}) => {
    const { theme } = useTheme();
    const cardRef = useRef<HTMLElement>(null);

    // Assigner les propriétés complexes via JavaScript (iaCount)
    useEffect(() => {
        if (cardRef.current && aiSuggestions.length > 0) {
            customElements.whenDefined('sh-stock-card').then(() => {
                if (cardRef.current) {
                    // @ts-ignore - propriété native du web component
                    cardRef.current.iaCount = aiSuggestions.length;
                }
            });
        }
    }, [aiSuggestions]);

    // Handler pour le bouton "Enregistrer session"
    const handleSessionClick = () => {
        console.log('Session clicked for stock:', stock.id);
        // TODO: Implémenter la logique de session
    };

    // Handler pour le bouton "Détails"
    const handleDetailsClick = () => {
        if (onView) {
            onView(stock.id);
        }
    };

    // Handler pour le bouton "Éditer"
    const handleEditClick = () => {
        if (onEdit) {
            onEdit(stock.id);
        }
    };

    // Handler pour le bouton "Supprimer"
    const handleDeleteClick = () => {
        if (onDelete) {
            onDelete(stock.id);
        }
    };

    return React.createElement('sh-stock-card', {
        ref: cardRef,
        id: `stock-card-${stock.id}`,
        name: stock.name,
        category: stock.category || '',
        'last-update': `Mis à jour il y a ${stock.lastUpdate}`,
        percentage: stock.unit === 'percentage' ? stock.quantity.toString() : '',
        quantity: formatQuantityWithUnit(stock.quantity, stock.unit),
        value: `€${stock.value.toLocaleString()}`,
        status: convertStatusToWebComponent(stock.status),
        'data-theme': theme,
        className: className,
        'onsh-session-click': handleSessionClick,
        'onsh-details-click': handleDetailsClick,
        'onsh-edit-click': handleEditClick,
        'onsh-delete-click': handleDeleteClick
    });
};
