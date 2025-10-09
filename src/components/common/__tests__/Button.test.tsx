import {describe, expect, it, vi} from 'vitest';
import {fireEvent, screen} from '@testing-library/react';

import {renderComponent} from '@/test/fixtures/helpers/renderWithProviders';
import {testIcons} from "@/test/fixtures/icon";
import {stockHubButtonUseCases} from "@/test/fixtures/button";
import {Button} from "@/components/common/Button";

vi.mock('@/hooks/useTheme', () => ({
    useTheme: () => ({
        theme: 'light',
        toggleTheme: vi.fn()
    })
}));

describe('Button Component', () => {

    describe('Basic rendering', () => {
        describe('when rendered with default props', () => {
            it('should display the button text', () => {
                renderComponent(<Button>Test Button</Button>);
                expect(screen.getByRole('button', { name: /test button/i })).toBeInTheDocument();
            });

            it('should apply base CSS classes', () => {
                renderComponent(<Button>Button</Button>);
                const button = screen.getByRole('button');
                expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center', 'font-medium');
            });

            it('should use button HTML element', () => {
                renderComponent(<Button>Button</Button>);
                const button = screen.getByRole('button');
                expect(button.tagName).toBe('BUTTON');
            });
        });
    });

    describe('Variants', () => {
        describe('when variant is primary (default)', () => {
            it('should apply purple background and white text', () => {
                renderComponent(<Button>Primary Button</Button>);
                const button = screen.getByRole('button');
                expect(button).toHaveClass('bg-purple-600', 'text-white');
            });
        });

        describe('when variant is secondary', () => {
            it('should apply gray background and gray text', () => {
                renderComponent(<Button variant="secondary">Secondary Button</Button>);
                const button = screen.getByRole('button');
                expect(button).toHaveClass('bg-gray-100', 'text-gray-700', 'border-gray-300');
            });
        });

        describe('when variant is ghost', () => {
            it('should apply transparent background', () => {
                renderComponent(<Button variant="ghost">Ghost Button</Button>);
                const button = screen.getByRole('button');
                expect(button).toHaveClass('bg-transparent', 'text-gray-600');
            });
        });
    });

    describe('Sizes', () => {
        describe('when size is md (default)', () => {
            it('should apply medium padding and text size', () => {
                renderComponent(<Button>Medium Button</Button>);
                const button = screen.getByRole('button');
                expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
            });
        });

        describe('when size is sm', () => {
            it('should apply small padding', () => {
                renderComponent(<Button size="sm">Small Button</Button>);
                const button = screen.getByRole('button');
                expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
            });
        });

        describe('when size is lg', () => {
            it('should apply large padding and text size', () => {
                renderComponent(<Button size="lg">Large Button</Button>);
                const button = screen.getByRole('button');
                expect(button).toHaveClass('px-6', 'py-3', 'text-base');
            });
        });
    });

    describe('States and interactions', () => {
        describe('when disabled', () => {
            it('should be disabled in the DOM', () => {
                renderComponent(<Button disabled>Disabled Button</Button>);
                const button = screen.getByRole('button');
                expect(button).toBeDisabled();
            });

            it('should apply disabled visual styles', () => {
                renderComponent(<Button disabled>Disabled Button</Button>);
                const button = screen.getByRole('button');
                expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
            });

            it('should not trigger onClick when clicked', () => {
                const handleClick = vi.fn();
                renderComponent(<Button disabled onClick={handleClick}>Disabled Button</Button>);
                const button = screen.getByRole('button');

                fireEvent.click(button);
                expect(handleClick).not.toHaveBeenCalled();
            });
        });

        describe('when enabled and clicked', () => {
            it('should call the onClick handler', () => {
                const handleClick = vi.fn();
                renderComponent(<Button onClick={handleClick}>Clickable Button</Button>);
                const button = screen.getByRole('button');

                fireEvent.click(button);
                expect(handleClick).toHaveBeenCalledTimes(1);
            });
        });

        describe('when loading', () => {
            it('should show loading spinner instead of content', () => {
                renderComponent(<Button loading>Loading Button</Button>);
                const button = screen.getByRole('button');
                const spinner = button.querySelector('.animate-spin');
                expect(spinner).toBeInTheDocument();
            });

            it('should be disabled when loading', () => {
                renderComponent(<Button loading>Loading Button</Button>);
                const button = screen.getByRole('button');
                expect(button).toBeDisabled();
            });
        });
    });

    describe('Icons', () => {
        describe('when rendered with an icon', () => {
            it('should display the icon with correct size', () => {
                renderComponent(<Button icon={testIcons.user}>With Icon</Button>);
                const button = screen.getByRole('button');
                const icon = button.querySelector('svg');
                expect(icon).toBeInTheDocument();
                expect(icon).toHaveClass('w-4', 'h-4');
            });

            it('should display both icon and text', () => {
                renderComponent(<Button icon={testIcons.add}>Add Item</Button>);
                const button = screen.getByRole('button');

                expect(screen.getByText('Add Item')).toBeInTheDocument();
                expect(button.querySelector('svg')).toBeInTheDocument();
            });
        });

        describe('when rendered without an icon', () => {
            it('should not display any SVG element when not loading', () => {
                renderComponent(<Button>Without Icon</Button>);
                const button = screen.getByRole('button');
                expect(button.querySelector('svg')).not.toBeInTheDocument();
            });
        });
    });

    describe('StockHub business use cases', () => {
        describe('when used as "Add Stock" button', () => {
            it('should work as primary button with icon', () => {
                const { variant, label } = stockHubButtonUseCases.addStock;
                renderComponent(
                    <Button variant={variant} icon={testIcons.add}>
                        {label}
                    </Button>
                );

                expect(screen.getByText(label)).toBeInTheDocument();
                expect(screen.getByRole('button')).toHaveClass('bg-purple-600');
            });
        });

        describe('when used as "Export" button', () => {
            it('should work as small secondary button', () => {
                const { variant, label } = stockHubButtonUseCases.export;
                renderComponent(
                    <Button variant={variant} size="sm">
                        {label}
                    </Button>
                );

                const button = screen.getByRole('button');
                expect(button).toHaveClass('bg-gray-100', 'px-3', 'py-1.5');
            });
        });

        describe('when used as "View Details" button', () => {
            it('should work as large ghost button', () => {
                const { variant, label } = stockHubButtonUseCases.viewDetails;
                renderComponent(
                    <Button variant={variant} size="lg">
                        {label}
                    </Button>
                );

                const button = screen.getByRole('button');
                expect(button).toHaveClass('bg-transparent', 'px-6', 'py-3');
            });
        });
    });
});