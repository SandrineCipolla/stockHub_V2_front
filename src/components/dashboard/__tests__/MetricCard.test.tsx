import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'

import {MetricCard} from '../MetricCard'
import {metricChanges, metricColors, metricIcons, metricLabels, stockHubMetricUseCases} from '@/test/fixtures/metric'

vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'light' })
}))

describe('MetricCard Component', () => {

    describe('Basic rendering', () => {
        describe('when rendered with required props', () => {
            it('should display the metric label', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} />)

                expect(screen.getByText(metric.label)).toBeInTheDocument()
            })

            it('should display the metric value', () => {
                const metric = stockHubMetricUseCases.lowStockAlert
                render(<MetricCard {...metric} />)

                expect(screen.getByText(String(metric.value))).toBeInTheDocument()
            })

            it('should display the change value', () => {
                render(
                    <MetricCard
                        id="test-metric"
                        label={metricLabels.trending}
                        value={100}
                        change={metricChanges.small}
                        changeType="increase"
                        icon={metricIcons[2]}
                        color={metricColors[2]}
                    />
                )

                expect(screen.getByText('+2')).toBeInTheDocument()
            })
        })
    })

    describe('Icons', () => {
        describe('when icon is package', () => {
            it('should render Package icon', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                const { container } = render(<MetricCard {...metric} />)

                const svg = container.querySelector('svg')
                expect(svg).toBeInTheDocument()
            })
        })

        describe('when icon is alert-triangle', () => {
            it('should render AlertTriangle icon', () => {
                const metric = stockHubMetricUseCases.lowStockAlert
                const { container } = render(<MetricCard {...metric} />)

                const svg = container.querySelector('svg')
                expect(svg).toBeInTheDocument()
            })
        })

        describe('when icon is trending-up', () => {
            it('should render TrendingUp icon', () => {
                const metric = stockHubMetricUseCases.totalValueMetric
                const { container } = render(<MetricCard {...metric} />)

                const svg = container.querySelector('svg')
                expect(svg).toBeInTheDocument()
            })
        })
    })

    describe('Color variants', () => {
        describe('when color is success', () => {
            it('should apply success color classes', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                const { container } = render(<MetricCard {...metric} />)

                const iconWrapper = container.querySelector('.p-3')
                expect(iconWrapper?.className).toContain('emerald')
            })
        })

        describe('when color is warning', () => {
            it('should apply warning color classes', () => {
                const metric = stockHubMetricUseCases.lowStockAlert
                const { container } = render(<MetricCard {...metric} />)

                const iconWrapper = container.querySelector('.p-3')
                expect(iconWrapper?.className).toContain('amber')
            })
        })

        describe('when color is info', () => {
            it('should apply info color classes', () => {
                const metric = stockHubMetricUseCases.totalValueMetric
                const { container } = render(<MetricCard {...metric} />)

                const iconWrapper = container.querySelector('.p-3')
                expect(iconWrapper?.className).toContain('blue')
            })
        })
    })

    describe('Change indicators', () => {
        describe('when changeType is increase', () => {
            it('should display positive change with + prefix', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} />)

                expect(screen.getByText(`+${metric.change}`)).toBeInTheDocument()
            })

            it('should have emerald color for increase', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} />)

                const changeText = screen.getByText(`+${metric.change}`).closest('span')
                expect(changeText?.className).toContain('emerald')
            })
        })

        describe('when changeType is decrease', () => {
            it('should display negative change with - prefix', () => {
                const metric = stockHubMetricUseCases.criticalStockAlert
                render(<MetricCard {...metric} />)

                expect(screen.getByLabelText(/Évolution négative.*-8/)).toBeInTheDocument()
            })

            it('should have red color for decrease', () => {
                const metric = stockHubMetricUseCases.decreasingMetric
                render(<MetricCard {...metric} />)

                const changeText = screen.getByLabelText(/Évolution négative/)
                expect(changeText?.className).toContain('red')
            })
        })
    })

    describe('Accessibility', () => {
        describe('when rendered', () => {
            it('should have proper region role', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} />)

                const region = screen.getByRole('region')
                expect(region).toBeInTheDocument()
                expect(region).toHaveAttribute('aria-labelledby', metric.id)
            })

            it('should have accessible label for value', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} />)

                const valueElement = screen.getByLabelText(`${metric.label}: ${metric.value}`)
                expect(valueElement).toBeInTheDocument()
            })
        })
    })

    describe('Value types', () => {
        describe('when value is a number', () => {
            it('should display numeric value', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} />)

                expect(screen.getByText(String(metric.value))).toBeInTheDocument()
            })
        })

        describe('when value is a string', () => {
            it('should display string value (formatted currency)', () => {
                const metric = stockHubMetricUseCases.totalValueMetric
                render(<MetricCard {...metric} />)

                expect(screen.getByText(String(metric.value))).toBeInTheDocument()
            })
        })
    })

    describe('StockHub business use cases', () => {
        describe('when displaying total products metric', () => {
            it('should show total products with positive change', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} />)

                expect(screen.getByText(metric.label)).toBeInTheDocument()
                expect(screen.getByText(String(metric.value))).toBeInTheDocument()
                expect(screen.getByText(`+${metric.change}`)).toBeInTheDocument()
            })
        })

        describe('when displaying low stock alert', () => {
            it('should show low stock count with warning style', () => {
                const metric = stockHubMetricUseCases.lowStockAlert
                render(<MetricCard {...metric} />)

                expect(screen.getByText(metric.label)).toBeInTheDocument()
                expect(screen.getByText(String(metric.value))).toBeInTheDocument()
                expect(screen.getByText(`+${metric.change}`)).toBeInTheDocument()
            })
        })

        describe('when displaying total value', () => {
            it('should show formatted currency value', () => {
                const metric = stockHubMetricUseCases.totalValueMetric
                render(<MetricCard {...metric} />)

                expect(screen.getByText(metric.label)).toBeInTheDocument()
                expect(screen.getByText(String(metric.value))).toBeInTheDocument()
            })
        })
    })
})