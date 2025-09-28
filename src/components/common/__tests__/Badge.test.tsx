import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'

// Import du VRAI composant Badge
import {Badge} from '../Badge'

// Mock du hook useTheme si nécessaire
vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'light' })
}))

describe('Badge Component', () => {

    describe('Basic rendering', () => {
        describe('when rendered with required props', () => {
            it('should display the badge content', () => {
                render(<Badge variant="success">Success Badge</Badge>)
                expect(screen.getByText('Success Badge')).toBeInTheDocument()
            })

            it('should apply base CSS classes', () => {
                render(<Badge variant="success">Badge</Badge>)
                const badge = screen.getByText('Badge')

                expect(badge).toHaveClass('rounded-full')
                expect(badge).toHaveClass('font-medium')
                expect(badge).toHaveClass('border')
                expect(badge).toHaveClass('px-3') // size md par défaut
                expect(badge).toHaveClass('py-1')
                expect(badge).toHaveClass('text-xs')
            })

            it('should use span as root element', () => {
                render(<Badge variant="success">Badge</Badge>)
                const badge = screen.getByText('Badge')
                expect(badge.tagName).toBe('SPAN')
            })
        })
    })

    describe('Variants', () => {
        describe('when variant is success', () => {
            it('should apply success color classes', () => {
                render(<Badge variant="success">Success</Badge>)
                const badge = screen.getByText('Success')

                // Les classes dépendent du thème mocké (light)
                expect(badge.className).toContain('emerald')
            })
        })

        describe('when variant is warning', () => {
            it('should apply warning color classes', () => {
                render(<Badge variant="warning">Warning</Badge>)
                const badge = screen.getByText('Warning')

                expect(badge.className).toContain('amber')
            })
        })

        describe('when variant is danger', () => {
            it('should apply danger color classes', () => {
                render(<Badge variant="danger">Danger</Badge>)
                const badge = screen.getByText('Danger')

                expect(badge.className).toContain('red')
            })
        })
    })

    describe('Content types', () => {
        describe('when content is simple text', () => {
            it('should display plain text correctly', () => {
                render(<Badge variant="success">Simple text</Badge>)
                expect(screen.getByText('Simple text')).toBeInTheDocument()
            })
        })

        describe('when content is numbers', () => {
            it('should display numeric content', () => {
                render(<Badge variant="warning">42</Badge>)
                expect(screen.getByText('42')).toBeInTheDocument()
            })

            it('should display negative numbers', () => {
                render(<Badge variant="danger">-3</Badge>)
                expect(screen.getByText('-3')).toBeInTheDocument()
            })
        })

        describe('when content has special characters', () => {
            it('should display percentage values', () => {
                render(<Badge variant="success">+15%</Badge>)
                expect(screen.getByText('+15%')).toBeInTheDocument()
            })
        })
    })

    describe('StockHub business use cases', () => {
        describe('when displaying stock status "Optimal"', () => {
            it('should use success variant', () => {
                render(<Badge variant="success">Optimal</Badge>)
                const badge = screen.getByText('Optimal')

                expect(badge).toBeInTheDocument()
                expect(badge.className).toContain('emerald')
            })
        })

        describe('when displaying stock status "Faible"', () => {
            it('should use warning variant', () => {
                render(<Badge variant="warning">Faible</Badge>)
                const badge = screen.getByText('Faible')

                expect(badge).toBeInTheDocument()
                expect(badge.className).toContain('amber')
            })
        })

        describe('when displaying stock status "Critique"', () => {
            it('should use danger variant', () => {
                render(<Badge variant="danger">Critique</Badge>)
                const badge = screen.getByText('Critique')

                expect(badge).toBeInTheDocument()
                expect(badge.className).toContain('red')
            })
        })

        describe('when displaying trend indicators', () => {
            it('should work for positive trends', () => {
                render(<Badge variant="success">+8</Badge>)
                const badge = screen.getByText('+8')
                expect(badge).toBeInTheDocument()
            })

            it('should work for negative trends', () => {
                render(<Badge variant="danger">-3</Badge>)
                const badge = screen.getByText('-3')
                expect(badge).toBeInTheDocument()
            })

            it('should work for percentage changes', () => {
                render(<Badge variant="success">+2%</Badge>)
                expect(screen.getByText('+2%')).toBeInTheDocument()
            })
        })

        describe('when displaying quantity alerts', () => {
            it('should indicate out of stock', () => {
                render(<Badge variant="danger">Rupture</Badge>)
                const badge = screen.getByText('Rupture')
                expect(badge.className).toContain('red')
            })

            it('should indicate low stock', () => {
                render(<Badge variant="warning">Stock faible</Badge>)
                const badge = screen.getByText('Stock faible')
                expect(badge.className).toContain('amber')
            })
        })
    })
})