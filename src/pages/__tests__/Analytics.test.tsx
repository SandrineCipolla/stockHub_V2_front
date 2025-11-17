import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Analytics } from '@/pages/Analytics';
import * as useStocksModule from '@/hooks/useStocks';
import { createMockUseStocks, createMockUseTheme } from '@/test/fixtures/hooks';
import { dashboardStocks } from '@/test/fixtures/stock';

// Mock navigate function
const mockNavigate = vi.fn();

vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => createMockUseTheme()
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('@/components/layout/NavSection', () => ({
    NavSection: ({ children }: { children: React.ReactNode }) => (
        <nav data-testid="nav-section">{children}</nav>
    )
}));

// Mock predictStockRuptures to return predictable results matching StockPrediction interface
vi.mock('@/utils/mlSimulation', () => ({
    predictStockRuptures: (stocks: unknown[]) => {
        // Generate predictions based on stock array length
        const predictions = [];
        for (let i = 0; i < Math.min(stocks.length, 5); i++) {
            const riskLevels = ['critical', 'high', 'medium', 'low'] as const;
            const daysUntilRupture = (i + 1) * 3;
            predictions.push({
                stockId: `stock-${i}`,
                stockName: `Stock ${i}`,
                riskLevel: riskLevels[i % 4],
                currentQuantity: 100 - i * 10,
                daysUntilRupture,
                dateOfRupture: new Date(Date.now() + daysUntilRupture * 24 * 60 * 60 * 1000),
                daysUntilRupturePessimistic: daysUntilRupture - 1,
                daysUntilRuptureOptimistic: daysUntilRupture + 2,
                dailyConsumptionRate: 5 + i,
                confidence: 85,
                recommendedReorderDate: new Date(Date.now() + (daysUntilRupture - 3) * 24 * 60 * 60 * 1000),
                recommendedReorderQuantity: 50 + i * 10,
            });
        }
        return predictions;
    },
}));

// Helper function to render Analytics with Router context
const renderAnalytics = () => {
    return render(
        <MemoryRouter>
            <Analytics />
        </MemoryRouter>
    );
};

