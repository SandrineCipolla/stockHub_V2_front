import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ItemFormModal } from '../ItemFormModal';
import { ItemsAPI } from '@/services/api/itemsAPI';
import type { StockDetailItem } from '@/types';

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

vi.mock('@/services/api/itemsAPI', () => ({
  ItemsAPI: {
    addItem: vi.fn(),
    updateItem: vi.fn(),
  },
}));

const mockOnSuccess = vi.fn();
const mockOnClose = vi.fn();

const editItem: StockDetailItem = {
  id: 42,
  label: 'Item Test',
  description: 'Description item',
  quantity: 5,
  minimumStock: 2,
  status: 'optimal',
};

describe('ItemFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when mode is create', () => {
    it('should render with empty fields and "Nouvel item" title', () => {
      render(
        <ItemFormModal mode="create" stockId={1} onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      expect(screen.getByRole('heading', { name: 'Nouvel item' })).toBeInTheDocument();
      expect(screen.getByLabelText(/Nom/)).toHaveValue('');
      expect(screen.getByLabelText(/Description/)).toHaveValue('');
      expect(screen.getByLabelText(/Stock minimum/)).toHaveValue(1);
    });

    it('should show error when label is empty on submit', async () => {
      const { container } = render(
        <ItemFormModal mode="create" stockId={1} onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      const submitButton = container.querySelector('sh-button[variant="primary"]');
      submitButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent("Le nom de l'item est requis.");
      });
      expect(ItemsAPI.addItem).not.toHaveBeenCalled();
    });

    it('should show error when minimumStock is negative on submit', async () => {
      const { container } = render(
        <ItemFormModal mode="create" stockId={1} onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      fireEvent.change(screen.getByLabelText(/Nom/), { target: { value: 'Mon item' } });
      fireEvent.change(screen.getByLabelText(/Stock minimum/), { target: { value: '-1' } });

      const submitButton = container.querySelector('sh-button[variant="primary"]');
      submitButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Le stock minimum doit être un nombre positif ou nul.'
        );
      });
      expect(ItemsAPI.addItem).not.toHaveBeenCalled();
    });

    it('should call addItem and onSuccess on valid submit', async () => {
      vi.mocked(ItemsAPI.addItem).mockResolvedValueOnce({
        id: 99,
        label: 'Mon item',
        quantity: 0,
        minimumStock: 3,
        stockId: 1,
      });

      const { container } = render(
        <ItemFormModal mode="create" stockId={1} onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      fireEvent.change(screen.getByLabelText(/Nom/), { target: { value: 'Mon item' } });
      fireEvent.change(screen.getByLabelText(/Description/), {
        target: { value: 'Une description' },
      });
      fireEvent.change(screen.getByLabelText(/Stock minimum/), { target: { value: '3' } });

      const submitButton = container.querySelector('sh-button[variant="primary"]');
      submitButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      await waitFor(() => {
        expect(ItemsAPI.addItem).toHaveBeenCalledWith(1, {
          label: 'Mon item',
          description: 'Une description',
          minimumStock: 3,
          quantity: 0,
        });
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onClose on cancel', () => {
      const { container } = render(
        <ItemFormModal mode="create" stockId={1} onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      const cancelButton = container.querySelector('sh-button[variant="ghost"]');
      cancelButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should show error message on API failure', async () => {
      vi.mocked(ItemsAPI.addItem).mockRejectedValueOnce(new Error('API error'));

      const { container } = render(
        <ItemFormModal mode="create" stockId={1} onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      fireEvent.change(screen.getByLabelText(/Nom/), { target: { value: 'Mon item' } });

      const submitButton = container.querySelector('sh-button[variant="primary"]');
      submitButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Une erreur est survenue. Veuillez réessayer.'
        );
      });
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  describe('when mode is edit', () => {
    it('should render with pre-filled fields and "Modifier l\'item" title', () => {
      render(
        <ItemFormModal
          mode="edit"
          stockId={1}
          item={editItem}
          onSuccess={mockOnSuccess}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByRole('heading', { name: "Modifier l'item" })).toBeInTheDocument();
      expect(screen.getByLabelText(/Nom/)).toHaveValue('Item Test');
      expect(screen.getByLabelText(/Description/)).toHaveValue('Description item');
      expect(screen.getByLabelText(/Stock minimum/)).toHaveValue(2);
    });

    it('should call updateItem with correct args on valid submit', async () => {
      vi.mocked(ItemsAPI.updateItem).mockResolvedValueOnce({
        id: 42,
        label: 'Item Modifié',
        quantity: 5,
        minimumStock: 2,
        stockId: 1,
      });

      const { container } = render(
        <ItemFormModal
          mode="edit"
          stockId={1}
          item={editItem}
          onSuccess={mockOnSuccess}
          onClose={mockOnClose}
        />
      );

      fireEvent.change(screen.getByLabelText(/Nom/), { target: { value: 'Item Modifié' } });

      const submitButton = container.querySelector('sh-button[variant="primary"]');
      submitButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      await waitFor(() => {
        expect(ItemsAPI.updateItem).toHaveBeenCalledWith(1, 42, {
          label: 'Item Modifié',
          description: 'Description item',
          minimumStock: 2,
        });
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should show error when label is cleared on submit', async () => {
      const { container } = render(
        <ItemFormModal
          mode="edit"
          stockId={1}
          item={editItem}
          onSuccess={mockOnSuccess}
          onClose={mockOnClose}
        />
      );

      fireEvent.change(screen.getByLabelText(/Nom/), { target: { value: '' } });

      const submitButton = container.querySelector('sh-button[variant="primary"]');
      submitButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(ItemsAPI.updateItem).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have role=dialog and aria-modal', () => {
      render(
        <ItemFormModal mode="create" stockId={1} onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should close on Escape key', () => {
      render(
        <ItemFormModal mode="create" stockId={1} onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should close on backdrop click', () => {
      render(
        <ItemFormModal mode="create" stockId={1} onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      const backdrop = screen.getByRole('dialog').parentElement!;
      fireEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
