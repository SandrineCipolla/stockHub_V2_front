import {act, renderHook, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {useTheme} from '@/hooks/useTheme';
import {ThemeProvider} from '@/components/providers/ThemeProvider';
import type {ReactNode} from 'react';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

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
        });
    });

    describe('StockHub business use cases', () => {
        describe('when user toggles theme from header', () => {
            it('should persist preference across sessions', () => {
                const { result, unmount } = renderHook(() => useTheme(), { wrapper });

                act(() => {
                    result.current.toggleTheme();
                });

                expect(result.current.theme).toBe('light');

                // reload
                unmount();

                const { result: newResult } = renderHook(() => useTheme(), { wrapper });

                waitFor(() => {
                    expect(newResult.current.theme).toBe('light');
                });
            });
        });

        describe('when user prefers light mode', () => {
            it('should load light theme on first visit if saved', () => {
                localStorageMock.setItem('stockhub-theme', 'light');

                const { result } = renderHook(() => useTheme(), { wrapper });

                waitFor(() => {
                    expect(result.current.theme).toBe('light');
                    expect(document.documentElement.classList.contains('dark')).toBe(false);
                });
            });
        });

        describe('when user switches between dashboards', () => {
            it('should maintain theme consistency', () => {
                const { result } = renderHook(() => useTheme(), { wrapper });

                act(() => {
                    result.current.setTheme('light');
                });

                expect(result.current.theme).toBe('light');


                waitFor(() => {
                    expect(localStorageMock.getItem('stockhub-theme')).toBe('light');
                });
            });
        });

        describe('when app is used at night', () => {
            it('should allow switching to dark mode', () => {
                localStorageMock.setItem('stockhub-theme', 'light');

                const { result } = renderHook(() => useTheme(), { wrapper });

                waitFor(() => {
                    expect(result.current.theme).toBe('light');
                });


                act(() => {
                    result.current.setTheme('dark');
                });

                expect(result.current.theme).toBe('dark');
                waitFor(() => {
                    expect(document.documentElement.classList.contains('dark')).toBe(true);
                });
            });
        });
    });
});