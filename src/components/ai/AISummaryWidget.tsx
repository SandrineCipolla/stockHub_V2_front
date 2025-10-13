/**
 * @fileoverview AISummaryWidget - Compact AI summary for Dashboard
 * @description Shows overview of AI suggestions with sparkles icon
 */

import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { AISuggestion } from '@/utils/aiPredictions';

/**
 * Props for AISummaryWidget component
 */
export interface AISummaryWidgetProps {
  /** Array of AI-generated suggestions */
  suggestions: AISuggestion[];
  /** Optional CSS class name */
  className?: string;
}

/**
 * Count suggestions by priority
 */
function countByPriority(suggestions: AISuggestion[]) {
  return {
    critical: suggestions.filter(s => s.priority === 'critical').length,
    high: suggestions.filter(s => s.priority === 'high').length,
    medium: suggestions.filter(s => s.priority === 'medium').length,
    low: suggestions.filter(s => s.priority === 'low').length,
  };
}

/**
 * Animation variants
 */
const containerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * AISummaryWidget Component
 *
 * Compact widget showing AI suggestions summary with expandable details.
 * Uses sparkles icon as requested by user.
 *
 * @component
 * @example
 * ```tsx
 * const suggestions = getTopAISuggestions(stocks, 5);
 *
 * <AISummaryWidget suggestions={suggestions} />
 * ```
 */
export function AISummaryWidget({ suggestions, className = '' }: AISummaryWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const counts = countByPriority(suggestions);
  const totalCount = suggestions.length;

  // No suggestions
  if (totalCount === 0) {
    return (
      <motion.div
        className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 ${className}`}
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial={shouldReduceMotion ? undefined : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'visible'}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Aucune suggestion IA pour le moment
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              L'IA analyse vos stocks en continu
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 ${className}`}
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      animate={shouldReduceMotion ? undefined : 'visible'}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200 rounded-lg"
        aria-expanded={isExpanded}
        aria-controls="ai-summary-details"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              🤖 {totalCount} stock{totalCount > 1 ? 's' : ''} nécessite{totalCount > 1 ? 'nt' : ''} votre attention
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {counts.critical > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                  {counts.critical} Critique{counts.critical > 1 ? 's' : ''}
                </span>
              )}
              {counts.high > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  {counts.high} Haute{counts.high > 1 ? 's' : ''}
                </span>
              )}
              {counts.medium > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {counts.medium} Moyenne{counts.medium > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="ai-summary-details"
            variants={shouldReduceMotion ? undefined : contentVariants}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
            exit={shouldReduceMotion ? undefined : 'exit'}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Suggestions détaillées disponibles dans chaque carte de stock
                </p>
                <ul className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      className="flex items-start gap-2 text-xs"
                    >
                      <span className="mt-0.5">•</span>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {suggestion.stockName}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {' '}
                          - {suggestion.title}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
