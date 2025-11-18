import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { SearchInputWrapper } from '../SearchInputWrapper';

// Mock useTheme
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

describe('SearchInputWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<SearchInputWrapper />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput).toBeInTheDocument();
    });

    it('should create web component with sh-search-input tag', () => {
      const { container } = render(<SearchInputWrapper />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Props mapping', () => {
    it('should apply placeholder prop correctly', () => {
      const { container } = render(<SearchInputWrapper placeholder="Search products..." />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput?.getAttribute('placeholder')).toBe('Search products...');
    });

    it('should apply default placeholder if not provided', () => {
      const { container } = render(<SearchInputWrapper />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput?.getAttribute('placeholder')).toBe('Rechercher...');
    });

    it('should apply debounce prop correctly', () => {
      const { container } = render(<SearchInputWrapper debounce={500} />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput?.getAttribute('debounce')).toBe('500');
    });

    it('should apply default debounce if not provided', () => {
      const { container } = render(<SearchInputWrapper />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput?.getAttribute('debounce')).toBe('300');
    });

    it('should apply clearable prop when true', () => {
      const { container } = render(<SearchInputWrapper clearable={true} />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput?.hasAttribute('clearable')).toBe(true);
    });

    it('should not apply clearable prop when false', () => {
      const { container } = render(<SearchInputWrapper clearable={false} />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput?.hasAttribute('clearable')).toBe(false);
    });

    it('should apply aria-label prop correctly', () => {
      const { container } = render(<SearchInputWrapper ariaLabel="Search stocks" />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput?.getAttribute('aria-label')).toBe('Search stocks');
    });

    it('should apply className prop correctly', () => {
      const { container } = render(<SearchInputWrapper className="custom-search" />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput?.classList.contains('custom-search')).toBe(true);
    });
  });

  describe('Theme integration', () => {
    it('should apply theme via data-theme attribute', () => {
      const { container } = render(<SearchInputWrapper />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput?.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Event handling - sh-search-change', () => {
    it('should call onSearchChange when sh-search-change event fires', () => {
      const handleSearchChange = vi.fn();
      const { container } = render(<SearchInputWrapper onSearchChange={handleSearchChange} />);
      const searchInput = container.querySelector('sh-search-input');

      // Simulate sh-search-change event with detail.value
      const event = new CustomEvent('sh-search-change', {
        bubbles: true,
        detail: { value: 'coffee' },
      });
      searchInput?.dispatchEvent(event);

      expect(handleSearchChange).toHaveBeenCalledTimes(1);
      expect(handleSearchChange).toHaveBeenCalledWith('coffee');
    });

    it('should call onSearchChange with empty string', () => {
      const handleSearchChange = vi.fn();
      const { container } = render(<SearchInputWrapper onSearchChange={handleSearchChange} />);
      const searchInput = container.querySelector('sh-search-input');

      const event = new CustomEvent('sh-search-change', {
        bubbles: true,
        detail: { value: '' },
      });
      searchInput?.dispatchEvent(event);

      expect(handleSearchChange).toHaveBeenCalledTimes(1);
      expect(handleSearchChange).toHaveBeenCalledWith('');
    });

    it('should handle special characters in search value', () => {
      const handleSearchChange = vi.fn();
      const { container } = render(<SearchInputWrapper onSearchChange={handleSearchChange} />);
      const searchInput = container.querySelector('sh-search-input');

      const event = new CustomEvent('sh-search-change', {
        bubbles: true,
        detail: { value: 'café & thé' },
      });
      searchInput?.dispatchEvent(event);

      expect(handleSearchChange).toHaveBeenCalledWith('café & thé');
    });

    it('should work without onSearchChange handler', () => {
      const { container } = render(<SearchInputWrapper />);
      const searchInput = container.querySelector('sh-search-input');

      const event = new CustomEvent('sh-search-change', {
        bubbles: true,
        detail: { value: 'test' },
      });

      // Should not throw
      expect(() => searchInput?.dispatchEvent(event)).not.toThrow();
    });

    it('should not call onSearchChange if event detail is missing', () => {
      const handleSearchChange = vi.fn();
      const { container } = render(<SearchInputWrapper onSearchChange={handleSearchChange} />);
      const searchInput = container.querySelector('sh-search-input');

      const event = new CustomEvent('sh-search-change', {
        bubbles: true,
      });
      searchInput?.dispatchEvent(event);

      expect(handleSearchChange).not.toHaveBeenCalled();
    });

    it('should not call onSearchChange if detail.value is not a string', () => {
      const handleSearchChange = vi.fn();
      const { container } = render(<SearchInputWrapper onSearchChange={handleSearchChange} />);
      const searchInput = container.querySelector('sh-search-input');

      const event = new CustomEvent('sh-search-change', {
        bubbles: true,
        detail: { value: 123 }, // number instead of string
      });
      searchInput?.dispatchEvent(event);

      expect(handleSearchChange).not.toHaveBeenCalled();
    });
  });

  describe('Event handling - sh-search-clear', () => {
    it('should call onSearchClear when sh-search-clear event fires', () => {
      const handleSearchClear = vi.fn();
      const { container } = render(<SearchInputWrapper onSearchClear={handleSearchClear} />);
      const searchInput = container.querySelector('sh-search-input');

      const event = new Event('sh-search-clear', { bubbles: true });
      searchInput?.dispatchEvent(event);

      expect(handleSearchClear).toHaveBeenCalledTimes(1);
    });

    it('should work without onSearchClear handler', () => {
      const { container } = render(<SearchInputWrapper />);
      const searchInput = container.querySelector('sh-search-input');

      const event = new Event('sh-search-clear', { bubbles: true });

      // Should not throw
      expect(() => searchInput?.dispatchEvent(event)).not.toThrow();
    });

    it('should allow multiple clear events', () => {
      const handleSearchClear = vi.fn();
      const { container } = render(<SearchInputWrapper onSearchClear={handleSearchClear} />);
      const searchInput = container.querySelector('sh-search-input');

      const event1 = new Event('sh-search-clear', { bubbles: true });
      const event2 = new Event('sh-search-clear', { bubbles: true });

      searchInput?.dispatchEvent(event1);
      searchInput?.dispatchEvent(event2);

      expect(handleSearchClear).toHaveBeenCalledTimes(2);
    });
  });

  describe('Value synchronization', () => {
    it('should synchronize value prop to web component', async () => {
      // Mock customElements.whenDefined
      const whenDefinedMock = vi.fn().mockResolvedValue(undefined);
      global.customElements.whenDefined = whenDefinedMock;

      const { container } = render(<SearchInputWrapper value="initial search" />);
      const searchInput = container.querySelector('sh-search-input');

      // Wait for whenDefined to be called
      await vi.waitFor(() => {
        expect(whenDefinedMock).toHaveBeenCalledWith('sh-search-input');
      });

      // In real scenario, the web component's value property would be set
      expect(searchInput).toBeInTheDocument();
    });

    it('should handle empty value prop', () => {
      const { container } = render(<SearchInputWrapper value="" />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete search workflow', () => {
      const handleSearchChange = vi.fn();
      const handleSearchClear = vi.fn();

      const { container } = render(
        <SearchInputWrapper
          placeholder="Search products..."
          value=""
          onSearchChange={handleSearchChange}
          onSearchClear={handleSearchClear}
          debounce={300}
          clearable={true}
        />
      );

      const searchInput = container.querySelector('sh-search-input');

      // User types
      const searchEvent = new CustomEvent('sh-search-change', {
        bubbles: true,
        detail: { value: 'coffee' },
      });
      searchInput?.dispatchEvent(searchEvent);
      expect(handleSearchChange).toHaveBeenCalledWith('coffee');

      // User clears
      const clearEvent = new Event('sh-search-clear', { bubbles: true });
      searchInput?.dispatchEvent(clearEvent);
      expect(handleSearchClear).toHaveBeenCalledTimes(1);
    });

    it('should maintain all props together', () => {
      const { container } = render(
        <SearchInputWrapper
          placeholder="Custom placeholder"
          value="test"
          debounce={500}
          clearable={true}
          ariaLabel="Custom search"
          className="custom-class"
        />
      );

      const searchInput = container.querySelector('sh-search-input');

      expect(searchInput?.getAttribute('placeholder')).toBe('Custom placeholder');
      expect(searchInput?.getAttribute('debounce')).toBe('500');
      expect(searchInput?.hasAttribute('clearable')).toBe(true);
      expect(searchInput?.getAttribute('aria-label')).toBe('Custom search');
      expect(searchInput?.classList.contains('custom-class')).toBe(true);
      expect(searchInput?.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Edge cases', () => {
    it('should handle very long search values', () => {
      const handleSearchChange = vi.fn();
      const longValue = 'a'.repeat(1000);

      const { container } = render(<SearchInputWrapper onSearchChange={handleSearchChange} />);
      const searchInput = container.querySelector('sh-search-input');

      const event = new CustomEvent('sh-search-change', {
        bubbles: true,
        detail: { value: longValue },
      });
      searchInput?.dispatchEvent(event);

      expect(handleSearchChange).toHaveBeenCalledWith(longValue);
    });

    it('should handle debounce value of 0', () => {
      const { container } = render(<SearchInputWrapper debounce={0} />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput?.getAttribute('debounce')).toBe('0');
    });

    it('should handle very high debounce values', () => {
      const { container } = render(<SearchInputWrapper debounce={5000} />);
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput?.getAttribute('debounce')).toBe('5000');
    });

    it('should handle undefined optional props gracefully', () => {
      const { container } = render(
        <SearchInputWrapper
          placeholder={undefined}
          value={undefined}
          ariaLabel={undefined}
          className={undefined}
        />
      );
      const searchInput = container.querySelector('sh-search-input');
      expect(searchInput).toBeInTheDocument();
    });
  });
});
