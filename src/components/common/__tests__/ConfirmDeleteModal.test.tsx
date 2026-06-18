import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDeleteModal } from '../ConfirmDeleteModal';

const mockOnConfirm = vi.fn();
const mockOnClose = vi.fn();

const renderModal = (props?: Partial<Parameters<typeof ConfirmDeleteModal>[0]>) =>
  render(
    <ConfirmDeleteModal
      stockLabel="Café Arabica"
      onConfirm={mockOnConfirm}
      onClose={mockOnClose}
      {...props}
    />
  );

describe('ConfirmDeleteModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should display the stock label in the confirmation message', () => {
      renderModal();
      expect(screen.getByText(/Café Arabica/)).toBeInTheDocument();
    });

    it('should display Annuler and Supprimer buttons', () => {
      renderModal();
      expect(screen.getByRole('button', { name: 'Annuler' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Supprimer' })).toBeInTheDocument();
    });

    it('should have role=dialog and aria-modal', () => {
      renderModal();
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('actions', () => {
    it('should call onConfirm when Supprimer is clicked', () => {
      renderModal();
      fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }));
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should call onClose when Annuler is clicked', () => {
      renderModal();
      fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should call onClose when clicking the overlay', () => {
      const { container } = renderModal();
      const overlay = container.firstChild as HTMLElement;
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose on Escape key', () => {
      renderModal();
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('when isDeleting is true', () => {
    it('should show "Suppression…" text on the confirm button', () => {
      renderModal({ isDeleting: true });
      expect(screen.getByRole('button', { name: 'Suppression…' })).toBeInTheDocument();
    });

    it('should disable both buttons', () => {
      renderModal({ isDeleting: true });
      expect(screen.getByRole('button', { name: 'Annuler' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Suppression…' })).toBeDisabled();
    });
  });
});
