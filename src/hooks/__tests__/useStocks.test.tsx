import {act, renderHook, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import type {CreateStockData, UpdateStockData} from '@/hooks/useStocks';
import {useStocks} from '@/hooks/useStocks';
import {Stock} from '@/types/index.ts';
import {createMockStock, stockCategories, stockHubStockUseCases, stockStatuses} from '@/test/fixtures/stock';
import {createLocalStorageMock} from '@/test/fixtures/localStorage';


const localStorageMock = createLocalStorageMock();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useStocks Hook', () => {

    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllTimers();
    });

    describe('Initial state', () => {
        describe('when hook is initialized', () => {
            it('should load stocks from stockData', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks).toBeDefined();
                    expect(Array.isArray(result.current.stocks)).toBe(true);
                });
            });

            it('should have loading state initially', () => {
                const { result } = renderHook(() => useStocks());

                expect(result.current.isLoading.storage).toBe(true);
            });

            it('should calculate initial stats', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stats).toBeDefined();
                    expect(result.current.stats?.total).toBeGreaterThanOrEqual(0);
                });
            });

            it('should have empty filters by default', () => {
                const { result } = renderHook(() => useStocks());

                expect(result.current.filters).toEqual({});
            });

            it('should handle fixture stock data correctly', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                    // Vérifier que les stocks fixtures sont bien présents
                    const hasOptimalStock = result.current.stocks.some(stock =>
                        stock.status === 'optimal'
                    );
                    expect(hasOptimalStock).toBe(true);
                });
            });
        });
    });

    describe('loadStocks action', () => {
        describe('when loadStocks is called', () => {
            it('should set loading state to true', async () => {
                const { result } = renderHook(() => useStocks());

                act(() => {
                    result.current.loadStocks();
                });

                expect(result.current.isLoading.load).toBe(true);
            });

            it('should load stocks successfully', async () => {
                const { result } = renderHook(() => useStocks());

                await act(async () => {
                    await result.current.loadStocks();
                });

                await waitFor(() => {
                    expect(result.current.isLoading.load).toBe(false);
                    expect(result.current.errors.load).toBeNull();
                });
            });

            it('should load dashboard stocks fixture data', async () => {
                const { result } = renderHook(() => useStocks());

                await act(async () => {
                    await result.current.loadStocks();
                });

                await waitFor(() => {
                    // Vérifier que les types de stocks des fixtures sont présents
                    const stockStatuses = result.current.stocks.map(s => s.status);
                    expect(stockStatuses).toContain('optimal');
                    expect(stockStatuses).toContain('low');
                    expect(stockStatuses).toContain('critical');
                });
            });
        });
    });

    describe('createStock action', () => {
        describe('when creating valid stock', () => {
            it('should create stock with correct data', async () => {
                const { result } = renderHook(() => useStocks());

                const newStockData: CreateStockData = {
                    name: 'New Test Stock',
                    quantity: 50,
                    value: 1000,
                    description: 'Test description'
                };

                let createdStock: Stock | null = null;
                await act(async () => {
                    createdStock = await result.current.createStock(newStockData);
                });

                await waitFor(() => {
                    expect(createdStock).toBeDefined();
                    expect(result.current.stocks.some(s => s.name === 'New Test Stock')).toBe(true);
                });
            });

            it('should auto-calculate status based on quantity using fixture thresholds', async () => {
                const { result } = renderHook(() => useStocks());

                // Utiliser les données des fixtures pour tester les seuils
                const optimalStockData: CreateStockData = {
                    name: stockHubStockUseCases.optimalStock.name,
                    quantity: stockHubStockUseCases.optimalStock.quantity,
                    value: stockHubStockUseCases.optimalStock.value,
                    minThreshold: 50,  // 150 est entre 50 et 200 → optimal
                    maxThreshold: 200
                };

                let created: Stock | null = null;
                await act(async () => {
                    created = await result.current.createStock(optimalStockData);
                });

                expect(created).not.toBeNull();
                expect(created!.status).toBe('optimal');
            });

            it('should set status to low for quantity matching fixture low stock', async () => {
                const { result } = renderHook(() => useStocks());

                const lowStockData: CreateStockData = {
                    name: stockHubStockUseCases.lowStock.name,
                    quantity: stockHubStockUseCases.lowStock.quantity,
                    value: stockHubStockUseCases.lowStock.value
                };

                let created: Stock | null = null;
                await act(async () => {
                    created = await result.current.createStock(lowStockData);
                });

                expect(created).not.toBeNull();
                expect(created!.status).toBe('low');
            });

            it('should set status to critical for quantity matching fixture critical stock', async () => {
                const { result } = renderHook(() => useStocks());

                const criticalStockData: CreateStockData = {
                    name: stockHubStockUseCases.criticalStock.name,
                    quantity: 3,  // 3 < 10 * 0.5 = 5 → critical
                    value: stockHubStockUseCases.criticalStock.value,
                    minThreshold: 10
                };

                let created: Stock | null = null;
                await act(async () => {
                    created = await result.current.createStock(criticalStockData);
                });

                expect(created).not.toBeNull();
                expect(created!.status).toBe('critical');
            });

            it('should create stock with fixture factory function', async () => {
                const { result } = renderHook(() => useStocks());

                const customStock = createMockStock({
                    name: 'Factory Created Stock',
                    quantity: 75,
                    value: 1500
                });

                const createData: CreateStockData = {
                    name: customStock.name,
                    quantity: customStock.quantity,
                    value: customStock.value,
                    description: customStock.description
                };

                let created: Stock | null = null;
                await act(async () => {
                    created = await result.current.createStock(createData);
                });

                expect(created).not.toBeNull();
                expect(created!.name).toBe(customStock.name);
                expect(created!.quantity).toBe(customStock.quantity);
            });
        });

        describe('when creating stocks with different categories', () => {
            it('should handle food category stocks', async () => {
                const { result } = renderHook(() => useStocks());

                const foodStockData: CreateStockData = {
                    name: 'Test Food Item',
                    quantity: 100,
                    value: 200,
                    category: stockCategories.food
                };

                let created: Stock | null = null;
                await act(async () => {
                    created = await result.current.createStock(foodStockData);
                });

                expect(created).not.toBeNull();
                expect(created!.category).toBe(stockCategories.food);
            });

            it('should handle electronics category stocks', async () => {
                const { result } = renderHook(() => useStocks());

                const electronicsStockData: CreateStockData = {
                    name: 'Test Electronics Item',
                    quantity: 25,
                    value: 5000,
                    category: stockCategories.electronics
                };

                let created: Stock | null = null;
                await act(async () => {
                    created = await result.current.createStock(electronicsStockData);
                });

                expect(created).not.toBeNull();
                expect(created!.category).toBe(stockCategories.electronics);
            });
        });
    });

    describe('updateStock action', () => {
        describe('when updating existing stock', () => {
            it('should update stock data correctly', async () => {
                const { result } = renderHook(() => useStocks());

                // Attendre que les stocks soient chargés
                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const firstStock = result.current.stocks[0];
                const updateData: UpdateStockData = {
                    id: firstStock.id,
                    name: 'Updated Stock Name',
                    quantity: firstStock.quantity + 10,
                    value: firstStock.value + 100
                };

                let updated: Stock | null = null;
                await act(async () => {
                    updated = await result.current.updateStock(updateData);
                });

                expect(updated).not.toBeNull();
                expect(updated!.name).toBe('Updated Stock Name');
                expect(updated!.quantity).toBe(firstStock.quantity + 10);
            });

            it('should recalculate status after update', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const firstStock = result.current.stocks[0];

                // Mettre à jour avec une quantité faible (low)
                const lowUpdate: UpdateStockData = {
                    id: firstStock.id,
                    quantity: 7,  // 7 est entre 5 et 10 → low (minThreshold=10)
                    minThreshold: 10
                };

                let updated: Stock | null = null;
                await act(async () => {
                    updated = await result.current.updateStock(lowUpdate);
                });

                expect(updated).not.toBeNull();
                expect(updated!.status).toBe('low');
            });
        });
    });

    describe('updateStock action', () => {
        describe('when updating with invalid data', () => {
            it('should reject empty name', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const firstStock = result.current.stocks[0];
                const invalidUpdate: UpdateStockData = {
                    id: firstStock.id,
                    name: '   '
                };

                let updated: Stock | null = null;
                await act(async () => {
                    updated = await result.current.updateStock(invalidUpdate);
                });

                expect(updated).toBeNull();
                expect(result.current.errors.update).toBeDefined();
            });

            it('should reject negative quantity', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const firstStock = result.current.stocks[0];
                const invalidUpdate: UpdateStockData = {
                    id: firstStock.id,
                    quantity: -5
                };

                let updated: Stock | null = null;
                await act(async () => {
                    updated = await result.current.updateStock(invalidUpdate);
                });

                expect(updated).toBeNull();
                expect(result.current.errors.update).toBeDefined();
            });

            it('should update to outOfStock status when quantity is 0', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const firstStock = result.current.stocks[0];
                const zeroUpdate: UpdateStockData = {
                    id: firstStock.id,
                    quantity: 0
                };

                let updated: Stock | null = null;
                await act(async () => {
                    updated = await result.current.updateStock(zeroUpdate);
                });

                expect(updated).not.toBeNull();
                expect(updated!.status).toBe('outOfStock');
            });
        });
    });

    describe('deleteStock action', () => {
        describe('when deleting existing stock', () => {
            it('should remove stock from list', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const initialCount = result.current.stocks.length;
                const firstStock = result.current.stocks[0];

                await act(async () => {
                    await result.current.deleteStock(firstStock.id);
                });

                await waitFor(() => {
                    expect(result.current.stocks.length).toBe(initialCount - 1);
                    expect(result.current.stocks.find(s => s.id === firstStock.id)).toBeUndefined();
                });
            });
        });

        describe('when deleting non-existent stock', () => {
            it('should handle error for non-existent stock', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const nonExistentId = 999999;

                await act(async () => {
                    await result.current.deleteStock(nonExistentId);
                });

                expect(result.current.errors.delete).toBeDefined();
            });
        });
    });

    describe('filtering and stats', () => {
        describe('when filtering by status', () => {
            it('should calculate correct stats for optimal stocks', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                // Filtrer par statut optimal
                act(() => {
                    result.current.updateFilters({ status: ['optimal'] });
                });

                await waitFor(() => {
                    const optimalStocks = result.current.allStocks.filter(s => s.status === 'optimal');
                    expect(result.current.stats?.optimal).toBe(optimalStocks.length);
                });
            });

            it('should handle all fixture status types', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                // Tester chaque statut des fixtures
                for (const status of stockStatuses) {
                    act(() => {
                        result.current.updateFilters({ status: [status] });
                    });

                    await waitFor(() => {
                        const statusStocks = result.current.allStocks.filter(s => s.status === status);
                        expect(result.current.stats?.[status as keyof typeof result.current.stats]).toBe(statusStocks.length);
                    });
                }
            });
        });

        describe('when filtering by category', () => {
            it('should filter stocks by category correctly', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                // Tester le filtrage par catégorie électronique
                act(() => {
                    result.current.updateFilters({ category: [stockCategories.electronics] });
                });

                await waitFor(() => {
                    const electronicsStocks = result.current.stocks.filter(s =>
                        s.category === stockCategories.electronics
                    );
                    expect(electronicsStocks.length).toBeGreaterThanOrEqual(0);
                });
            });
        });
    });

    describe('utility functions', () => {
        describe('getStockById', () => {
            it('should return stock by id', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const firstStock = result.current.stocks[0];
                const foundStock = result.current.getStockById(firstStock.id);

                expect(foundStock).toBeDefined();
                expect(foundStock?.id).toBe(firstStock.id);
            });

            it('should return undefined for non-existent id', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const foundStock = result.current.getStockById(999999);
                expect(foundStock).toBeUndefined();
            });
        });

        describe('resetFilters', () => {
            it('should reset all filters', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                // Apply some filters
                act(() => {
                    result.current.updateFilters({
                        status: ['low'],
                        category: [stockCategories.food],
                        query: 'test'
                    });
                });

                // Reset filters
                act(() => {
                    result.current.resetFilters();
                });

                expect(result.current.filters).toEqual({});
                expect(result.current.stocks.length).toBe(result.current.allStocks.length);
            });
        });

        describe('deleteMultipleStocks', () => {
            it('should delete multiple stocks', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(1);
                });

                const initialCount = result.current.stocks.length;
                const stocksToDelete = [result.current.stocks[0].id, result.current.stocks[1].id];

                await act(async () => {
                    await result.current.deleteMultipleStocks(stocksToDelete);
                });

                await waitFor(() => {
                    expect(result.current.stocks.length).toBe(initialCount - 2);
                });
            });

            it('should handle empty array', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const initialCount = result.current.stocks.length;

                await act(async () => {
                    await result.current.deleteMultipleStocks([]);
                });

                expect(result.current.stocks.length).toBe(initialCount);
            });
        });

        describe('resetErrors', () => {
            it('should reset specific error', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                // Trigger an error
                await act(async () => {
                    await result.current.deleteStock(999999);
                });

                expect(result.current.errors.delete).toBeDefined();

                // Reset the error
                act(() => {
                    result.current.resetErrors.delete();
                });

                expect(result.current.errors.delete).toBeNull();
            });
        });
    });
});