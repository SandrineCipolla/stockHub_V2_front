import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { MetricCardProps } from '@/types';

// Mapping des noms d'icônes vers les noms Lucide (PascalCase)
const iconMap: Record<string, string> = {
  package: 'Package',
  'alert-triangle': 'AlertTriangle',
  'trending-up': 'TrendingUp',
  'trending-down': 'TrendingDown',
};

// Mapping des couleurs vers les variants du web component
const colorToVariantMap: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  success: 'success',
  warning: 'warning',
  info: 'default',
  danger: 'danger',
};

/**
 * Wrapper React pour le web component sh-metric-card
 * Mappe les props React vers les attributs du web component
 */
export const MetricCardWrapper: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  change,
  className = '',
}) => {
  const { theme } = useTheme();

  // Convertir le nom d'icône
  const iconName = iconMap[icon] || 'Package';

  // Convertir la couleur en variant
  const variant = colorToVariantMap[color] || 'default';

  // Convertir change en trend et trend-value
  const trend = change?.type || 'neutral';
  const trendValue = change ? `${change.type === 'increase' ? '+' : '-'}${change.value}` : '';

  return React.createElement('sh-metric-card', {
    icon: iconName,
    label: title,
    value: typeof value === 'number' ? value.toString() : value,
    trend: trend,
    'trend-value': trendValue,
    variant: variant,
    'data-theme': theme,
    className: className,
  });
};
