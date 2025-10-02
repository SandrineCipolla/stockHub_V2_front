import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'


import {MetricCard} from '../MetricCard'

vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'light' })
}))

describe('MetricCard Component', () => {

    describe('Basic rendering', () => {
        describe('when rendered with required props', () => {
            it('should display the metric label', () => {
                render(
                    <MetricCard
                        id="test-metric"
                        label="Total Produits"
                        value={248}
                        change={8}
                        changeType="increase"
                        icon="package"
                        color="success"
                    />
                )

                expect(screen.getByText('Total Produits')).toBeInTheDocument()
            })

            it('should display the metric value', () => {
                render(
                    <MetricCard
                        id="test-metric"
                        label="Stock Faible"
                        value={12}
                        change={3}
                        changeType="decrease"
                        icon="alert-triangle"
                        color="warning"
                    />
                )

                expect(screen.getByText('12')).toBeInTheDocument()
            })

            it('should display the change value', () => {
                render(
                    <MetricCard
                        id="test-metric"
                        label="Test"
                        value={100}
                        change={5}
                        changeType="increase"
                        icon="trending-up"
                        color="info"
                    />
                )

                expect(screen.getByText('+5')).toBeInTheDocument()
            })
        })
    })

    describe('Icons', () => {
        describe('when icon is package', () => {
            it('should render Package icon', () => {
                const { container } = render(
                    <MetricCard
                        id="test-metric"
                        label="Total"
                        value={100}
                        change={5}
                        changeType="increase"
                        icon="package"
                        color="success"
                    />
                )

                const svg = container.querySelector('svg')
                expect(svg).toBeInTheDocument()
            })
        })

        describe('when icon is alert-triangle', () => {
            it('should render AlertTriangle icon', () => {
                const { container } = render(
                    <MetricCard
                        id="test-metric"
                        label="Stock Faible"
                        value={10}
                        change={2}
                        changeType="decrease"
                        icon="alert-triangle"
                        color="warning"
                    />
                )

                const svg = container.querySelector('svg')
                expect(svg).toBeInTheDocument()
            })
        })

        describe('when icon is trending-up', () => {
            it('should render TrendingUp icon', () => {
                const { container } = render(
                    <MetricCard
                        id="test-metric"
                        label="Valeur"
                        value="€1000"
                        change={10}
                        changeType="increase"
                        icon="trending-up"
                        color="info"
                    />
                )

                const svg = container.querySelector('svg')
                expect(svg).toBeInTheDocument()
            })
        })
    })

    describe('Color variants', () => {
        describe('when color is success', () => {
            it('should apply success color classes', () => {
                const { container } = render(
                    <MetricCard
                        id="test-metric"
                        label="Total"
                        value={100}
                        change={5}
                        changeType="increase"
                        icon="package"
                        color="success"
                    />
                )

                const iconWrapper = container.querySelector('.p-3')
                expect(iconWrapper?.className).toContain('emerald')
            })
        })

        describe('when color is warning', () => {
            it('should apply warning color classes', () => {
                const { container } = render(
                    <MetricCard
                        id="test-metric"
                        label="Stock Faible"
                        value={10}
                        change={2}
                        changeType="decrease"
                        icon="alert-triangle"
                        color="warning"
                    />
                )

                const iconWrapper = container.querySelector('.p-3')
                expect(iconWrapper?.className).toContain('amber')
            })
        })

        describe('when color is info', () => {
            it('should apply info color classes', () => {
                const { container } = render(
                    <MetricCard
                        id="test-metric"
                        label="Valeur"
                        value="€1000"
                        change={10}
                        changeType="increase"
                        icon="trending-up"
                        color="info"
                    />
                )

                const iconWrapper = container.querySelector('.p-3')
                expect(iconWrapper?.className).toContain('blue')
            })
        })
    })

    describe('Change indicators', () => {
        describe('when changeType is increase', () => {
            it('should display positive change with + prefix', () => {
                render(
                    <MetricCard
                        id="test-metric"
                        label="Total"
                        value={100}
                        change={8}
                        changeType="increase"
                        icon="package"
                        color="success"
                    />
                )

                expect(screen.getByText('+8')).toBeInTheDocument()
            })

            it('should have emerald color for increase', () => {
                render(
                    <MetricCard
                        id="test-metric"
                        label="Total"
                        value={100}
                        change={8}
                        changeType="increase"
                        icon="package"
                        color="success"
                    />
                )

                const changeText = screen.getByText('+8').closest('span')
                expect(changeText?.className).toContain('emerald')
            })
        })

        describe('when changeType is decrease', () => {
            it('should display negative change with - prefix', () => {
                render(
                    <MetricCard
                        id="test-metric"
                        label="Stock"
                        value={10}
                        change={3}
                        changeType="decrease"
                        icon="alert-triangle"
                        color="warning"
                    />
                )

                expect(screen.getByText('-3')).toBeInTheDocument()
            })

            it('should have red color for decrease', () => {
                render(
                    <MetricCard
                        id="test-metric"
                        label="Stock"
                        value={10}
                        change={3}
                        changeType="decrease"
                        icon="alert-triangle"
                        color="warning"
                    />
                )

                const changeText = screen.getByText('-3').closest('span')
                expect(changeText?.className).toContain('red')
            })
        })
    })

    describe('Accessibility', () => {
        describe('when rendered', () => {
            it('should have proper region role', () => {
                render(
                    <MetricCard
                        id="total-products"
                        label="Total Produits"
                        value={248}
                        change={8}
                        changeType="increase"
                        icon="package"
                        color="success"
                    />
                )

                const region = screen.getByRole('region')
                expect(region).toBeInTheDocument()
                expect(region).toHaveAttribute('aria-labelledby', 'total-products')
            })

            it('should have accessible label for value', () => {
                render(
                    <MetricCard
                        id="metric-test"
                        label="Total Produits"
                        value={248}
                        change={8}
                        changeType="increase"
                        icon="package"
                        color="success"
                    />
                )

                const valueElement = screen.getByLabelText('Total Produits: 248')
                expect(valueElement).toBeInTheDocument()
            })
        })
    })

    describe('Value types', () => {
        describe('when value is a number', () => {
            it('should display numeric value', () => {
                render(
                    <MetricCard
                        id="test-metric"
                        label="Quantité"
                        value={156}
                        change={5}
                        changeType="increase"
                        icon="package"
                        color="success"
                    />
                )

                expect(screen.getByText('156')).toBeInTheDocument()
            })
        })

        describe('when value is a string', () => {
            it('should display string value (formatted currency)', () => {
                render(
                    <MetricCard
                        id="test-metric"
                        label="Valeur Totale"
                        value="€2,450"
                        change={10}
                        changeType="increase"
                        icon="trending-up"
                        color="info"
                    />
                )

                expect(screen.getByText('€2,450')).toBeInTheDocument()
            })
        })
    })

    describe('StockHub business use cases', () => {
        describe('when displaying total products metric', () => {
            it('should show total products with positive change', () => {
                render(
                    <MetricCard
                        id="total-products"
                        label="Total Produits"
                        value={248}
                        change={8}
                        changeType="increase"
                        icon="package"
                        color="success"
                    />
                )

                expect(screen.getByText('Total Produits')).toBeInTheDocument()
                expect(screen.getByText('248')).toBeInTheDocument()
                expect(screen.getByText('+8')).toBeInTheDocument()
            })
        })

        describe('when displaying low stock alert', () => {
            it('should show low stock count with warning style', () => {
                render(
                    <MetricCard
                        id="low-stock"
                        label="Stock Faible"
                        value={12}
                        change={3}
                        changeType="decrease"
                        icon="alert-triangle"
                        color="warning"
                    />
                )

                expect(screen.getByText('Stock Faible')).toBeInTheDocument()
                expect(screen.getByText('12')).toBeInTheDocument()
                expect(screen.getByText('-3')).toBeInTheDocument()
            })
        })

        describe('when displaying total value', () => {
            it('should show formatted currency value', () => {
                render(
                    <MetricCard
                        id="total-value"
                        label="Valeur Totale"
                        value="€15,240"
                        change={2}
                        changeType="increase"
                        icon="trending-up"
                        color="info"
                    />
                )

                expect(screen.getByText('Valeur Totale')).toBeInTheDocument()
                expect(screen.getByText('€15,240')).toBeInTheDocument()
            })
        })
    })
})