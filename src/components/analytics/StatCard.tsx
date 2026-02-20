import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

export interface StatCardProps {
  /** Valeur numérique à afficher */
  value: number;
  /** Label descriptif */
  label: string;
  /** Niveau de risque (aligné avec sh-stock-prediction-card) */
  riskLevel?: 'default' | 'critical' | 'high' | 'medium' | 'low';
  /** Si la carte est sélectionnée/active */
  selected?: boolean;
  /** Handler de clic */
  onClick?: () => void;
  /** Classes CSS additionnelles */
  className?: string;
  /** Label d'accessibilité pour lecteurs d'écran */
  'aria-label'?: string;
}

/**
 * Composant StatCard pour afficher les statistiques avec filtres
 * Wrapper React pour le web component sh-stat-card du Design System
 * Utilisé dans la page Analytics pour afficher Total, Critical, High, Medium, Low
 */
export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  riskLevel = 'default',
  selected = false,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLElement>(null);

  // Écouter l'événement sh-stat-click du web component
  useEffect(() => {
    const handleClick = () => {
      onClick?.();
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('sh-stat-click', handleClick);
      return () => card.removeEventListener('sh-stat-click', handleClick);
    }
  }, [onClick]);

  // Utiliser useEffect pour assigner la propriété selected via JavaScript
  React.useEffect(() => {
    if (cardRef.current) {
      customElements.whenDefined('sh-stat-card').then(() => {
        if (cardRef.current) {
          // @ts-expect-error - propriété native du web component
          cardRef.current.selected = selected;
        }
      });
    }
  }, [selected]);

  return React.createElement('sh-stat-card', {
    ref: cardRef,
    label: label,
    value: value.toString(),
    'risk-level': riskLevel,
    'data-theme': theme,
    'aria-label': ariaLabel,
    className: className,
  });
};
