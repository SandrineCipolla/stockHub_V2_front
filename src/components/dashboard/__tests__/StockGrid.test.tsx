import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { StockGrid } from '../StockGrid';
import { createMockStock, dashboardStocks, stockHubStockUseCases } from '@/test/fixtures/stock';

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' }),
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
      it('should render one sh-stock-card web component', () => {
        const stocks = [stockHubStockUseCases.optimalStock];
        const { container } = render(<StockGrid stocks={stocks} />);

        // Check for sh-stock-card web component (Shadow DOM prevents text access)
        const stockCard = container.querySelector('sh-stock-card');
        expect(stockCard).toBeInTheDocument();
        expect(stockCard?.getAttribute('name')).toBe(stocks[0].name);
      });

      it('should render StockCardWrapper with web component', () => {
        const stocks = [stockHubStockUseCases.optimalStock];
        const { container } = render(<StockGrid stocks={stocks} />);

        // StockCardWrapper renders sh-stock-card directly (no article wrapper)
        const stockCard = container.querySelector('sh-stock-card');
        expect(stockCard).toBeInTheDocument();
      });
    });

    describe('when multiple stocks are provided', () => {
      it('should render all sh-stock-card web components', () => {
        const stocks = dashboardStocks.slice(0, 3);
        const { container } = render(<StockGrid stocks={stocks} />);

        // Check for sh-stock-card web components (Shadow DOM prevents direct text access)
        const stockCards = container.querySelectorAll('sh-stock-card');
        expect(stockCards.length).toBe(stocks.length);
      });

      it('should render all stock cards with correct count', () => {
        const stocks = dashboardStocks.slice(0, 3);
        const { container } = render(<StockGrid stocks={stocks} />);

        // Check that all sh-stock-card web components are rendered
        const stockCards = container.querySelectorAll('sh-stock-card');
        expect(stockCards).toHaveLength(3);
        expect(stockCards[0]).toBeInTheDocument();
        expect(stockCards[1]).toBeInTheDocument();
        expect(stockCards[2]).toBeInTheDocument();
      });

      it('should update heading count dynamically', () => {
        const stocks = dashboardStocks;
        render(<StockGrid stocks={stocks} />);

        expect(
          screen.getByText(new RegExp(`Liste des stocks \\(${stocks.length} éléments\\)`, 'i'))
        ).toBeInTheDocument();
      });
    });
  });

  describe('Callbacks propagation', () => {
    describe.skip('when onView callback is provided', () => {
      it('should render Details button for each stock', () => {
        const onView = vi.fn();
        const stocks = dashboardStocks.slice(0, 2);
        render(<StockGrid stocks={stocks} onView={onView} />);

        const detailsButtons = screen.getAllByRole('button', { name: /Voir les détails/i });
        expect(detailsButtons).toHaveLength(stocks.length);
      });
    });

    describe.skip('when onView callback is not provided', () => {
      it('should not render Details buttons', () => {
        const stocks = [stockHubStockUseCases.optimalStock];
        render(<StockGrid stocks={stocks} />);

        expect(screen.queryByRole('button', { name: /Voir les détails/i })).not.toBeInTheDocument();
      });
    });

    describe.skip('when onEdit callback is provided', () => {
      it('should render Edit buttons for each stock', () => {
        const onEdit = vi.fn();
        const stocks = dashboardStocks.slice(0, 2);
        render(<StockGrid stocks={stocks} onEdit={onEdit} />);

        const editButtons = screen.getAllByRole('button', { name: /Modifier/i });
        expect(editButtons).toHaveLength(stocks.length);
      });
    });

    describe.skip('when onDelete callback is provided', () => {
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
    describe('when rendering with Framer Motion', () => {
      it('should render all stock cards', () => {
        const stocks = dashboardStocks.slice(0, 2);
        const { container } = render(<StockGrid stocks={stocks} />);

        // Check sh-stock-card web components are rendered
        const stockCards = container.querySelectorAll('sh-stock-card');
        expect(stockCards).toHaveLength(2);
        stockCards.forEach(card => {
          expect(card).toBeInTheDocument();
        });
      });
    });

    describe.skip('when isUpdating is true', () => {
      it('should disable all Edit and Delete buttons', () => {
        const stocks = [stockHubStockUseCases.optimalStock];
        render(<StockGrid stocks={stocks} onEdit={vi.fn()} onDelete={vi.fn()} isUpdating={true} />);

        const editButton = screen.getByRole('button', { name: /Modifier/i });
        const deleteButton = screen.getByRole('button', { name: /Supprimer/i });

        expect(editButton).toBeDisabled();
        expect(deleteButton).toBeDisabled();
      });
    });

    describe.skip('when isDeleting is true', () => {
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
        const { container } = render(<StockGrid stocks={stocks} />);

        // Check sh-stock-card web components are rendered (Shadow DOM prevents text access)
        const stockCards = container.querySelectorAll('sh-stock-card');
        expect(stockCards.length).toBe(stocks.length);

        // Verify each stock card has the correct name attribute
        stocks.forEach((stock, index) => {
          expect(stockCards[index]?.getAttribute('name')).toBe(stock.name);
        });
      });
    });

    describe('when displaying stocks with different statuses', () => {
      it('should render mixed status stocks correctly', () => {
        const stocks = [
          stockHubStockUseCases.optimalStock,
          stockHubStockUseCases.lowStock,
          stockHubStockUseCases.criticalStock,
        ];
        const { container } = render(<StockGrid stocks={stocks} />);

        // Check sh-stock-card web components with correct status attributes
        const stockCards = container.querySelectorAll('sh-stock-card');
        expect(stockCards.length).toBe(3);

        // Verify status attributes (converted to web component format)
        expect(stockCards[0]?.getAttribute('status')).toBe('optimal');
        expect(stockCards[1]?.getAttribute('status')).toBe('low');
        expect(stockCards[2]?.getAttribute('status')).toBe('critical');
      });
    });

    describe('when user has no stocks yet', () => {
      it('should handle empty state gracefully', () => {
        const { container } = render(<StockGrid stocks={[]} />);

        expect(screen.getByText(/0 éléments/)).toBeInTheDocument();

        // No sh-stock-card web components should be rendered
        const stockCards = container.querySelectorAll('sh-stock-card');
        expect(stockCards).toHaveLength(0);
      });
    });

    describe('when rendering large inventory', () => {
      it('should handle 50 stocks efficiently', () => {
        const stocks = Array.from({ length: 50 }, (_, i) =>
          createMockStock({ id: i + 1, name: `Stock ${i + 1}` })
        );
        const { container } = render(<StockGrid stocks={stocks} />);

        // Check sh-stock-card web components for large inventory
        const stockCards = container.querySelectorAll('sh-stock-card');
        expect(stockCards).toHaveLength(50);
      });

      it('should render all items correctly', () => {
        const stocks = Array.from({ length: 10 }, (_, i) => createMockStock({ id: i + 1 }));
        const { container } = render(<StockGrid stocks={stocks} />);

        // Check all sh-stock-card web components are rendered
        const stockCards = container.querySelectorAll('sh-stock-card');
        expect(stockCards).toHaveLength(10);
        expect(stockCards[0]).toBeInTheDocument();
        expect(stockCards[9]).toBeInTheDocument();
      });
    });

    describe.skip('when user performs bulk operations', () => {
      it('should support view action on multiple stocks', () => {
        // Buttons are in Shadow DOM, cannot be accessed directly
        const onView = vi.fn();
        const stocks = dashboardStocks.slice(0, 3);
        render(<StockGrid stocks={stocks} onView={onView} />);

        const viewButtons = screen.getAllByRole('button', { name: /Voir les détails/i });
        expect(viewButtons).toHaveLength(stocks.length);
      });
    });

    describe('when loading stocks from API', () => {
      it('should render all stock cards', () => {
        const stocks = dashboardStocks.slice(0, 2);
        const { container } = render(<StockGrid stocks={stocks} />);

        // Check sh-stock-card web components
        const stockCards = container.querySelectorAll('sh-stock-card');
        expect(stockCards).toHaveLength(2);
        stockCards.forEach(card => {
          expect(card).toBeInTheDocument();
        });
      });
    });

    describe.skip('when user updates a stock', () => {
      it('should disable all action buttons during update', () => {
        // Buttons are in Shadow DOM, disabled state cannot be checked directly
        const stocks = dashboardStocks.slice(0, 2);
        render(<StockGrid stocks={stocks} onEdit={vi.fn()} onDelete={vi.fn()} isUpdating={true} />);

        const editButtons = screen.getAllByRole('button', { name: /Modifier/i });
        const deleteButtons = screen.getAllByRole('button', { name: /Supprimer/i });

        editButtons.forEach(button => expect(button).toBeDisabled());
        deleteButtons.forEach(button => expect(button).toBeDisabled());
      });
    });

    describe.skip('when user deletes a stock', () => {
      it('should disable all action buttons during deletion', () => {
        // Buttons are in Shadow DOM, disabled state cannot be checked directly
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
