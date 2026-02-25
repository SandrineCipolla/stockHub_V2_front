/**
 * Logger utilitaire pour StockHub V2
 *
 * En production (import.meta.env.PROD) : seuls warn et error s'affichent
 * En développement : tous les niveaux s'affichent (debug, info, warn, error)
 *
 * Interface identique à console : logger.info(), logger.warn(), logger.error(), logger.debug()
 */

const noop: (...args: unknown[]) => void = () => {};

const isProd = import.meta.env.PROD;

export const logger = {
  debug: isProd ? noop : console.debug.bind(console),
  info: isProd ? noop : console.info.bind(console),
  log: isProd ? noop : console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};
