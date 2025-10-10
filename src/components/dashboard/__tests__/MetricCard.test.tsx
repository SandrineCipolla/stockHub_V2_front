import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'

import {MetricCard} from '../MetricCard'
import {stockHubMetricUseCases} from '@/test/fixtures/metric'

vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'light' })
}))

describe('MetricCard Component', () => {

    describe('Basic rendering', () => {
        describe('when rendered with required props', () => {
            it('should display the metric title', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} enableAnimation={false} />)

                expect(screen.getByText(metric.title)).toBeInTheDocument()
            })

            it('should display the metric value', () => {
                const metric = stockHubMetricUseCases.lowStockAlert
                render(<MetricCard {...metric} enableAnimation={false} />)

                expect(screen.getByText(String(metric.value))).toBeInTheDocument()
            })

            it('should display the change value when provided', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} enableAnimation={false} />)

                if (metric.change) {
                    const changeText = metric.change.type === 'increase' ? `+${metric.change.value}` : `-${metric.change.value}`;
                    expect(screen.getByText(changeText)).toBeInTheDocument()
                }
            })
        })
    })

    describe('Icons', () => {
        describe('when icon is package', () => {
            it('should render Package icon', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                const { container } = render(<MetricCard {...metric} enableAnimation={false} />)

                const svg = container.querySelector('svg')
                expect(svg).toBeInTheDocument()
            })
        })

        describe('when icon is alert-triangle', () => {
            it('should render AlertTriangle icon', () => {
                const metric = stockHubMetricUseCases.lowStockAlert
                const { container } = render(<MetricCard {...metric} enableAnimation={false} />)

                const svg = container.querySelector('svg')
                expect(svg).toBeInTheDocument()
            })
        })

        describe('when icon is trending-up', () => {
            it('should render TrendingUp icon', () => {
                const metric = stockHubMetricUseCases.totalValueMetric
                const { container } = render(<MetricCard {...metric} enableAnimation={false} />)

                const svg = container.querySelector('svg')
                expect(svg).toBeInTheDocument()
            })
        })
    })

    describe('Color variants', () => {
        describe('when color is success', () => {
            it('should apply success color classes', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                const { container } = render(<MetricCard {...metric} enableAnimation={false} />)

                const iconWrapper = container.querySelector('.p-3')
                expect(iconWrapper?.className).toContain('emerald')
            })
        })

        describe('when color is warning', () => {
            it('should apply warning color classes', () => {
                const metric = stockHubMetricUseCases.lowStockAlert
                const { container } = render(<MetricCard {...metric} enableAnimation={false} />)

                const iconWrapper = container.querySelector('.p-3')
                expect(iconWrapper?.className).toContain('amber')
            })
        })

        describe('when color is info', () => {
            it('should apply info color classes', () => {
                const metric = stockHubMetricUseCases.totalValueMetric
                const { container } = render(<MetricCard {...metric} enableAnimation={false} />)

                const iconWrapper = container.querySelector('.p-3')
                expect(iconWrapper?.className).toContain('blue')
            })
        })
    })

    describe('Change indicators', () => {
        describe('when change type is increase', () => {
            it('should display positive change with + prefix', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} enableAnimation={false} />)

                if (metric.change && metric.change.type === 'increase') {
                    expect(screen.getByText(`+${metric.change.value}`)).toBeInTheDocument()
                }
            })

            it('should have emerald color for increase', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} enableAnimation={false} />)

                if (metric.change && metric.change.type === 'increase') {
                    const changeText = screen.getByText(`+${metric.change.value}`).closest('span')
                    expect(changeText?.className).toContain('emerald')
                }
            })
        })

        describe('when change type is decrease', () => {
            it('should display negative change', () => {
                const metric = stockHubMetricUseCases.decreasingMetric
                render(<MetricCard {...metric} enableAnimation={false} />)

                if (metric.change && metric.change.type === 'decrease') {
                    expect(screen.getByText(`-${metric.change.value}`)).toBeInTheDocument()
                }
            })

            it('should have red color for decrease', () => {
                const metric = stockHubMetricUseCases.decreasingMetric
                render(<MetricCard {...metric} enableAnimation={false} />)

                if (metric.change && metric.change.type === 'decrease') {
                    const changeText = screen.getByText(`-${metric.change.value}`).closest('span')
                    expect(changeText?.className).toContain('red')
                }
            })
        })
    })

    describe('Value types', () => {
        describe('when value is a number', () => {
            it('should display numeric value', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} enableAnimation={false} />)

                expect(screen.getByText(String(metric.value))).toBeInTheDocument()
            })
        })

        describe('when value is a string', () => {
            it('should display string value (formatted currency)', () => {
                const metric = stockHubMetricUseCases.totalValueMetric
                render(<MetricCard {...metric} enableAnimation={false} />)

                expect(screen.getByText(String(metric.value))).toBeInTheDocument()
            })
        })
    })

    describe('StockHub business use cases', () => {
        describe('when displaying total products metric', () => {
            it('should show total products with positive change', () => {
                const metric = stockHubMetricUseCases.totalStockMetric
                render(<MetricCard {...metric} enableAnimation={false} />)

                expect(screen.getByText(metric.title)).toBeInTheDocument()
                expect(screen.getByText(String(metric.value))).toBeInTheDocument()
                if (metric.change) {
                    expect(screen.getByText(`+${metric.change.value}`)).toBeInTheDocument()
                }
            })
        })

        describe('when displaying low stock alert', () => {
            it('should show low stock count with warning style', () => {
                const metric = stockHubMetricUseCases.lowStockAlert
                render(<MetricCard {...metric} enableAnimation={false} />)

                expect(screen.getByText(metric.title)).toBeInTheDocument()
                expect(screen.getByText(String(metric.value))).toBeInTheDocument()
                if (metric.change) {
                    expect(screen.getByText(`+${metric.change.value}`)).toBeInTheDocument()
                }
            })
        })

        describe('when displaying total value', () => {
            it('should show formatted currency value', () => {
                const metric = stockHubMetricUseCases.totalValueMetric
                render(<MetricCard {...metric} enableAnimation={false} />)

                expect(screen.getByText(metric.title)).toBeInTheDocument()
                expect(screen.getByText(String(metric.value))).toBeInTheDocument()
            })
        })
    })
})