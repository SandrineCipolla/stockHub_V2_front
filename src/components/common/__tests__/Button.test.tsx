import {fireEvent, render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {Plus, User} from 'lucide-react'


import {Button} from '../Button'

// Mock du hook useTheme pour éviter les erreurs de contexte
vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'light' })
}))

// Helper pour render avec le bon contexte
const renderButton = (component: React.ReactElement) => {
    return render(component)
}

describe('Button Component', () => {

    describe('Basic rendering', () => {
        describe('when rendered with default props', () => {
            it('should display the button text', () => {
                renderButton(<Button>Test Button</Button>)
                expect(screen.getByRole('button', { name: /test button/i })).toBeInTheDocument()
            })

            it('should apply base CSS classes', () => {
                renderButton(<Button>Button</Button>)
                const button = screen.getByRole('button')
                expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center', 'font-medium')
            })

            it('should use button HTML element', () => {
                renderButton(<Button>Button</Button>)
                const button = screen.getByRole('button')
                expect(button.tagName).toBe('BUTTON')
            })
        })
    })

    describe('Variants', () => {
        describe('when variant is primary (default)', () => {
            it('should apply purple background and white text', () => {
                renderButton(<Button>Primary Button</Button>)
                const button = screen.getByRole('button')
                expect(button).toHaveClass('bg-purple-600', 'text-white')
            })
        })

        describe('when variant is secondary', () => {
            it('should apply gray background and gray text', () => {
                renderButton(<Button variant="secondary">Secondary Button</Button>)
                const button = screen.getByRole('button')
                expect(button).toHaveClass('bg-gray-100', 'text-gray-700', 'border-gray-300')
            })
        })

        describe('when variant is ghost', () => {
            it('should apply transparent background', () => {
                renderButton(<Button variant="ghost">Ghost Button</Button>)
                const button = screen.getByRole('button')
                expect(button).toHaveClass('bg-transparent', 'text-gray-600')
            })
        })
    })

    describe('Sizes', () => {
        describe('when size is md (default)', () => {
            it('should apply medium padding and text size', () => {
                renderButton(<Button>Medium Button</Button>)
                const button = screen.getByRole('button')
                expect(button).toHaveClass('px-4', 'py-2', 'text-sm')
            })
        })

        describe('when size is sm', () => {
            it('should apply small padding', () => {
                renderButton(<Button size="sm">Small Button</Button>)
                const button = screen.getByRole('button')
                expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
            })
        })

        describe('when size is lg', () => {
            it('should apply large padding and text size', () => {
                renderButton(<Button size="lg">Large Button</Button>)
                const button = screen.getByRole('button')
                expect(button).toHaveClass('px-6', 'py-3', 'text-base')
            })
        })
    })

    describe('States and interactions', () => {
        describe('when disabled', () => {
            it('should be disabled in the DOM', () => {
                renderButton(<Button disabled>Disabled Button</Button>)
                const button = screen.getByRole('button')
                expect(button).toBeDisabled()
            })

            it('should apply disabled visual styles', () => {
                renderButton(<Button disabled>Disabled Button</Button>)
                const button = screen.getByRole('button')
                expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
            })

            it('should not trigger onClick when clicked', () => {
                const handleClick = vi.fn()
                renderButton(<Button disabled onClick={handleClick}>Disabled Button</Button>)
                const button = screen.getByRole('button')

                fireEvent.click(button)
                expect(handleClick).not.toHaveBeenCalled()
            })
        })

        describe('when enabled and clicked', () => {
            it('should call the onClick handler', () => {
                const handleClick = vi.fn()
                renderButton(<Button onClick={handleClick}>Clickable Button</Button>)
                const button = screen.getByRole('button')

                fireEvent.click(button)
                expect(handleClick).toHaveBeenCalledTimes(1)
            })
        })

        describe('when loading', () => {
            it('should show loading spinner instead of content', () => {
                renderButton(<Button loading>Loading Button</Button>)
                const button = screen.getByRole('button')
                const spinner = button.querySelector('.animate-spin')
                expect(spinner).toBeInTheDocument()
            })

            it('should be disabled when loading', () => {
                renderButton(<Button loading>Loading Button</Button>)
                const button = screen.getByRole('button')
                expect(button).toBeDisabled()
            })
        })
    })

    describe('Icons', () => {
        describe('when rendered with an icon', () => {
            it('should display the icon with correct size', () => {
                renderButton(<Button icon={User}>With Icon</Button>)
                const button = screen.getByRole('button')
                const icon = button.querySelector('svg')
                expect(icon).toBeInTheDocument()
                expect(icon).toHaveClass('w-4', 'h-4')
            })

            it('should display both icon and text', () => {
                renderButton(<Button icon={Plus}>Add Item</Button>)
                const button = screen.getByRole('button')

                expect(screen.getByText('Add Item')).toBeInTheDocument()
                expect(button.querySelector('svg')).toBeInTheDocument()
            })
        })

        describe('when rendered without an icon', () => {
            it('should not display any SVG element when not loading', () => {
                renderButton(<Button>Without Icon</Button>)
                const button = screen.getByRole('button')
                expect(button.querySelector('svg')).not.toBeInTheDocument()
            })
        })
    })

    describe('StockHub business use cases', () => {
        describe('when used as "Add Stock" button', () => {
            it('should work as primary button with icon', () => {
                renderButton(<Button variant="primary" icon={Plus}>Ajouter Stock</Button>)

                expect(screen.getByText('Ajouter Stock')).toBeInTheDocument()
                expect(screen.getByRole('button')).toHaveClass('bg-purple-600')
            })
        })

        describe('when used as "Export" button', () => {
            it('should work as small secondary button', () => {
                renderButton(<Button variant="secondary" size="sm">Exporter</Button>)

                const button = screen.getByText('Exporter')
                expect(button).toHaveClass('bg-gray-100', 'px-3', 'py-1.5')
            })
        })

        describe('when used as "View Details" button', () => {
            it('should work as large ghost button', () => {
                renderButton(<Button variant="ghost" size="lg">Voir Détails</Button>)

                const button = screen.getByText('Voir Détails')
                expect(button).toHaveClass('bg-transparent', 'px-6', 'py-3')
            })
        })
    })
})