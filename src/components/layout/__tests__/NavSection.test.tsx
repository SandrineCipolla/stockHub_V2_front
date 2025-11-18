import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NavSection } from '@/components/layout/NavSection';
import { mockBreadcrumbs, mockNavigationLinks } from '@/test/fixtures/navigation';

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

describe('NavSection Component', () => {
  describe('Basic rendering', () => {
    describe('when rendered with children', () => {
      it('should render children content', () => {
        render(
          <NavSection>
            <div>Test Content</div>
          </NavSection>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });

    describe('when rendered with default breadcrumbs', () => {
      it('should display default breadcrumb items', () => {
        render(
          <NavSection>
            <div>Content</div>
          </NavSection>
        );

        expect(screen.getByText('Accueil')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    describe('when rendered with fixture breadcrumbs', () => {
      it('should display dashboard breadcrumbs', () => {
        const dashboardBreadcrumbs = mockBreadcrumbs.dashboard.map(item => ({
          label: item.label,
          href: item.href,
          current: item.isActive,
        }));

        render(
          <NavSection breadcrumbs={dashboardBreadcrumbs}>
            <div>Dashboard Content</div>
          </NavSection>
        );

        mockBreadcrumbs.dashboard.forEach(item => {
          expect(screen.getByText(item.label)).toBeInTheDocument();
        });
      });

      it('should display stocks breadcrumbs', () => {
        const stocksBreadcrumbs = mockBreadcrumbs.stocks.map(item => ({
          label: item.label,
          href: item.href,
          current: item.isActive,
        }));

        render(
          <NavSection breadcrumbs={stocksBreadcrumbs}>
            <div>Stocks Content</div>
          </NavSection>
        );

        mockBreadcrumbs.stocks.forEach(item => {
          expect(screen.getByText(item.label)).toBeInTheDocument();
        });
      });

      it('should display stock detail breadcrumbs', () => {
        const stockDetailBreadcrumbs = mockBreadcrumbs.stockDetail.map(item => ({
          label: item.label,
          href: item.href,
          current: item.isActive,
        }));

        render(
          <NavSection breadcrumbs={stockDetailBreadcrumbs}>
            <div>Stock Detail Content</div>
          </NavSection>
        );

        mockBreadcrumbs.stockDetail.forEach(item => {
          expect(screen.getByText(item.label)).toBeInTheDocument();
        });
      });

      it('should display portfolio breadcrumbs', () => {
        const portfolioBreadcrumbs = mockBreadcrumbs.portfolio.map(item => ({
          label: item.label,
          href: item.href,
          current: item.isActive,
        }));

        render(
          <NavSection breadcrumbs={portfolioBreadcrumbs}>
            <div>Portfolio Content</div>
          </NavSection>
        );

        mockBreadcrumbs.portfolio.forEach(item => {
          expect(screen.getByText(item.label)).toBeInTheDocument();
        });
      });
    });

    describe('when rendered with custom breadcrumbs', () => {
      it('should display custom breadcrumb items', () => {
        const customBreadcrumbs = [
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Details', current: true },
        ];

        render(
          <NavSection breadcrumbs={customBreadcrumbs}>
            <div>Content</div>
          </NavSection>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Details')).toBeInTheDocument();
      });
    });
  });

  describe('Breadcrumb navigation', () => {
    describe('when breadcrumb is current page', () => {
      it('should have aria-current attribute', () => {
        const breadcrumbs = [{ label: 'Current Page', current: true }];

        render(
          <NavSection breadcrumbs={breadcrumbs}>
            <div>Content</div>
          </NavSection>
        );

        const currentItem = screen.getByText('Current Page');
        expect(currentItem).toHaveAttribute('aria-current', 'page');
      });

      it('should not be a link', () => {
        const breadcrumbs = [{ label: 'Current', current: true }];

        render(
          <NavSection breadcrumbs={breadcrumbs}>
            <div>Content</div>
          </NavSection>
        );

        const current = screen.getByText('Current');
        expect(current.tagName).not.toBe('A');
      });

      it('should handle fixture active breadcrumbs', () => {
        const activeDashboard = mockBreadcrumbs.dashboard.find(item => item.isActive);
        if (activeDashboard) {
          const breadcrumbs = [{ label: activeDashboard.label, current: true }];

          render(
            <NavSection breadcrumbs={breadcrumbs}>
              <div>Content</div>
            </NavSection>
          );

          const currentItem = screen.getByText(activeDashboard.label);
          expect(currentItem).toHaveAttribute('aria-current', 'page');
        }
      });
    });

    describe('when breadcrumb has href', () => {
      it('should render as link', () => {
        const breadcrumbs = [{ label: 'Link Item', href: '/test' }];

        render(
          <NavSection breadcrumbs={breadcrumbs}>
            <div>Content</div>
          </NavSection>
        );

        const link = screen.getByText('Link Item');
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', '/test');
      });

      it('should render fixture links correctly', () => {
        const dashboardLinks = mockBreadcrumbs.dashboard
          .filter(item => item.href && !item.isActive)
          .map(item => ({
            label: item.label,
            href: item.href,
          }));

        render(
          <NavSection breadcrumbs={dashboardLinks}>
            <div>Content</div>
          </NavSection>
        );

        dashboardLinks.forEach(link => {
          const linkElement = screen.getByText(link.label);
          expect(linkElement.tagName).toBe('A');
          expect(linkElement).toHaveAttribute('href', link.href);
        });
      });
    });
  });

  describe('Navigation integration', () => {
    describe('when using navigation fixtures', () => {
      it('should work with navigation link labels in breadcrumbs', () => {
        const navLinkLabels = mockNavigationLinks.map(link => link.label);
        const breadcrumbsFromNav = navLinkLabels.map(label => ({
          label,
          href: `/${label.toLowerCase().replace(' ', '-')}`,
        }));

        render(
          <NavSection breadcrumbs={breadcrumbsFromNav}>
            <div>Content</div>
          </NavSection>
        );

        navLinkLabels.forEach(label => {
          expect(screen.getByText(label)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Accessibility', () => {
    describe('when rendered', () => {
      it('should have navigation with proper label', () => {
        render(
          <NavSection>
            <div>Content</div>
          </NavSection>
        );

        expect(screen.getByLabelText("Fil d'Ariane")).toBeInTheDocument();
      });

      it('should render breadcrumb list with proper structure', () => {
        const breadcrumbs = mockBreadcrumbs.stockDetail.map(item => ({
          label: item.label,
          href: item.href,
          current: item.isActive,
        }));

        render(
          <NavSection breadcrumbs={breadcrumbs}>
            <div>Content</div>
          </NavSection>
        );

        expect(screen.getByLabelText("Fil d'Ariane")).toBeInTheDocument();

        breadcrumbs.forEach(breadcrumb => {
          expect(screen.getByText(breadcrumb.label)).toBeInTheDocument();
        });
      });

      it('should maintain accessibility across different breadcrumb scenarios', () => {
        Object.entries(mockBreadcrumbs).forEach(([scenario, breadcrumbs]) => {
          const mappedBreadcrumbs = breadcrumbs.map(item => ({
            label: item.label,
            href: item.href,
            current: item.isActive,
          }));

          const { unmount } = render(
            <NavSection breadcrumbs={mappedBreadcrumbs}>
              <div>{scenario} Content</div>
            </NavSection>
          );

          expect(screen.getByLabelText("Fil d'Ariane")).toBeInTheDocument();
          unmount();
        });
      });
    });
  });
});
