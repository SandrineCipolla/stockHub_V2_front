import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { StockCardWrapper } from '../StockCardWrapper';
import type { Stock } from '@/types/stock';

// Mock useTheme
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

// Mock formatQuantityWithUnit
vi.mock('@/utils/unitFormatter', () => ({
  formatQuantityWithUnit: (quantity: number, unit?: string) => {
    if (unit === 'percentage') return `${quantity}%`;
    return `${quantity} unités`;
  },
}));

// Mock containerManager
vi.mock('@/utils/containerManager', () => ({
  recordUsage: (stock: Stock) => ({
    newQuantity: stock.quantity - 10,
    message: 'Usage recorded',
  }),
}));

// Mock stock data
const mockStock: Stock = {
  id: 1,
  name: 'Test Product',
  category: 'Electronics',
  quantity: 100,
  value: 1500,
  unit: 'piece',
  status: 'optimal',
  lastUpdate: '2 heures',
  minThreshold: 20,
  maxThreshold: 200,
};

const mockPercentageStock: Stock = {
  ...mockStock,
  id: '2',
  name: 'Paint Product',
  unit: 'percentage',
  quantity: 75,
  status: 'optimal',
};

describe('StockCardWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      expect(container.querySelector('sh-stock-card')).toBeInTheDocument();
    });

    it('should create web component with sh-stock-card tag', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card).toBeInTheDocument();
    });

    it('should render stock name', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('name')).toBe('Test Product');
    });

    it('should render stock category', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('category')).toBe('Electronics');
    });
  });

  describe('Props mapping', () => {
    it('should map stock properties correctly', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      const card = container.querySelector('sh-stock-card');

      expect(card?.getAttribute('name')).toBe('Test Product');
      expect(card?.getAttribute('category')).toBe('Electronics');
      expect(card?.getAttribute('quantity')).toBe('100 unités');
      expect(card?.getAttribute('value')).toBe('€1\u202f500'); // toLocaleString uses narrow no-break space
    });

    it('should apply className correctly', () => {
      const { container } = render(
        <StockCardWrapper stock={mockStock} className="custom-stock-card" />
      );
      const card = container.querySelector('sh-stock-card');
      expect(card?.classList.contains('custom-stock-card')).toBe(true);
    });

    it('should generate unique id for each card', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('id')).toBe('stock-card-1');
    });
  });

  describe('Status conversion', () => {
    it('should convert optimal status correctly', () => {
      const stock = { ...mockStock, status: 'optimal' as const };
      const { container } = render(<StockCardWrapper stock={stock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('status')).toBe('optimal');
    });

    it('should convert low status correctly', () => {
      const stock = { ...mockStock, status: 'low' as const };
      const { container } = render(<StockCardWrapper stock={stock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('status')).toBe('low');
    });

    it('should convert critical status correctly', () => {
      const stock = { ...mockStock, status: 'critical' as const };
      const { container } = render(<StockCardWrapper stock={stock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('status')).toBe('critical');
    });

    it('should convert outOfStock status correctly', () => {
      const stock = { ...mockStock, status: 'outOfStock' as const };
      const { container } = render(<StockCardWrapper stock={stock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('status')).toBe('out-of-stock');
    });

    it('should convert overstocked status correctly', () => {
      const stock = { ...mockStock, status: 'overstocked' as const };
      const { container } = render(<StockCardWrapper stock={stock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('status')).toBe('overstocked');
    });
  });

  describe('Quantity formatting', () => {
    it('should format regular unit quantity', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('quantity')).toBe('100 unités');
    });

    it('should format percentage quantity', () => {
      const { container } = render(<StockCardWrapper stock={mockPercentageStock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('quantity')).toBe('75%');
      expect(card?.getAttribute('percentage')).toBe('75');
    });

    it('should not set percentage attribute for non-percentage units', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.hasAttribute('percentage')).toBe(false);
    });
  });

  describe('Value formatting', () => {
    it('should format value with currency symbol', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('value')).toBe('€1\u202f500');
    });

    it('should handle large values', () => {
      const stock = { ...mockStock, value: 125000 };
      const { container } = render(<StockCardWrapper stock={stock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('value')).toBe('€125\u202f000');
    });

    it('should handle small values', () => {
      const stock = { ...mockStock, value: 50 };
      const { container } = render(<StockCardWrapper stock={stock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('value')).toBe('€50');
    });
  });

  describe('Last update formatting', () => {
    it('should format last update text', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('last-update')).toBe('Mis à jour il y a 2 heures');
    });

    it('should handle different time formats', () => {
      const stock = { ...mockStock, lastUpdate: 'maintenant' };
      const { container } = render(<StockCardWrapper stock={stock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('last-update')).toBe('Mis à jour il y a maintenant');
    });
  });

  describe('Event handling', () => {
    it('should call onView when details button is clicked', () => {
      const onView = vi.fn();
      const { container } = render(<StockCardWrapper stock={mockStock} onView={onView} />);
      const card = container.querySelector('sh-stock-card');

      const event = new Event('sh-details-click', { bubbles: true });
      card?.dispatchEvent(event);

      expect(onView).toHaveBeenCalledWith(1);
    });

    it('should call onEdit when edit button is clicked', () => {
      const onEdit = vi.fn();
      const { container } = render(<StockCardWrapper stock={mockStock} onEdit={onEdit} />);
      const card = container.querySelector('sh-stock-card');

      const event = new Event('sh-edit-click', { bubbles: true });
      card?.dispatchEvent(event);

      expect(onEdit).toHaveBeenCalledWith(1);
    });

    it('should call onDelete when delete button is clicked', () => {
      const onDelete = vi.fn();
      const { container } = render(<StockCardWrapper stock={mockStock} onDelete={onDelete} />);
      const card = container.querySelector('sh-stock-card');

      const event = new Event('sh-delete-click', { bubbles: true });
      card?.dispatchEvent(event);

      expect(onDelete).toHaveBeenCalledWith(1);
    });

    it('should not throw when handlers are not provided', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      const card = container.querySelector('sh-stock-card');

      const detailsEvent = new Event('sh-details-click', { bubbles: true });
      const editEvent = new Event('sh-edit-click', { bubbles: true });
      const deleteEvent = new Event('sh-delete-click', { bubbles: true });

      expect(() => {
        card?.dispatchEvent(detailsEvent);
        card?.dispatchEvent(editEvent);
        card?.dispatchEvent(deleteEvent);
      }).not.toThrow();
    });
  });

  describe('AI suggestions', () => {
    it('should render without AI suggestions', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card).toBeInTheDocument();
    });

    it('should handle empty AI suggestions array', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} aiSuggestions={[]} />);
      const card = container.querySelector('sh-stock-card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Theme integration', () => {
    it('should apply theme via data-theme attribute', () => {
      const { container } = render(<StockCardWrapper stock={mockStock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Edge cases', () => {
    it('should handle stock without category', () => {
      const stock = { ...mockStock, category: undefined };
      const { container } = render(<StockCardWrapper stock={stock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('category')).toBe('');
    });

    it('should handle zero quantity', () => {
      const stock = { ...mockStock, quantity: 0, status: 'outOfStock' as const };
      const { container } = render(<StockCardWrapper stock={stock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('quantity')).toBe('0 unités');
      expect(card?.getAttribute('status')).toBe('out-of-stock');
    });

    it('should handle zero value', () => {
      const stock = { ...mockStock, value: 0 };
      const { container } = render(<StockCardWrapper stock={stock} />);
      const card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('value')).toBe('€0');
    });
  });

  describe('Stock updates', () => {
    it('should update when stock prop changes', () => {
      const { container, rerender } = render(<StockCardWrapper stock={mockStock} />);
      let card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('name')).toBe('Test Product');

      const updatedStock = { ...mockStock, name: 'Updated Product' };
      rerender(<StockCardWrapper stock={updatedStock} />);

      card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('name')).toBe('Updated Product');
    });

    it('should update quantity when stock changes', () => {
      const { container, rerender } = render(<StockCardWrapper stock={mockStock} />);
      let card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('quantity')).toBe('100 unités');

      const updatedStock = { ...mockStock, quantity: 50 };
      rerender(<StockCardWrapper stock={updatedStock} />);

      card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('quantity')).toBe('50 unités');
    });

    it('should update status when stock changes', () => {
      const { container, rerender } = render(<StockCardWrapper stock={mockStock} />);
      let card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('status')).toBe('optimal');

      const updatedStock = { ...mockStock, status: 'low' as const };
      rerender(<StockCardWrapper stock={updatedStock} />);

      card = container.querySelector('sh-stock-card');
      expect(card?.getAttribute('status')).toBe('low');
    });
  });
});
