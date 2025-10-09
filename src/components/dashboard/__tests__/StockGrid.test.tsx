import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import {StockGrid} from '../StockGrid';
import {createMockStock, dashboardStocks, stockHubStockUseCases,} from '@/test/fixtures/stock';


vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'dark' })
}));

describe('StockGrid Component', () => {

    describe('Basic rendering', () => {
        describe('when rendered with stocks array', () => {
            it('should render a section with region role', () => {
                const stocks = [stockHubStockUseCases.optimalStock];
                const { container } = render(<StockGrid stocks={stocks} />);

                const section = container.querySelector('section[role="region"]');
                expect(section).toBeInTheDocument();
            });

            it('should apply responsive grid layout classes', () => {
                const stocks = [stockHubStockUseCases.optimalStock];
                const { container } = render(<StockGrid stocks={stocks} />);

                const section = container.querySelector('section');
                expect(section).toHaveClass('grid');
                expect(section).toHaveClass('grid-cols-1');
                expect(section).toHaveClass('lg:grid-cols-2');
                expect(section).toHaveClass('xl:grid-cols-3');
                expect(section).toHaveClass('gap-6');
            });

            it('should display accessible hidden heading with count', () => {
                const stocks = dashboardStocks.slice(0, 2);
                render(<StockGrid stocks={stocks} />);

                const heading = screen.getByText(/Liste des stocks \(2 éléments\)/i);
                expect(heading).toBeInTheDocument();
                expect(heading).toHaveClass('sr-only');
            });
        });

        describe('when custom className is provided', () => {
            it('should apply custom className to section', () => {
                const stocks = [stockHubStockUseCases.optimalStock];
                const { container } = render(<StockGrid stocks={stocks} className="custom-grid-class" />);

                const section = container.querySelector('section');
                expect(section).toHaveClass('custom-grid-class');
            });
        });
    });

    describe('Empty state', () => {
        describe('when stocks array is empty', () => {
            it('should display zero in heading count', () => {
                render(<StockGrid stocks={[]} />);

                expect(screen.getByText(/Liste des stocks \(0 éléments\)/i)).toBeInTheDocument();
            });

            it('should not render any stock articles', () => {
                const { container } = render(<StockGrid stocks={[]} />);

                const articles = container.querySelectorAll('article');
                expect(articles).toHaveLength(0);
            });
        });
    });

    describe('Stock cards rendering', () => {
        describe('when single stock is provided', () => {
            it('should render one stock article', () => {
                const stocks = [stockHubStockUseCases.optimalStock];
                render(<StockGrid stocks={stocks} />);

                expect(screen.getByText(stocks[0].name)).toBeInTheDocument();
            });

            it('should apply correct animation delay', () => {
                const stocks = [stockHubStockUseCases.optimalStock];
                const { container } = render(<StockGrid stocks={stocks} />);

                const article = container.querySelector('article');
                expect(article).toHaveStyle({ transitionDelay: '0ms' });
            });
        });

        describe('when multiple stocks are provided', () => {
            it('should render all stock names', () => {
                const stocks = dashboardStocks.slice(0, 3);
                render(<StockGrid stocks={stocks} />);

                stocks.forEach(stock => {
                    expect(screen.getByText(stock.name)).toBeInTheDocument();
                });
            });

            it('should apply staggered animation delays', () => {
                const stocks = dashboardStocks.slice(0, 3);
                const { container } = render(<StockGrid stocks={stocks} />);

                const articles = container.querySelectorAll('article');
                expect(articles[0]).toHaveStyle({ transitionDelay: '0ms' });
                expect(articles[1]).toHaveStyle({ transitionDelay: '150ms' });
                expect(articles[2]).toHaveStyle({ transitionDelay: '300ms' });
            });

            it('should update heading count dynamically', () => {
                const stocks = dashboardStocks;
                render(<StockGrid stocks={stocks} />);

                expect(screen.getByText(new RegExp(`Liste des stocks \\(${stocks.length} éléments\\)`, 'i'))).toBeInTheDocument();
            });
        });
    });

    describe('Callbacks propagation', () => {
        describe('when onView callback is provided', () => {
            it('should render Details button for each stock', () => {
                const onView = vi.fn();
                const stocks = dashboardStocks.slice(0, 2);
                render(<StockGrid stocks={stocks} onView={onView} />);

                const detailsButtons = screen.getAllByRole('button', { name: /Voir les détails/i });
                expect(detailsButtons).toHaveLength(stocks.length);
            });
        });

        describe('when onView callback is not provided', () => {
            it('should not render Details buttons', () => {
                const stocks = [stockHubStockUseCases.optimalStock];
                render(<StockGrid stocks={stocks} />);

                expect(screen.queryByRole('button', { name: /Voir les détails/i })).not.toBeInTheDocument();
            });
        });

        describe('when onEdit callback is provided', () => {
            it('should render Edit buttons for each stock', () => {
                const onEdit = vi.fn();
                const stocks = dashboardStocks.slice(0, 2);
                render(<StockGrid stocks={stocks} onEdit={onEdit} />);

                const editButtons = screen.getAllByRole('button', { name: /Modifier/i });
                expect(editButtons).toHaveLength(stocks.length);
            });
        });

        describe('when onDelete callback is provided', () => {
            it('should render Delete buttons for each stock', () => {
                const onDelete = vi.fn();
                const stocks = dashboardStocks.slice(0, 2);
                render(<StockGrid stocks={stocks} onDelete={onDelete} />);

                const deleteButtons = screen.getAllByRole('button', { name: /Supprimer/i });
                expect(deleteButtons).toHaveLength(stocks.length);
            });
        });
    });

    describe('Loading states', () => {
        describe('when isLoaded is true', () => {
            it('should apply loaded animation classes to all cards', () => {
                const stocks = dashboardStocks.slice(0, 2);
                const { container } = render(<StockGrid stocks={stocks} isLoaded={true} />);

                const articles = container.querySelectorAll('article');
                articles.forEach(article => {
                    expect(article).toHaveClass('translate-y-0', 'opacity-100');
                });
            });
        });

        describe('when isLoaded is false', () => {
            it('should apply initial animation classes to all cards', () => {
                const stocks = dashboardStocks.slice(0, 2);
                const { container } = render(<StockGrid stocks={stocks} isLoaded={false} />);

                const articles = container.querySelectorAll('article');
                articles.forEach(article => {
                    expect(article).toHaveClass('translate-y-8', 'opacity-0');
                });
            });
        });

        describe('when isUpdating is true', () => {
            it('should disable all Edit and Delete buttons', () => {
                const stocks = [stockHubStockUseCases.optimalStock];
                render(<StockGrid stocks={stocks} onEdit={vi.fn()} onDelete={vi.fn()} isUpdating={true} />);

                const editButton = screen.getByRole('button', { name: /Modifier/i });
                const deleteButton = screen.getByRole('button', { name: /Supprimer/i });

                expect(editButton).toBeDisabled();
                expect(deleteButton).toBeDisabled();
            });
        });

        describe('when isDeleting is true', () => {
            it('should disable all Edit and Delete buttons', () => {
                const stocks = [stockHubStockUseCases.optimalStock];
                render(<StockGrid stocks={stocks} onEdit={vi.fn()} onDelete={vi.fn()} isDeleting={true} />);

                const editButton = screen.getByRole('button', { name: /Modifier/i });
                const deleteButton = screen.getByRole('button', { name: /Supprimer/i });

                expect(editButton).toBeDisabled();
                expect(deleteButton).toBeDisabled();
            });
        });
    });

    describe('Accessibility', () => {
        describe('when rendered', () => {
            it('should link section to heading via aria-labelledby', () => {
                const stocks = [stockHubStockUseCases.optimalStock];
                const { container } = render(<StockGrid stocks={stocks} />);

                const section = container.querySelector('section');
                const heading = screen.getByText(/Liste des stocks/);

                expect(section).toHaveAttribute('aria-labelledby', 'stocks-list-heading');
                expect(heading).toHaveAttribute('id', 'stocks-list-heading');
            });

            it('should provide descriptive count in heading', () => {
                const stocks = dashboardStocks.slice(0, 2);
                render(<StockGrid stocks={stocks} />);

                expect(screen.getByText('Liste des stocks (2 éléments)')).toBeInTheDocument();
            });

            it('should use sr-only class for screen reader only heading', () => {
                const stocks = [stockHubStockUseCases.optimalStock];
                render(<StockGrid stocks={stocks} />);

                const heading = screen.getByText(/Liste des stocks/);
                expect(heading).toHaveClass('sr-only');
            });
        });
    });

    describe('StockHub business use cases', () => {
        describe('when displaying dashboard stock overview', () => {
            it('should render all user stocks in grid layout', () => {
                const stocks = dashboardStocks;
                render(<StockGrid stocks={stocks} />);

                stocks.forEach(stock => {
                    expect(screen.getByText(stock.name)).toBeInTheDocument();
                });
            });
        });

        describe('when displaying stocks with different statuses', () => {
            it('should render mixed status stocks correctly', () => {
                const stocks = [
                    stockHubStockUseCases.optimalStock,
                    stockHubStockUseCases.lowStock,
                    stockHubStockUseCases.criticalStock
                ];
                render(<StockGrid stocks={stocks} />);

                stocks.forEach(stock => {
                    expect(screen.getByText(stock.name)).toBeInTheDocument();
                });

                // Vérifier les badges de statut
                expect(screen.getByText('Optimal')).toBeInTheDocument();
                expect(screen.getByText('Low')).toBeInTheDocument();
                expect(screen.getByText('Critical')).toBeInTheDocument();
            });
        });

        describe('when user has no stocks yet', () => {
            it('should handle empty state gracefully', () => {
                const { container } = render(<StockGrid stocks={[]} />);

                expect(screen.getByText(/0 éléments/)).toBeInTheDocument();

                const articles = container.querySelectorAll('article');
                expect(articles).toHaveLength(0);
            });
        });

        describe('when rendering large inventory', () => {
            it('should handle 50 stocks efficiently', () => {
                const stocks = Array.from({ length: 50 }, (_, i) =>
                    createMockStock({ id: i + 1, name: `Stock ${i + 1}` })
                );
                const { container } = render(<StockGrid stocks={stocks} />);

                const articles = container.querySelectorAll('article');
                expect(articles).toHaveLength(50);
            });

            it('should maintain correct animation delays for first and last items', () => {
                const stocks = Array.from({ length: 10 }, (_, i) => createMockStock({ id: i + 1 }));
                const { container } = render(<StockGrid stocks={stocks} />);

                const articles = container.querySelectorAll('article');
                expect(articles[0]).toHaveStyle({ transitionDelay: '0ms' });
                expect(articles[9]).toHaveStyle({ transitionDelay: '1350ms' }); // 9 * 150ms
            });
        });

        describe('when user performs bulk operations', () => {
            it('should support view action on multiple stocks', () => {
                const onView = vi.fn();
                const stocks = dashboardStocks.slice(0, 3);
                render(<StockGrid stocks={stocks} onView={onView} />);

                const viewButtons = screen.getAllByRole('button', { name: /Voir les détails/i });
                expect(viewButtons).toHaveLength(stocks.length);
            });
        });

        describe('when loading stocks from API', () => {
            it('should show initial loading state for all cards', () => {
                const stocks = dashboardStocks.slice(0, 2);
                const { container } = render(<StockGrid stocks={stocks} isLoaded={false} />);

                const articles = container.querySelectorAll('article');
                articles.forEach(article => {
                    expect(article).toHaveClass('translate-y-8', 'opacity-0');
                });
            });

            it('should show loaded state after API response', () => {
                const stocks = dashboardStocks.slice(0, 2);
                const { container } = render(<StockGrid stocks={stocks} isLoaded={true} />);

                const articles = container.querySelectorAll('article');
                articles.forEach(article => {
                    expect(article).toHaveClass('translate-y-0', 'opacity-100');
                });
            });
        });

        describe('when user updates a stock', () => {
            it('should disable all action buttons during update', () => {
                const stocks = dashboardStocks.slice(0, 2);
                render(<StockGrid stocks={stocks} onEdit={vi.fn()} onDelete={vi.fn()} isUpdating={true} />);

                const editButtons = screen.getAllByRole('button', { name: /Modifier/i });
                const deleteButtons = screen.getAllByRole('button', { name: /Supprimer/i });

                editButtons.forEach(button => expect(button).toBeDisabled());
                deleteButtons.forEach(button => expect(button).toBeDisabled());
            });
        });

        describe('when user deletes a stock', () => {
            it('should disable all action buttons during deletion', () => {
                const stocks = dashboardStocks.slice(0, 2);
                render(<StockGrid stocks={stocks} onEdit={vi.fn()} onDelete={vi.fn()} isDeleting={true} />);

                const editButtons = screen.getAllByRole('button', { name: /Modifier/i });
                const deleteButtons = screen.getAllByRole('button', { name: /Supprimer/i });

                editButtons.forEach(button => expect(button).toBeDisabled());
                deleteButtons.forEach(button => expect(button).toBeDisabled());
            });
        });
    });
});