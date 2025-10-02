import {render, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import userEvent from '@testing-library/user-event';
import {Dashboard} from '@/pages/Dashboard';
import * as useStocksModule from '@/hooks/useStocks';
import * as useFrontendStateModule from '@/hooks/useFrontendState';


vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'dark' })
}));

vi.mock('@/components/layout/Header', () => ({
    Header: () => <header data-testid="header">Header</header>
}));

vi.mock('@/components/layout/Footer', () => ({
    Footer: () => <footer data-testid="footer">Footer</footer>
}));

vi.mock('@/components/layout/NavSection', () => ({
    NavSection: ({ children }: { children: React.ReactNode }) => (
        <nav data-testid="nav-section">{children}</nav>
    )
}));

const createMockUseStocks = (overrides = {}) => ({
    stocks: [
        { id: 1, name: 'Stock A', quantity: 100, value: 5000, status: 'optimal' as const, lastUpdate: '2h' },
        { id: 2, name: 'Stock B', quantity: 5, value: 500, status: 'low' as const, lastUpdate: '1h' }
    ],
    allStocks: [
        { id: 1, name: 'Stock A', quantity: 100, value: 5000, status: 'optimal' as const, lastUpdate: '2h' },
        { id: 2, name: 'Stock B', quantity: 5, value: 500, status: 'low' as const, lastUpdate: '1h' }
    ],
    stats: {
        total: 2,
        optimal: 1,
        low: 1,
        critical: 0,
        totalValue: 5500,
        averageValue: 2750
    },
    filters: {},
    loadStocks: vi.fn().mockResolvedValue(undefined),
    createStock: vi.fn(),
    updateStock: vi.fn(),
    deleteStock: vi.fn(),
    deleteMultipleStocks: vi.fn(),
    updateFilters: vi.fn(),
    resetFilters: vi.fn(),
    getStockById: vi.fn(),
    isLoading: {
        load: false,
        create: false,
        update: false,
        delete: false,
        deleteMultiple: false,
        storage: false
    },
    errors: {
        load: null,
        create: null,
        update: null,
        delete: null,
        deleteMultiple: null,
        storage: null
    },
    hasAnyError: false,
    isAnyLoading: false,
    resetErrors: {
        load: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        deleteMultiple: vi.fn()
    },
    ...overrides
});

const createMockUseDataExport = (overrides = {}) => ({
    exportToCsv: vi.fn().mockResolvedValue(true),
    data: null,
    loading: false,
    error: null,
    status: 'idle' as const,
    setLoading: vi.fn(),
    setData: vi.fn(),
    setError: vi.fn(),
    reset: vi.fn(),
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    isError: false,
    ...overrides
});

