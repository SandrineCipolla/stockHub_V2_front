import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {Footer} from '@/components/layout/Footer';

vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'dark' })
}));

describe('Footer Component', () => {
    describe('Basic rendering', () => {
        describe('when rendered with default props', () => {
            it('should display company name', () => {
                render(<Footer />);
                expect(screen.getByText(/STOCK HUB/i)).toBeInTheDocument();
            });

            it('should display current year', () => {
                render(<Footer />);
                const currentYear = new Date().getFullYear();
                expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
            });

            it('should display default legal links', () => {
                render(<Footer />);
                expect(screen.getByText('Mentions Légales')).toBeInTheDocument();
                expect(screen.getByText('Politique de Confidentialité')).toBeInTheDocument();
                expect(screen.getByText('CGU')).toBeInTheDocument();
                expect(screen.getByText('Politique de Cookies')).toBeInTheDocument();
            });
        });

        describe('when rendered with custom props', () => {
            it('should display custom company name', () => {
                render(<Footer companyName="Custom Corp" />);
                expect(screen.getByText(/Custom Corp/i)).toBeInTheDocument();
            });

            it('should display custom year', () => {
                render(<Footer year={2020} />);
                expect(screen.getByText(/2020/)).toBeInTheDocument();
            });

            it('should display custom links', () => {
                const customLinks = [
                    { label: 'Contact', href: '/contact' },
                    { label: 'About', href: '/about' }
                ];
                render(<Footer links={customLinks} />);

                expect(screen.getByText('Contact')).toBeInTheDocument();
                expect(screen.getByText('About')).toBeInTheDocument();
            });
        });
    });

    describe('Link behavior', () => {
        describe('when link is external', () => {
            it('should open in new tab', () => {
                const externalLinks = [
                    { label: 'External', href: 'https://example.com', external: true }
                ];
                render(<Footer links={externalLinks} />);

                const link = screen.getByText('External');
                expect(link).toHaveAttribute('target', '_blank');
                expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            });
        });
    });

    describe('Accessibility', () => {
        describe('when rendered', () => {
            it('should have contentinfo role', () => {
                const { container } = render(<Footer />);
                expect(container.querySelector('[role="contentinfo"]')).toBeInTheDocument();
            });

            it('should have aria-label on nav', () => {
                render(<Footer />);
                expect(screen.getByLabelText('Liens légaux')).toBeInTheDocument();
            });
        });
    });
});