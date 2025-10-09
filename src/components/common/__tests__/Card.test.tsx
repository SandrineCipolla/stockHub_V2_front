import {fireEvent, render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'


import {Card} from '../Card'


vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'light' })
}))

describe('Card Component', () => {

    describe('Basic rendering', () => {
        describe('when rendered with default props', () => {
            it('should display the child content', () => {
                render(
                    <Card>
                        <h2>Card Title</h2>
                        <p>Card content</p>
                    </Card>
                )

                expect(screen.getByText('Card Title')).toBeInTheDocument()
                expect(screen.getByText('Card content')).toBeInTheDocument()
            })

            it('should apply base CSS classes', () => {
                render(<Card>Test content</Card>)

                const card = screen.getByText('Test content').closest('div')

                // Classes toujours présentes
                expect(card).toHaveClass('backdrop-blur-sm')
                expect(card).toHaveClass('border')
                expect(card).toHaveClass('rounded-xl')
                expect(card).toHaveClass('p-6')
                expect(card).toHaveClass('transition-all')
                expect(card).toHaveClass('duration-300')

                // Classes pour le thème clair (mockées)
                expect(card).toHaveClass('bg-white/80')
                expect(card).toHaveClass('border-gray-200')
                expect(card).toHaveClass('shadow-sm')
            })

            it('should use div as root element', () => {
                render(<Card>Content</Card>)
                const card = screen.getByText('Content').closest('div')
                expect(card?.tagName).toBe('DIV')
            })
        })
    })

    describe('Hover behavior', () => {
        describe('when hover is true (default)', () => {
            it('should apply hover classes', () => {
                render(<Card>Content</Card>)
                const card = screen.getByText('Content').closest('div')

                // Pour thème clair
                expect(card).toHaveClass('hover:-translate-y-1')
                expect(card).toHaveClass('hover:bg-white')
                expect(card).toHaveClass('hover:border-purple-300')
                expect(card).toHaveClass('hover:shadow-md')
            })
        })

        describe('when hover is false', () => {
            it('should not apply hover classes', () => {
                render(<Card hover={false}>Content</Card>)
                const card = screen.getByText('Content').closest('div')

                expect(card).not.toHaveClass('hover:-translate-y-1')
                expect(card).not.toHaveClass('hover:bg-white')
            })
        })
    })

    describe('Interactions', () => {
        describe('when onClick is provided', () => {
            it('should be clickable and call onClick', () => {
                const handleClick = vi.fn()
                render(<Card onClick={handleClick}>Clickable Card</Card>)
                const card = screen.getByText('Clickable Card').closest('div')

                expect(card).toHaveClass('cursor-pointer')
                expect(card).toHaveAttribute('tabIndex', '0')

                fireEvent.click(card!)
                expect(handleClick).toHaveBeenCalledTimes(1)
            })

            it('should handle keyboard interactions', () => {
                const handleClick = vi.fn()
                render(<Card onClick={handleClick}>Keyboard Card</Card>)
                const card = screen.getByText('Keyboard Card').closest('div')

                fireEvent.keyDown(card!, { key: 'Enter' })
                expect(handleClick).toHaveBeenCalledTimes(1)

                fireEvent.keyDown(card!, { key: ' ' })
                expect(handleClick).toHaveBeenCalledTimes(2)
            })
        })

        describe('when onClick is not provided', () => {
            it('should not be clickable', () => {
                render(<Card>Non-clickable Card</Card>)
                const card = screen.getByText('Non-clickable Card').closest('div')

                expect(card).not.toHaveClass('cursor-pointer')
                expect(card).not.toHaveAttribute('tabIndex')
            })
        })
    })

    describe('Custom styling', () => {
        describe('when custom className is provided', () => {
            it('should apply additional CSS classes', () => {
                render(<Card className="custom-class bg-red-500">Content</Card>)
                const card = screen.getByText('Content').closest('div')

                expect(card).toHaveClass('custom-class', 'bg-red-500')
            })

            it('should preserve base classes with custom classes', () => {
                render(<Card className="my-custom-class">Content</Card>)
                const card = screen.getByText('Content').closest('div')

                expect(card).toHaveClass('my-custom-class')
                expect(card).toHaveClass('backdrop-blur-sm', 'border', 'rounded-xl')
            })
        })
    })

    describe('Accessibility', () => {
        describe('when ARIA props are provided', () => {
            it('should apply role attribute', () => {
                render(<Card role="button">Card with role</Card>)
                const card = screen.getByText('Card with role').closest('div')
                expect(card).toHaveAttribute('role', 'button')
            })

            it('should apply aria-labelledby', () => {
                render(<Card aria-labelledby="label-id">Card with label</Card>)
                const card = screen.getByText('Card with label').closest('div')
                expect(card).toHaveAttribute('aria-labelledby', 'label-id')
            })
        })
    })

    describe('StockHub business use cases', () => {
        describe('when used as metric card', () => {
            it('should display stock metrics correctly', () => {
                render(
                    <Card>
                        <div>
                            <h3>Total Produits</h3>
                            <div>248</div>
                            <span>+8 ce mois</span>
                        </div>
                    </Card>
                )

                expect(screen.getByText('Total Produits')).toBeInTheDocument()
                expect(screen.getByText('248')).toBeInTheDocument()
                expect(screen.getByText('+8 ce mois')).toBeInTheDocument()
            })
        })

        describe('when used as clickable stock item card', () => {
            it('should handle stock item interactions', () => {
                const onStockClick = vi.fn()

                render(
                    <Card onClick={onStockClick} role="button" aria-labelledby="stock-title">
                        <div>
                            <h4 id="stock-title">MyFirstStock</h4>
                            <p>Quantité: 156</p>
                            <p>Valeur: 2450€</p>
                            <span>Status: Optimal</span>
                        </div>
                    </Card>
                )

                expect(screen.getByText('MyFirstStock')).toBeInTheDocument()
                expect(screen.getByText('Quantité: 156')).toBeInTheDocument()
                expect(screen.getByText('Valeur: 2450€')).toBeInTheDocument()
                expect(screen.getByText('Status: Optimal')).toBeInTheDocument()

                // Test interaction
                const card = screen.getByText('MyFirstStock').closest('[role="button"]')
                fireEvent.click(card!)
                expect(onStockClick).toHaveBeenCalledTimes(1)
            })
        })
    })
})