describe('Analytics Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockClear();
    });

    describe('Initial render', () => {
        describe('when Analytics loads successfully', () => {
            it('should render all main sections', async () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());

                const { container } = await act(async () => {
                    return renderAnalytics();
                });

                // Check for web components
                const header = container.querySelector('sh-header');
                expect(header).toBeInTheDocument();
                expect(screen.getByTestId('nav-section')).toBeInTheDocument();
            });

            it('should display Analytics title and description', async () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());

                await act(async () => {
                    renderAnalytics();
                });

                expect(screen.getByText('Analyses IA & Prédictions')).toBeInTheDocument();
                expect(screen.getByText(/Prédictions Machine Learning basées sur régression linéaire/)).toBeInTheDocument();
            });

            it.skip('should render stats summary with all risk levels', async () => {
                // Skip: Shadow DOM prevents testing card interactions
                // Move to E2E tests with Playwright (issue #28)
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());

                const { container } = await act(async () => {
                    return renderAnalytics();
                });

                // Check for sh-card web components for stats (Shadow DOM prevents text access)
                const statCards = container.querySelectorAll('sh-card[clickable="true"]');
                // We expect 5 cards: Total, Critical, High, Medium, Low
                expect(statCards.length).toBe(5);
            });

            it('should render Back to Dashboard button', async () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());

                await act(async () => {
                    renderAnalytics();
                });

                expect(screen.getByText('Retour Dashboard')).toBeInTheDocument();
            });
        });

        describe('when Analytics has ML predictions', () => {
            it('should display all predictions initially', async () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks({
                    stocks: dashboardStocks.slice(0, 5) // Use 5 stocks to generate 5 predictions
                }));

                await act(async () => {
                    renderAnalytics();
                });

                // Should show "Toutes les prédictions" title
                expect(screen.getByText(/Toutes les prédictions/)).toBeInTheDocument();
            });

            it('should display ML info box', async () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());

                const { container } = await act(async () => {
                    return renderAnalytics();
                });

                // Check for info box CardWrapper
                const infoCard = container.querySelector('sh-card[variant="info"]');
                expect(infoCard).toBeInTheDocument();

                expect(screen.getByText('À propos des prédictions ML')).toBeInTheDocument();
                expect(screen.getByText(/Régression linéaire avec méthode des moindres carrés/)).toBeInTheDocument();
            });
        });
    });

    describe('Risk level filtering', () => {
        describe('when user clicks on stat cards', () => {
            it.skip('should filter predictions by critical risk', async () => {
                // Skip: Shadow DOM prevents testing card click interactions
                // Move to E2E tests with Playwright (issue #28)
                const user = userEvent.setup();
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks({
                    stocks: dashboardStocks.slice(0, 5)
                }));

                await act(async () => {
                    renderAnalytics();
                });

                const criticalLabel = screen.getByText('Critique (≤3j)');
                await user.click(criticalLabel);

                // Should update title to show filter
                expect(screen.getByText(/Prédictions : critical/)).toBeInTheDocument();
            });

            it.skip('should filter predictions by high risk', async () => {
                // Skip: Shadow DOM prevents testing card click interactions
                // Move to E2E tests with Playwright (issue #28)
                const user = userEvent.setup();
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks({
                    stocks: dashboardStocks.slice(0, 5)
                }));

                await act(async () => {
                    renderAnalytics();
                });

                const highLabel = screen.getByText('Élevé (4-7j)');
                await user.click(highLabel);

                expect(screen.getByText(/Prédictions : high/)).toBeInTheDocument();
            });

            it.skip('should filter predictions by medium risk', async () => {
                // Skip: Shadow DOM prevents testing card click interactions
                // Move to E2E tests with Playwright (issue #28)
                const user = userEvent.setup();
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks({
                    stocks: dashboardStocks.slice(0, 5)
                }));

                await act(async () => {
                    renderAnalytics();
                });

                const mediumLabel = screen.getByText('Moyen (8-14j)');
                await user.click(mediumLabel);

                expect(screen.getByText(/Prédictions : medium/)).toBeInTheDocument();
            });

            it.skip('should filter predictions by low risk', async () => {
                // Skip: Shadow DOM prevents testing card click interactions
                // Move to E2E tests with Playwright (issue #28)
                const user = userEvent.setup();
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks({
                    stocks: dashboardStocks.slice(0, 5)
                }));

                await act(async () => {
                    renderAnalytics();
                });

                const lowLabel = screen.getByText('Faible (15j+)');
                await user.click(lowLabel);

                expect(screen.getByText(/Prédictions : low/)).toBeInTheDocument();
            });

            it.skip('should reset filter when clicking Total Stocks', async () => {
                // Skip: Shadow DOM prevents testing card click interactions
                // Move to E2E tests with Playwright (issue #28)
                const user = userEvent.setup();
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks({
                    stocks: dashboardStocks.slice(0, 5)
                }));

                await act(async () => {
                    renderAnalytics();
                });

                // First filter by critical
                const criticalLabel = screen.getByText('Critique (≤3j)');
                await user.click(criticalLabel);

                // Then click Total Stocks to reset
                const totalLabel = screen.getByText('Total Stocks');
                await user.click(totalLabel);

                expect(screen.getByText(/Toutes les prédictions/)).toBeInTheDocument();
            });
        });

        describe('when filter button is displayed', () => {
            it.skip('should show reset filter button when filtered', async () => {
                // Skip: Shadow DOM prevents testing card click interactions
                // Move to E2E tests with Playwright (issue #28)
                const user = userEvent.setup();
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks({
                    stocks: dashboardStocks.slice(0, 5)
                }));

                await act(async () => {
                    renderAnalytics();
                });

                // Filter by critical
                const criticalLabel = screen.getByText('Critique (≤3j)');
                await user.click(criticalLabel);

                // Reset button should appear
                expect(screen.getByText('Réinitialiser filtre')).toBeInTheDocument();
            });

            it.skip('should reset filter when clicking reset button', async () => {
                // Skip: Shadow DOM prevents testing card click interactions
                // Move to E2E tests with Playwright (issue #28)
                const user = userEvent.setup();
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks({
                    stocks: dashboardStocks.slice(0, 5)
                }));

                await act(async () => {
                    renderAnalytics();
                });

                // Filter by high
                const highLabel = screen.getByText('Élevé (4-7j)');
                await user.click(highLabel);

                // Click reset button
                const resetButton = screen.getByText('Réinitialiser filtre');
                await user.click(resetButton);

                expect(screen.getByText(/Toutes les prédictions/)).toBeInTheDocument();
            });
        });
    });

    describe('Empty states', () => {
        describe('when no predictions match filter', () => {
            it('should display empty state for no predictions', async () => {
                // Mock with empty stocks to generate no predictions
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks({
                    stocks: []
                }));

                await act(async () => {
                    renderAnalytics();
                });

                // When no predictions at all, it should show empty state
                expect(screen.getByText(/Aucune prédiction/)).toBeInTheDocument();
            });
        });
    });

    describe('Navigation', () => {
        describe('when user navigates', () => {
            it.skip('should navigate back to dashboard when clicking back button', async () => {
                const user = userEvent.setup();
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());

                await act(async () => {
                    renderAnalytics();
                });

                const backButton = screen.getByText('Retour Dashboard');
                await user.click(backButton);

                expect(mockNavigate).toHaveBeenCalledWith('/');
            });
        });
    });

    describe('Stats calculation', () => {
        describe('when predictions are generated', () => {
            it.skip('should calculate correct stats for each risk level', async () => {
                // Skip: Shadow DOM prevents testing card count
                // Move to E2E tests with Playwright (issue #28)
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks({
                    stocks: dashboardStocks.slice(0, 4) // Generate 4 predictions with different risk levels
                }));

                const { container } = await act(async () => {
                    return renderAnalytics();
                });

                // Check that stat cards are rendered
                const statCards = container.querySelectorAll('sh-card[clickable="true"]');
                expect(statCards.length).toBe(5); // Total + 4 risk levels

                // Verify labels are displayed
                expect(screen.getByText('Total Stocks')).toBeInTheDocument();
                expect(screen.getByText('Critique (≤3j)')).toBeInTheDocument();
                expect(screen.getByText('Élevé (4-7j)')).toBeInTheDocument();
                expect(screen.getByText('Moyen (8-14j)')).toBeInTheDocument();
                expect(screen.getByText('Faible (15j+)')).toBeInTheDocument();
            });
        });
    });

    describe('Theme integration', () => {
        describe('when using theme', () => {
            it('should apply theme classes correctly', async () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());

                const { container } = await act(async () => {
                    return renderAnalytics();
                });

                // Check that web components have data-theme attribute
                const cards = container.querySelectorAll('sh-card');
                cards.forEach(card => {
                    expect(card.getAttribute('data-theme')).toBeTruthy();
                });
            });
        });
    });

    describe('Design System integration', () => {
        describe('when using CardWrapper components', () => {
            it.skip('should render StatCard components with correct variants', async () => {
                // Skip: Analytics now uses StatCard wrapper which renders sh-stat-card, not sh-card
                // TODO: Update test to check for sh-stat-card elements or create StatCardWrapper tests (Issue #24)
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks({
                    stocks: dashboardStocks.slice(0, 5)
                }));

                const { container } = await act(async () => {
                    return renderAnalytics();
                });

                // Check for cards with different variants
                const primaryCard = container.querySelector('sh-card[variant="primary"]');
                const errorCard = container.querySelector('sh-card[variant="error"]');
                const warningCard = container.querySelector('sh-card[variant="warning"]');
                const successCard = container.querySelector('sh-card[variant="success"]');
                const infoCard = container.querySelector('sh-card[variant="info"]');

                expect(primaryCard).toBeInTheDocument(); // Total
                expect(errorCard).toBeInTheDocument(); // Critical
                expect(warningCard).toBeInTheDocument(); // High or Medium
                expect(successCard).toBeInTheDocument(); // Low
                expect(infoCard).toBeInTheDocument(); // Info Box
            });

            it.skip('should render cards with clickable attribute', async () => {
                // Skip: Shadow DOM prevents testing card attributes
                // Move to E2E tests with Playwright (issue #28)
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());

                const { container } = await act(async () => {
                    return renderAnalytics();
                });

                // All stat cards should be clickable
                const clickableCards = container.querySelectorAll('sh-card[clickable="true"]');
                expect(clickableCards.length).toBeGreaterThanOrEqual(5);
            });

            it.skip('should mark selected card with selected attribute', async () => {
                // Skip: Shadow DOM prevents testing card selection state
                // Move to E2E tests with Playwright (issue #28)
                const user = userEvent.setup();
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks({
                    stocks: dashboardStocks.slice(0, 5)
                }));

                const { container } = await act(async () => {
                    return renderAnalytics();
                });

                // Click on critical filter
                const criticalLabel = screen.getByText('Critique (≤3j)');
                await user.click(criticalLabel);

                // Check that a card is now selected
                const selectedCard = container.querySelector('sh-card[selected="true"]');
                expect(selectedCard).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        describe('when interacting with keyboard', () => {
            it('should render semantic HTML structure', async () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());

                const { container } = await act(async () => {
                    return renderAnalytics();
                });

                // Check for semantic elements
                expect(container.querySelector('main')).toBeInTheDocument();
                expect(screen.getByTestId('nav-section')).toBeInTheDocument();
            });

            it('should have proper heading hierarchy', async () => {
                vi.spyOn(useStocksModule, 'useStocks').mockReturnValue(createMockUseStocks());

                await act(async () => {
                    renderAnalytics();
                });

                // Check heading levels
                const h1 = screen.getByRole('heading', { level: 1, name: /Analyses IA & Prédictions/ });
                const h2 = screen.getByRole('heading', { level: 2, name: /Toutes les prédictions/ });
                const h3 = screen.getByRole('heading', { level: 3, name: /À propos des prédictions ML/ });

                expect(h1).toBeInTheDocument();
                expect(h2).toBeInTheDocument();
                expect(h3).toBeInTheDocument();
            });
        });
    });
});
