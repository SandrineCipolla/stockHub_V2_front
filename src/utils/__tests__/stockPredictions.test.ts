import { describe, expect, it } from 'vitest';
import { computePredictions } from '@/utils/stockPredictions';
import type { StockDetailItem } from '@/types';
import type { ItemPrediction } from '@/services/api/predictionsAPI';

const makeItem = (overrides: Partial<StockDetailItem>): StockDetailItem => ({
  id: 1,
  label: 'Tomates',
  quantity: 10,
  minimumStock: 5,
  status: 'critical',
  ...overrides,
});

const makePrediction = (overrides: Partial<ItemPrediction> = {}): ItemPrediction => ({
  itemId: 1,
  stockId: 42,
  daysUntilEmpty: 4,
  trend: 'STABLE',
  avgDailyConsumption: 2.5,
  recommendedRestock: 35,
  computedAt: '2026-03-28T10:00:00.000Z',
  ...overrides,
});

describe('computePredictions', () => {
  describe('item filtering', () => {
    it('should include critical items', () => {
      const items = [makeItem({ status: 'critical' })];
      expect(computePredictions(items)).toHaveLength(1);
    });

    it('should include low items', () => {
      const items = [makeItem({ status: 'low' })];
      expect(computePredictions(items)).toHaveLength(1);
    });

    it('should include out-of-stock items', () => {
      const items = [makeItem({ status: 'out-of-stock', quantity: 0 })];
      expect(computePredictions(items)).toHaveLength(1);
    });

    it('should exclude optimal items', () => {
      const items = [makeItem({ status: 'optimal' })];
      expect(computePredictions(items)).toHaveLength(0);
    });

    it('should exclude overstocked items', () => {
      const items = [makeItem({ status: 'overstocked' })];
      expect(computePredictions(items)).toHaveLength(0);
    });
  });

  describe('simulatedFallback when no predictionMap', () => {
    it('should set simulatedFallback: true when no predictionMap provided', () => {
      const items = [makeItem({ status: 'critical', quantity: 10 })];
      const [result] = computePredictions(items);

      expect(result?.simulatedFallback).toBe(true);
    });

    it('should use 10% of quantity as daily rate (simulated)', () => {
      const items = [makeItem({ status: 'critical', quantity: 20 })];
      const [result] = computePredictions(items);

      // 10% of 20 = 2, floor(20/2) = 10
      expect(result?.dailyConsumptionRate).toBe(2);
      expect(result?.daysUntilRupture).toBe(10);
    });

    it('should use minimum 1 as daily rate when quantity is very low', () => {
      const items = [makeItem({ status: 'critical', quantity: 3 })];
      const [result] = computePredictions(items);

      // 10% of 3 = 0.3, rounded = 0, min(1, 0) = 1
      expect(result?.dailyConsumptionRate).toBeGreaterThanOrEqual(1);
    });

    it('should use fallback recommendedReorderQuantity when no prediction', () => {
      const items = [makeItem({ status: 'critical', minimumStock: 5 })];
      const [result] = computePredictions(items);

      // max(10, 5 * 3) = 15
      expect(result?.recommendedReorderQuantity).toBe(15);
    });
  });

  describe('with predictionMap (real backend data)', () => {
    it('should set simulatedFallback: false when API data is present', () => {
      const items = [makeItem({ id: 1, status: 'critical' })];
      const predictionMap = { 1: makePrediction({ itemId: 1 }) };
      const [result] = computePredictions(items, predictionMap);

      expect(result?.simulatedFallback).toBe(false);
    });

    it('should use avgDailyConsumption from API instead of 10%', () => {
      const items = [makeItem({ id: 1, status: 'critical', quantity: 20 })];
      const predictionMap = { 1: makePrediction({ avgDailyConsumption: 4 }) };
      const [result] = computePredictions(items, predictionMap);

      expect(result?.dailyConsumptionRate).toBe(4);
      expect(result?.daysUntilRupture).toBe(5); // floor(20/4)
    });

    it('should use recommendedRestock from API', () => {
      const items = [makeItem({ id: 1, status: 'critical' })];
      const predictionMap = { 1: makePrediction({ recommendedRestock: 50 }) };
      const [result] = computePredictions(items, predictionMap);

      expect(result?.recommendedReorderQuantity).toBe(50);
    });

    it('should use simulatedFallback: true for items not in predictionMap', () => {
      const item1 = makeItem({ id: 1, status: 'critical' });
      const item2 = makeItem({ id: 2, status: 'low', label: 'Farine' });
      const predictionMap = { 1: makePrediction({ itemId: 1 }) };
      const results = computePredictions([item1, item2], predictionMap);

      const res1 = results.find(r => r.stockId === '1');
      const res2 = results.find(r => r.stockId === '2');

      expect(res1?.simulatedFallback).toBe(false);
      expect(res2?.simulatedFallback).toBe(true);
    });
  });

  describe('risk level mapping', () => {
    it('should map out-of-stock to critical risk', () => {
      const items = [makeItem({ status: 'out-of-stock', quantity: 0 })];
      const [result] = computePredictions(items);
      expect(result?.riskLevel).toBe('critical');
    });

    it('should map critical to high risk', () => {
      const items = [makeItem({ status: 'critical' })];
      const [result] = computePredictions(items);
      expect(result?.riskLevel).toBe('high');
    });

    it('should map low to medium risk', () => {
      const items = [makeItem({ status: 'low' })];
      const [result] = computePredictions(items);
      expect(result?.riskLevel).toBe('medium');
    });
  });

  describe('out-of-stock edge case', () => {
    it('should set daysUntilRupture to null when quantity is 0', () => {
      const items = [makeItem({ status: 'out-of-stock', quantity: 0 })];
      const [result] = computePredictions(items);
      expect(result?.daysUntilRupture).toBeNull();
    });

    it('should set confidence to 99 for out-of-stock', () => {
      const items = [makeItem({ status: 'out-of-stock', quantity: 0 })];
      const [result] = computePredictions(items);
      expect(result?.confidence).toBe(99);
    });
  });
});
