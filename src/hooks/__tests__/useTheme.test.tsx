import {act, renderHook, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {useTheme} from '@/hooks/useTheme';
import {ThemeProvider} from '@/components/providers/ThemeProvider';
import type {ReactNode} from 'react';
import {mockDefaultUser, mockUserScenarios} from '@/test/fixtures/user';
import {createLocalStorageMock} from '@/test/fixtures/localStorage';


const localStorageMock = createLocalStorageMock();
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Wrapper pour fournir le ThemeProvider
const wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
);

describe('useTheme Hook', () => {

    beforeEach(() => {
        localStorageMock.clear();
        document.documentElement.classList.remove('dark');
    });

    afterEach(() => {
        localStorageMock.clear();
    });

    describe('Basic functionality', () => {
        describe('when hook is used within ThemeProvider', () => {
            it('should return theme context', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                expect(result.current).toBeDefined();
                expect(result.current.theme).toBeDefined();
                expect(result.current.toggleTheme).toBeDefined();
                expect(result.current.setTheme).toBeDefined();
            });

            it('should have default theme as dark', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                expect(result.current.theme).toBe('dark');
            });

            it('should match default user theme preference', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                expect(result.current.theme).toBe(mockDefaultUser.preferences.theme);
            });
        });

        describe('when hook is used outside ThemeProvider', () => {
            it('should throw error', () => {
                const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

                expect(() => {
                    renderHook(() => useTheme());
                }).toThrow('useTheme must be used within a ThemeProvider');

                consoleErrorSpy.mockRestore();
            });
        });
    });

    describe('Theme toggle', () => {
        describe('when toggleTheme is called', () => {
            it('should switch from dark to light', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                expect(result.current.theme).toBe('dark');

                act(() => {
                    result.current.toggleTheme();
                });

                expect(result.current.theme).toBe('light');
            });

            it('should switch from light to dark', () => {
                localStorageMock.setItem('stockhub-theme', 'light');

                const { result } = renderHook(() => useTheme(), { wrapper });

                waitFor(() => {
                    expect(result.current.theme).toBe('light');
                });

                act(() => {
                    result.current.toggleTheme();
                });

                expect(result.current.theme).toBe('dark');
            });

            it('should toggle multiple times correctly', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                expect(result.current.theme).toBe('dark');

                act(() => {
                    result.current.toggleTheme(); // dark -> light
                });
                expect(result.current.theme).toBe('light');

                act(() => {
                    result.current.toggleTheme(); // light -> dark
                });
                expect(result.current.theme).toBe('dark');

                act(() => {
                    result.current.toggleTheme(); // dark -> light
                });
                expect(result.current.theme).toBe('light');
            });
        });
    });

    describe('Theme setter', () => {
        describe('when setTheme is called', () => {
            it('should set theme to dark', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                act(() => {
                    result.current.setTheme('dark');
                });

                expect(result.current.theme).toBe('dark');
            });

            it('should set theme to light', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                act(() => {
                    result.current.setTheme('light');
                });

                expect(result.current.theme).toBe('light');
            });

            it('should override current theme', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                expect(result.current.theme).toBe('dark');

                act(() => {
                    result.current.setTheme('light');
                });

                expect(result.current.theme).toBe('light');

                act(() => {
                    result.current.setTheme('dark');
                });

                expect(result.current.theme).toBe('dark');
            });
        });
    });

    describe('User preference scenarios', () => {
        describe('when different users have theme preferences', () => {
            it('should work with wealthy user light theme preference', () => {
                const wealthyUser = mockUserScenarios.wealthyUser;
                const userTheme = wealthyUser.preferences.theme;

                localStorageMock.setItem('stockhub-theme', userTheme);
                const { result } = renderHook(() => useTheme(), { wrapper });

                waitFor(() => {
                    expect(result.current.theme).toBe(userTheme);
                });
            });

            it('should work with new user auto theme preference', () => {
                const newUser = mockUserScenarios.newUser;
                const userTheme = newUser.preferences.theme;

                localStorageMock.setItem('stockhub-theme', userTheme);
                const { result } = renderHook(() => useTheme(), { wrapper });

                waitFor(() => {
                    expect(result.current.theme).toBe(userTheme);
                });
            });

            it('should handle theme switching for different user types', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                // Test with each user scenario
                const userScenarios = Object.values(mockUserScenarios);

                userScenarios.forEach(user => {
                    act(() => {
                        result.current.setTheme(user.preferences.theme);
                    });

                    expect(result.current.theme).toBe(user.preferences.theme);
                });
            });
        });
    });

    describe('localStorage persistence', () => {
        describe('when theme is changed', () => {
            it('should save theme to localStorage', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                act(() => {
                    result.current.setTheme('light');
                });

                waitFor(() => {
                    expect(localStorageMock.getItem('stockhub-theme')).toBe('light');
                });
            });

            it('should update localStorage on toggle', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                act(() => {
                    result.current.toggleTheme();
                });

                waitFor(() => {
                    expect(localStorageMock.getItem('stockhub-theme')).toBe('light');
                });
            });

            it('should persist user theme preferences', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                // Test each user theme preference
                const themes: Array<'light' | 'dark'> = ['light', 'dark'];

                themes.forEach(theme => {
                    act(() => {
                        result.current.setTheme(theme);
                    });

                    waitFor(() => {
                        expect(localStorageMock.getItem('stockhub-theme')).toBe(theme);
                    });
                });
            });
        });

        describe('when component mounts', () => {
            it('should load saved theme from localStorage', () => {
                localStorageMock.setItem('stockhub-theme', 'light');

                const { result } = renderHook(() => useTheme(), { wrapper });

                waitFor(() => {
                    expect(result.current.theme).toBe('light');
                });
            });

            it('should use default dark theme if no saved theme', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                expect(result.current.theme).toBe('dark');
            });

            it('should load default user preference theme', () => {
                localStorageMock.setItem('stockhub-theme', mockDefaultUser.preferences.theme);

                const { result } = renderHook(() => useTheme(), { wrapper });

                waitFor(() => {
                    expect(result.current.theme).toBe(mockDefaultUser.preferences.theme);
                });
            });
        });
    });

    describe('DOM manipulation', () => {
        describe('when theme is dark', () => {
            it('should add dark class to html element', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                act(() => {
                    result.current.setTheme('dark');
                });

                waitFor(() => {
                    expect(document.documentElement.classList.contains('dark')).toBe(true);
                });
            });
        });

        describe('when theme is light', () => {
            it('should remove dark class from html element', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                act(() => {
                    result.current.setTheme('light');
                });

                waitFor(() => {
                    expect(document.documentElement.classList.contains('dark')).toBe(false);
                });
            });
        });

        describe('when theme is toggled', () => {
            it('should update html dark class correctly', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                // Initial: dark
                waitFor(() => {
                    expect(document.documentElement.classList.contains('dark')).toBe(true);
                });

                // Toggle to light
                act(() => {
                    result.current.toggleTheme();
                });

                waitFor(() => {
                    expect(document.documentElement.classList.contains('dark')).toBe(false);
                });

                // Toggle back to dark
                act(() => {
                    result.current.toggleTheme();
                });

                waitFor(() => {
                    expect(document.documentElement.classList.contains('dark')).toBe(true);
                });
            });

            it('should handle DOM updates for user preference themes', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                // Test DOM updates for each user scenario
                Object.values(mockUserScenarios).forEach(user => {
                    act(() => {
                        result.current.setTheme(user.preferences.theme);
                    });

                    const shouldHaveDarkClass = user.preferences.theme === 'dark';

                    waitFor(() => {
                        expect(document.documentElement.classList.contains('dark')).toBe(shouldHaveDarkClass);
                    });
                });
            });
        });
    });
});