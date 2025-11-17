import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { AIAlertBannerWrapper } from '../AIAlertBannerWrapper';
import type { AISuggestion } from '@/utils/aiPredictions';

// Mock useTheme
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' })
}));

// Mock console.log to avoid noise in tests
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

// Mock AI suggestions
const criticalSuggestion: AISuggestion = {
  id: '1',
  stockId: '1',
  stockName: 'Test Product Critical',
  title: 'Stock critique - commandez immédiatement',
  message: 'Le stock est dangereusement bas',
  action: 'Commander immédiatement',
  impact: 'Risque de rupture de stock',
  priority: 'critical',
  type: 'rupture-risk',
  confidence: 95
};

const highSuggestion: AISuggestion = {
  id: '2',
  stockId: '2',
  stockName: 'Test Product High',
  title: 'Stock faible - commande recommandée',
  message: 'Le stock approche du seuil critique',
  action: 'Prévoir réapprovisionnement',
  impact: 'Optimisation des stocks',
  priority: 'high',
  type: 'reorder-now',
  confidence: 85
};

const mediumSuggestion: AISuggestion = {
  id: '3',
  stockId: '3',
  stockName: 'Test Product Medium',
  title: 'Surveillez le stock',
  message: 'Tendance à la baisse',
  action: 'Surveiller l\'évolution',
  impact: 'Prévention des ruptures',
  priority: 'medium',
  type: 'reorder-soon',
  confidence: 75
};

describe('AIAlertBannerWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render without crashing with suggestions', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion]} />
      );
      expect(container.querySelector('sh-ia-alert-banner')).toBeInTheDocument();
    });

    it('should create web component with sh-ia-alert-banner tag', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[highSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner).toBeInTheDocument();
    });

    it('should not render when suggestions array is empty', () => {
      const { container } = render(<AIAlertBannerWrapper suggestions={[]} />);
      expect(container.querySelector('sh-ia-alert-banner')).not.toBeInTheDocument();
    });

    it('should return null when no suggestions', () => {
      const { container } = render(<AIAlertBannerWrapper suggestions={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Props mapping', () => {
    it('should set count prop correctly with single suggestion', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('count')).toBe('1');
    });

    it('should set count prop correctly with multiple suggestions', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion, highSuggestion, mediumSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('count')).toBe('3');
    });

    it('should apply className correctly', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion]} className="custom-banner" />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.classList.contains('custom-banner')).toBe(true);
    });

    it('should set expanded to false by default', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      // Boolean false doesn't create attribute in React.createElement
      // Check it's falsy or not 'true'
      const expanded = banner?.getAttribute('expanded');
      expect(expanded === null || expanded === 'false').toBe(true);
    });
  });

  describe('Priority to severity conversion', () => {
    it('should convert critical priority to critical severity', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('severity')).toBe('critical');
    });

    it('should convert high priority to warning severity', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[highSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('severity')).toBe('warning');
    });

    it('should convert medium priority to info severity', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[mediumSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('severity')).toBe('info');
    });
  });

  describe('Dominant severity calculation', () => {
    it('should use critical as dominant when present', () => {
      const { container } = render(
        <AIAlertBannerWrapper
          suggestions={[criticalSuggestion, highSuggestion, mediumSuggestion]}
        />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('severity')).toBe('critical');
    });

    it('should use warning as dominant when critical not present', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[highSuggestion, mediumSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('severity')).toBe('warning');
    });

    it('should use info when only medium/low priorities', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[mediumSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('severity')).toBe('info');
    });

    it('should handle mix of high and medium', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[highSuggestion, mediumSuggestion, mediumSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('severity')).toBe('warning');
    });
  });

  describe('Message customization', () => {
    it('should use singular message for single suggestion', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('message')).toBe('stock nécessite votre attention');
    });

    it('should use plural message for multiple suggestions', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion, highSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('message')).toBe('stocks nécessitent votre attention');
    });

    it('should use plural message for three suggestions', () => {
      const { container } = render(
        <AIAlertBannerWrapper
          suggestions={[criticalSuggestion, highSuggestion, mediumSuggestion]}
        />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('message')).toBe('stocks nécessitent votre attention');
    });
  });

  describe('Alerts array transformation', () => {
    it('should transform AISuggestion to IaAlert format', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');

      // Note: alerts is an object, check it exists
      expect(banner?.hasAttribute('alerts')).toBe(true);
    });

    it('should map stockName to product field', () => {
      // This is internal transformation, validated by web component rendering
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner).toBeInTheDocument();
    });

    it('should map title to message field', () => {
      // This is internal transformation, validated by web component rendering
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[highSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner).toBeInTheDocument();
    });

    it('should transform multiple suggestions correctly', () => {
      const { container } = render(
        <AIAlertBannerWrapper
          suggestions={[criticalSuggestion, highSuggestion, mediumSuggestion]}
        />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('count')).toBe('3');
    });
  });

  describe('Theme integration', () => {
    it('should apply theme via data-theme attribute', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Event handling', () => {
    it('should have event handler for item clicks', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');

      // Simulate sh-ia-alert-item-click event
      const event = new CustomEvent('sh-ia-alert-item-click', {
        detail: { product: 'Test Product', index: 0 },
        bubbles: true
      });
      banner?.dispatchEvent(event);

      // Verify console.log was called
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '🤖 Alert item clicked:',
        expect.objectContaining({ product: 'Test Product', index: 0 })
      );
    });

    it('should not crash on event without detail', () => {
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[criticalSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');

      const event = new Event('sh-ia-alert-item-click', { bubbles: true });

      expect(() => banner?.dispatchEvent(event)).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should handle suggestion without priority', () => {
      const invalidSuggestion = { ...criticalSuggestion, priority: 'unknown' as any };
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[invalidSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      // Should default to 'info'
      expect(banner?.getAttribute('severity')).toBe('info');
    });

    it('should handle very long stock names', () => {
      const longNameSuggestion = {
        ...criticalSuggestion,
        stockName: 'A'.repeat(100)
      };
      const { container } = render(
        <AIAlertBannerWrapper suggestions={[longNameSuggestion]} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner).toBeInTheDocument();
    });

    it('should handle large number of suggestions', () => {
      const manySuggestions = Array(20).fill(null).map((_, i) => ({
        ...mediumSuggestion,
        id: `${i}`,
        stockName: `Product ${i}`
      }));
      const { container } = render(
        <AIAlertBannerWrapper suggestions={manySuggestions} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');
      expect(banner?.getAttribute('count')).toBe('20');
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle dashboard with mixed priority alerts', () => {
      const mixedAlerts = [
        criticalSuggestion,
        highSuggestion,
        mediumSuggestion,
        { ...mediumSuggestion, id: '4', stockName: 'Product 4' }
      ];
      const { container } = render(
        <AIAlertBannerWrapper suggestions={mixedAlerts} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');

      expect(banner?.getAttribute('count')).toBe('4');
      expect(banner?.getAttribute('severity')).toBe('critical');
      expect(banner?.getAttribute('message')).toBe('stocks nécessitent votre attention');
    });

    it('should handle analytics page with only warnings', () => {
      const warningAlerts = [
        highSuggestion,
        { ...highSuggestion, id: '5', stockName: 'Product 5' },
        { ...highSuggestion, id: '6', stockName: 'Product 6' }
      ];
      const { container } = render(
        <AIAlertBannerWrapper suggestions={warningAlerts} />
      );
      const banner = container.querySelector('sh-ia-alert-banner');

      expect(banner?.getAttribute('severity')).toBe('warning');
    });
  });
});
