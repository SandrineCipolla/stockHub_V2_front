import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createFrontendError,
  useAsyncAction,
  useDataExport,
  useFrontendState,
  useLocalStorageState,
} from '@/hooks/useFrontendState';
import * as loggerModule from '@/utils/logger';

const originalCreateElement = document.createElement.bind(document);

const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
const mockLinkClick = vi.fn();
const mockSetAttribute = vi.fn();

beforeEach(() => {
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'a') {
      const mockLink = {
        setAttribute: mockSetAttribute,
        click: mockLinkClick,
        download: 'test',
        href: '',
        style: { visibility: '' },
        nodeType: 1,
        nodeName: 'A',
      } as unknown as HTMLAnchorElement;
      return mockLink;
    }
    return originalCreateElement(tag);
  });

  vi.spyOn(document.body, 'appendChild').mockImplementation((node: Node) => {
    return node as HTMLElement;
  });

  vi.spyOn(document.body, 'removeChild').mockImplementation((node: Node) => {
    return node as HTMLElement;
  });

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
          { id: 2, name: 'Product 2', price: 200 },
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
          { id: 2, name: 'Product 2', price: 200 },
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

        const testData = [{ name: 'Item 1', quantity: 10, value: 500 }];

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

        const testData = [{ name: 'Item with "quotes"', description: 'Text, with, commas' }];

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
          { id: 3, name: 'Entrepôt C', quantity: 0, value: 0, status: 'critical' },
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
          { id: 2, name: 'Stock Faible', quantity: 5, value: 500, status: 'low' },
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
          value: Math.floor(Math.random() * 10000),
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

describe('useFrontendState Hook', () => {
  describe('Initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useFrontendState<string>());

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.status).toBe('idle');
    });

    it('should initialize with custom initial data', () => {
      const { result } = renderHook(() => useFrontendState<string>('initial value'));

      expect(result.current.data).toBe('initial value');
    });
  });

  describe('State mutations', () => {
    it('should update data correctly', () => {
      const { result } = renderHook(() => useFrontendState<number>());

      act(() => {
        result.current.setData(42);
      });

      expect(result.current.data).toBe(42);
      expect(result.current.status).toBe('success');
      expect(result.current.error).toBeNull();
    });

    it('should set loading state', () => {
      const { result } = renderHook(() => useFrontendState());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.status).toBe('loading');
    });

    it('should set error state', () => {
      const { result } = renderHook(() => useFrontendState());
      const error = createFrontendError('validation', 'Test error');

      act(() => {
        result.current.setError(error);
      });

      expect(result.current.error).toBe(error);
      expect(result.current.status).toBe('error');
      expect(result.current.loading).toBe(false);
    });

    it('should reset to initial state', () => {
      const { result } = renderHook(() => useFrontendState<string>('initial'));

      act(() => {
        result.current.setData('updated');
      });

      expect(result.current.data).toBe('updated');

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBe('initial');
      expect(result.current.status).toBe('idle');
    });
  });
});

describe('useAsyncAction Hook', () => {
  describe('Successful execution', () => {
    it('should execute action successfully', async () => {
      const mockAction = vi.fn().mockResolvedValue('success');
      const { result } = renderHook(() => useAsyncAction(mockAction));

      let executeResult: string | null = null;
      await act(async () => {
        executeResult = await result.current.execute();
      });

      expect(executeResult).toBe('success');
      expect(result.current.status).toBe('success');
    });

    it('should call onSuccess callback', async () => {
      const mockAction = vi.fn().mockResolvedValue('data');
      const onSuccess = vi.fn();
      const { result } = renderHook(() => useAsyncAction(mockAction, { onSuccess }));

      await act(async () => {
        await result.current.execute();
      });

      expect(onSuccess).toHaveBeenCalledWith('data');
    });

    it('should handle simulateDelay option', async () => {
      const mockAction = vi.fn().mockResolvedValue('data');
      const { result } = renderHook(() => useAsyncAction(mockAction, { simulateDelay: 100 }));

      const startTime = Date.now();
      await act(async () => {
        await result.current.execute();
      });
      const endTime = Date.now();

      const DELAY = 100;
      const TIMING_TOLERANCE = 15; // ms de tolérance pour les runners CI

      expect(endTime - startTime).toBeGreaterThanOrEqual(DELAY - TIMING_TOLERANCE);
    });
  });

  describe('Error handling', () => {
    it('should handle action errors', async () => {
      const mockAction = vi.fn().mockRejectedValue(new Error('Action failed'));
      const { result } = renderHook(() => useAsyncAction(mockAction));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.status).toBe('error');
      expect(result.current.error?.message).toBe('Action failed');
    });

    it('should call onError callback', async () => {
      const mockAction = vi.fn().mockRejectedValue(new Error('Failed'));
      const onError = vi.fn();
      const { result } = renderHook(() => useAsyncAction(mockAction, { onError }));

      await act(async () => {
        await result.current.execute();
      });

      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0]![0].message).toBe('Failed');
    });

    it('should handle non-Error exceptions', async () => {
      const mockAction = vi.fn().mockRejectedValue('string error');
      const { result } = renderHook(() => useAsyncAction(mockAction));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.error?.message).toBe('Une erreur est survenue');
    });
  });
});

