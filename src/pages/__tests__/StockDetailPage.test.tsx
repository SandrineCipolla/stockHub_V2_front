import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { StockDetailPage } from '@/pages/StockDetailPage';
import * as useStockDetailModule from '@/hooks/useStockDetail';
import * as stockPredictionsModule from '@/utils/stockPredictions';
import {
  createMockUseStockDetail,
  createMockStockDetail,
  createMockUseTheme,
} from '@/test/fixtures/hooks';

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => createMockUseTheme(),
}));

vi.mock('@/hooks/useStockDetail', () => ({
  useStockDetail: vi.fn(),
}));

vi.mock('@/utils/stockPredictions', () => ({
  computePredictions: vi.fn().mockReturnValue([]),
}));

vi.mock('@/components/layout/NavSection', () => ({
  NavSection: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="nav-section">{children}</nav>
  ),
}));

vi.mock('@/hooks/useItems', () => ({
  useItems: () => ({
    updateItem: vi.fn().mockResolvedValue(undefined),
    deleteItem: vi.fn().mockResolvedValue(undefined),
    isLoading: { load: false, add: false, update: false, delete: false },
    errors: { load: null, add: null, update: null, delete: null },
    resetErrors: { load: vi.fn(), add: vi.fn(), update: vi.fn(), delete: vi.fn() },
  }),
}));

vi.mock('@/components/items/ItemFormModal', () => ({
  ItemFormModal: ({
    onClose,
    onSuccess,
  }: {
    mode: string;
    onClose: () => void;
    onSuccess: () => void;
  }) => (
    <div data-testid="item-form-modal">
      <button data-testid="item-modal-close" onClick={onClose}>
        Fermer
      </button>
      <button data-testid="item-modal-success" onClick={onSuccess}>
        Succès
      </button>
    </div>
  ),
}));

vi.mock('@/components/stocks/StockFormModal', () => ({
  StockFormModal: ({
    onClose,
    onSuccess,
  }: {
    mode: string;
    onClose: () => void;
    onSuccess: () => void;
  }) => (
    <div data-testid="stock-form-modal">
      <button data-testid="modal-close" onClick={onClose}>
        Fermer
      </button>
      <button data-testid="modal-success" onClick={onSuccess}>
        Succès
      </button>
    </div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ stockId: '1' }),
    useNavigate: () => mockNavigate,
  };
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <StockDetailPage />
    </MemoryRouter>
  );

describe('StockDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStockDetailModule.useStockDetail).mockReturnValue(createMockUseStockDetail());
    vi.mocked(stockPredictionsModule.computePredictions).mockReturnValue([]);
  });

  describe('when loading', () => {
    it('should show loading indicator', () => {
      vi.mocked(useStockDetailModule.useStockDetail).mockReturnValue(
        createMockUseStockDetail({ isLoading: true, stock: null })
      );

      renderPage();

      expect(screen.getByRole('status', { name: /chargement/i })).toBeInTheDocument();
    });
  });

  describe('when stock is not found', () => {
    it('should show error message and back button', async () => {
      vi.mocked(useStockDetailModule.useStockDetail).mockReturnValue(
        createMockUseStockDetail({ error: 'Impossible de charger le stock.', stock: null })
      );

      await act(async () => {
        renderPage();
      });

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Stock introuvable/i)).toBeInTheDocument();
      expect(screen.getByText(/Impossible de charger le stock/i)).toBeInTheDocument();
    });

    it('should navigate to dashboard on back button click', async () => {
      vi.mocked(useStockDetailModule.useStockDetail).mockReturnValue(
        createMockUseStockDetail({ error: 'Erreur', stock: null })
      );

      const { container } = await act(async () => renderPage());

      const backButton = container.querySelector('sh-button');
      backButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('when stock is loaded', () => {
    it('should display stock name and description', async () => {
      await act(async () => {
        renderPage();
      });

      expect(screen.getByText('Stock Alimentaire Test')).toBeInTheDocument();
      expect(
        screen.getByText(/alimentation — Stock de test pour la page détail/i)
      ).toBeInTheDocument();
    });

    it('should display metric cards with correct values', async () => {
      const { container } = await act(async () => renderPage());

      const metricCards = container.querySelectorAll('sh-metric-card');
      expect(metricCards.length).toBeGreaterThanOrEqual(3);
    });

    it('should display items in a table with correct labels', async () => {
      await act(async () => renderPage());

      const table = screen.getByRole('table', { name: /liste des items/i });
      expect(table).toBeInTheDocument();
      expect(screen.getByText('Tomates')).toBeInTheDocument();
      expect(screen.getByText('Carottes')).toBeInTheDocument();
    });

    it('should show empty state when stock has no items', async () => {
      vi.mocked(useStockDetailModule.useStockDetail).mockReturnValue(
        createMockUseStockDetail({
          stock: createMockStockDetail({ items: [], totalItems: 0 }),
        })
      );

      await act(async () => {
        renderPage();
      });

      expect(screen.getByText("Ce stock ne contient pas encore d'items.")).toBeInTheDocument();
    });

    it('should display prediction cards for critical and low items', async () => {
      const mockPredictions = [
        {
          stockName: 'Tomates',
          stockId: '1',
          riskLevel: 'high' as const,
          daysUntilRupture: 3,
          confidence: 92,
          dailyConsumptionRate: 1,
          currentQuantity: 3,
          recommendedReorderQuantity: 15,
        },
      ];
      vi.mocked(stockPredictionsModule.computePredictions).mockReturnValue(mockPredictions);

      const { container } = await act(async () => renderPage());

      const predCards = container.querySelectorAll('sh-stock-prediction-card');
      expect(predCards).toHaveLength(1);
      expect(predCards[0]?.getAttribute('stock-name')).toBe('Tomates');
      expect(predCards[0]?.getAttribute('risk-level')).toBe('high');
    });

    it('should not display prediction section when all items are optimal', async () => {
      vi.mocked(stockPredictionsModule.computePredictions).mockReturnValue([]);

      const { container } = await act(async () => renderPage());

      const predCards = container.querySelectorAll('sh-stock-prediction-card');
      expect(predCards).toHaveLength(0);
    });
  });

  describe('when user clicks edit button', () => {
    it('should open StockFormModal in edit mode', async () => {
      const { container } = await act(async () => renderPage());

      const editButton = container.querySelector('sh-button[variant="secondary"]');
      await act(async () => {
        editButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));
      });

      expect(screen.getByTestId('stock-form-modal')).toBeInTheDocument();
    });

    it('should refetch stock data after successful edit', async () => {
      const mockRefetch = vi.fn().mockResolvedValue(undefined);
      vi.mocked(useStockDetailModule.useStockDetail).mockReturnValue(
        createMockUseStockDetail({ refetch: mockRefetch })
      );

      const { container } = await act(async () => renderPage());

      const editButton = container.querySelector('sh-button[variant="secondary"]');
      await act(async () => {
        editButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));
      });

      await act(async () => {
        screen.getByTestId('modal-success').click();
      });

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('when user clicks back button', () => {
    it('should navigate to dashboard', async () => {
      const { container } = await act(async () => renderPage());

      const backButton = container.querySelector('sh-button[variant="ghost"]');
      backButton?.dispatchEvent(new Event('sh-button-click', { bubbles: true }));

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
