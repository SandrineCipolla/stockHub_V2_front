import {render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import userEvent from '@testing-library/user-event';
import {Header} from '@/components/layout/Header';
import * as useThemeModule from '@/hooks/useTheme';

vi.mock('@/hooks/useTheme', () => ({
    useTheme: vi.fn(() => ({ theme: 'dark', toggleTheme: vi.fn(), setTheme: vi.fn() }))
}));

describe('Header Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic rendering', () => {
        describe('when rendered with default props', () => {
            it('should display logo', () => {
                render(<Header />);
                expect(screen.getByText('StockHub')).toBeInTheDocument();
            });

            it('should display default user name', () => {
                render(<Header />);
                expect(screen.getByText('Sandrine Cipolla')).toBeInTheDocument();
            });

            it('should show notification count', () => {
                render(<Header />);
                expect(screen.getByText('3')).toBeInTheDocument();
            });

            it('should display logout button', () => {
                render(<Header />);
                expect(screen.getByRole('button', { name: /Se déconnecter/i })).toBeInTheDocument();
            });
        });

        describe('when rendered with custom props', () => {
            it('should display custom user name', () => {
                render(<Header userName="John Doe" />);
                expect(screen.getByText('John Doe')).toBeInTheDocument();
            });

            it('should display custom notification count', () => {
                render(<Header notificationCount={5} />);
                expect(screen.getByText('5')).toBeInTheDocument();
            });

            it('should update notification badge count', () => {
                render(<Header notificationCount={10} />);
                expect(screen.getByText('10')).toBeInTheDocument();
            });

            it('should apply custom className', () => {
                const { container } = render(<Header className="custom-class" />);
                const header = container.querySelector('header');
                expect(header?.className).toContain('custom-class');
            });
        });
    });

    describe('User interactions', () => {
        describe('when clicking notification button', () => {
            it('should handle notification click', async () => {
                const user = userEvent.setup();
                const consoleSpy = vi.spyOn(console, 'log');

                render(<Header />);

                const notifButton = screen.getByRole('button', {
                    name: /Notifications \(3 non lues\)/i
                });
                await user.click(notifButton);

                expect(consoleSpy).toHaveBeenCalledWith(
                    expect.stringContaining('notifications')
                );
            });

            it('should update aria-label with different notification counts', () => {
                const { rerender } = render(<Header notificationCount={5} />);

                expect(screen.getByRole('button', {
                    name: /Notifications \(5 non lues\)/i
                })).toBeInTheDocument();

                rerender(<Header notificationCount={1} />);

                expect(screen.getByRole('button', {
                    name: /Notifications \(1 non lues\)/i
                })).toBeInTheDocument();
            });
        });

        describe('when clicking theme toggle', () => {
            it('should call toggleTheme', async () => {
                const user = userEvent.setup();
                const mockToggleTheme = vi.fn();

                vi.mocked(useThemeModule.useTheme).mockReturnValue({
                    theme: 'dark',
                    toggleTheme: mockToggleTheme,
                    setTheme: vi.fn()
                });

                render(<Header />);

                const themeButton = screen.getByLabelText(/Changer vers le thème/i);
                await user.click(themeButton);

                expect(mockToggleTheme).toHaveBeenCalledTimes(1);
            });

            it('should display correct aria-label for dark theme', () => {
                vi.mocked(useThemeModule.useTheme).mockReturnValue({
                    theme: 'dark',
                    toggleTheme: vi.fn(),
                    setTheme: vi.fn()
                });

                render(<Header />);

                expect(screen.getByLabelText(/Changer vers le thème clair/i)).toBeInTheDocument();
            });

            it('should display correct aria-label for light theme', () => {
                vi.mocked(useThemeModule.useTheme).mockReturnValue({
                    theme: 'light',
                    toggleTheme: vi.fn(),
                    setTheme: vi.fn()
                });

                render(<Header />);

                expect(screen.getByLabelText(/Changer vers le thème sombre/i)).toBeInTheDocument();
            });
        });

        describe('when clicking logout button', () => {
            it('should render logout button', () => {
                render(<Header />);

                const logoutButton = screen.getByRole('button', {
                    name: /Se déconnecter de l'application StockHub/i
                });

                expect(logoutButton).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        describe('when rendered', () => {
            it('should have banner role', () => {
                const { container } = render(<Header />);
                expect(container.querySelector('[role="banner"]')).toBeInTheDocument();
            });

            it('should have navigation label', () => {
                render(<Header />);
                expect(screen.getByLabelText('Actions utilisateur')).toBeInTheDocument();
            });

            it('should have aria-label on logo', () => {
                const { container } = render(<Header />);
                expect(container.querySelector('[aria-label="Logo StockHub"]')).toBeInTheDocument();
            });

            it('should have proper aria-label on notification button with count', () => {
                render(<Header notificationCount={5} />);
                expect(screen.getByRole('button', {
                    name: /Notifications \(5 non lues\)/i
                })).toBeInTheDocument();
            });

            it('should have aria-describedby on notification button', () => {
                render(<Header />);
                const notifButton = screen.getByRole('button', {
                    name: /Notifications/i
                });
                expect(notifButton).toHaveAttribute('aria-describedby', 'notifications-count');
            });

            it('should have proper aria-label on logout button', () => {
                render(<Header />);
                expect(screen.getByLabelText(/Se déconnecter de l'application/i)).toBeInTheDocument();
            });

            it('should have title on user name span', () => {
                render(<Header userName="Jane Smith" />);
                const userSpan = screen.getByTitle('Jane Smith');
                expect(userSpan).toHaveAttribute('aria-label', 'Utilisateur connecté');
            });

            it('should have aria-hidden on decorative bell icon', () => {
                const { container } = render(<Header />);
                const bellIcon = container.querySelector('.lucide-bell');
                // Lucide ajoute aria-hidden directement sur le SVG
                expect(bellIcon).toHaveAttribute('aria-hidden', 'true');
            });
        });

        describe('keyboard navigation', () => {
            it('should allow keyboard interaction on notification button with Enter', async () => {
                const user = userEvent.setup();
                const consoleSpy = vi.spyOn(console, 'log');

                render(<Header />);

                const notifButton = screen.getByRole('button', {
                    name: /Notifications/i
                });

                notifButton.focus();
                expect(notifButton).toHaveFocus();

                await user.keyboard('{Enter}');
                expect(consoleSpy).toHaveBeenCalled();
            });

            it('should allow keyboard interaction on notification button with Space', async () => {
                const user = userEvent.setup();
                const consoleSpy = vi.spyOn(console, 'log');

                render(<Header />);

                const notifButton = screen.getByRole('button', {
                    name: /Notifications/i
                });

                notifButton.focus();
                await user.keyboard(' ');

                expect(consoleSpy).toHaveBeenCalled();
            });

            it('should allow keyboard interaction on theme toggle', async () => {
                const user = userEvent.setup();
                const mockToggleTheme = vi.fn();

                vi.mocked(useThemeModule.useTheme).mockReturnValue({
                    theme: 'dark',
                    toggleTheme: mockToggleTheme,
                    setTheme: vi.fn()
                });

                render(<Header />);

                const themeButton = screen.getByLabelText(/Changer vers le thème/i);

                themeButton.focus();
                expect(themeButton).toHaveFocus();

                await user.keyboard('{Enter}');
                expect(mockToggleTheme).toHaveBeenCalled();
            });
        });
    });

    describe('Responsive behavior', () => {
        describe('when rendered', () => {
            it('should have responsive classes on logo', () => {
                const { container } = render(<Header />);
                const logo = container.querySelector('[aria-label="Logo StockHub"]');
                expect(logo?.className).toMatch(/w-8.*h-8.*sm:w-10.*sm:h-10/);
            });

            it('should hide user name on mobile', () => {
                render(<Header />);
                const userName = screen.getByTitle('Sandrine Cipolla');
                expect(userName.className).toContain('hidden sm:block');
            });

            it('should have responsive padding on header', () => {
                const { container } = render(<Header />);
                const headerContent = container.querySelector('.max-w-7xl');
                expect(headerContent?.className).toMatch(/px-4.*sm:px-6/);
            });

            it('should have responsive gap on actions', () => {
                render(<Header />);
                const nav = screen.getByLabelText('Actions utilisateur');
                expect(nav.className).toMatch(/gap-1.*sm:gap-4/);
            });

            it('should hide logout text on mobile', () => {
                render(<Header />);
                const logoutText = screen.getByText('Logout');
                expect(logoutText.className).toContain('hidden sm:inline');
            });
        });
    });

    describe('Visual states', () => {
        describe('notification button', () => {
            it('should display red badge for unread notifications', () => {
                const { container } = render(<Header notificationCount={3} />);
                const badge = container.querySelector('.bg-red-500');
                expect(badge).toBeInTheDocument();
            });

            it('should have focus ring styles', () => {
                render(<Header />);
                const notifButton = screen.getByRole('button', {
                    name: /Notifications/i
                });
                expect(notifButton.className).toContain('focus:ring-2');
                expect(notifButton.className).toContain('focus:ring-purple-500');
            });

            it('should have hover styles for dark theme', () => {
                vi.mocked(useThemeModule.useTheme).mockReturnValue({
                    theme: 'dark',
                    toggleTheme: vi.fn(),
                    setTheme: vi.fn()
                });

                render(<Header />);
                const notifButton = screen.getByRole('button', {
                    name: /Notifications/i
                });
                expect(notifButton.className).toContain('hover:bg-white/10');
            });

            it('should have hover styles for light theme', () => {
                vi.mocked(useThemeModule.useTheme).mockReturnValue({
                    theme: 'light',
                    toggleTheme: vi.fn(),
                    setTheme: vi.fn()
                });

                render(<Header />);
                const notifButton = screen.getByRole('button', {
                    name: /Notifications/i
                });
                expect(notifButton.className).toContain('hover:bg-gray-100');
            });
        });

        describe('header styles', () => {
            it('should have dark theme styles', () => {
                vi.mocked(useThemeModule.useTheme).mockReturnValue({
                    theme: 'dark',
                    toggleTheme: vi.fn(),
                    setTheme: vi.fn()
                });

                const { container } = render(<Header />);
                const header = container.querySelector('header');
                expect(header?.className).toContain('bg-slate-900/90');
                expect(header?.className).toContain('border-white/10');
            });

            it('should have light theme styles', () => {
                vi.mocked(useThemeModule.useTheme).mockReturnValue({
                    theme: 'light',
                    toggleTheme: vi.fn(),
                    setTheme: vi.fn()
                });

                const { container } = render(<Header />);
                const header = container.querySelector('header');
                expect(header?.className).toContain('bg-white/95');
                expect(header?.className).toContain('border-gray-200');
            });
        });
    });

    describe('Edge cases', () => {
        describe('when notification count is very large', () => {
            it('should display large numbers correctly', () => {
                render(<Header notificationCount={999} />);
                expect(screen.getByText('999')).toBeInTheDocument();
            });
        });

        describe('when user name is very long', () => {
            it('should display long names', () => {
                const longName = 'Jean-Philippe de la Fontaine-Martinez';
                render(<Header userName={longName} />);
                expect(screen.getByText(longName)).toBeInTheDocument();
            });
        });

        describe('when notification count is zero', () => {
            it('should still display the badge', () => {
                render(<Header notificationCount={0} />);
                expect(screen.getByText('0')).toBeInTheDocument();
            });
        });
    });

    describe('Theme integration', () => {
        it('should use theme from useTheme hook', () => {
            const mockToggleTheme = vi.fn();
            vi.mocked(useThemeModule.useTheme).mockReturnValue({
                theme: 'dark',
                toggleTheme: mockToggleTheme,
                setTheme: vi.fn()
            });

            render(<Header />);

            expect(useThemeModule.useTheme).toHaveBeenCalled();
        });

        it('should render correctly in both themes', () => {
            vi.mocked(useThemeModule.useTheme).mockReturnValue({
                theme: 'dark',
                toggleTheme: vi.fn(),
                setTheme: vi.fn()
            });

            const { rerender, container } = render(<Header />);
            let header = container.querySelector('header');
            expect(header?.className).toContain('bg-slate-900/90');

            vi.mocked(useThemeModule.useTheme).mockReturnValue({
                theme: 'light',
                toggleTheme: vi.fn(),
                setTheme: vi.fn()
            });

            rerender(<Header />);
            header = container.querySelector('header');
            expect(header?.className).toContain('bg-white/95');
        });
    });
});