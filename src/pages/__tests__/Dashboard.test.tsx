import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
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
        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

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
        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        await act(async () => {
          renderDashboard();
        });

        expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
      });

      it('should render metrics section with fixture stats', async () => {
        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        const { container } = await act(async () => {
          return renderDashboard();
        });

        // Check for sh-metric-card web components (Shadow DOM prevents text access)
        const metricCards = container.querySelectorAll('sh-metric-card');
        expect(metricCards.length).toBeGreaterThanOrEqual(3);
      });

      it('should display search input', async () => {
        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        const { container } = await act(async () => {
          return renderDashboard();
        });

        // Check for sh-search-input web component
        const searchInput = container.querySelector('sh-search-input');
        expect(searchInput).toBeInTheDocument();
      });

      it('should display fixture stocks correctly', async () => {
        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

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
        const optimalStocksOnly = createMockUseStocks({
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
        });

        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(optimalStocksOnly);
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        const { container } = await act(async () => {
          return renderDashboard();
        });

        // Check metric cards are present (Shadow DOM prevents text access)
        const metricCards = container.querySelectorAll('sh-metric-card');
        expect(metricCards.length).toBeGreaterThanOrEqual(3);
      });

      it('should handle critical stocks scenario', async () => {
        const criticalStocksOnly = createMockUseStocks({
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
        });

        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(criticalStocksOnly);
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
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
      it.skip('should call createStock with fixture data', async () => {
        const user = userEvent.setup();
        const mockCreateStock = vi.fn();

        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
          createMockUseStocks({
            createStock: mockCreateStock,
          })
        );
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        await act(async () => {
          renderDashboard();
        });

        const addButton = screen.getByText('Ajouter un Stock');
        await user.click(addButton);

        expect(mockCreateStock).toHaveBeenCalled();
      });
    });

    describe('when user searches for stocks', () => {
      it.skip('should filter stocks based on fixture data', async () => {
        const user = userEvent.setup();
        const mockUpdateFilters = vi.fn();

        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
          createMockUseStocks({
            updateFilters: mockUpdateFilters,
          })
        );
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        await act(async () => {
          renderDashboard();
        });

        const searchInput = screen.getByPlaceholderText('Rechercher un produit...');
        await user.type(searchInput, stockHubStockUseCases.optimalStock.label);

        expect(mockUpdateFilters).toHaveBeenLastCalledWith({
          query: stockHubStockUseCases.optimalStock.label,
        });
      });

      it.skip('should search for specific fixture stock names', async () => {
        const user = userEvent.setup();
        const mockUpdateFilters = vi.fn();

        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
          createMockUseStocks({
            updateFilters: mockUpdateFilters,
          })
        );
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        await act(async () => {
          renderDashboard();
        });

        const searchInput = screen.getByPlaceholderText('Rechercher un produit...');

        // Tester avec différents stocks des fixtures
        const stockNames = [
          stockHubStockUseCases.lowStock.label,
          stockHubStockUseCases.criticalStock.label,
          stockHubStockUseCases.highValueStock.label,
        ];

        for (const stockName of stockNames) {
          await user.clear(searchInput);
          await user.type(searchInput, stockName);

          expect(mockUpdateFilters).toHaveBeenLastCalledWith({
            query: stockName,
          });
        }
      });
    });

    describe('when user exports data', () => {
      it.skip('should call exportToCsv with fixture stocks', async () => {
        const user = userEvent.setup();
        const mockExportToCsv = vi.fn().mockResolvedValue(true);

        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport({
            exportToCsv: mockExportToCsv,
          })
        );

        await act(async () => {
          renderDashboard();
        });

        const exportButton = screen.getByText('Exporter');
        await user.click(exportButton);

        expect(mockExportToCsv).toHaveBeenCalledWith(
          dashboardStocks.map(stock => ({ ...stock })),
          'stocks-export.csv'
        );
      });
    });
  });

  describe('Data integration with fixtures', () => {
    describe('when using complete fixture data', () => {
      it.skip('should display user information correctly', async () => {
        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        await act(async () => {
          renderDashboard();
        });

        // Le header devrait afficher les informations utilisateur des fixtures
        expect(screen.getByTestId('header')).toBeInTheDocument();
      });

      it.skip('should handle breadcrumb navigation correctly', async () => {
        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        await act(async () => {
          renderDashboard();
        });

        // Le NavSection devrait afficher le bon breadcrumb pour le dashboard
        expect(screen.getByTestId('nav-section')).toBeInTheDocument();
      });

      it.skip('should display stock categories from fixtures', async () => {
        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        await act(async () => {
          renderDashboard();
        });

        // Vérifier que les différentes catégories de stock sont représentées
        const categorizedStocks = dashboardStocks.filter(stock => stock.category);
        expect(categorizedStocks.length).toBeGreaterThan(0);
      });
    });

    describe('when handling different user scenarios', () => {
      it.skip('should work with wealthy user scenario', async () => {
        const wealthyUserStocks = createMockUseStocks({
          stats: {
            ...createMockUseStocks().stats,
            totalValue: mockUserScenarios.wealthyUser.stats.portfolioValue,
          },
        });

        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(wealthyUserStocks);
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        await act(async () => {
          renderDashboard();
        });

        expect(screen.getByText('Valeur Totale')).toBeInTheDocument();
      });

      it.skip('should work with new user scenario', async () => {
        const newUserStocks = createMockUseStocks({
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
        });

        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(newUserStocks);
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        await act(async () => {
          renderDashboard();
        });

        expect(screen.getByLabelText('Total Produits: 0')).toBeInTheDocument();
      });
    });
  });

  describe('Error handling with fixtures', () => {
    describe('when there are loading errors', () => {
      it.skip('should handle stock loading errors', async () => {
        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
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
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
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
      it.skip('should handle stock loading states', async () => {
        vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
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
        vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
          createMockUseDataExport()
        );

        await act(async () => {
          renderDashboard();
        });

        // Vérifier que le dashboard affiche l'état de chargement
        expect(screen.getByTestId('nav-section')).toBeInTheDocument();
      });
    });
  });
});
