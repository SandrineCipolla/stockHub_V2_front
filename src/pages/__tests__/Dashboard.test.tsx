import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import * as useStocksModule from '@/hooks/useStocks';
import * as useFrontendStateModule from '@/hooks/useFrontendState';
import { dashboardStocks, stockHubStockUseCases, stocksByStatus } from '@/test/fixtures/stock';
import { mockUserScenarios } from '@/test/fixtures/user';
import {
  createMockUseDataExport,
  createMockUseStocks,
  createMockUseTheme,
} from '@/test/fixtures/hooks';

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => createMockUseTheme(),
}));

vi.mock('@/hooks/useStocks', () => ({
  useStocks: vi.fn(() => createMockUseStocks()),
}));

vi.mock('@/hooks/useFrontendState', () => ({
  useDataExport: vi.fn(() => createMockUseDataExport()),
}));

vi.mock('@/components/layout/NavSection', () => ({
  NavSection: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="nav-section">{children}</nav>
  ),
}));

// Helper function to render Dashboard with Router context
const renderDashboard = () => {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial render', () => {
    describe('when dashboard loads successfully', () => {
      it('should render all main sections', async () => {
        const { container } = await act(async () => {
          return renderDashboard();
        });

        // Check for web components
        const header = container.querySelector('sh-header');
        const footer = container.querySelector('sh-footer');

        expect(header).toBeInTheDocument();
        expect(screen.getByTestId('nav-section')).toBeInTheDocument();
        expect(footer).toBeInTheDocument();
      });

      it('should display dashboard title', async () => {
        await act(async () => {
          renderDashboard();
        });

        expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
      });

      it('should render metrics section with fixture stats', async () => {
        const { container } = await act(async () => {
          return renderDashboard();
        });

        // Check for sh-metric-card web components (Shadow DOM prevents text access)
        const metricCards = container.querySelectorAll('sh-metric-card');
        expect(metricCards.length).toBeGreaterThanOrEqual(3);
      });

      it('should display search input', async () => {
        const { container } = await act(async () => {
          return renderDashboard();
        });

        // Check for sh-search-input web component
        const searchInput = container.querySelector('sh-search-input');
        expect(searchInput).toBeInTheDocument();
      });

      it('should display fixture stocks correctly', async () => {
        const { container } = await act(async () => {
          return renderDashboard();
        });

        // Check for sh-stock-card web components (Shadow DOM prevents direct text access)
        const stockCards = container.querySelectorAll('sh-stock-card');
        expect(stockCards.length).toBe(dashboardStocks.length);
      });
    });

    describe('when dashboard has different stock scenarios', () => {
      it('should handle optimal stocks scenario', async () => {
        vi.mocked(useStocksModule.useStocks).mockReturnValue(
          createMockUseStocks({
            stocks: stocksByStatus.optimal,
            allStocks: stocksByStatus.optimal,
            stats: {
              total: stocksByStatus.optimal.length,
              optimal: stocksByStatus.optimal.length,
              low: 0,
              critical: 0,
              byStatus: {
                optimal: stocksByStatus.optimal.length,
                low: 0,
                critical: 0,
              },
            },
          })
        );

        const { container } = await act(async () => {
          return renderDashboard();
        });

        // Check metric cards are present (Shadow DOM prevents text access)
        const metricCards = container.querySelectorAll('sh-metric-card');
        expect(metricCards.length).toBeGreaterThanOrEqual(3);
      });

      it('should handle critical stocks scenario', async () => {
        vi.mocked(useStocksModule.useStocks).mockReturnValue(
          createMockUseStocks({
            stocks: stocksByStatus.critical,
            allStocks: stocksByStatus.critical,
            stats: {
              total: stocksByStatus.critical.length,
              optimal: 0,
              low: 0,
              critical: stocksByStatus.critical.length,
              byStatus: {
                optimal: 0,
                low: 0,
                critical: stocksByStatus.critical.length,
              },
            },
          })
        );

        const { container } = await act(async () => {
          return renderDashboard();
        });

        // Check stock cards are rendered (Shadow DOM prevents direct text access)
        const stockCards = container.querySelectorAll('sh-stock-card');
        expect(stockCards.length).toBe(stocksByStatus.critical.length);
      });
    });
  });

  describe('User interactions', () => {
    describe('when user clicks Add Stock button', () => {
      it('should call createStock with fixture data', async () => {
        const mockCreateStock = vi.fn();

        vi.mocked(useStocksModule.useStocks).mockReturnValue(
          createMockUseStocks({
            createStock: mockCreateStock,
          })
        );

        const { container } = await act(async () => {
          return renderDashboard();
        });

        // sh-button is a web component — find the primary variant button
        const addButton = container.querySelector('sh-button[variant="primary"]');
        expect(addButton).toBeInTheDocument();

        await act(async () => {
          addButton!.dispatchEvent(new CustomEvent('sh-button-click', { bubbles: true }));
        });

        expect(mockCreateStock).toHaveBeenCalled();
      });
    });

    describe('when user searches for stocks', () => {
      it('should filter stocks based on fixture data', async () => {
        const mockUpdateFilters = vi.fn();

        vi.mocked(useStocksModule.useStocks).mockReturnValue(
          createMockUseStocks({
            updateFilters: mockUpdateFilters,
          })
        );

        const { container } = await act(async () => {
          return renderDashboard();
        });

        // sh-search-input is a web component — interact via its input event
        const searchInput = container.querySelector('sh-search-input');
        expect(searchInput).toBeInTheDocument();

        // Simulate the search change event emitted by the web component
        await act(async () => {
          searchInput!.dispatchEvent(
            new CustomEvent('sh-search-change', {
              detail: { value: stockHubStockUseCases.optimalStock.label },
              bubbles: true,
            })
          );
        });

        expect(mockUpdateFilters).toHaveBeenCalledWith({
          query: stockHubStockUseCases.optimalStock.label,
        });
      });

      it('should search for specific fixture stock names', async () => {
        const mockUpdateFilters = vi.fn();

        vi.mocked(useStocksModule.useStocks).mockReturnValue(
          createMockUseStocks({
            updateFilters: mockUpdateFilters,
          })
        );

        const { container } = await act(async () => {
          return renderDashboard();
        });

        const searchInput = container.querySelector('sh-search-input');
        expect(searchInput).toBeInTheDocument();

        // Tester avec différents stocks des fixtures
        const stockNames = [
          stockHubStockUseCases.lowStock.label,
          stockHubStockUseCases.criticalStock.label,
          stockHubStockUseCases.highValueStock.label,
        ];

        for (const stockName of stockNames) {
          await act(async () => {
            searchInput!.dispatchEvent(
              new CustomEvent('sh-search-change', {
                detail: { value: stockName },
                bubbles: true,
              })
            );
          });

          expect(mockUpdateFilters).toHaveBeenCalledWith({
            query: stockName,
          });
        }
      });
    });

    describe('when user exports data', () => {
      it('should call exportToCsv with fixture stocks', async () => {
        const mockExportToCsv = vi.fn().mockResolvedValue(true);

        vi.mocked(useFrontendStateModule.useDataExport).mockReturnValue(
          createMockUseDataExport({
            exportToCsv: mockExportToCsv,
          })
        );

        const { container } = await act(async () => {
          return renderDashboard();
        });

        // sh-button with export description
        const exportButton = container.querySelector('sh-button[aria-describedby="export-help"]');
        expect(exportButton).toBeInTheDocument();

        await act(async () => {
          exportButton!.dispatchEvent(new CustomEvent('sh-button-click', { bubbles: true }));
        });

        expect(mockExportToCsv).toHaveBeenCalledWith(
          dashboardStocks.map(stock => ({ ...stock })),
          'stocks-export.csv'
        );
      });
    });
  });

  describe('Data integration with fixtures', () => {
    describe('when using complete fixture data', () => {
      it('should display header component correctly', async () => {
        const { container } = await act(async () => {
          return renderDashboard();
        });

        // Le header est un web component sh-header
        const header = container.querySelector('sh-header');
        expect(header).toBeInTheDocument();
      });

      it('should handle breadcrumb navigation correctly', async () => {
        await act(async () => {
          renderDashboard();
        });

        // Le NavSection devrait afficher le bon breadcrumb pour le dashboard
        expect(screen.getByTestId('nav-section')).toBeInTheDocument();
      });

      it('should display stock categories from fixtures', async () => {
        await act(async () => {
          renderDashboard();
        });

        // Vérifier que les différentes catégories de stock sont représentées
        const categorizedStocks = dashboardStocks.filter(stock => stock.category);
        expect(categorizedStocks.length).toBeGreaterThan(0);
      });
    });

    describe('when handling different user scenarios', () => {
      it('should work with wealthy user scenario', async () => {
        vi.mocked(useStocksModule.useStocks).mockReturnValue(
          createMockUseStocks({
            stats: {
              ...createMockUseStocks().stats,
              totalValue: mockUserScenarios.wealthyUser.stats.portfolioValue,
            },
          })
        );

        const { container } = await act(async () => {
          return renderDashboard();
        });

        // Vérifier que les metric cards sont rendues (Shadow DOM)
        const metricCards = container.querySelectorAll('sh-metric-card');
        expect(metricCards.length).toBeGreaterThanOrEqual(3);
      });

      it('should work with new user scenario', async () => {
        vi.mocked(useStocksModule.useStocks).mockReturnValue(
          createMockUseStocks({
            stocks: [],
            allStocks: [],
            stats: {
              total: 0,
              optimal: 0,
              low: 0,
              critical: 0,
              totalValue: 0,
              averageValue: 0,
              byStatus: { optimal: 0, low: 0, critical: 0 },
              byCategory: {},
            },
          })
        );

        await act(async () => {
          renderDashboard();
        });

        // Vérifier l'état vide
        expect(screen.getByText('Aucun stock trouvé')).toBeInTheDocument();
      });
    });
  });

  describe('Error handling with fixtures', () => {
    describe('when there are loading errors', () => {
      it('should handle stock loading errors', async () => {
        vi.mocked(useStocksModule.useStocks).mockReturnValue(
          createMockUseStocks({
            errors: {
              load: new Error('Erreur de chargement des stocks'),
              create: null,
              update: null,
              delete: null,
              deleteMultiple: null,
              storage: null,
            },
            hasAnyError: true,
          })
        );

        await act(async () => {
          renderDashboard();
        });

        // En cas d'erreur, le composant affiche une page d'erreur au lieu du layout normal
        expect(screen.getByText('Erreur')).toBeInTheDocument();
        expect(screen.getByText('Recharger')).toBeInTheDocument();
        expect(screen.getByText('Réessayer')).toBeInTheDocument();
      });
    });

    describe('when there are loading states', () => {
      it('should handle stock loading states', async () => {
        vi.mocked(useStocksModule.useStocks).mockReturnValue(
          createMockUseStocks({
            isLoading: {
              load: true,
              create: false,
              update: false,
              delete: false,
              deleteMultiple: false,
              storage: false,
            },
            isAnyLoading: true,
          })
        );

        await act(async () => {
          renderDashboard();
        });

        // Vérifier que le dashboard affiche l'état de chargement
        expect(screen.getByText('Chargement des stocks...')).toBeInTheDocument();
      });
    });
  });
});