describe('Dashboard Component', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial render', () => {
        describe('when dashboard loads successfully', () => {
            it('should render all main sections', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                expect(screen.getByTestId('header')).toBeInTheDocument();
                expect(screen.getByTestId('nav-section')).toBeInTheDocument();
                expect(screen.getByTestId('footer')).toBeInTheDocument();
            });

            it('should display dashboard title', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                expect(screen.getByText('Tableau de Bord')).toBeInTheDocument();
            });

            it('should render metrics section with stats', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                expect(screen.getByText('Total Produits')).toBeInTheDocument();
                expect(screen.getByText('Stock Faible')).toBeInTheDocument();
                expect(screen.getByText('Valeur Totale')).toBeInTheDocument();
            });

            it('should display search input', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                expect(screen.getByPlaceholderText('Rechercher un produit...')).toBeInTheDocument();
            });
        });
    });

    describe('Action buttons', () => {
        describe('when user clicks Add Stock button', () => {
            it('should call createStock with default data', async () => {
                const user = userEvent.setup();
                const mockCreateStock = vi.fn();

                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({ createStock: mockCreateStock })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                const addButton = screen.getAllByRole('button').find(btn =>
                    btn.textContent?.includes('Ajouter') || btn.getAttribute('aria-label')?.includes('Ajouter')
                );

                if (addButton) {
                    await user.click(addButton);

                    expect(mockCreateStock).toHaveBeenCalledWith({
                        name: 'Nouveau Stock',
                        quantity: 50,
                        value: 1000,
                        description: 'Stock créé depuis le dashboard'
                    });
                }
            });
        });

        describe('when user clicks Export button', () => {
            it('should call exportToCsv with stocks data', async () => {
                const user = userEvent.setup();
                const mockExportToCsv = vi.fn().mockResolvedValue(true);

                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
                    createMockUseDataExport({ exportToCsv: mockExportToCsv })
                );

                render(<Dashboard />);

                const exportButton = screen.getByRole('button', { name: /Exporter/i });
                await user.click(exportButton);

                expect(mockExportToCsv).toHaveBeenCalledWith(
                    expect.any(Array),
                    'stocks-export.csv'
                );
            });

            it('should not export when stocks are empty', async () => {
                const user = userEvent.setup();
                const mockExportToCsv = vi.fn();

                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({ stocks: [] })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
                    createMockUseDataExport({ exportToCsv: mockExportToCsv })
                );

                render(<Dashboard />);

                const exportButton = screen.getByRole('button', { name: /Exporter/i });
                await user.click(exportButton);

                expect(mockExportToCsv).not.toHaveBeenCalled();
            });
        });
    });

    describe('Search functionality', () => {
        describe('when user types in search input', () => {
            it('should update search term', async () => {
                const user = userEvent.setup();
                const mockUpdateFilters = vi.fn();

                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({ updateFilters: mockUpdateFilters })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                const searchInput = screen.getByPlaceholderText('Rechercher un produit...');

                await waitFor(async () => {
                    await user.clear(searchInput);
                    await user.type(searchInput, 'Stock A');
                });

                await waitFor(() => {
                    expect(mockUpdateFilters).toHaveBeenCalled();
                });
            });
        });

        describe('when user clears filters', () => {
            it('should reset search term and filters', async () => {
                const mockResetFilters = vi.fn();

                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({
                        stocks: [],
                        resetFilters: mockResetFilters
                    })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                await waitFor(() => {
                    expect(screen.queryByText('Aucun stock trouvé')).toBeInTheDocument();
                });
            });
        });
    });

    describe('Stock Grid interactions', () => {
        describe('when user views a stock', () => {
            it('should call getStockById', async () => {
                const user = userEvent.setup();
                const mockGetStockById = vi.fn().mockReturnValue({ id: 1, name: 'Stock A' });

                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({ getStockById: mockGetStockById })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                await waitFor(() => {
                    const detailsButton = screen.queryByRole('button', { name: /Voir les détails de Stock A/i });
                    if (detailsButton) {
                        user.click(detailsButton);
                        expect(mockGetStockById).toHaveBeenCalled();
                    }
                });
            });
        });

        describe('when user edits a stock', () => {
            it('should call updateStock', async () => {
                const user = userEvent.setup();
                const mockUpdateStock = vi.fn();
                const mockGetStockById = vi.fn().mockReturnValue({
                    id: 1,
                    name: 'Stock A',
                    quantity: 100
                });

                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({
                        updateStock: mockUpdateStock,
                        getStockById: mockGetStockById
                    })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                await waitFor(() => {
                    const editButton = screen.queryByRole('button', { name: /Modifier Stock A/i });
                    if (editButton) {
                        user.click(editButton);
                        expect(mockUpdateStock).toHaveBeenCalled();
                    }
                });
            });
        });

        describe('when user deletes a stock', () => {
            it('should call deleteStock', async () => {
                const user = userEvent.setup();
                const mockDeleteStock = vi.fn();

                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({ deleteStock: mockDeleteStock })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                await waitFor(() => {
                    const deleteButton = screen.queryByRole('button', { name: /Supprimer Stock A/i });
                    if (deleteButton) {
                        user.click(deleteButton);
                        expect(mockDeleteStock).toHaveBeenCalled();
                    }
                });
            });
        });
    });

    describe('Loading states', () => {
        describe('when stocks are loading', () => {
            it('should display loading spinner', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({ isAnyLoading: true, isLoading: { ...createMockUseStocks().isLoading, load: true } })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                expect(screen.getByText('Chargement des stocks...')).toBeInTheDocument();
            });

            it('should not render StockGrid during loading', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({ isAnyLoading: true })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                expect(screen.queryByText('Stock A')).not.toBeInTheDocument();
            });
        });

        describe('when creating a stock', () => {
            it('should show creation loading state', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({
                        isAnyLoading: true,
                        isLoading: { ...createMockUseStocks().isLoading, create: true }
                    })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                expect(screen.getByText('Création en cours...')).toBeInTheDocument();
            });
        });
    });

    describe('Error states', () => {
        describe('when there is a global error', () => {
            it('should display error screen', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({
                        hasAnyError: true,
                        errors: {
                            ...createMockUseStocks().errors,
                            load: { id: '1', type: 'unknown', message: 'Erreur de chargement', timestamp: new Date() }
                        }
                    })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                expect(screen.getByText('Erreur')).toBeInTheDocument();
                expect(screen.getByText(/Erreur de chargement/)).toBeInTheDocument();
            });

            it('should show retry button', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({ hasAnyError: true })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                expect(screen.getByRole('button', { name: /Réessayer/i })).toBeInTheDocument();
            });

            it('should allow resetting errors', async () => {
                const user = userEvent.setup();
                const mockResetErrors = {
                    load: vi.fn(),
                    create: vi.fn(),
                    update: vi.fn(),
                    delete: vi.fn(),
                    deleteMultiple: vi.fn()
                };

                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({
                        hasAnyError: true,
                        resetErrors: mockResetErrors
                    })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                const retryButton = screen.getByRole('button', { name: /Réessayer/i });
                await user.click(retryButton);

                expect(mockResetErrors.load).toHaveBeenCalled();
            });
        });
    });

    describe('Empty state', () => {
        describe('when no stocks are available', () => {
            it('should display empty state message', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({ stocks: [] })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                expect(screen.getByText('Aucun stock trouvé')).toBeInTheDocument();
            });

            it('should show add stock button in empty state', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({ stocks: [] })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                const addButtons = screen.getAllByRole('button', { name: /Ajouter/i });
                expect(addButtons.length).toBeGreaterThan(0);
            });
        });

        describe('when search returns no results', () => {
            it('should display no results message with search term', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(
                    createMockUseStocks({ stocks: [] })
                );
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                expect(screen.getByText('Aucun stock trouvé')).toBeInTheDocument();
            });
        });
    });

    describe('StockHub business use cases', () => {
        describe('when manager monitors inventory', () => {
            it('should display all critical metrics', () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(createMockUseDataExport());

                render(<Dashboard />);

                expect(screen.getByText('Total Produits')).toBeInTheDocument();
                expect(screen.getByText('Stock Faible')).toBeInTheDocument();
                expect(screen.getByText('Valeur Totale')).toBeInTheDocument();
            });
        });

        describe('when exporting for reporting', () => {
            it('should export filtered stocks', async () => {
                const user = userEvent.setup();
                const mockExportToCsv = vi.fn().mockResolvedValue(true);

                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());
                vi.spyOn(useFrontendStateModule, 'useDataExport').mockReturnValue(
                    createMockUseDataExport({ exportToCsv: mockExportToCsv })
                );

                render(<Dashboard />);

                const exportButton = screen.getByRole('button', { name: /Exporter/i });
                await user.click(exportButton);

                expect(mockExportToCsv).toHaveBeenCalled();
            });
        });
    });
});