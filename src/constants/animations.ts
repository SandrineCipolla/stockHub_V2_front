/**
 * Animation constants for consistent motion design across the application
 * All durations are in seconds, all distances in pixels
 */

/**
 * StockCard animation configuration
 */
export const STOCK_CARD_ANIMATION = {
  // Entrance animation
  INITIAL_Y_OFFSET: 50,
  INITIAL_SCALE: 0.95,
  ENTRANCE_DURATION: 0.6,
  CASCADE_DELAY: 0.12, // Delay between each card in grid
  EASING: [0.25, 0.46, 0.45, 0.94] as const, // easeOutQuad

  // Exit animation
  EXIT_Y_OFFSET: -16,
  EXIT_DURATION: 0.3,
  EXIT_SCALE: 0.95,

  // Hover animation
  HOVER_SCALE: 1.02,
  HOVER_Y_OFFSET: -4,
  HOVER_DURATION: 0.2,
} as const;

/**
 * MetricCard counter animation configuration
 */
export const METRIC_CARD_ANIMATION = {
  COUNTER_DURATION: 1.2,
  EASING_FACTOR: -10, // For easeOutExpo calculation
} as const;

/**
 * Reduced motion fallback duration (for accessibility)
 */
export const REDUCED_MOTION_DURATION = 0.01;
