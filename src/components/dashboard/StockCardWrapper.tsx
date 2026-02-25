import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { logger } from '@/utils/logger';
import type { StockCardProps } from '@/types';
import type { WebComponentStatus } from '@/types/web-component-events';
import type { StockStatus, Stock } from '@/types/stock';
import { formatQuantityWithUnit } from '@/utils/unitFormatter';
import { recordUsage } from '@/utils/containerManager';

// Conversion du format StockStatus vers le format du web component
const convertStatusToWebComponent = (status: StockStatus): WebComponentStatus => {
  const statusMap: Record<StockStatus, WebComponentStatus> = {
    optimal: 'optimal',
    low: 'low',
    critical: 'critical',
    outOfStock: 'out-of-stock',
    overstocked: 'overstocked',
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
  aiSuggestions = [],
}) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLElement>(null);
  const [localStock, setLocalStock] = useState<Stock>(stock);

  // Mettre à jour le stock local quand le stock parent change
  useEffect(() => {
    setLocalStock(stock);
  }, [stock]);

  // Assigner les propriétés complexes via JavaScript (iaCount)
  useEffect(() => {
    if (cardRef.current && aiSuggestions.length > 0) {
      customElements.whenDefined('sh-stock-card').then(() => {
        if (cardRef.current) {
          // @ts-expect-error - propriété native du web component
          cardRef.current.iaCount = aiSuggestions.length;
        }
      });
    }
  }, [aiSuggestions]);

  // Handler pour le bouton "Enregistrer session"
  const handleSessionClick = () => {
    if (localStock.unit !== 'percentage') return;

    try {
      const result = recordUsage(localStock);
      setLocalStock({
        ...localStock,
        quantity: result.newQuantity,
      });
      logger.info(result.message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error(errorMessage);
    }
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
    id: `stock-card-${localStock.id}`,
    name: localStock.label,
    category: localStock.category || '',
    'last-update': `Mis à jour il y a ${localStock.lastUpdate}`,
    percentage:
      localStock.unit === 'percentage' && localStock.quantity !== undefined
        ? localStock.quantity.toString()
        : undefined,
    quantity: formatQuantityWithUnit(localStock.quantity, localStock.unit),
    value: localStock.value !== undefined ? `€${localStock.value.toLocaleString()}` : '-',
    status: convertStatusToWebComponent(localStock.status),
    'data-theme': theme,
    className: className,
    'onsh-session-click': handleSessionClick,
    'onsh-details-click': handleDetailsClick,
    'onsh-edit-click': handleEditClick,
    'onsh-delete-click': handleDeleteClick,
  });
};
