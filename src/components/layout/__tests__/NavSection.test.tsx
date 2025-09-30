import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {NavSection} from '@/components/layout/NavSection';

vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'dark' })
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
                render(<NavSection><div>Content</div></NavSection>);

                expect(screen.getByText('Accueil')).toBeInTheDocument();
                expect(screen.getByText('Dashboard')).toBeInTheDocument();
            });
        });

        describe('when rendered with custom breadcrumbs', () => {
            it('should display custom breadcrumb items', () => {
                const customBreadcrumbs = [
                    { label: 'Home', href: '/' },
                    { label: 'Products', href: '/products' },
                    { label: 'Details', current: true }
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
                const breadcrumbs = [
                    { label: 'Current Page', current: true }
                ];

                render(<NavSection breadcrumbs={breadcrumbs}><div>Content</div></NavSection>);

                const currentItem = screen.getByText('Current Page');
                expect(currentItem).toHaveAttribute('aria-current', 'page');
            });

            it('should not be a link', () => {
                const breadcrumbs = [
                    { label: 'Current', current: true }
                ];

                render(<NavSection breadcrumbs={breadcrumbs}><div>Content</div></NavSection>);

                const current = screen.getByText('Current');
                expect(current.tagName).not.toBe('A');
            });
        });

        describe('when breadcrumb has href', () => {
            it('should render as link', () => {
                const breadcrumbs = [
                    { label: 'Link Item', href: '/test' }
                ];

                render(<NavSection breadcrumbs={breadcrumbs}><div>Content</div></NavSection>);

                const link = screen.getByText('Link Item');
                expect(link.tagName).toBe('A');
                expect(link).toHaveAttribute('href', '/test');
            });
        });
    });

    describe('Accessibility', () => {
        describe('when rendered', () => {
            it('should have navigation with proper label', () => {
                render(<NavSection><div>Content</div></NavSection>);

                expect(screen.getByLabelText('Fil d\'Ariane')).toBeInTheDocument();
            });

            it('should render breadcrumb list', () => {
                const { container } = render(<NavSection><div>Content</div></NavSection>);

                expect(container.querySelector('ol')).toBeInTheDocument();
            });
        });
    });

    describe('StockHub business use cases', () => {
        describe('when user navigates dashboard', () => {
            it('should show current location in breadcrumb', () => {
                render(<NavSection><div>Dashboard Content</div></NavSection>);

                const dashboard = screen.getByText('Dashboard');
                expect(dashboard).toHaveAttribute('aria-current', 'page');
            });
        });
    });
});