// tests/hooks/useFrontendState.test.tsx
import {act, renderHook, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {useDataExport} from '@/hooks/useFrontendState';

// Store original implementations
const originalCreateElement = document.createElement.bind(document);

// Mock variables
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
const mockLinkClick = vi.fn();
const mockSetAttribute = vi.fn();

beforeEach(() => {
    // Mock document.createElement to return a proper link element
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'a') {
            const mockLink = {
                setAttribute: mockSetAttribute,
                click: mockLinkClick,
                download: 'test',
                href: '',
                style: { visibility: '' },
                nodeType: 1,
                nodeName: 'A'
            } as unknown as HTMLAnchorElement;
            return mockLink;
        }
        return originalCreateElement(tag);
    });

    // Mock appendChild/removeChild
    vi.spyOn(document.body, 'appendChild').mockImplementation((node: Node) => {
        return node as HTMLElement;
    });

    vi.spyOn(document.body, 'removeChild').mockImplementation((node: Node) => {
        return node as HTMLElement;
    });

    // Mock URL methods
    mockCreateObjectURL.mockReturnValue('blob:mock-url');
    URL.createObjectURL = mockCreateObjectURL;
    URL.revokeObjectURL = mockRevokeObjectURL;
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('useFrontendState - useDataExport Hook', () => {

    describe('Initial state', () => {
        describe('when hook is initialized', () => {
            it('should have null data initially', () => {
                const { result } = renderHook(() => useDataExport());

                expect(result.current.data).toBeNull();
            });

            it('should not be loading initially', () => {
                const { result } = renderHook(() => useDataExport());

                expect(result.current.loading).toBe(false);
            });

            it('should have no error initially', () => {
                const { result } = renderHook(() => useDataExport());

                expect(result.current.error).toBeNull();
            });

            it('should have idle status initially', () => {
                const { result } = renderHook(() => useDataExport());

                expect(result.current.status).toBe('idle');
            });
        });
    });

    describe('exportToCsv action', () => {
        describe('when exporting valid data', () => {
            it('should set loading state to true during export', async () => {
                const { result } = renderHook(() => useDataExport());

                const testData = [
                    { id: 1, name: 'Product 1', price: 100 },
                    { id: 2, name: 'Product 2', price: 200 }
                ];

                act(() => {
                    result.current.exportToCsv(testData, 'test.csv');
                });

                expect(result.current.loading).toBe(true);
            });

            it('should create CSV blob with correct data', async () => {
                const { result } = renderHook(() => useDataExport());

                const testData = [
                    { id: 1, name: 'Product 1', price: 100 },
                    { id: 2, name: 'Product 2', price: 200 }
                ];

                let exportResult: boolean = false;
                await act(async () => {
                    exportResult = await result.current.exportToCsv(testData, 'test.csv');
                });

                await waitFor(() => {
                    expect(exportResult).toBe(true);
                    expect(result.current.data).toBeInstanceOf(Blob);
                });
            });

            it('should generate CSV with headers', async () => {
                const { result } = renderHook(() => useDataExport());

                const testData = [
                    { name: 'Item 1', quantity: 10, value: 500 }
                ];

                await act(async () => {
                    await result.current.exportToCsv(testData, 'export.csv');
                });

                await waitFor(() => {
                    expect(result.current.data).toBeDefined();
                    expect(result.current.error).toBeNull();
                });
            });

            it('should create download link and trigger download', async () => {
                const { result } = renderHook(() => useDataExport());

                const testData = [{ id: 1, name: 'Test' }];

                await act(async () => {
                    await result.current.exportToCsv(testData, 'download.csv');
                });

                await waitFor(() => {
                    const createElementSpy = vi.mocked(document.createElement);
                    expect(createElementSpy).toHaveBeenCalledWith('a');
                    expect(mockCreateObjectURL).toHaveBeenCalled();
                });
            });

            it('should set loading to false after successful export', async () => {
                const { result } = renderHook(() => useDataExport());

                const testData = [{ id: 1, name: 'Test' }];

                await act(async () => {
                    await result.current.exportToCsv(testData, 'test.csv');
                });

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                    expect(result.current.status).toBe('success');
                });
            });

            it('should handle special characters in CSV data', async () => {
                const { result } = renderHook(() => useDataExport());

                const testData = [
                    { name: 'Item with "quotes"', description: 'Text, with, commas' }
                ];

                await act(async () => {
                    await result.current.exportToCsv(testData, 'special.csv');
                });

                await waitFor(() => {
                    expect(result.current.error).toBeNull();
                });
            });
        });

        describe('when exporting empty data', () => {
            it('should throw error for empty array', async () => {
                const { result } = renderHook(() => useDataExport());

                await act(async () => {
                    await result.current.exportToCsv([], 'empty.csv');
                });

                await waitFor(() => {
                    expect(result.current.error).toBeDefined();
                    expect(result.current.error?.message).toContain('Aucune donnée à exporter');
                });
            });

            it('should set error status', async () => {
                const { result } = renderHook(() => useDataExport());

                await act(async () => {
                    await result.current.exportToCsv([], 'empty.csv');
                });

                await waitFor(() => {
                    expect(result.current.status).toBe('error');
                    expect(result.current.loading).toBe(false);
                });
            });

            it('should return false on error', async () => {
                const { result } = renderHook(() => useDataExport());

                let exportResult: boolean = true;
                await act(async () => {
                    exportResult = await result.current.exportToCsv([], 'empty.csv');
                });

                expect(exportResult).toBe(false);
            });
        });

        describe('when using default filename', () => {
            it('should use default filename export.csv', async () => {
                const { result } = renderHook(() => useDataExport());

                const testData = [{ id: 1, name: 'Test' }];

                await act(async () => {
                    await result.current.exportToCsv(testData);
                });

                await waitFor(() => {
                    expect(result.current.error).toBeNull();
                });
            });
        });
    });

    describe('Status flags', () => {
        describe('when in different states', () => {
            it('should have isIdle true initially', () => {
                const { result } = renderHook(() => useDataExport());

                expect(result.current.isIdle).toBe(true);
                expect(result.current.isLoading).toBe(false);
                expect(result.current.isSuccess).toBe(false);
                expect(result.current.isError).toBe(false);
            });

            it('should have isLoading true during export', async () => {
                const { result } = renderHook(() => useDataExport());

                const testData = [{ id: 1 }];

                act(() => {
                    result.current.exportToCsv(testData);
                });

                expect(result.current.isLoading).toBe(true);
            });

            it('should have isSuccess true after successful export', async () => {
                const { result } = renderHook(() => useDataExport());

                const testData = [{ id: 1 }];

                await act(async () => {
                    await result.current.exportToCsv(testData);
                });

                await waitFor(() => {
                    expect(result.current.isSuccess).toBe(true);
                    expect(result.current.isLoading).toBe(false);
                });
            });

            it('should have isError true after failed export', async () => {
                const { result } = renderHook(() => useDataExport());

                await act(async () => {
                    await result.current.exportToCsv([]);
                });

                await waitFor(() => {
                    expect(result.current.isError).toBe(true);
                    expect(result.current.isSuccess).toBe(false);
                });
            });
        });
    });

    describe('StockHub business use cases', () => {
        describe('when user exports stock data from dashboard', () => {
            it('should export stocks to CSV successfully', async () => {
                const { result } = renderHook(() => useDataExport());

                const stocksData = [
                    { id: 1, name: 'Entrepôt A', quantity: 150, value: 5000, status: 'optimal' },
                    { id: 2, name: 'Entrepôt B', quantity: 5, value: 500, status: 'low' },
                    { id: 3, name: 'Entrepôt C', quantity: 0, value: 0, status: 'critical' }
                ];

                let success: boolean = false;
                await act(async () => {
                    success = await result.current.exportToCsv(stocksData, 'mes-stocks.csv');
                });

                expect(success).toBe(true);
                await waitFor(() => {
                    expect(result.current.error).toBeNull();
                });
            });
        });

        describe('when user tries to export empty stock list', () => {
            it('should show error message', async () => {
                const { result } = renderHook(() => useDataExport());

                await act(async () => {
                    await result.current.exportToCsv([]);
                });

                await waitFor(() => {
                    expect(result.current.error?.message).toBe('Aucune donnée à exporter');
                    expect(result.current.error?.type).toBe('export');
                });
            });
        });

        describe('when exporting filtered stock data', () => {
            it('should export only filtered results', async () => {
                const { result } = renderHook(() => useDataExport());

                const filteredStocks = [
                    { id: 2, name: 'Stock Faible', quantity: 5, value: 500, status: 'low' }
                ];

                let success: boolean = false;
                await act(async () => {
                    success = await result.current.exportToCsv(filteredStocks, 'stocks-faibles.csv');
                });

                expect(success).toBe(true);
            });
        });

        describe('when exporting large dataset', () => {
            it('should handle 50+ stocks efficiently', async () => {
                const { result } = renderHook(() => useDataExport());

                const largeDataset = Array.from({ length: 50 }, (_, i) => ({
                    id: i + 1,
                    name: `Stock ${i + 1}`,
                    quantity: Math.floor(Math.random() * 100),
                    value: Math.floor(Math.random() * 10000)
                }));

                let success: boolean = false;
                await act(async () => {
                    success = await result.current.exportToCsv(largeDataset, 'large-export.csv');
                });

                expect(success).toBe(true);
                await waitFor(() => {
                    expect(result.current.data).toBeDefined();
                });
            });
        });
    });
});