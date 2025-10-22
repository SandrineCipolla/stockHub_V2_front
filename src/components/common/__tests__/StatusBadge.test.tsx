import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {StatusBadge} from '../StatusBadge';

vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'light' })
}));

describe('StatusBadge Component', () => {
    describe('Basic rendering', () => {
        describe('when rendered with required props', () => {
            it('should display the status label', () => {
                render(<StatusBadge status="optimal" />);

                expect(screen.getByText('Optimal')).toBeInTheDocument();
            });

            it('should have proper accessibility attributes', () => {
                render(<StatusBadge status="optimal" />);

                const badge = screen.getByRole('status');
                expect(badge).toHaveAttribute('aria-label', 'Statut: Optimal');
            });

            it('should display icon by default', () => {
                render(<StatusBadge status="optimal" />);

                const icon = screen.getByLabelText('Statut: Optimal').querySelector('svg');
                expect(icon).toBeInTheDocument();
                expect(icon).toHaveAttribute('aria-hidden', 'true');
            });
        });
    });

    describe('Status variants', () => {
        describe('when status is optimal', () => {
            it('should render with optimal styling and icon', () => {
                render(<StatusBadge status="optimal" />);

                expect(screen.getByText('Optimal')).toBeInTheDocument();
                const badge = screen.getByRole('status');
                expect(badge.className).toContain('bg-emerald');
            });
        });

        describe('when status is low', () => {
            it('should render with low styling and icon', () => {
                render(<StatusBadge status="low" />);

                expect(screen.getByText('Low')).toBeInTheDocument();
                const badge = screen.getByRole('status');
                expect(badge.className).toContain('bg-amber');
            });
        });

        describe('when status is critical', () => {
            it('should render with critical styling and icon', () => {
                render(<StatusBadge status="critical" />);

                expect(screen.getByText('Critical')).toBeInTheDocument();
                const badge = screen.getByRole('status');
                expect(badge.className).toContain('bg-red');
            });
        });

        describe('when status is outOfStock', () => {
            it('should render with outOfStock styling and icon', () => {
                render(<StatusBadge status="outOfStock" />);

                expect(screen.getByText('Out of Stock')).toBeInTheDocument();
                const badge = screen.getByRole('status');
                expect(badge.className).toContain('bg-gray');
            });
        });

        describe('when status is overstocked', () => {
            it('should render with overstocked styling and icon', () => {
                render(<StatusBadge status="overstocked" />);

                expect(screen.getByText('Overstocked')).toBeInTheDocument();
                const badge = screen.getByRole('status');
                expect(badge.className).toContain('bg-blue');
            });
        });
    });

    describe('Icon display', () => {
        describe('when showIcon is true (default)', () => {
            it('should display the status icon', () => {
                render(<StatusBadge status="optimal" showIcon={true} />);

                const badge = screen.getByRole('status');
                const icon = badge.querySelector('svg');
                expect(icon).toBeInTheDocument();
            });
        });

        describe('when showIcon is false', () => {
            it('should not display the status icon', () => {
                render(<StatusBadge status="optimal" showIcon={false} />);

                const badge = screen.getByRole('status');
                const icon = badge.querySelector('svg');
                expect(icon).not.toBeInTheDocument();
            });

            it('should still display the status label', () => {
                render(<StatusBadge status="optimal" showIcon={false} />);

                expect(screen.getByText('Optimal')).toBeInTheDocument();
            });
        });
    });

    describe('Size variants', () => {
        describe('when size is sm', () => {
            it('should apply small size classes', () => {
                render(<StatusBadge status="optimal" size="sm" />);

                const badge = screen.getByRole('status');
                expect(badge.className).toContain('status-badge--sm');

                const icon = badge.querySelector('svg');
                expect(icon).toBeInTheDocument();
                expect(icon?.getAttribute('class')).toContain('status-badge__icon--sm');
            });
        });

        describe('when size is md (default)', () => {
            it('should apply medium size classes', () => {
                render(<StatusBadge status="optimal" size="md" />);

                const badge = screen.getByRole('status');
                expect(badge.className).toContain('status-badge--md');

                const icon = badge.querySelector('svg');
                expect(icon).toBeInTheDocument();
                expect(icon?.getAttribute('class')).toContain('status-badge__icon--md');
            });
        });

        describe('when size is lg', () => {
            it('should apply large size classes', () => {
                render(<StatusBadge status="optimal" size="lg" />);

                const badge = screen.getByRole('status');
                expect(badge.className).toContain('status-badge--lg');

                const icon = badge.querySelector('svg');
                expect(icon).toBeInTheDocument();
                expect(icon?.getAttribute('class')).toContain('status-badge__icon--lg');
            });
        });
    });

    describe('Theme support', () => {
        describe('when theme is light', () => {
            it('should apply light theme colors for optimal status', () => {
                render(<StatusBadge status="optimal" />);

                const badge = screen.getByRole('status');
                expect(badge.className).toContain('bg-emerald-100');
                expect(badge.className).toContain('text-emerald-700');
            });
        });

        describe('when theme is dark', () => {
            it('should apply dark theme colors for optimal status', () => {

                render(<StatusBadge status="optimal" />);

                const badge = screen.getByRole('status');

                expect(badge.className).toContain('bg-emerald-100');
                expect(badge.className).toContain('text-emerald-700');
            });
        });
    });

    describe('Custom styling', () => {
        describe('when custom className is provided', () => {
            it('should apply custom classes', () => {
                render(<StatusBadge status="optimal" className="custom-class" />);

                const badge = screen.getByRole('status');
                expect(badge.className).toContain('custom-class');
            });

            it('should preserve base classes with custom classes', () => {
                render(<StatusBadge status="optimal" className="custom-class" />);

                const badge = screen.getByRole('status');
                expect(badge.className).toContain('status-badge');
                expect(badge.className).toContain('custom-class');
            });
        });
    });

    describe('StockHub business use cases', () => {
        describe('when displaying stock status in dashboard', () => {
            it('should handle critical stock status appropriately', () => {
                render(<StatusBadge status="critical" size="md" />);

                expect(screen.getByText('Critical')).toBeInTheDocument();
                expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Statut: Critical');

                const badge = screen.getByRole('status');
                expect(badge.className).toContain('bg-red');
            });

            it('should handle low stock status with proper warning styling', () => {
                render(<StatusBadge status="low" size="sm" />);

                expect(screen.getByText('Low')).toBeInTheDocument();
                const badge = screen.getByRole('status');
                expect(badge.className).toContain('bg-amber');
                expect(badge.className).toContain('status-badge--sm');
            });

            it('should handle optimal stock status with success styling', () => {
                render(<StatusBadge status="optimal" size="lg" />);

                expect(screen.getByText('Optimal')).toBeInTheDocument();
                const badge = screen.getByRole('status');
                expect(badge.className).toContain('bg-emerald');
                expect(badge.className).toContain('status-badge--lg');
            });
        });

        describe('when used in compact displays', () => {
            it('should render properly without icon for space-constrained layouts', () => {
                render(<StatusBadge status="critical" showIcon={false} size="sm" />);

                const badge = screen.getByRole('status');
                expect(badge.querySelector('svg')).not.toBeInTheDocument();
                expect(screen.getByText('Critical')).toBeInTheDocument();
                expect(badge.className).toContain('status-badge--sm');
            });
        });
    });

    describe('Accessibility', () => {
        describe('when used with screen readers', () => {
            it('should have proper ARIA attributes', () => {
                render(<StatusBadge status="low" />);

                const badge = screen.getByRole('status');
                expect(badge).toHaveAttribute('aria-label', 'Statut: Low');

                const icon = badge.querySelector('svg');
                expect(icon).toHaveAttribute('aria-hidden', 'true');
            });

            it('should provide meaningful status information', () => {
                render(<StatusBadge status="outOfStock" />);

                const badge = screen.getByLabelText('Statut: Out of Stock');
                expect(badge).toBeInTheDocument();
                expect(screen.getByText('Out of Stock')).toBeInTheDocument();
            });
        });
    });
});