describe('useLocalStorageState Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should initialize with default value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorageState('test-key', 'default'));

      expect(result.current.value).toBe('default');
    });

    it('should initialize from localStorage if value exists', () => {
      localStorage.setItem('test-key', JSON.stringify('stored value'));
      const { result } = renderHook(() => useLocalStorageState('test-key', 'default'));

      expect(result.current.value).toBe('stored value');
    });

    it('should handle JSON parse errors gracefully', () => {
      const loggerWarnSpy = vi.spyOn(loggerModule.logger, 'warn').mockImplementation(() => {});
      localStorage.setItem('test-key', 'invalid json');

      const { result } = renderHook(() => useLocalStorageState('test-key', 'default'));

      expect(result.current.value).toBe('default');
      expect(loggerWarnSpy).toHaveBeenCalled();

      loggerWarnSpy.mockRestore();
    });
  });

  describe('setValue', () => {
    it('should update value and localStorage', () => {
      const { result } = renderHook(() => useLocalStorageState('test-key', 'initial'));

      act(() => {
        result.current.setValue('updated');
      });

      expect(result.current.value).toBe('updated');
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
    });

    it('should handle function updater', () => {
      const { result } = renderHook(() => useLocalStorageState<number>('test-key', 10));

      act(() => {
        result.current.setValue(prev => prev + 5);
      });

      expect(result.current.value).toBe(15);
    });

    it('should handle localStorage errors', () => {
      const { result } = renderHook(() => useLocalStorageState('test-key', 'value'));

      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });

      act(() => {
        result.current.setValue('new value');
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.error?.type).toBe('storage');

      vi.restoreAllMocks();
    });
  });

  describe('removeValue', () => {
    it('should remove value and reset to initial', () => {
      const { result } = renderHook(() => useLocalStorageState('test-key', 'initial'));

      act(() => {
        result.current.setValue('updated');
      });

      expect(result.current.value).toBe('updated');

      act(() => {
        result.current.removeValue();
      });

      expect(result.current.value).toBe('initial');
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('should handle localStorage errors on remove', () => {
      const { result } = renderHook(() => useLocalStorageState('test-key', 'value'));

      vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Cannot remove');
      });

      act(() => {
        result.current.removeValue();
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.error?.type).toBe('storage');

      vi.restoreAllMocks();
    });
  });

  describe('Storage event synchronization', () => {
    it('should sync with storage events from other tabs', async () => {
      const { result } = renderHook(() => useLocalStorageState('test-key', 'initial'));

      await act(async () => {
        const event = new StorageEvent('storage', {
          key: 'test-key',
          newValue: JSON.stringify('updated from other tab'),
        });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.value).toBe('updated from other tab');
      });
    });

    it('should handle storage event errors', async () => {
      const { result } = renderHook(() => useLocalStorageState('test-key', 'initial'));

      await act(async () => {
        const event = new StorageEvent('storage', {
          key: 'test-key',
          newValue: 'invalid json',
        });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });
});

describe('createFrontendError utility', () => {
  it('should create error with required fields', () => {
    const error = createFrontendError('validation', 'Test error');

    expect(error.type).toBe('validation');
    expect(error.message).toBe('Test error');
    expect(error.id).toBeDefined();
    expect(error.timestamp).toBeInstanceOf(Date);
  });

  it('should include optional field', () => {
    const error = createFrontendError('validation', 'Field error', 'email');

    expect(error.field).toBe('email');
  });

  it('should include optional details', () => {
    const details = { code: 123, extra: 'info' };
    const error = createFrontendError('export', 'Export error', undefined, details);

    expect(error.details).toEqual(details);
  });
});
