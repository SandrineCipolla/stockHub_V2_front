import React from 'react';
import { Sparkles, TrendingDown } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { logger } from '@/utils/logger';
import type { AISuggestion } from '@/utils/aiPredictions';

// Type pour les alertes IA du web component
interface IaAlert {
  product: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface AIAlertBannerWrapperProps {
  suggestions: AISuggestion[];
  isLoading?: boolean;
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
 * Wrapper React pour le web component sh-ia-alert-banner.
 * Affiche un badge "IA" (Sparkles) pour les suggestions LLM
 * et "Calcul" (TrendingDown) pour les suggestions déterministes.
 * Gère un état de chargement (skeleton) et un message de source en pied.
 */
export const AIAlertBannerWrapper: React.FC<AIAlertBannerWrapperProps> = ({
  suggestions,
  isLoading = false,
  className = '',
}) => {
  const { theme } = useTheme();

  // Skeleton pendant le chargement LLM (plus long qu'un calcul local)
  if (isLoading) {
    return (
      <div
        className="animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 h-16"
        aria-label="Chargement des suggestions IA..."
        role="status"
        data-testid="suggestions-loading"
      />
    );
  }

  // Si aucune suggestion, ne rien afficher
  if (suggestions.length === 0) {
    return null;
  }

  // Convertir les suggestions en alertes pour le DS
  const alerts: IaAlert[] = suggestions.map(suggestion => ({
    product: suggestion.stockName,
    message: suggestion.title,
    severity: priorityToSeverity(suggestion.priority),
  }));

  // Calculer la severity dominante
  const dominantSeverity = getDominantSeverity(suggestions);

  // Message personnalisé selon le nombre
  const message =
    suggestions.length === 1
      ? 'stock nécessite votre attention'
      : 'stocks nécessitent votre attention';

  // Handler pour le clic sur un item
  const handleItemClick = (e: Event) => {
    const detail = e instanceof CustomEvent ? e.detail : null;
    logger.debug('Alert item clicked:', detail);
    // TODO: Navigation vers le stock concerné
  };

  // Distinction source : llm vs déterministe
  const llmCount = suggestions.filter(s => s.source === 'llm').length;
  const deterministicCount = suggestions.filter(s => s.source === 'deterministic').length;
  const hasLLM = llmCount > 0;

  return (
    <div className={className}>
      {/* Badges source */}
      <div className="flex items-center gap-2 mb-2 text-xs">
        {hasLLM && (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300 font-medium"
            data-testid="badge-llm"
          >
            <Sparkles size={11} aria-hidden="true" />
            IA ({llmCount})
          </span>
        )}
        {deterministicCount > 0 && (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-medium"
            data-testid="badge-deterministic"
          >
            <TrendingDown size={11} aria-hidden="true" />
            Calcul ({deterministicCount})
          </span>
        )}
      </div>

      {React.createElement('sh-ia-alert-banner', {
        count: suggestions.length,
        severity: dominantSeverity,
        message,
        alerts: alerts,
        expanded: false,
        'data-theme': theme,
        'onsh-ia-alert-item-click': handleItemClick,
      })}

      {/* Message de source en pied */}
      <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500" data-testid="source-footer">
        {hasLLM
          ? 'Propulsé par IA \u2022 Mistral via OpenRouter'
          : 'Suggestions basées sur vos données'}
      </p>
    </div>
  );
};
