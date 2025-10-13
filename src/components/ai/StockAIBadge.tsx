/**
 * @fileoverview StockAIBadge - AI suggestion badge for StockCard
 * @description Shows AI badge with popover containing stock-specific suggestions
 */

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, AlertCircle, TrendingUp, Package, Settings } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { AISuggestion, SuggestionPriority, SuggestionType } from '@/utils/aiPredictions';

/**
 * Props for StockAIBadge component
 */
export interface StockAIBadgeProps {
  /** Stock ID to filter suggestions */
  stockId: number;
  /** All AI suggestions (will be filtered by stockId) */
  suggestions: AISuggestion[];
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
  'overstock': Package,
  'reorder-now': TrendingUp,
  'reorder-soon': TrendingUp,
  'optimize-stock': Settings,
};

/**
 * Animation variants
 */
const popoverVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.15,
    },
  },
};

const badgePulseVariants: Variants = {
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * StockAIBadge Component
 *
 * Displays a badge with AI suggestions count. When clicked, shows a popover
 * with detailed contextual AI suggestions for the specific stock.
 *
 * @component
 * @example
 * ```tsx
 * <StockAIBadge
 *   stockId={stock.id}
 *   suggestions={allSuggestions}
 * />
 * ```
 */
export function StockAIBadge({ stockId, suggestions, className = '' }: StockAIBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Filter suggestions for this stock
  const stockSuggestions = suggestions.filter(s => s.stockId === stockId);

  // Update popover position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Actual popover width with max-w constraint
      // Use full-width layout for narrow viewports (mobile + narrow desktop windows)
      const isNarrow = viewportWidth < 800;
      const maxPopoverWidth = isNarrow ? viewportWidth - 32 : Math.min(320, viewportWidth - 32); // 16px margin each side
      const popoverHeight = 400; // Approximate max height
      const margin = 16;

      let top = rect.bottom + 8;
      let left = rect.left + rect.width / 2;

      // For narrow screens, center in viewport instead of centering on button
      if (isNarrow) {
        left = viewportWidth / 2;
      } else {
        // Desktop: adjust if overflow
        const halfPopoverWidth = maxPopoverWidth / 2;

        // Check right overflow
        if (left + halfPopoverWidth > viewportWidth - margin) {
          left = viewportWidth - halfPopoverWidth - margin;
        }

        // Check left overflow
        if (left - halfPopoverWidth < margin) {
          left = halfPopoverWidth + margin;
        }
      }

      // Check bottom overflow - show above button if needed
      if (top + popoverHeight > viewportHeight - margin) {
        top = rect.top - popoverHeight - 8; // Show above

        // If still overflows, limit to viewport
        if (top < margin) {
          top = margin;
        }
      }

      setPosition({ top, left });
    }
  }, [isOpen]);

  // Close popover on scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      setIsOpen(false);
    };

    window.addEventListener('scroll', handleScroll, true); // Use capture phase
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  // No suggestions for this stock
  if (stockSuggestions.length === 0) {
    return null;
  }

  // Get highest priority for badge color
  const highestPriority = stockSuggestions.reduce((highest, current) => {
    const priorityOrder: Record<SuggestionPriority, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };
    return priorityOrder[current.priority] < priorityOrder[highest.priority] ? current : highest;
  }, stockSuggestions[0]);

  const colors = PRIORITY_COLORS[highestPriority.priority];
  const isCritical = highestPriority.priority === 'critical';

  // Border colors for popover based on highest priority
  const popoverBorderColors: Record<SuggestionPriority, string> = {
    critical: 'border-red-500 dark:border-red-400',
    high: 'border-amber-500 dark:border-amber-400',
    medium: 'border-blue-500 dark:border-blue-400',
    low: 'border-gray-400 dark:border-gray-500',
  };

  return (
    <>
      <div className={className}>
        {/* Badge Button */}
        <motion.button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`
            flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
            ${colors.bg} ${colors.text} ${colors.border} border
            hover:shadow-md transition-shadow duration-200
          `}
          variants={shouldReduceMotion || !isCritical ? undefined : badgePulseVariants}
          animate={shouldReduceMotion || !isCritical ? undefined : 'pulse'}
          aria-label={`${stockSuggestions.length} suggestion${stockSuggestions.length > 1 ? 's' : ''} IA pour ce stock`}
          aria-expanded={isOpen}
        >
          <Sparkles className="w-3 h-3" />
          <span>IA ({stockSuggestions.length})</span>
        </motion.button>
      </div>

      {/* Render popover in portal (outside of card overflow) */}
      {isOpen && createPortal(
        <AnimatePresence>
          <>
            {/* Backdrop to close popover - darker on mobile for better visibility */}
            <div
              className="fixed inset-0 z-[9998] bg-black/0 sm:bg-black/20 transition-colors duration-200"
              style={{
                backgroundColor: window.innerWidth < 800 ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)',
              }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Popover content - Always use left/right margins for reliability */}
            <motion.div
              className="fixed z-[9999]"
              style={{
                top: `${position.top}px`,
                left: '16px',
                right: '16px',
                width: 'auto',
                maxWidth: '380px',
                // Center on large screens by using auto margins
                marginLeft: window.innerWidth >= 800 ? 'auto' : '0',
                marginRight: window.innerWidth >= 800 ? 'auto' : '0',
              }}
              variants={shouldReduceMotion ? undefined : popoverVariants}
              initial={shouldReduceMotion ? undefined : 'hidden'}
              animate={shouldReduceMotion ? undefined : 'visible'}
              exit={shouldReduceMotion ? undefined : 'exit'}
            >
              <div className={`rounded-lg border-2 ${popoverBorderColors[highestPriority.priority]} bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/10`}>
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-gradient-to-br from-emerald-500 to-blue-500">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Suggestions IA
                    </h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Fermer les suggestions"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Suggestions List */}
                <div className="max-h-96 overflow-y-auto p-3 space-y-3">
                  {stockSuggestions.map((suggestion) => {
                    const Icon = TYPE_ICONS[suggestion.type];
                    const suggestionColors = PRIORITY_COLORS[suggestion.priority];

                    return (
                      <div
                        key={suggestion.id}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                      >
                        {/* Title + Priority */}
                        <div className="flex items-start gap-2 mb-2">
                          <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${suggestionColors.text}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                              {suggestion.title}
                            </p>
                          </div>
                          <span
                            className={`
                              px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap flex-shrink-0
                              ${suggestionColors.bg} ${suggestionColors.text} ${suggestionColors.border} border
                            `}
                          >
                            {suggestion.priority === 'critical' && 'Critique'}
                            {suggestion.priority === 'high' && 'Haute'}
                            {suggestion.priority === 'medium' && 'Moyenne'}
                            {suggestion.priority === 'low' && 'Basse'}
                          </span>
                        </div>

                        {/* Message */}
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {suggestion.message}
                        </p>

                        {/* Action & Impact */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-start gap-1.5">
                            <span className="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              Action :
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {suggestion.action}
                            </span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              Impact :
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {suggestion.impact}
                            </span>
                          </div>
                        </div>

                        {/* Confidence */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            Confiance :
                          </span>
                          <div className="flex items-center gap-1 flex-1">
                            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              {suggestion.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                    🤖 Suggestions basées sur l'analyse prédictive
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
