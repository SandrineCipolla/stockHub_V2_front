/**
 * Logger conditionnel pour StockHub V2
 *
 * En développement : Tous les logs sont affichés
 * En production : Seulement les erreurs et warnings
 *
 * Avantages :
 * - Pas de pollution de console en production
 * - Les erreurs critiques restent visibles pour le débogage
 * - Pas besoin de drop_console dans Terser
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * Logs de débogage - Seulement en développement
   * @example logger.debug('User clicked button', { userId: 123 });
   */
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.debug('🐛 [DEBUG]', ...args);
    }
  },

  /**
   * Logs d'information - Seulement en développement
   * @example logger.log('Fetching stocks...');
   */
  log: (...args: unknown[]) => {
    if (isDev) {
      console.log('ℹ️ [INFO]', ...args);
    }
  },

  /**
   * Warnings - Affichés en dev ET production
   * @example logger.warn('Stock level is low', { stockId: 'ABC123' });
   */
  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn('⚠️ [WARN]', ...args);
    } else {
      // En production, simplifier le format
      console.warn(...args);
    }
  },

  /**
   * Erreurs - TOUJOURS affichées (dev ET production)
   * @example logger.error('Failed to save stock', error);
   */
  error: (...args: unknown[]) => {
    if (isDev) {
      console.error('❌ [ERROR]', ...args);
    } else {
      // En production, garder les erreurs pour le débogage
      console.error(...args);
    }
  },

  /**
   * Logs de performance - Seulement en développement
   * @example logger.perf('Stock rendering took', duration, 'ms');
   */
  perf: (message: string, duration: number, unit = 'ms') => {
    if (isDev) {
      console.log(`⚡ [PERF] ${message}: ${duration}${unit}`);
    }
  },

  /**
   * Groupe de logs - Seulement en développement
   * @example
   * logger.group('Stock Update');
   * logger.log('Old value:', oldStock);
   * logger.log('New value:', newStock);
   * logger.groupEnd();
   */
  group: (label: string) => {
    if (isDev) {
      console.group(`📦 ${label}`);
    }
  },

  groupEnd: () => {
    if (isDev) {
      console.groupEnd();
    }
  },
};

/**
 * Helper pour logger les performances d'une fonction
 * @example
 * const result = await measurePerf('Fetch stocks', () => fetchStocks());
 */
export async function measurePerf<T>(
  label: string,
  fn: () => Promise<T> | T
): Promise<T> {
  if (!isDev) {
    return await fn();
  }

  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logger.perf(label, Math.round(duration));
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`${label} failed after ${Math.round(duration)}ms`, error);
    throw error;
  }
}
