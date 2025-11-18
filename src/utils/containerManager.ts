/**
 * @fileoverview Container management utilities for creative/hobby stocks
 * @description Handles purchase and usage tracking for containers (tubes, bottles, etc.)
 *
 * @module containerManager
 * @category Utilities
 */

import type { Stock } from '@/types/stock';

/**
 * Result of a purchase operation
 */
export interface PurchaseResult {
  newQuantity: number; // Nouvelle quantité totale (en %)
  newContainersOwned: number; // Nouveau nombre de containers
  totalCapacity: number; // Capacité totale
  message: string; // Message de confirmation
}

/**
 * Result of a usage operation
 */
export interface UsageResult {
  newQuantity: number; // Nouvelle quantité après usage
  consumed: number; // Quantité consommée
  remainingSessions: number; // Sessions estimées restantes
  message: string; // Message de confirmation
}

/**
 * Purchases new containers and updates stock quantity
 *
 * @param stock - Current stock item
 * @param containersCount - Number of containers to purchase
 * @returns Updated quantity and container count
 *
 * @example
 * ```ts
 * // Acheter 2 tubes de peinture
 * const result = purchaseContainers(stock, 2);
 * console.log(result.message); // "2 tubes ajoutés. Nouveau total : 265%"
 * ```
 */
export function purchaseContainers(stock: Stock, containersCount: number): PurchaseResult {
  const unit = stock.unit ?? 'piece';

  // Validation : containers uniquement pour les unités en %
  if (unit !== 'percentage') {
    throw new Error(
      'purchaseContainers() est réservé aux stocks en pourcentage (tubes, bouteilles)'
    );
  }

  if (containersCount <= 0) {
    throw new Error('Le nombre de containers doit être positif');
  }

  const containerCapacity = stock.containerCapacity ?? 100;
  const currentContainers = stock.containersOwned ?? 0;
  const currentQuantity = stock.quantity;

  // Calcul
  const newContainersOwned = currentContainers + containersCount;
  const addedCapacity = containersCount * containerCapacity;
  const newQuantity = currentQuantity + addedCapacity;
  const totalCapacity = newContainersOwned * containerCapacity;

  return {
    newQuantity,
    newContainersOwned,
    totalCapacity,
    message: `${containersCount} tube${containersCount > 1 ? 's' : ''} ajouté${containersCount > 1 ? 's' : ''}. Nouveau total : ${newQuantity}% (${newContainersOwned} tube${newContainersOwned > 1 ? 's' : ''})`,
  };
}

/**
 * Records usage and decrements stock quantity
 *
 * @param stock - Current stock item
 * @param percentageUsed - Percentage consumed (optional, uses average if not specified)
 * @returns Updated quantity and usage stats
 *
 * @example
 * ```ts
 * // Session de peinture (usage moyen)
 * const result = recordUsage(stock);
 * console.log(result.message); // "Session enregistrée : -12%. Reste : 53%"
 *
 * // Usage personnalisé
 * const result = recordUsage(stock, 20);
 * console.log(result.message); // "Session enregistrée : -20%. Reste : 45%"
 * ```
 */
export function recordUsage(stock: Stock, percentageUsed?: number): UsageResult {
  const unit = stock.unit ?? 'piece';

  // Moyenne de consommation par session selon l'unité
  const defaultConsumption = getDefaultConsumption(unit);
  const consumed = percentageUsed ?? defaultConsumption;

  if (consumed <= 0) {
    throw new Error('La quantité consommée doit être positive');
  }

  const currentQuantity = stock.quantity;
  const newQuantity = Math.max(0, currentQuantity - consumed);

  // Calcul des sessions restantes
  const remainingSessions = Math.floor(newQuantity / defaultConsumption);

  return {
    newQuantity,
    consumed,
    remainingSessions,
    message: `Session enregistrée : -${consumed}%. Reste : ${newQuantity}% (~${remainingSessions} session${remainingSessions > 1 ? 's' : ''})`,
  };
}

/**
 * Gets default consumption rate based on unit type
 */
function getDefaultConsumption(unit: Stock['unit']): number {
  switch (unit) {
    case 'percentage':
      return 12; // 12% par session créative (tube de peinture)
    case 'ml':
    case 'liter':
      return 75; // 75ml par session
    case 'g':
    case 'kg':
      return 200; // 200g par utilisation
    case 'meter':
      return 1.5; // 1.5m par projet couture
    case 'piece':
    default:
      return 1; // 1 pièce par utilisation
  }
}

/**
 * Calculates total capacity from containers
 *
 * @param containerCapacity - Capacity per container (e.g., 100ml)
 * @param containersOwned - Number of containers owned
 * @returns Total capacity
 *
 * @example
 * ```ts
 * calculateTotalCapacity(100, 2); // 200ml (2 tubes de 100ml)
 * ```
 */
export function calculateTotalCapacity(containerCapacity: number, containersOwned: number): number {
  return containerCapacity * containersOwned;
}

/**
 * Converts percentage to actual volume based on container capacity
 *
 * @param percentage - Percentage of stock (e.g., 65%)
 * @param containerCapacity - Capacity per container
 * @param containersOwned - Number of containers
 * @returns Actual volume
 *
 * @example
 * ```ts
 * // 65% de 2 tubes de 100ml
 * percentageToVolume(65, 100, 2); // 130ml
 * ```
 */
export function percentageToVolume(
  percentage: number,
  containerCapacity: number,
  containersOwned: number
): number {
  const totalCapacity = calculateTotalCapacity(containerCapacity, containersOwned);
  return (percentage / 100) * totalCapacity;
}

/**
 * Converts actual volume to percentage based on container capacity
 *
 * @param volume - Actual volume (e.g., 130ml)
 * @param containerCapacity - Capacity per container
 * @param containersOwned - Number of containers
 * @returns Percentage
 *
 * @example
 * ```ts
 * // 130ml sur une capacité de 200ml (2 tubes de 100ml)
 * volumeToPercentage(130, 100, 2); // 65%
 * ```
 */
export function volumeToPercentage(
  volume: number,
  containerCapacity: number,
  containersOwned: number
): number {
  const totalCapacity = calculateTotalCapacity(containerCapacity, containersOwned);
  if (totalCapacity === 0) return 0;
  return (volume / totalCapacity) * 100;
}

/**
 * Gets a human-readable label for container count
 *
 * @param containersOwned - Number of containers
 * @param containerType - Type of container (default: "tube")
 * @returns Label string
 *
 * @example
 * ```ts
 * getContainerLabel(2, "tube"); // "2 tubes"
 * getContainerLabel(1, "bouteille"); // "1 bouteille"
 * ```
 */
export function getContainerLabel(containersOwned: number, containerType: string = 'tube'): string {
  if (containersOwned === 0) return `Aucun ${containerType}`;
  if (containersOwned === 1) return `1 ${containerType}`;
  return `${containersOwned} ${containerType}s`;
}
