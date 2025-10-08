// tests/unit/components/Badge.test.tsx
import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import {Badge} from '@/components/common/Badge';
import {
    numericBadgeContent,
    stockHubBadgeUseCases,
    stockStatusBadgeContent,
    textBadgeContent,
    trendBadgeContent
} from '@/test/fixtures/badge';

vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'light' })
}));

describe('Badge Component', () => {

    describe('Basic rendering', () => {
        describe('when rendered with required props', () => {
            it('should display the badge content', () => {
                render(<Badge variant="success">Success Badge</Badge>);
                expect(screen.getByText('Success Badge')).toBeInTheDocument();
            });

            it('should apply base CSS classes', () => {
                render(<Badge variant="success">Badge</Badge>);
                const badge = screen.getByText('Badge');

                expect(badge).toHaveClass('rounded-full');
                expect(badge).toHaveClass('font-medium');
                expect(badge).toHaveClass('border');
                expect(badge).toHaveClass('px-3');
                expect(badge).toHaveClass('py-1');
                expect(badge).toHaveClass('text-xs');
            });

            it('should use span as root element', () => {
                render(<Badge variant="success">Badge</Badge>);
                const badge = screen.getByText('Badge');
                expect(badge.tagName).toBe('SPAN');
            });
        });
    });

    describe('Variants', () => {
        describe('when variant is success', () => {
            it('should apply success color classes', () => {
                render(<Badge variant="success">Success</Badge>);
                const badge = screen.getByText('Success');
                expect(badge.className).toContain('emerald');
            });
        });

        describe('when variant is warning', () => {
            it('should apply warning color classes', () => {
                render(<Badge variant="warning">Warning</Badge>);
                const badge = screen.getByText('Warning');
                expect(badge.className).toContain('amber');
            });
        });

        describe('when variant is danger', () => {
            it('should apply danger color classes', () => {
                render(<Badge variant="danger">Danger</Badge>);
                const badge = screen.getByText('Danger');
                expect(badge.className).toContain('red');
            });
        });
    });

    describe('Content types', () => {
        describe('when content is simple text', () => {
            it('should display plain text correctly', () => {
                render(<Badge variant="success">{textBadgeContent.simple}</Badge>);
                expect(screen.getByText(textBadgeContent.simple)).toBeInTheDocument();
            });
        });

        describe('when content is numbers', () => {
            it('should display numeric content', () => {
                render(<Badge variant="warning">{numericBadgeContent.positive}</Badge>);
                expect(screen.getByText(numericBadgeContent.positive.toString())).toBeInTheDocument();
            });

            it('should display negative numbers', () => {
                render(<Badge variant="danger">{numericBadgeContent.negative}</Badge>);
                expect(screen.getByText(numericBadgeContent.negative.toString())).toBeInTheDocument();
            });
        });

        describe('when content has special characters', () => {
            it('should display percentage values', () => {
                render(<Badge variant="success">{textBadgeContent.withSpecialChars}</Badge>);
                expect(screen.getByText(textBadgeContent.withSpecialChars)).toBeInTheDocument();
            });
        });
    });

    describe('StockHub business use cases', () => {
        describe('when displaying stock status "Optimal"', () => {
            it('should use success variant', () => {
                const { variant, content } = stockHubBadgeUseCases.optimal;
                render(<Badge variant={variant}>{content}</Badge>);
                const badge = screen.getByText(content);

                expect(badge).toBeInTheDocument();
                expect(badge.className).toContain('emerald');
            });
        });

        describe('when displaying stock status "Faible"', () => {
            it('should use warning variant', () => {
                const { variant, content } = stockHubBadgeUseCases.low;
                render(<Badge variant={variant}>{content}</Badge>);
                const badge = screen.getByText(content);

                expect(badge).toBeInTheDocument();
                expect(badge.className).toContain('amber');
            });
        });

        describe('when displaying stock status "Critique"', () => {
            it('should use danger variant', () => {
                const { variant, content } = stockHubBadgeUseCases.critical;
                render(<Badge variant={variant}>{content}</Badge>);
                const badge = screen.getByText(content);

                expect(badge).toBeInTheDocument();
                expect(badge.className).toContain('red');
            });
        });

        describe('when displaying trend indicators', () => {
            it('should work for positive trends', () => {
                const { variant, content } = stockHubBadgeUseCases.positiveTrend;
                render(<Badge variant={variant}>{content}</Badge>);
                expect(screen.getByText(content)).toBeInTheDocument();
            });

            it('should work for negative trends', () => {
                const { variant, content } = stockHubBadgeUseCases.negativeTrend;
                render(<Badge variant={variant}>{content}</Badge>);
                expect(screen.getByText(content)).toBeInTheDocument();
            });

            it('should work for percentage changes', () => {
                render(<Badge variant="success">{trendBadgeContent.positivePercentage}</Badge>);
                expect(screen.getByText(trendBadgeContent.positivePercentage)).toBeInTheDocument();
            });
        });

        describe('when displaying quantity alerts', () => {
            it('should indicate out of stock', () => {
                const { variant, content } = stockHubBadgeUseCases.outOfStock;
                render(<Badge variant={variant}>{content}</Badge>);
                const badge = screen.getByText(content);
                expect(badge.className).toContain('red');
            });

            it('should indicate low stock', () => {
                render(<Badge variant="warning">{stockStatusBadgeContent.lowStock}</Badge>);
                const badge = screen.getByText(stockStatusBadgeContent.lowStock);
                expect(badge.className).toContain('amber');
            });
        });
    });
});