import {render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import userEvent from '@testing-library/user-event';
import {Header} from '@/components/layout/Header';
import * as useThemeModule from '@/hooks/useTheme';
import {getUserDisplayName, mockDefaultUser, mockUserScenarios} from '@/test/fixtures/user';
import {getNotificationStats, mockNotificationScenarios} from '@/test/fixtures/notification';

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
                expect(screen.getByText(getUserDisplayName(mockDefaultUser))).toBeInTheDocument();
            });

            it('should show notification count', () => {
                const unreadCount = getNotificationStats(mockNotificationScenarios.unreadOnly).unread;
                render(<Header notificationCount={unreadCount} />);
                expect(screen.getByText(unreadCount.toString())).toBeInTheDocument();
            });

            it('should display logout button', () => {
                render(<Header />);
                expect(screen.getByRole('button', { name: /Se déconnecter/i })).toBeInTheDocument();
            });
        });

        describe('when rendered with custom props', () => {
            it('should display custom user name', () => {
                const customUser = mockUserScenarios.newUser;
                render(<Header userName={getUserDisplayName(customUser)} />);
                expect(screen.getByText(getUserDisplayName(customUser))).toBeInTheDocument();
            });

            it('should display custom notification count', () => {
                const customCount = 5;
                render(<Header notificationCount={customCount} />);
                expect(screen.getByText(customCount.toString())).toBeInTheDocument();
            });

            it('should update notification badge count', () => {
                const highPriorityCount = getNotificationStats(mockNotificationScenarios.highPriority).total;
                render(<Header notificationCount={highPriorityCount} />);
                expect(screen.getByText(highPriorityCount.toString())).toBeInTheDocument();
            });

            it('should apply custom className', () => {
                const { container } = render(<Header className="custom-class" />);
                const header = container.querySelector('header');
                expect(header?.className).toContain('custom-class');
            });
        });

        describe('with different user scenarios', () => {
            it('should display wealthy user name', () => {
                const wealthyUser = mockUserScenarios.wealthyUser;
                render(<Header userName={getUserDisplayName(wealthyUser)} />);
                expect(screen.getByText(getUserDisplayName(wealthyUser))).toBeInTheDocument();
            });

            it('should handle empty notification scenario', () => {
                const emptyCount = getNotificationStats(mockNotificationScenarios.empty).total;
                render(<Header notificationCount={emptyCount} />);
                expect(screen.getByText('0')).toBeInTheDocument();
            });

            it('should handle many notifications scenario', () => {
                const manyCount = getNotificationStats(mockNotificationScenarios.many).total;
                render(<Header notificationCount={manyCount} />);
                expect(screen.getByText(manyCount.toString())).toBeInTheDocument();
            });
        });
    });

    describe('User interactions', () => {
        describe('when clicking notification button', () => {
            it('should handle notification click', async () => {
                const user = userEvent.setup();
                const consoleSpy = vi.spyOn(console, 'log');
                const unreadCount = getNotificationStats(mockNotificationScenarios.unreadOnly).unread;

                render(<Header notificationCount={unreadCount} />);

                const notifButton = screen.getByRole('button', {
                    name: new RegExp(`Notifications \\(${unreadCount} non lues\\)`, 'i')
                });
                await user.click(notifButton);

                expect(consoleSpy).toHaveBeenCalledWith(
                    expect.stringContaining('notifications')
                );
            });

            it('should update aria-label with different notification counts', () => {
                const stockAlertsCount = getNotificationStats(mockNotificationScenarios.stockAlerts).total;
                const { rerender } = render(<Header notificationCount={stockAlertsCount} />);

                expect(screen.getByRole('button', {
                    name: new RegExp(`Notifications \\(${stockAlertsCount} non lues\\)`, 'i')
                })).toBeInTheDocument();

                const singleNotificationCount = 1;
                rerender(<Header notificationCount={singleNotificationCount} />);

                expect(screen.getByRole('button', {
                    name: /Notifications \(1 non lues\)/i
                })).toBeInTheDocument();
            });

            it('should handle high priority notifications', () => {
                const highPriorityCount = getNotificationStats(mockNotificationScenarios.highPriority).total;
                render(<Header notificationCount={highPriorityCount} />);

                const notifButton = screen.getByRole('button', {
                    name: new RegExp(`Notifications \\(${highPriorityCount} non lues\\)`, 'i')
                });
                expect(notifButton).toBeInTheDocument();
            });
        });

        describe('when clicking theme toggle', () => {
            it('should call toggleTheme', async () => {
                const user = userEvent.setup();
                const mockToggleTheme = vi.fn();

                vi.mocked(useThemeModule.useTheme).mockReturnValue({
                    theme: mockDefaultUser.preferences.theme,
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

            it('should work with user theme preferences', () => {
                const userWithLightTheme = { ...mockDefaultUser, preferences: { ...mockDefaultUser.preferences, theme: 'light' as const } };

                vi.mocked(useThemeModule.useTheme).mockReturnValue({
                    theme: userWithLightTheme.preferences.theme,
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

            it('should render logout button for different users', () => {
                render(<Header userName={getUserDisplayName(mockUserScenarios.wealthyUser)} />);

                const logoutButton = screen.getByRole('button', {
                    name: /Se déconnecter de l'application StockHub/i
                });

                expect(logoutButton).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            const unreadCount = getNotificationStats(mockNotificationScenarios.unreadOnly).unread;
            render(<Header notificationCount={unreadCount} />);

            expect(screen.getByRole('button', {
                name: new RegExp(`Notifications \\(${unreadCount} non lues\\)`, 'i')
            })).toBeInTheDocument();

            expect(screen.getByLabelText(/Changer vers le thème/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Se déconnecter/i })).toBeInTheDocument();
        });
    });
});