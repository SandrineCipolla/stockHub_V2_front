import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardWrapper } from '../CardWrapper';

// Mock useTheme
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' })
}));

describe('CardWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      render(<CardWrapper>Test Card</CardWrapper>);
      expect(screen.getByText('Test Card')).toBeInTheDocument();
    });

    it('should create web component with sh-card tag', () => {
      const { container } = render(<CardWrapper>Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(<CardWrapper>Card Content</CardWrapper>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <CardWrapper>
          <h2>Title</h2>
          <p>Description</p>
        </CardWrapper>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  describe('Props mapping', () => {
    it('should apply variant prop correctly', () => {
      const { container } = render(<CardWrapper variant="primary">Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('variant')).toBe('primary');
    });

    it('should apply size prop correctly', () => {
      const { container } = render(<CardWrapper size="lg">Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('size')).toBe('lg');
    });

    it('should apply clickable prop correctly', () => {
      const { container } = render(<CardWrapper clickable>Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.hasAttribute('clickable')).toBe(true);
    });

    it('should apply selected prop correctly', () => {
      const { container } = render(<CardWrapper selected>Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.hasAttribute('selected')).toBe(true);
    });

    it('should apply disabled prop correctly', () => {
      const { container } = render(<CardWrapper disabled>Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.hasAttribute('disabled')).toBe(true);
    });

    it('should apply className prop correctly', () => {
      const { container } = render(<CardWrapper className="custom-card">Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.classList.contains('custom-card')).toBe(true);
    });
  });

  describe('Theme integration', () => {
    it('should apply theme via data-theme attribute', () => {
      const { container } = render(<CardWrapper>Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Event handling', () => {
    it('should call onClick when sh-card-click event fires', () => {
      const handleClick = vi.fn();
      const { container } = render(<CardWrapper onClick={handleClick}>Click</CardWrapper>);
      const card = container.querySelector('sh-card');

      // Simulate sh-card-click event
      const event = new Event('sh-card-click', { bubbles: true });
      card?.dispatchEvent(event);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <CardWrapper onClick={handleClick} disabled>
          Disabled
        </CardWrapper>
      );
      const card = container.querySelector('sh-card');

      const event = new Event('sh-card-click', { bubbles: true });
      card?.dispatchEvent(event);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should work without onClick handler', () => {
      const { container } = render(<CardWrapper>No Handler</CardWrapper>);
      const card = container.querySelector('sh-card');

      const event = new Event('sh-card-click', { bubbles: true });

      // Should not throw
      expect(() => card?.dispatchEvent(event)).not.toThrow();
    });
  });

  describe('Default values', () => {
    it('should use default variant of default', () => {
      const { container } = render(<CardWrapper>Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('variant')).toBe('default');
    });

    it('should use default size of md', () => {
      const { container } = render(<CardWrapper>Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('size')).toBe('md');
    });

    it('should not be clickable by default', () => {
      const { container } = render(<CardWrapper>Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.hasAttribute('clickable')).toBe(false);
    });

    it('should not be selected by default', () => {
      const { container} = render(<CardWrapper>Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.hasAttribute('selected')).toBe(false);
    });

    it('should not be disabled by default', () => {
      const { container } = render(<CardWrapper>Test</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('Variant combinations', () => {
    it('should render primary variant', () => {
      const { container } = render(<CardWrapper variant="primary">Primary</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('variant')).toBe('primary');
    });

    it('should render success variant', () => {
      const { container } = render(<CardWrapper variant="success">Success</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('variant')).toBe('success');
    });

    it('should render warning variant', () => {
      const { container } = render(<CardWrapper variant="warning">Warning</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('variant')).toBe('warning');
    });

    it('should render error variant', () => {
      const { container } = render(<CardWrapper variant="error">Error</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('variant')).toBe('error');
    });

    it('should render info variant', () => {
      const { container } = render(<CardWrapper variant="info">Info</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('variant')).toBe('info');
    });
  });

  describe('Size variants', () => {
    it('should render small size', () => {
      const { container } = render(<CardWrapper size="sm">Small</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('size')).toBe('sm');
    });

    it('should render large size', () => {
      const { container } = render(<CardWrapper size="lg">Large</CardWrapper>);
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('size')).toBe('lg');
    });
  });

  describe('Interactive states', () => {
    it('should render clickable and selected card', () => {
      const { container } = render(
        <CardWrapper clickable selected>
          Selected Card
        </CardWrapper>
      );
      const card = container.querySelector('sh-card');
      expect(card?.hasAttribute('clickable')).toBe(true);
      expect(card?.hasAttribute('selected')).toBe(true);
    });

    it('should render clickable card with onClick', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <CardWrapper clickable onClick={handleClick}>
          Clickable
        </CardWrapper>
      );
      const card = container.querySelector('sh-card');

      const event = new Event('sh-card-click', { bubbles: true });
      card?.dispatchEvent(event);

      expect(handleClick).toHaveBeenCalled();
    });

    it('should not trigger click when clickable but disabled', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <CardWrapper clickable disabled onClick={handleClick}>
          Disabled
        </CardWrapper>
      );
      const card = container.querySelector('sh-card');

      const event = new Event('sh-card-click', { bubbles: true });
      card?.dispatchEvent(event);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Additional props', () => {
    it('should pass through additional HTML attributes', () => {
      const { container } = render(
        <CardWrapper data-testid="custom-card" role="article">
          Test
        </CardWrapper>
      );
      const card = container.querySelector('sh-card');
      expect(card?.getAttribute('data-testid')).toBe('custom-card');
      expect(card?.getAttribute('role')).toBe('article');
    });
  });
});
