/**
 * @fileoverview SmartSuggestions - AI-powered suggestions component
 * @description Displays intelligent stock management suggestions with animations
 */

import { motion, type Variants } from 'framer-motion';
import { Sparkles, AlertCircle, TrendingUp, Package, Settings } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { AISuggestion, SuggestionPriority, SuggestionType } from '@/utils/aiPredictions';

/**
 * Props for SmartSuggestions component
 */
export interface SmartSuggestionsProps {
  /** Array of AI-generated suggestions */
  suggestions: AISuggestion[];
  /** Optional: Filter suggestions by stock ID */
  stockId?: number;
  /** Callback when user clicks "Apply" on a suggestion */
  onApply?: (suggestion: AISuggestion) => void;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Priority badge colors
 */
const PRIORITY_COLORS: Record<SuggestionPriority, { bg: string; text: string; border: string }> = {
  critical: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  high: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
  medium: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  low: {
    bg: 'bg-gray-50 dark:bg-gray-800/20',
    text: 'text-gray-700 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
  },
};

/**
 * Suggestion type icons
 */
const TYPE_ICONS: Record<SuggestionType, typeof AlertCircle> = {
  'rupture-risk': AlertCircle,
  overstock: Package,
  'reorder-now': TrendingUp,
  'reorder-soon': TrendingUp,
  'optimize-stock': Settings,
};

/**
 * Animation variants for stagger effect
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * SmartSuggestions Component
 *
 * Displays AI-powered stock management suggestions with priority badges,
 * confidence indicators, and action buttons. Features stagger animations
 * and gradient design.
 *
 * @component
 * @example
 * ```tsx
 * const suggestions = getTopAISuggestions(stocks, 5);
 *
 * <SmartSuggestions
 *   suggestions={suggestions}
 *   onApply={(suggestion) => {
 *     console.log('Applying:', suggestion.action);
 *   }}
 * />
 * ```
 */
export function SmartSuggestions({
  suggestions,
  stockId,
  onApply,
  className = '',
}: SmartSuggestionsProps) {
  const shouldReduceMotion = useReducedMotion();

  // Filter suggestions by stockId if provided
  const filteredSuggestions = stockId
    ? suggestions.filter(s => s.stockId === stockId)
    : suggestions;

  if (filteredSuggestions.length === 0) {
    return (
      <div
        className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-emerald-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Suggestions IA</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Aucune suggestion pour le moment. L'IA analyse vos stocks en continu.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 ${className}`}
    >
      {/* Header with AI icon */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Suggestions IA</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredSuggestions.length} recommandation{filteredSuggestions.length > 1 ? 's' : ''}{' '}
            basée{filteredSuggestions.length > 1 ? 's' : ''} sur l'analyse prédictive
          </p>
        </div>
      </div>

      {/* Suggestions list with stagger animation */}
      <motion.div
        className="space-y-4"
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial={shouldReduceMotion ? undefined : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'visible'}
      >
        {filteredSuggestions.map(suggestion => {
          const Icon = TYPE_ICONS[suggestion.type];
          const colors = PRIORITY_COLORS[suggestion.priority];

          return (
            <motion.article
              key={suggestion.id}
              className={`
                p-4 rounded-lg border ${colors.border}
                ${colors.bg}
                transition-all duration-200
                hover:shadow-md
              `}
              variants={shouldReduceMotion ? undefined : itemVariants}
            >
              {/* Header: Title + Priority Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <Icon className={`w-5 h-5 mt-0.5 ${colors.text}`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {suggestion.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {suggestion.message}
                    </p>
                  </div>
                </div>

                {/* Priority badge */}
                <span
                  className={`
                    px-2 py-1 rounded text-xs font-medium whitespace-nowrap
                    ${colors.bg} ${colors.text} ${colors.border} border
                  `}
                >
                  {suggestion.priority === 'critical' && 'Critique'}
                  {suggestion.priority === 'high' && 'Haute'}
                  {suggestion.priority === 'medium' && 'Moyenne'}
                  {suggestion.priority === 'low' && 'Basse'}
                </span>
              </div>

              {/* Action & Impact */}
              <div className="ml-8 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Action :</span>
                  <span className="text-gray-600 dark:text-gray-400">{suggestion.action}</span>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Impact :</span>
                  <span className="text-gray-600 dark:text-gray-400">{suggestion.impact}</span>
                </div>

                {/* Footer: Confidence + Apply button */}
                <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-500">Confiance :</span>
                    <div className="flex items-center gap-1">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            suggestion.confidence >= 85
                              ? 'bg-emerald-500'
                              : suggestion.confidence >= 75
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                          }`}
                          style={{ width: `${suggestion.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {suggestion.confidence}%
                      </span>
                    </div>
                  </div>

                  {onApply && (
                    <button
                      onClick={() => onApply(suggestion)}
                      className={`
                        px-3 py-1 rounded text-xs font-medium
                        bg-gray-900 dark:bg-gray-100
                        text-white dark:text-gray-900
                        hover:bg-gray-800 dark:hover:bg-gray-200
                        transition-colors duration-200
                      `}
                      aria-label={`Appliquer la suggestion pour ${suggestion.stockName}`}
                    >
                      Appliquer
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Footer info */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
          🤖 Suggestions générées par intelligence artificielle • Mise à jour en temps réel
        </p>
      </div>
    </div>
  );
}
