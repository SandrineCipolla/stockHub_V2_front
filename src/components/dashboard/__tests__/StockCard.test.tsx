// tests/components/StockCard.test.tsx
import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import userEvent from '@testing-library/user-event';

import type {Stock} from '@/types';
import {StockCard} from '../StockCard';

// Mock du hook useTheme
vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'dark' })
}));

// Helper pour créer un stock de test
const createMockStock = (overrides?: Partial<Stock>): Stock => ({
    id: 1,
    name: 'Stock Test',
    quantity: 100,
    value: 5000,
    status: 'optimal',
    lastUpdate: '2h',
    ...overrides
});

describe('StockCard Component', () => {

    describe('Basic rendering', () => {
        describe('when rendered with required props', () => {
            it('should display the stock name', () => {
                const stock = createMockStock({ name: 'Mon Stock Principal' });
                render(<StockCard stock={stock} />);

                expect(screen.getByText('Mon Stock Principal')).toBeInTheDocument();
            });

            it('should display the quantity', () => {
                const stock = createMockStock({ quantity: 250 });
                render(<StockCard stock={stock} />);

                expect(screen.getByText('250')).toBeInTheDocument();
                expect(screen.getByText('Quantité')).toBeInTheDocument();
            });

            it('should display the formatted value with currency', () => {
                const stock = createMockStock({ value: 12500 });
                render(<StockCard stock={stock} />);

                expect(screen.getByText(/€12[,\s]?500/)).toBeInTheDocument();
            });

            it('should display the last update time', () => {
                const stock = createMockStock({ lastUpdate: '5min' });
                render(<StockCard stock={stock} />);

                expect(screen.getByText(/Mis à jour il y a 5min/)).toBeInTheDocument();
            });

            it('should use article as semantic element', () => {
                const stock = createMockStock();
                const { container } = render(<StockCard stock={stock} />);

                expect(container.querySelector('article')).toBeInTheDocument();
            });
        });

        describe('when category is provided', () => {
            it('should display the category', () => {
                const stock = createMockStock({ category: 'Électronique' });
                render(<StockCard stock={stock} />);

                expect(screen.getByText(/Catégorie: Électronique/)).toBeInTheDocument();
            });
        });

        describe('when category is not provided', () => {
            it('should not display category label', () => {
                const stock = createMockStock({ category: undefined });
                render(<StockCard stock={stock} />);

                expect(screen.queryByText(/Catégorie:/)).not.toBeInTheDocument();
            });
        });
    });

    describe('Status badges', () => {
        describe('when status is optimal', () => {
            it('should display "Optimal" badge', () => {
                const stock = createMockStock({ status: 'optimal' });
                render(<StockCard stock={stock} />);

                expect(screen.getByText('Optimal')).toBeInTheDocument();
            });

            it('should apply emerald color to status bar', () => {
                const stock = createMockStock({ status: 'optimal' });
                const { container } = render(<StockCard stock={stock} />);

                const statusBar = container.querySelector('.bg-emerald-400');
                expect(statusBar).toBeInTheDocument();
            });
        });

        describe('when status is low', () => {
            it('should display "Faible" badge', () => {
                const stock = createMockStock({ status: 'low' });
                render(<StockCard stock={stock} />);

                expect(screen.getByText('Faible')).toBeInTheDocument();
            });

            it('should apply amber color to status bar', () => {
                const stock = createMockStock({ status: 'low' });
                const { container } = render(<StockCard stock={stock} />);

                const statusBar = container.querySelector('.bg-amber-400');
                expect(statusBar).toBeInTheDocument();
            });
        });

        describe('when status is critical', () => {
            it('should display "Critique" badge', () => {
                const stock = createMockStock({ status: 'critical' });
                render(<StockCard stock={stock} />);

                expect(screen.getByText('Critique')).toBeInTheDocument();
            });

            it('should apply red color to status bar', () => {
                const stock = createMockStock({ status: 'critical' });
                const { container } = render(<StockCard stock={stock} />);

                const statusBar = container.querySelector('.bg-red-400');
                expect(statusBar).toBeInTheDocument();
            });
        });
    });

    describe('User interactions', () => {
        describe('when onView is provided', () => {
            it('should display Details button', () => {
                const stock = createMockStock();
                render(<StockCard stock={stock} onView={vi.fn()} />);

                expect(screen.getByRole('button', { name: /Voir les détails/i })).toBeInTheDocument();
            });

            it('should call onView with correct stock ID on click', async () => {
                const user = userEvent.setup();
                const onView = vi.fn();
                const stock = createMockStock({ id: 42 });

                render(<StockCard stock={stock} onView={onView} />);

                const detailsButton = screen.getByRole('button', { name: /Voir les détails/i });
                await user.click(detailsButton);

                expect(onView).toHaveBeenCalledWith(42);
                expect(onView).toHaveBeenCalledTimes(1);
            });
        });

        describe('when onView is not provided', () => {
            it('should not display Details button', () => {
                const stock = createMockStock();
                render(<StockCard stock={stock} />);

                expect(screen.queryByRole('button', { name: /Voir les détails/i })).not.toBeInTheDocument();
            });
        });

        describe('when onEdit is provided', () => {
            it('should display Edit button', () => {
                const stock = createMockStock();
                render(<StockCard stock={stock} onEdit={vi.fn()} />);

                expect(screen.getByRole('button', { name: /Modifier/i })).toBeInTheDocument();
            });

            it('should call onEdit with correct stock ID on click', async () => {
                const user = userEvent.setup();
                const onEdit = vi.fn();
                const stock = createMockStock({ id: 99 });

                render(<StockCard stock={stock} onEdit={onEdit} />);

                const editButton = screen.getByRole('button', { name: /Modifier/i });
                await user.click(editButton);

                expect(onEdit).toHaveBeenCalledWith(99);
            });
        });

        describe('when onEdit is not provided', () => {
            it('should not display Edit button', () => {
                const stock = createMockStock();
                render(<StockCard stock={stock} />);

                expect(screen.queryByRole('button', { name: /Modifier/i })).not.toBeInTheDocument();
            });
        });

        describe('when onDelete is provided', () => {
            it('should display Delete button', () => {
                const stock = createMockStock();
                render(<StockCard stock={stock} onDelete={vi.fn()} />);

                expect(screen.getByRole('button', { name: /Supprimer/i })).toBeInTheDocument();
            });

            it('should call onDelete with correct stock ID on click', async () => {
                const user = userEvent.setup();
                const onDelete = vi.fn();
                const stock = createMockStock({ id: 13 });

                render(<StockCard stock={stock} onDelete={onDelete} />);

                const deleteButton = screen.getByRole('button', { name: /Supprimer/i });
                await user.click(deleteButton);

                expect(onDelete).toHaveBeenCalledWith(13);
            });
        });

        describe('when onDelete is not provided', () => {
            it('should not display Delete button', () => {
                const stock = createMockStock();
                render(<StockCard stock={stock} />);

                expect(screen.queryByRole('button', { name: /Supprimer/i })).not.toBeInTheDocument();
            });
        });
    });

    describe('Loading states', () => {
        describe('when isUpdating is true', () => {
            it('should disable Edit button', () => {
                const stock = createMockStock();
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
                const stock = createMockStock();
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
                const stock = createMockStock();
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
                const stock = createMockStock();
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
                const stock = createMockStock();
                const { container } = render(<StockCard stock={stock} isLoaded={true} />);

                const article = container.querySelector('article');
                expect(article).toHaveClass('translate-y-0', 'opacity-100');
            });
        });

        describe('when isLoaded is false', () => {
            it('should apply initial animation classes', () => {
                const stock = createMockStock();
                const { container } = render(<StockCard stock={stock} isLoaded={false} />);

                const article = container.querySelector('article');
                expect(article).toHaveClass('translate-y-8', 'opacity-0');
            });
        });

        describe('when index is provided', () => {
            it('should apply staggered animation delay', () => {
                const stock = createMockStock();
                const { container } = render(<StockCard stock={stock} index={3} />);

                const article = container.querySelector('article');
                expect(article).toHaveStyle({ transitionDelay: '450ms' });
            });
        });

        describe('when custom className is provided', () => {
            it('should apply custom className', () => {
                const stock = createMockStock();
                const { container } = render(<StockCard stock={stock} className="custom-class" />);

                const article = container.querySelector('article');
                expect(article).toHaveClass('custom-class');
            });
        });
    });

    describe('Accessibility', () => {
        describe('when rendered', () => {
            it('should associate heading with article via aria-labelledby', () => {
                const stock = createMockStock({ id: 7, name: 'Test Stock' });
                render(<StockCard stock={stock} />);

                const article = screen.getByRole('article');
                const heading = screen.getByRole('heading', { name: 'Test Stock' });

                expect(article).toHaveAttribute('aria-labelledby', 'stock-7-name');
                expect(heading).toHaveAttribute('id', 'stock-7-name');
            });

            it('should add aria-label on status bar', () => {
                const stock = createMockStock({ status: 'low' });
                const { container } = render(<StockCard stock={stock} />);

                const statusBar = container.querySelector('[aria-label*="Statut du stock"]');
                expect(statusBar).toHaveAttribute('aria-label', 'Statut du stock: low');
            });

            it('should group metrics with role="group"', () => {
                const stock = createMockStock();
                render(<StockCard stock={stock} />);

                const metricsGroup = screen.getByRole('group', { name: /Informations du stock/i });
                expect(metricsGroup).toBeInTheDocument();
            });

            it('should group actions with role="group"', () => {
                const stock = createMockStock({ name: 'Mon Stock' });
                render(<StockCard stock={stock} onView={vi.fn()} />);

                const actionsGroup = screen.getByRole('group', { name: /Actions pour Mon Stock/i });
                expect(actionsGroup).toBeInTheDocument();
            });

            it('should provide descriptive aria-label for quantity', () => {
                const stock = createMockStock({ quantity: 150 });
                const { container } = render(<StockCard stock={stock} />);

                const quantityLabel = container.querySelector('[aria-label*="Quantité: 150"]');
                expect(quantityLabel).toBeInTheDocument();
            });

            it('should provide descriptive aria-label for value', () => {
                const stock = createMockStock({ value: 3000 });
                const { container } = render(<StockCard stock={stock} />);

                const valueLabel = container.querySelector('[aria-label*="Valeur: 3000"]');
                expect(valueLabel).toBeInTheDocument();
            });
        });
    });
});