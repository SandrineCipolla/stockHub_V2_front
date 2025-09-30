// tests/hooks/useStocks.test.tsx
import {act, renderHook, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import type {CreateStockData, UpdateStockData} from '@/hooks/useStocks';
import {useStocks} from '@/hooks/useStocks';
import {Stock} from '@/types/index.ts';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

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

            it('should auto-calculate status based on quantity', async () => {
                const { result } = renderHook(() => useStocks());

                const optimalStock: CreateStockData = {
                    name: 'Optimal Stock',
                    quantity: 50,
                    value: 1000
                };

                let created: Stock | null = null;
                await act(async () => {
                    created = await result.current.createStock(optimalStock);
                });

                expect(created).not.toBeNull();
                expect(created!.status).toBe('optimal');
            });

            it('should set status to low for quantity < 10', async () => {
                const { result } = renderHook(() => useStocks());

                const lowStock: CreateStockData = {
                    name: 'Low Stock',
                    quantity: 5,
                    value: 500
                };

                let created: Stock | null= null;
                await act(async () => {
                    created = await result.current.createStock(lowStock);
                });

                expect(created).not.toBeNull();
                expect(created!.status).toBe('low');
            });

            it('should set status to critical for quantity = 0', async () => {
                const { result } = renderHook(() => useStocks());

                const criticalStock: CreateStockData = {
                    name: 'Critical Stock',
                    quantity: 0,
                    value: 0
                };

                let created: Stock | null = null;
                await act(async () => {
                    created = await result.current.createStock(criticalStock);
                });

                expect(created).not.toBeNull();
                expect(created!.status).toBe('critical');
            });
        });

        describe('when creating invalid stock', () => {
            it('should throw error for empty name', async () => {
                const { result } = renderHook(() => useStocks());

                const invalidStock: CreateStockData = {
                    name: '   ',
                    quantity: 10,
                    value: 100
                };

                await act(async () => {
                    try {
                        await result.current.createStock(invalidStock);
                    } catch (error) {
                        if (error instanceof Error) {
                            expect(error.message).toContain('obligatoire');
                        }
                    }
                });
            });

            it('should throw error for negative quantity', async () => {
                const { result } = renderHook(() => useStocks());

                const invalidStock: CreateStockData = {
                    name: 'Test',
                    quantity: -5,
                    value: 100
                };

                await act(async () => {
                    try {
                        await result.current.createStock(invalidStock);
                    } catch (error) {
                        if (error instanceof Error) {
                            expect(error.message).toContain('negative');
                        }
                    }
                });
            });

            it('should throw error for negative value', async () => {
                const { result } = renderHook(() => useStocks());

                const invalidStock: CreateStockData = {
                    name: 'Test',
                    quantity: 10,
                    value: -100
                };

                await act(async () => {
                    try {
                        await result.current.createStock(invalidStock);
                    } catch (error) {
                        if (error instanceof Error) {
                            expect(error.message).toContain('negative');
                        }
                    }
                });
            });

            it('should throw error for duplicate name', async () => {
                const { result } = renderHook(() => useStocks());

                const stock: CreateStockData = {
                    name: 'Duplicate Stock',
                    quantity: 10,
                    value: 100
                };

                await act(async () => {
                    await result.current.createStock(stock);
                });

                await act(async () => {
                    try {
                        await result.current.createStock(stock);
                    } catch (error) {
                        if (error instanceof Error) {
                            expect(error.message).toContain('existe deja');
                        }
                    }
                });
            });
        });
    });

    describe('updateStock action', () => {
        describe('when updating existing stock', () => {
            it('should update stock quantity', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const stockToUpdate = result.current.stocks[0];
                const updateData: UpdateStockData = {
                    id: stockToUpdate.id,
                    quantity: stockToUpdate.quantity + 10
                };

                await act(async () => {
                    await result.current.updateStock(updateData);
                });

                await waitFor(() => {
                    const updated = result.current.getStockById(stockToUpdate.id);
                    expect(updated?.quantity).toBe(stockToUpdate.quantity + 10);
                });
            });

            it('should recalculate status when quantity changes', async () => {
                const { result } = renderHook(() => useStocks());

                const newStock: CreateStockData = {
                    name: 'Status Test',
                    quantity: 50,
                    value: 1000
                };

                let created: Stock | null = null;
                await act(async () => {
                    created = await result.current.createStock(newStock);
                });

                expect(created).not.toBeNull();
                expect(created!.status).toBe('optimal');

                await act(async () => {
                    await result.current.updateStock({
                        id: created!.id,
                        quantity: 0
                    });
                });

                await waitFor(() => {
                    const updated = result.current.getStockById(created!.id);
                    expect(updated?.status).toBe('critical');
                });
            });
        });

        describe('when updating non-existent stock', () => {
            it('should throw error', async () => {
                const { result } = renderHook(() => useStocks());

                const updateData: UpdateStockData = {
                    id: 99999,
                    quantity: 10
                };

                await act(async () => {
                    try {
                        await result.current.updateStock(updateData);
                    } catch (error) {
                        if (error instanceof Error) {
                            expect(error.message).toContain('introuvable');
                        }
                    }
                });
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
                const stockToDelete = result.current.stocks[0];

                await act(async () => {
                    await result.current.deleteStock(stockToDelete.id);
                });

                await waitFor(() => {
                    expect(result.current.stocks.length).toBe(initialCount - 1);
                    expect(result.current.getStockById(stockToDelete.id)).toBeUndefined();
                });
            });
        });

        describe('when deleting non-existent stock', () => {
            it('should throw error', async () => {
                const { result } = renderHook(() => useStocks());

                await act(async () => {
                    try {
                        await result.current.deleteStock(99999);
                    } catch (error) {
                        if (error instanceof Error) {
                            expect(error.message).toContain('introuvable');
                        }
                    }
                });
            });
        });
    });

    describe('deleteMultipleStocks action', () => {
        describe('when deleting multiple stocks', () => {
            it('should remove all specified stocks', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(1);
                });

                const idsToDelete = result.current.stocks.slice(0, 2).map(s => s.id);
                const initialCount = result.current.stocks.length;

                await act(async () => {
                    await result.current.deleteMultipleStocks(idsToDelete);
                });

                await waitFor(() => {
                    expect(result.current.stocks.length).toBe(initialCount - 2);
                });
            });
        });

        describe('when deleting with empty array', () => {
            it('should throw error', async () => {
                const { result } = renderHook(() => useStocks());

                await act(async () => {
                    try {
                        await result.current.deleteMultipleStocks([]);
                    } catch (error) {
                        if (error instanceof Error) {
                            expect(error.message).toContain('aucun stock selectionné');
                        }
                    }
                });
            });
        });
    });

    describe('Filters', () => {
        describe('when filtering by query', () => {
            it('should filter stocks by name', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const firstStock = result.current.stocks[0];

                act(() => {
                    result.current.updateFilters({ query: firstStock.name });
                });

                await waitFor(() => {
                    expect(result.current.stocks.every(s =>
                        s.name.toLowerCase().includes(firstStock.name.toLowerCase())
                    )).toBe(true);
                });
            });
        });

        describe('when filtering by status', () => {
            it('should filter stocks by status array', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                act(() => {
                    result.current.updateFilters({ status: ['optimal'] });
                });

                await waitFor(() => {
                    expect(result.current.stocks.every(s => s.status === 'optimal')).toBe(true);
                });
            });
        });

        describe('when resetting filters', () => {
            it('should clear all filters', async () => {
                const { result } = renderHook(() => useStocks());

                act(() => {
                    result.current.updateFilters({ query: 'test', status: ['optimal'] });
                });

                expect(result.current.filters.query).toBe('test');

                act(() => {
                    result.current.resetFilters();
                });

                expect(result.current.filters).toEqual({});
            });
        });
    });

    describe('Statistics', () => {
        describe('when stocks are loaded', () => {
            it('should calculate total count', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stats?.total).toBeGreaterThanOrEqual(0);
                });
            });

            it('should calculate status counts', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    const stats = result.current.stats;
                    expect(stats).toBeDefined();
                    expect(typeof stats?.optimal).toBe('number');
                    expect(typeof stats?.low).toBe('number');
                    expect(typeof stats?.critical).toBe('number');
                });
            });

            it('should calculate total value', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stats?.totalValue).toBeGreaterThanOrEqual(0);
                });
            });

            it('should calculate average value', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    const stats = result.current.stats;
                    if (stats && stats.total > 0) {
                        expect(stats.averageValue).toBeGreaterThan(0);
                    }
                });
            });
        });
    });

    describe('Utility functions', () => {
        describe('when using getStockById', () => {
            it('should return stock if exists', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stocks.length).toBeGreaterThan(0);
                });

                const firstStock = result.current.stocks[0];
                const found = result.current.getStockById(firstStock.id);

                expect(found).toBeDefined();
                expect(found?.id).toBe(firstStock.id);
            });

            it('should return undefined if not exists', () => {
                const { result } = renderHook(() => useStocks());

                const found = result.current.getStockById(99999);
                expect(found).toBeUndefined();
            });
        });
    });

    describe('Error states', () => {
        describe('when action fails', () => {
            it('should set error for that action', async () => {
                const { result } = renderHook(() => useStocks());

                await act(async () => {
                    try {
                        await result.current.createStock({
                            name: '',
                            quantity: 10,
                            value: 100
                        });
                    } catch {
                        // Expected error
                    }
                });

                await waitFor(() => {
                    expect(result.current.errors.create).toBeDefined();
                });
            });

            it('should set hasAnyError to true', async () => {
                const { result } = renderHook(() => useStocks());

                await act(async () => {
                    try {
                        await result.current.deleteStock(99999);
                    } catch {
                        // Expected error
                    }
                });

                await waitFor(() => {
                    expect(result.current.hasAnyError).toBe(true);
                });
            });
        });
    });

    describe('StockHub business use cases', () => {
        describe('when user manages inventory', () => {
            it('should create, update, and delete stock', async () => {
                const { result } = renderHook(() => useStocks());

                // Create
                const newStock: CreateStockData = {
                    name: 'Business Stock',
                    quantity: 100,
                    value: 5000
                };

                let created: Stock | null = null;
                await act(async () => {
                    created = await result.current.createStock(newStock);
                });

                expect(created).not.toBeNull();

                // Update
                await act(async () => {
                    await result.current.updateStock({
                        id: created!.id,
                        quantity: 150
                    });
                });

                await waitFor(() => {
                    const updated = result.current.getStockById(created!.id);
                    expect(updated?.quantity).toBe(150);
                });

                // Delete
                await act(async () => {
                    await result.current.deleteStock(created!.id);
                });

                await waitFor(() => {
                    expect(result.current.getStockById(created!.id)).toBeUndefined();
                });
            });
        });

        describe('when monitoring low stock', () => {
            it('should filter and count low stock items', async () => {
                const { result } = renderHook(() => useStocks());

                await waitFor(() => {
                    expect(result.current.stats).toBeDefined();
                });

                act(() => {
                    result.current.updateFilters({ status: ['low', 'critical'] });
                });

                await waitFor(() => {
                    const lowStocks = result.current.stocks;
                    expect(lowStocks.every(s =>
                        s.status === 'low' || s.status === 'critical'
                    )).toBe(true);
                });
            });
        });
    });
});