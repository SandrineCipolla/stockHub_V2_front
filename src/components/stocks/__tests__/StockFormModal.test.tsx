import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StockFormModal } from '../StockFormModal';
import { StocksAPI } from '@/services/api/stocksAPI';
import { createMockStock } from '@/test/fixtures/stock';

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

vi.mock('@/services/api/stocksAPI', () => ({
  StocksAPI: {
    createStock: vi.fn(),
    updateStock: vi.fn(),
  },
}));

const mockOnSuccess = vi.fn();
const mockOnClose = vi.fn();

const editStock = {
  id: 1,
  label: 'Stock Test',
  description: 'Description test',
  category: 'alimentaire',
};

describe('StockFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when mode is create', () => {
    it('should render with empty fields and "Nouveau stock" title', () => {
      render(<StockFormModal mode="create" onSuccess={mockOnSuccess} onClose={mockOnClose} />);

      expect(screen.getByRole('heading', { name: 'Nouveau stock' })).toBeInTheDocument();
      expect(screen.getByLabelText(/Nom du stock/)).toHaveValue('');
      expect(screen.getByLabelText('Description')).toHaveValue('');
      expect(screen.getByLabelText('Catégorie')).toHaveValue('');
    });

    it('should show error when label is empty on submit', async () => {
      const { container } = render(
        <StockFormModal mode="create" onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      const submitButton = container.querySelector('sh-button[variant="primary"]');
      submitButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Le nom du stock est requis.');
      });
      expect(StocksAPI.createStock).not.toHaveBeenCalled();
    });

    it('should call createStock and onSuccess on valid submit', async () => {
      vi.mocked(StocksAPI.createStock).mockResolvedValueOnce(createMockStock());
      const { container } = render(
        <StockFormModal mode="create" onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      fireEvent.change(screen.getByLabelText(/Nom du stock/), {
        target: { value: 'Mon Nouveau Stock' },
      });
      fireEvent.change(screen.getByLabelText('Description'), {
        target: { value: 'Une description' },
      });
      fireEvent.change(screen.getByLabelText('Catégorie'), { target: { value: 'alimentation' } });

      const submitButton = container.querySelector('sh-button[variant="primary"]');
      submitButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      await waitFor(() => {
        expect(StocksAPI.createStock).toHaveBeenCalledWith({
          label: 'Mon Nouveau Stock',
          description: 'Une description',
          category: 'alimentation',
          quantity: 0,
          value: 0,
        });
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onClose on cancel', () => {
      const { container } = render(
        <StockFormModal mode="create" onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      const cancelButton = container.querySelector('sh-button[variant="ghost"]');
      cancelButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should show loading state during submission', async () => {
      let resolveCreate!: () => void;
      vi.mocked(StocksAPI.createStock).mockReturnValue(
        new Promise(resolve => {
          resolveCreate = () => resolve(createMockStock());
        })
      );

      const { container } = render(
        <StockFormModal mode="create" onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      fireEvent.change(screen.getByLabelText(/Nom du stock/), { target: { value: 'Test' } });

      const submitButton = container.querySelector('sh-button[variant="primary"]');
      submitButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      await waitFor(() => {
        expect(submitButton?.hasAttribute('loading')).toBe(true);
        expect(submitButton?.hasAttribute('disabled')).toBe(true);
      });

      resolveCreate();
    });

    it('should show error message on API failure', async () => {
      vi.mocked(StocksAPI.createStock).mockRejectedValueOnce(new Error('API error'));
      const { container } = render(
        <StockFormModal mode="create" onSuccess={mockOnSuccess} onClose={mockOnClose} />
      );

      fireEvent.change(screen.getByLabelText(/Nom du stock/), { target: { value: 'Test' } });

      const submitButton = container.querySelector('sh-button[variant="primary"]');
      submitButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Une erreur est survenue.');
      });
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  describe('when mode is edit', () => {
    it('should render with pre-filled fields and "Modifier le stock" title', () => {
      render(
        <StockFormModal
          mode="edit"
          stock={editStock}
          onSuccess={mockOnSuccess}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByRole('heading', { name: 'Modifier le stock' })).toBeInTheDocument();
      expect(screen.getByLabelText(/Nom du stock/)).toHaveValue('Stock Test');
      expect(screen.getByLabelText('Description')).toHaveValue('Description test');
      expect(screen.getByLabelText('Catégorie')).toHaveValue('alimentaire');
    });

    it('should call updateStock with stock id on valid submit', async () => {
      vi.mocked(StocksAPI.updateStock).mockResolvedValueOnce(createMockStock());
      const { container } = render(
        <StockFormModal
          mode="edit"
          stock={editStock}
          onSuccess={mockOnSuccess}
          onClose={mockOnClose}
        />
      );

      const submitButton = container.querySelector('sh-button[variant="primary"]');
      submitButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      await waitFor(() => {
        expect(StocksAPI.updateStock).toHaveBeenCalledWith({
          id: 1,
          label: 'Stock Test',
          description: 'Description test',
          category: 'alimentaire',
        });
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call updateStock when label is cleared', async () => {
      const { container } = render(
        <StockFormModal
          mode="edit"
          stock={editStock}
          onSuccess={mockOnSuccess}
          onClose={mockOnClose}
        />
      );

      fireEvent.change(screen.getByLabelText(/Nom du stock/), { target: { value: '' } });

      const submitButton = container.querySelector('sh-button[variant="primary"]');
      submitButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(StocksAPI.updateStock).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should close on Escape key', () => {
      render(<StockFormModal mode="create" onSuccess={mockOnSuccess} onClose={mockOnClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should have role=dialog and aria-modal', () => {
      render(<StockFormModal mode="create" onSuccess={mockOnSuccess} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });
});
