import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useItems } from '@/hooks/useItems';
import { ItemsAPI } from '@/services/api/itemsAPI';
import type { StockItem, CreateItemData } from '@/types';

vi.mock('@/services/api/itemsAPI', () => ({
  ItemsAPI: {
    fetchItems: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
    deleteItem: vi.fn(),
  },
}));

const mockItem: StockItem = {
  id: 1,
  stockId: 42,
  label: 'Café Arabica',
  quantity: 5,
  minimumStock: 2,
  description: 'Grains de café',
};

const mockItem2: StockItem = {
  id: 2,
  stockId: 42,
  label: 'Sucre',
  quantity: 10,
  minimumStock: 3,
  description: '',
};

describe('useItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ItemsAPI.fetchItems).mockResolvedValue([mockItem, mockItem2]);
    vi.mocked(ItemsAPI.addItem).mockResolvedValue(mockItem);
    vi.mocked(ItemsAPI.updateItem).mockResolvedValue({ ...mockItem, quantity: 8 });
    vi.mocked(ItemsAPI.deleteItem).mockResolvedValue(undefined);
  });

  describe('loadItems', () => {
    it('should call ItemsAPI.fetchItems with the correct stockId', async () => {
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.loadItems();
      });

      expect(ItemsAPI.fetchItems).toHaveBeenCalledWith(42);
    });

    it('should return items from the API', async () => {
      const { result } = renderHook(() => useItems(42));

      let items: StockItem[] | null | undefined;
      await act(async () => {
        items = await result.current.loadItems();
      });

      expect(items).toEqual([mockItem, mockItem2]);
    });

    it('should set errors.load on network error', async () => {
      vi.mocked(ItemsAPI.fetchItems).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.loadItems();
      });

      await waitFor(() => {
        expect(result.current.errors.load).not.toBeNull();
      });
    });

    it('should set isLoading.load to false after loading', async () => {
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.loadItems();
      });

      expect(result.current.isLoading.load).toBe(false);
    });
  });

  describe('addItem', () => {
    it('should call ItemsAPI.addItem with correct stockId and itemData', async () => {
      const { result } = renderHook(() => useItems(42));
      const itemData: CreateItemData = { label: 'Farine', quantity: 3, minimumStock: 1 };

      await act(async () => {
        await result.current.addItem(itemData);
      });

      expect(ItemsAPI.addItem).toHaveBeenCalledWith(42, itemData);
    });

    it('should set errors.add and not call API when label is empty', async () => {
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.addItem({ label: '   ', quantity: 1 });
      });

      await waitFor(() => {
        expect(result.current.errors.add).not.toBeNull();
        expect(ItemsAPI.addItem).not.toHaveBeenCalled();
      });
    });

    it('should set errors.add and not call API when quantity is negative', async () => {
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.addItem({ label: 'Farine', quantity: -1 });
      });

      await waitFor(() => {
        expect(result.current.errors.add).not.toBeNull();
        expect(ItemsAPI.addItem).not.toHaveBeenCalled();
      });
    });

    it('should call ItemsAPI.addItem when label and quantity are valid', async () => {
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.addItem({ label: 'Farine', quantity: 0 });
      });

      expect(ItemsAPI.addItem).toHaveBeenCalledOnce();
    });

    it('should set errors.add on network error', async () => {
      vi.mocked(ItemsAPI.addItem).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.addItem({ label: 'Farine', quantity: 1 });
      });

      await waitFor(() => {
        expect(result.current.errors.add).not.toBeNull();
      });
    });
  });

  describe('updateItem', () => {
    it('should call ItemsAPI.updateItem with correct args', async () => {
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.updateItem(1, { quantity: 8 });
      });

      expect(ItemsAPI.updateItem).toHaveBeenCalledWith(42, 1, { quantity: 8 });
    });

    it('should set errors.update when quantity is negative', async () => {
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.updateItem(1, { quantity: -5 });
      });

      await waitFor(() => {
        expect(result.current.errors.update).not.toBeNull();
      });
    });

    it('should not set errors when quantity is undefined (label-only update)', async () => {
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.updateItem(1, { label: 'Nouveau nom' });
      });

      expect(result.current.errors.update).toBeNull();
      expect(ItemsAPI.updateItem).toHaveBeenCalled();
    });

    it('should set errors.update when label is empty string', async () => {
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.updateItem(1, { label: '' });
      });

      await waitFor(() => {
        expect(result.current.errors.update).not.toBeNull();
      });
    });

    it('should not set errors when label is undefined (quantity-only update)', async () => {
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.updateItem(1, { quantity: 5 });
      });

      expect(result.current.errors.update).toBeNull();
      expect(ItemsAPI.updateItem).toHaveBeenCalled();
    });

    it('should set errors.update on network error', async () => {
      vi.mocked(ItemsAPI.updateItem).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.updateItem(1, { quantity: 5 });
      });

      await waitFor(() => {
        expect(result.current.errors.update).not.toBeNull();
      });
    });
  });

  describe('deleteItem', () => {
    it('should call ItemsAPI.deleteItem with correct stockId and itemId', async () => {
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.deleteItem(1);
      });

      expect(ItemsAPI.deleteItem).toHaveBeenCalledWith(42, 1);
    });

    it('should set errors.delete on network error', async () => {
      vi.mocked(ItemsAPI.deleteItem).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.deleteItem(1);
      });

      await waitFor(() => {
        expect(result.current.errors.delete).not.toBeNull();
      });
    });
  });

  describe('resetErrors', () => {
    it('should reset errors.add to null after calling resetErrors.add', async () => {
      vi.mocked(ItemsAPI.addItem).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useItems(42));

      await act(async () => {
        await result.current.addItem({ label: 'Farine', quantity: 1 });
      });

      await waitFor(() => {
        expect(result.current.errors.add).not.toBeNull();
      });

      act(() => {
        result.current.resetErrors.add();
      });

      await waitFor(() => {
        expect(result.current.errors.add).toBeNull();
      });
    });
  });
});
