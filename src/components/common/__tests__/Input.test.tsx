import {fireEvent, render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {Mail, Search} from 'lucide-react'

// Import du VRAI composant Input
import {Input} from '../Input'

// Mock du hook useTheme
vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({ theme: 'light' })
}))

describe('Input Component', () => {

    describe('Basic rendering', () => {
        describe('when rendered with minimal props', () => {
            it('should render an input element', () => {
                render(<Input placeholder="Test input" />)
                const input = screen.getByPlaceholderText('Test input')
                expect(input).toBeInTheDocument()
                expect(input.tagName).toBe('INPUT')
            })

            it('should apply base CSS classes', () => {
                render(<Input placeholder="Test" />)
                const input = screen.getByPlaceholderText('Test')
                expect(input).toHaveClass('w-full', 'px-4', 'py-3', 'rounded-xl', 'transition-all')
            })
        })

        describe('when label is provided', () => {
            it('should display the label', () => {
                render(<Input label="Email" placeholder="email@example.com" />)
                expect(screen.getByText('Email')).toBeInTheDocument()
            })

            it('should associate label with input via htmlFor', () => {
                render(<Input label="Email" id="email-input" placeholder="test" />)
                const label = screen.getByText('Email')
                expect(label).toHaveAttribute('for', 'email-input')
            })

            it('should generate unique ID if not provided', () => {
                render(<Input label="Test" placeholder="test" />)
                const input = screen.getByPlaceholderText('test')
                expect(input).toHaveAttribute('id')
                expect(input.id).toMatch(/^input-/)
            })
        })
    })

    describe('Icon handling', () => {
        describe('when icon is provided', () => {
            it('should render the icon', () => {
                const { container } = render(<Input icon={Search} placeholder="Search" />)
                const icon = container.querySelector('svg')
                expect(icon).toBeInTheDocument()
                expect(icon).toHaveClass('w-4', 'h-4')
            })

            it('should adjust input padding for icon', () => {
                render(<Input icon={Mail} placeholder="Email" />)
                const input = screen.getByPlaceholderText('Email')
                expect(input).toHaveClass('pl-10')
            })

            it('should hide icon from screen readers', () => {
                const { container } = render(<Input icon={Search} placeholder="Search" />)
                const icon = container.querySelector('svg')
                expect(icon).toHaveAttribute('aria-hidden', 'true')
            })
        })

        describe('when icon is not provided', () => {
            it('should not adjust padding', () => {
                render(<Input placeholder="No icon" />)
                const input = screen.getByPlaceholderText('No icon')
                expect(input).not.toHaveClass('pl-10')
            })
        })
    })

    describe('Error state', () => {
        describe('when error is provided', () => {
            it('should display the error message', () => {
                render(<Input error="This field is required" placeholder="test" />)
                const errorMsg = screen.getByText('This field is required')
                expect(errorMsg).toBeInTheDocument()
                expect(errorMsg).toHaveClass('text-red-500')
            })

            it('should have role alert on error message', () => {
                render(<Input error="Invalid input" placeholder="test" />)
                const errorMsg = screen.getByRole('alert')
                expect(errorMsg).toHaveTextContent('Invalid input')
            })

            it('should apply error styles to input', () => {
                render(<Input error="Error" placeholder="test" />)
                const input = screen.getByPlaceholderText('test')
                expect(input).toHaveClass('border-red-500')
            })

            it('should set aria-invalid to true', () => {
                render(<Input error="Error" placeholder="test" />)
                const input = screen.getByPlaceholderText('test')
                expect(input).toHaveAttribute('aria-invalid', 'true')
            })

            it('should link error to input via aria-describedby', () => {
                render(<Input id="test-input" error="Error message" placeholder="test" />)
                const input = screen.getByPlaceholderText('test')
                expect(input).toHaveAttribute('aria-describedby', 'test-input-error')
            })
        })

        describe('when no error', () => {
            it('should not display error message', () => {
                render(<Input placeholder="test" />)
                expect(screen.queryByRole('alert')).not.toBeInTheDocument()
            })

            it('should set aria-invalid to false', () => {
                render(<Input placeholder="test" />)
                const input = screen.getByPlaceholderText('test')
                expect(input).toHaveAttribute('aria-invalid', 'false')
            })

            it('should apply focus ring classes', () => {
                render(<Input placeholder="test" />)
                const input = screen.getByPlaceholderText('test')
                expect(input).toHaveClass('focus:ring-2', 'focus:ring-purple-500')
            })
        })
    })

    describe('Helper text', () => {
        describe('when helperText is provided', () => {
            it('should display helper text', () => {
                render(<Input helperText="Enter your email address" placeholder="test" />)
                expect(screen.getByText('Enter your email address')).toBeInTheDocument()
            })

            it('should link helper text to input via aria-describedby', () => {
                render(<Input id="test-input" helperText="Helper" placeholder="test" />)
                const input = screen.getByPlaceholderText('test')
                expect(input).toHaveAttribute('aria-describedby', 'test-input-helper')
            })
        })

        describe('when both error and helperText provided', () => {
            it('should show error instead of helper text', () => {
                render(
                    <Input
                        error="Error message"
                        helperText="Helper text"
                        placeholder="test"
                    />
                )
                expect(screen.getByText('Error message')).toBeInTheDocument()
                expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
            })

            it('should link error to input, not helper text', () => {
                render(
                    <Input
                        id="test-input"
                        error="Error"
                        helperText="Helper"
                        placeholder="test"
                    />
                )
                const input = screen.getByPlaceholderText('test')
                expect(input).toHaveAttribute('aria-describedby', 'test-input-error')
            })
        })
    })

    describe('User interactions', () => {
        describe('when user types', () => {
            it('should update input value', () => {
                render(<Input placeholder="Type here" />)
                const input = screen.getByPlaceholderText('Type here') as HTMLInputElement

                fireEvent.change(input, { target: { value: 'Hello World' } })
                expect(input.value).toBe('Hello World')
            })

            it('should call onChange handler', () => {
                const handleChange = vi.fn()
                render(<Input onChange={handleChange} placeholder="test" />)
                const input = screen.getByPlaceholderText('test')

                fireEvent.change(input, { target: { value: 'test' } })
                expect(handleChange).toHaveBeenCalledTimes(1)
            })
        })

        describe('when input is focused', () => {
            it('should call onFocus handler', () => {
                const handleFocus = vi.fn()
                render(<Input onFocus={handleFocus} placeholder="test" />)
                const input = screen.getByPlaceholderText('test')

                fireEvent.focus(input)
                expect(handleFocus).toHaveBeenCalledTimes(1)
            })
        })

        describe('when input is blurred', () => {
            it('should call onBlur handler', () => {
                const handleBlur = vi.fn()
                render(<Input onBlur={handleBlur} placeholder="test" />)
                const input = screen.getByPlaceholderText('test')

                fireEvent.blur(input)
                expect(handleBlur).toHaveBeenCalledTimes(1)
            })
        })
    })

    describe('HTML input attributes', () => {
        describe('when standard input props are provided', () => {
            it('should support type attribute', () => {
                render(<Input type="email" placeholder="test" />)
                const input = screen.getByPlaceholderText('test')
                expect(input).toHaveAttribute('type', 'email')
            })

            it('should support disabled attribute', () => {
                render(<Input disabled placeholder="test" />)
                const input = screen.getByPlaceholderText('test')
                expect(input).toBeDisabled()
            })

            it('should support required attribute', () => {
                render(<Input required placeholder="test" />)
                const input = screen.getByPlaceholderText('test')
                expect(input).toBeRequired()
            })

            it('should support maxLength attribute', () => {
                render(<Input maxLength={10} placeholder="test" />)
                const input = screen.getByPlaceholderText('test')
                expect(input).toHaveAttribute('maxLength', '10')
            })
        })
    })

    describe('Custom styling', () => {
        describe('when custom className is provided', () => {
            it('should apply additional classes', () => {
                render(<Input className="custom-class" placeholder="test" />)
                const input = screen.getByPlaceholderText('test')
                expect(input.className).toContain('custom-class')
            })
        })
    })

    describe('StockHub business use cases', () => {
        describe('when used as search input', () => {
            it('should work with search icon and placeholder', () => {
                render(
                    <Input
                        icon={Search}
                        placeholder="Rechercher un produit..."
                        type="search"
                    />
                )
                const input = screen.getByPlaceholderText('Rechercher un produit...')
                expect(input).toHaveAttribute('type', 'search')
                expect(input).toHaveClass('pl-10')
            })
        })

        describe('when used in form with validation', () => {
            it('should display validation error', () => {
                render(
                    <Input
                        label="Quantité"
                        type="number"
                        error="La quantité doit être positive"
                        placeholder="0"
                    />
                )

                expect(screen.getByText('Quantité')).toBeInTheDocument()
                expect(screen.getByText('La quantité doit être positive')).toBeInTheDocument()
                expect(screen.getByPlaceholderText('0')).toHaveAttribute('aria-invalid', 'true')
            })
        })

        describe('when used with helper text for guidance', () => {
            it('should provide contextual help', () => {
                render(
                    <Input
                        label="Nom du stock"
                        helperText="Choisissez un nom descriptif pour votre stock"
                        placeholder="Ex: Stock Cuisine"
                    />
                )

                expect(screen.getByText('Nom du stock')).toBeInTheDocument()
                expect(screen.getByText('Choisissez un nom descriptif pour votre stock')).toBeInTheDocument()
            })
        })
    })
})