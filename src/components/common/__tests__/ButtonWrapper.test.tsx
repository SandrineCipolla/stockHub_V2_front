import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ButtonWrapper } from '../ButtonWrapper';
import { Plus, Download } from 'lucide-react';

// Mock useTheme
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' })
}));

describe('ButtonWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      render(<ButtonWrapper>Test Button</ButtonWrapper>);
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('should create web component with sh-button tag', () => {
      const { container } = render(<ButtonWrapper>Test</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(<ButtonWrapper>Click Me</ButtonWrapper>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });
  });

  describe('Props mapping', () => {
    it('should apply variant prop correctly', () => {
      const { container } = render(<ButtonWrapper variant="secondary">Test</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('variant')).toBe('secondary');
    });

    it('should apply size prop correctly', () => {
      const { container } = render(<ButtonWrapper size="lg">Test</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('size')).toBe('lg');
    });

    it('should apply loading prop correctly', () => {
      const { container } = render(<ButtonWrapper loading>Test</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.hasAttribute('loading')).toBe(true);
    });

    it('should apply disabled prop correctly', () => {
      const { container } = render(<ButtonWrapper disabled>Test</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.hasAttribute('disabled')).toBe(true);
    });

    it('should apply className prop correctly', () => {
      const { container } = render(<ButtonWrapper className="custom-class">Test</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('Theme integration', () => {
    it('should apply theme via data-theme attribute', () => {
      const { container } = render(<ButtonWrapper>Test</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Icon mapping', () => {
    it('should convert Plus Lucide icon to string', () => {
      const { container } = render(<ButtonWrapper icon={Plus}>Add</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('icon-before')).toBe('Plus');
    });

    it('should convert Download Lucide icon to string', () => {
      const { container } = render(<ButtonWrapper icon={Download}>Export</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('icon-before')).toBe('Download');
    });

    it('should handle undefined icon gracefully', () => {
      const { container } = render(<ButtonWrapper>No Icon</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.hasAttribute('icon-before')).toBe(false);
    });
  });

  describe('Event handling', () => {
    it('should call onClick when sh-button-click event fires', () => {
      const handleClick = vi.fn();
      const { container } = render(<ButtonWrapper onClick={handleClick}>Click</ButtonWrapper>);
      const button = container.querySelector('sh-button');

      // Simulate sh-button-click event
      const event = new Event('sh-button-click', { bubbles: true });
      button?.dispatchEvent(event);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <ButtonWrapper onClick={handleClick} disabled>
          Disabled
        </ButtonWrapper>
      );
      const button = container.querySelector('sh-button');

      const event = new Event('sh-button-click', { bubbles: true });
      button?.dispatchEvent(event);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <ButtonWrapper onClick={handleClick} loading>
          Loading
        </ButtonWrapper>
      );
      const button = container.querySelector('sh-button');

      const event = new Event('sh-button-click', { bubbles: true });
      button?.dispatchEvent(event);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should work without onClick handler', () => {
      const { container } = render(<ButtonWrapper>No Handler</ButtonWrapper>);
      const button = container.querySelector('sh-button');

      const event = new Event('sh-button-click', { bubbles: true });

      // Should not throw
      expect(() => button?.dispatchEvent(event)).not.toThrow();
    });
  });

  describe('Default values', () => {
    it('should use default variant of primary', () => {
      const { container } = render(<ButtonWrapper>Test</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('variant')).toBe('primary');
    });

    it('should use default size of md', () => {
      const { container } = render(<ButtonWrapper>Test</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('size')).toBe('md');
    });

    it('should not be loading by default', () => {
      const { container } = render(<ButtonWrapper>Test</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.hasAttribute('loading')).toBe(false);
    });

    it('should not be disabled by default', () => {
      const { container } = render(<ButtonWrapper>Test</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('Variant combinations', () => {
    it('should render primary variant with icon', () => {
      const { container } = render(
        <ButtonWrapper variant="primary" icon={Plus}>
          Add Stock
        </ButtonWrapper>
      );
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('variant')).toBe('primary');
      expect(button?.getAttribute('icon-before')).toBe('Plus');
      expect(screen.getByText('Add Stock')).toBeInTheDocument();
    });

    it('should render secondary variant with icon', () => {
      const { container } = render(
        <ButtonWrapper variant="secondary" icon={Download}>
          Export
        </ButtonWrapper>
      );
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('variant')).toBe('secondary');
      expect(button?.getAttribute('icon-before')).toBe('Download');
    });

    it('should render ghost variant', () => {
      const { container } = render(<ButtonWrapper variant="ghost">Ghost</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('variant')).toBe('ghost');
    });
  });

  describe('Size variants', () => {
    it('should render small size', () => {
      const { container } = render(<ButtonWrapper size="sm">Small</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('size')).toBe('sm');
    });

    it('should render large size', () => {
      const { container } = render(<ButtonWrapper size="lg">Large</ButtonWrapper>);
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('size')).toBe('lg');
    });
  });

  describe('ARIA and accessibility', () => {
    it('should pass through aria-label', () => {
      const { container } = render(
        <ButtonWrapper aria-label="Close dialog">X</ButtonWrapper>
      );
      const button = container.querySelector('sh-button');
      expect(button?.getAttribute('aria-label')).toBe('Close dialog');
    });
  });
});
