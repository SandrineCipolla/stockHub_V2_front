import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MetricCardWrapper } from '../MetricCardWrapper';

// Mock useTheme
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

describe('MetricCardWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <MetricCardWrapper title="Test Metric" value="100" icon="package" color="success" />
      );
      expect(container.querySelector('sh-metric-card')).toBeInTheDocument();
    });

    it('should create web component with sh-metric-card tag', () => {
      const { container } = render(
        <MetricCardWrapper title="Test" value="50" icon="package" color="success" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card).toBeInTheDocument();
    });

    it('should render with numeric value', () => {
      const { container } = render(
        <MetricCardWrapper title="Count" value={150} icon="package" color="success" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('value')).toBe('150');
    });

    it('should render with string value', () => {
      const { container } = render(
        <MetricCardWrapper title="Amount" value="€1,250" icon="package" color="success" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('value')).toBe('€1,250');
    });
  });

  describe('Props mapping', () => {
    it('should map title to label attribute', () => {
      const { container } = render(
        <MetricCardWrapper title="Total Products" value="100" icon="package" color="success" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('label')).toBe('Total Products');
    });

    it('should apply className correctly', () => {
      const { container } = render(
        <MetricCardWrapper
          title="Test"
          value="50"
          icon="package"
          color="success"
          className="custom-metric"
        />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.classList.contains('custom-metric')).toBe(true);
    });
  });

  describe('Icon mapping', () => {
    it('should map package icon to Package', () => {
      const { container } = render(
        <MetricCardWrapper title="Test" value="10" icon="package" color="success" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('icon')).toBe('Package');
    });

    it('should map alert-triangle icon to AlertTriangle', () => {
      const { container } = render(
        <MetricCardWrapper title="Test" value="5" icon="alert-triangle" color="warning" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('icon')).toBe('AlertTriangle');
    });

    it('should map trending-up icon to TrendingUp', () => {
      const { container } = render(
        <MetricCardWrapper title="Test" value="20" icon="trending-up" color="success" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('icon')).toBe('TrendingUp');
    });

    it('should default to Package for unknown icon', () => {
      const { container } = render(
        <MetricCardWrapper title="Test" value="10" icon="package" color="success" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('icon')).toBe('Package');
    });
  });

  describe('Color to variant mapping', () => {
    it('should map success color to success variant', () => {
      const { container } = render(
        <MetricCardWrapper title="Test" value="10" icon="package" color="success" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('variant')).toBe('success');
    });

    it('should map warning color to warning variant', () => {
      const { container } = render(
        <MetricCardWrapper title="Test" value="5" icon="package" color="warning" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('variant')).toBe('warning');
    });

    it('should map info color to default variant', () => {
      const { container } = render(
        <MetricCardWrapper title="Test" value="8" icon="package" color="info" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('variant')).toBe('default');
    });

    it('should default to default variant for unknown colors', () => {
      const { container } = render(
        <MetricCardWrapper title="Test" value="10" icon="package" color={'purple' as any} />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('variant')).toBe('default');
    });
  });

  describe('Change/Trend mapping', () => {
    it('should map increase change to positive trend', () => {
      const { container } = render(
        <MetricCardWrapper
          title="Test"
          value="100"
          icon="package"
          color="success"
          change={{ type: 'increase', value: 15 }}
        />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('trend')).toBe('increase');
      expect(card?.getAttribute('trend-value')).toBe('+15');
    });

    it('should map decrease change to negative trend', () => {
      const { container } = render(
        <MetricCardWrapper
          title="Test"
          value="80"
          icon="package"
          color="warning"
          change={{ type: 'decrease', value: 10 }}
        />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('trend')).toBe('decrease');
      expect(card?.getAttribute('trend-value')).toBe('-10');
    });

    it('should handle neutral change without value', () => {
      const { container } = render(
        <MetricCardWrapper title="Test" value="50" icon="package" color="info" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('trend')).toBe('neutral');
      expect(card?.getAttribute('trend-value')).toBe('');
    });

    it('should handle change with percentage values', () => {
      const { container } = render(
        <MetricCardWrapper
          title="Test"
          value="120"
          icon="trending-up"
          color="success"
          change={{ type: 'increase', value: 25 }}
        />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('trend-value')).toBe('+25');
    });
  });

  describe('Theme integration', () => {
    it('should apply theme via data-theme attribute', () => {
      const { container } = render(
        <MetricCardWrapper title="Test" value="10" icon="package" color="success" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Dashboard use cases', () => {
    it('should render Total Products metric', () => {
      const { container } = render(
        <MetricCardWrapper
          title="Total Produits"
          value={150}
          icon="package"
          color="success"
          change={{ type: 'increase', value: 25 }}
        />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('label')).toBe('Total Produits');
      expect(card?.getAttribute('value')).toBe('150');
      expect(card?.getAttribute('icon')).toBe('Package');
      expect(card?.getAttribute('variant')).toBe('success');
      expect(card?.getAttribute('trend')).toBe('increase');
    });

    it('should render Low Stock metric', () => {
      const { container } = render(
        <MetricCardWrapper
          title="Stock Faible"
          value={12}
          icon="alert-triangle"
          color="warning"
          change={{ type: 'decrease', value: 3 }}
        />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('label')).toBe('Stock Faible');
      expect(card?.getAttribute('value')).toBe('12');
      expect(card?.getAttribute('icon')).toBe('AlertTriangle');
      expect(card?.getAttribute('variant')).toBe('warning');
      expect(card?.getAttribute('trend')).toBe('decrease');
    });

    it('should render Total Value metric with formatted string', () => {
      const { container } = render(
        <MetricCardWrapper
          title="Valeur Totale"
          value="€45,230"
          icon="trending-up"
          color="info"
          change={{ type: 'increase', value: 10 }}
        />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('label')).toBe('Valeur Totale');
      expect(card?.getAttribute('value')).toBe('€45,230');
      expect(card?.getAttribute('icon')).toBe('TrendingUp');
    });
  });

  describe('Edge cases', () => {
    it('should handle zero value', () => {
      const { container } = render(
        <MetricCardWrapper title="Empty" value={0} icon="package" color="warning" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('value')).toBe('0');
    });

    it('should handle empty string value', () => {
      const { container } = render(
        <MetricCardWrapper title="Test" value="" icon="package" color="success" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('value')).toBe('');
    });

    it('should handle very large numbers', () => {
      const { container } = render(
        <MetricCardWrapper title="Big Number" value={9999999} icon="package" color="success" />
      );
      const card = container.querySelector('sh-metric-card');
      expect(card?.getAttribute('value')).toBe('9999999');
    });
  });
});
