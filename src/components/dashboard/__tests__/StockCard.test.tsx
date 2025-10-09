import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import userEvent from '@testing-library/user-event';

import {StockCard} from '../StockCard';
import {createMockStock, stockHubStockUseCases,} from '@/test/fixtures/stock';


vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'dark' })
}));

describe('StockCard Component', () => {

    describe('Basic rendering', () => {
        describe('when rendered with required props', () => {
            it('should display the stock name', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(<StockCard stock={stock} />);

                expect(screen.getByText(stock.name)).toBeInTheDocument();
            });

            it('should display the quantity', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(<StockCard stock={stock} />);

                expect(screen.getByText(String(stock.quantity))).toBeInTheDocument();
                expect(screen.getByText('Quantité')).toBeInTheDocument();
            });

            it('should display the formatted value with currency', () => {
                const stock = stockHubStockUseCases.highValueStock;
                render(<StockCard stock={stock} />);

                expect(screen.getByText(/€12[,\s]?500/)).toBeInTheDocument();
            });

            it('should display the last update time', () => {
                const stock = createMockStock({ lastUpdate: '5min' });
                render(<StockCard stock={stock} />);

                expect(screen.getByText(/Mis à jour il y a 5min/)).toBeInTheDocument();
            });

            it('should use article as semantic element', () => {
                const stock = stockHubStockUseCases.optimalStock;
                const { container } = render(<StockCard stock={stock} />);

                expect(container.querySelector('article')).toBeInTheDocument();
            });
        });

        describe('when category is provided', () => {
            it('should display the category', () => {
                const stock = stockHubStockUseCases.lowStock;
                render(<StockCard stock={stock} />);

                expect(screen.getByText(new RegExp(`Catégorie: ${stock.category}`))).toBeInTheDocument();
            });
        });

        describe('when category is not provided', () => {
            it('should not display category label', () => {
                const stock = { ...stockHubStockUseCases.minimalStock, category: undefined };
                render(<StockCard stock={stock} />);

                expect(screen.queryByText(/Catégorie:/)).not.toBeInTheDocument();
            });
        });
    });

    describe('Status badges', () => {
        describe('when status is optimal', () => {
            it('should display "Optimal" badge', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(<StockCard stock={stock} />);

                expect(screen.getByText('Optimal')).toBeInTheDocument();
            });

            it('should apply emerald color to status bar', () => {
                const stock = stockHubStockUseCases.optimalStock;
                const { container } = render(<StockCard stock={stock} />);

                const statusBar = container.querySelector('[aria-label*="Optimal"]');
                expect(statusBar).toHaveClass('border-emerald-500/30');
            });
        });

        describe('when status is low', () => {
            it('should display "Low" badge', () => {
                const stock = stockHubStockUseCases.lowStock;
                render(<StockCard stock={stock} />);

                expect(screen.getByText('Low')).toBeInTheDocument();
            });

            it('should apply amber color to status bar', () => {
                const stock = stockHubStockUseCases.lowStock;
                const { container } = render(<StockCard stock={stock} />);

                const statusBar = container.querySelector('[aria-label*="Low"]');
                expect(statusBar).toHaveClass('border-amber-500/30');
            });
        });

        describe('when status is critical', () => {
            it('should display "Critical" badge', () => {
                const stock = stockHubStockUseCases.criticalStock;
                render(<StockCard stock={stock} />);

                expect(screen.getByText('Critical')).toBeInTheDocument();
            });

            it('should apply red color to status bar', () => {
                const stock = stockHubStockUseCases.criticalStock;
                const { container } = render(<StockCard stock={stock} />);

                const statusBar = container.querySelector('[aria-label*="Critical"]');
                expect(statusBar).toHaveClass('border-red-500/40');
            });
        });
    });

    describe('User interactions', () => {
        describe('when onView is provided', () => {
            it('should display Details button', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(<StockCard stock={stock} onView={vi.fn()} />);

                expect(screen.getByRole('button', { name: /Voir les détails/i })).toBeInTheDocument();
            });

            it('should call onView with correct stock ID on click', async () => {
                const user = userEvent.setup();
                const onView = vi.fn();
                const stock = stockHubStockUseCases.lowStock;

                render(<StockCard stock={stock} onView={onView} />);

                const detailsButton = screen.getByRole('button', { name: /Voir les détails/i });
                await user.click(detailsButton);

                expect(onView).toHaveBeenCalledWith(stock.id);
                expect(onView).toHaveBeenCalledTimes(1);
            });
        });

        describe('when onView is not provided', () => {
            it('should not display Details button', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(<StockCard stock={stock} />);

                expect(screen.queryByRole('button', { name: /Voir les détails/i })).not.toBeInTheDocument();
            });
        });

        describe('when onEdit is provided', () => {
            it('should display Edit button', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(<StockCard stock={stock} onEdit={vi.fn()} />);

                expect(screen.getByRole('button', { name: /Modifier/i })).toBeInTheDocument();
            });

            it('should call onEdit with correct stock ID on click', async () => {
                const user = userEvent.setup();
                const onEdit = vi.fn();
                const stock = stockHubStockUseCases.criticalStock;

                render(<StockCard stock={stock} onEdit={onEdit} />);

                const editButton = screen.getByRole('button', { name: /Modifier/i });
                await user.click(editButton);

                expect(onEdit).toHaveBeenCalledWith(stock.id);
            });
        });

        describe('when onEdit is not provided', () => {
            it('should not display Edit button', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(<StockCard stock={stock} />);

                expect(screen.queryByRole('button', { name: /Modifier/i })).not.toBeInTheDocument();
            });
        });

        describe('when onDelete is provided', () => {
            it('should display Delete button', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(<StockCard stock={stock} onDelete={vi.fn()} />);

                expect(screen.getByRole('button', { name: /Supprimer/i })).toBeInTheDocument();
            });

            it('should call onDelete with correct stock ID on click', async () => {
                const user = userEvent.setup();
                const onDelete = vi.fn();
                const stock = stockHubStockUseCases.criticalLowQuantity;

                render(<StockCard stock={stock} onDelete={onDelete} />);

                const deleteButton = screen.getByRole('button', { name: /Supprimer/i });
                await user.click(deleteButton);

                expect(onDelete).toHaveBeenCalledWith(stock.id);
            });
        });

        describe('when onDelete is not provided', () => {
            it('should not display Delete button', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(<StockCard stock={stock} />);

                expect(screen.queryByRole('button', { name: /Supprimer/i })).not.toBeInTheDocument();
            });
        });
    });

    describe('Loading states', () => {
        describe('when isUpdating is true', () => {
            it('should disable Edit button', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(
                    <StockCard
                        stock={stock}
                        onEdit={vi.fn()}
                        isUpdating={true}
                    />
                );

                const editButton = screen.getByRole('button', { name: /Modifier/i });
                expect(editButton).toBeDisabled();
            });

            it('should disable Delete button', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(
                    <StockCard
                        stock={stock}
                        onDelete={vi.fn()}
                        isUpdating={true}
                    />
                );

                const deleteButton = screen.getByRole('button', { name: /Supprimer/i });
                expect(deleteButton).toBeDisabled();
            });
        });

        describe('when isDeleting is true', () => {
            it('should disable Edit button', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(
                    <StockCard
                        stock={stock}
                        onEdit={vi.fn()}
                        isDeleting={true}
                    />
                );

                const editButton = screen.getByRole('button', { name: /Modifier/i });
                expect(editButton).toBeDisabled();
            });

            it('should disable Delete button', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(
                    <StockCard
                        stock={stock}
                        onDelete={vi.fn()}
                        isDeleting={true}
                    />
                );

                const deleteButton = screen.getByRole('button', { name: /Supprimer/i });
                expect(deleteButton).toBeDisabled();
            });
        });
    });

    describe('Animations and styles', () => {
        describe('when isLoaded is true', () => {
            it('should apply loaded animation classes', () => {
                const stock = stockHubStockUseCases.optimalStock;
                const { container } = render(<StockCard stock={stock} isLoaded={true} />);

                const article = container.querySelector('article');
                expect(article).toHaveClass('translate-y-0', 'opacity-100');
            });
        });

        describe('when isLoaded is false', () => {
            it('should apply initial animation classes', () => {
                const stock = stockHubStockUseCases.optimalStock;
                const { container } = render(<StockCard stock={stock} isLoaded={false} />);

                const article = container.querySelector('article');
                expect(article).toHaveClass('translate-y-8', 'opacity-0');
            });
        });

        describe('when index is provided', () => {
            it('should apply staggered animation delay', () => {
                const stock = stockHubStockUseCases.optimalStock;
                const { container } = render(<StockCard stock={stock} index={3} />);

                const article = container.querySelector('article');
                expect(article).toHaveStyle({ transitionDelay: '450ms' });
            });
        });

        describe('when custom className is provided', () => {
            it('should apply custom className', () => {
                const stock = stockHubStockUseCases.optimalStock;
                const { container } = render(<StockCard stock={stock} className="custom-class" />);

                const article = container.querySelector('article');
                expect(article).toHaveClass('custom-class');
            });
        });
    });

    describe('Accessibility', () => {
        describe('when rendered', () => {
            it('should associate heading with article via aria-labelledby', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(<StockCard stock={stock} />);

                const article = screen.getByRole('article');
                const heading = screen.getByRole('heading', { name: stock.name });

                expect(article).toHaveAttribute('aria-labelledby', `stock-${stock.id}-name`);
                expect(heading).toHaveAttribute('id', `stock-${stock.id}-name`);
            });

            it('should add aria-label on status bar', () => {
                const stock = stockHubStockUseCases.lowStock;
                const { container } = render(<StockCard stock={stock} />);

                const statusBar = container.querySelector('[aria-label*="Statut du stock"]');
                expect(statusBar).toHaveAttribute('aria-label', 'Statut du stock: Low');
            });

            it('should group metrics with role="group"', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(<StockCard stock={stock} />);

                const metricsGroup = screen.getByRole('group', { name: /Informations du stock/i });
                expect(metricsGroup).toBeInTheDocument();
            });

            it('should group actions with role="group"', () => {
                const stock = stockHubStockUseCases.optimalStock;
                render(<StockCard stock={stock} onView={vi.fn()} />);

                const actionsGroup = screen.getByRole('group', { name: new RegExp(`Actions pour ${stock.name}`, 'i') });
                expect(actionsGroup).toBeInTheDocument();
            });

            it('should provide descriptive aria-label for quantity', () => {
                const stock = stockHubStockUseCases.optimalStock;
                const { container } = render(<StockCard stock={stock} />);

                const quantityLabel = container.querySelector(`[aria-label*="Quantité: ${stock.quantity}"]`);
                expect(quantityLabel).toBeInTheDocument();
            });

            it('should provide descriptive aria-label for value', () => {
                const stock = stockHubStockUseCases.criticalStock;
                const { container } = render(<StockCard stock={stock} />);

                const valueLabel = container.querySelector(`[aria-label*="Valeur: ${stock.value}"]`);
                expect(valueLabel).toBeInTheDocument();
            });
        });
    });
});