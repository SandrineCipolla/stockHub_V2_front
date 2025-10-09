import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {Footer} from '@/components/layout/Footer';
import {mockSecondaryNavigation} from '@/test/fixtures/navigation';

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

            it('should display secondary navigation links', () => {
                const secondaryLinks = mockSecondaryNavigation.map(link => ({
                    label: link.label,
                    href: link.href
                }));
                render(<Footer links={secondaryLinks} />);

                mockSecondaryNavigation.forEach(link => {
                    expect(screen.getByText(link.label)).toBeInTheDocument();
                });
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

        describe('when using navigation fixtures', () => {
            it('should render internal navigation links correctly', () => {
                const internalLinks = mockSecondaryNavigation
                    .filter(link => !link.href.startsWith('http'))
                    .map(link => ({
                        label: link.label,
                        href: link.href
                    }));

                render(<Footer links={internalLinks} />);

                internalLinks.forEach(link => {
                    const linkElement = screen.getByText(link.label);
                    expect(linkElement).toHaveAttribute('href', link.href);
                    expect(linkElement).not.toHaveAttribute('target', '_blank');
                });
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

            it('should maintain accessibility with custom navigation', () => {
                const navLinks = mockSecondaryNavigation.map(link => ({
                    label: link.label,
                    href: link.href
                }));
                render(<Footer links={navLinks} />);

                expect(screen.getByLabelText('Liens légaux')).toBeInTheDocument();

                navLinks.forEach(link => {
                    const linkElement = screen.getByText(link.label);
                    expect(linkElement).toBeInTheDocument();
                });
            });
        });
    });
});