import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { ButtonVariant, ButtonSize } from '@/types';

// Types pour les props du composant
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ElementType;
    loading?: boolean;
    children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
                                                  variant = 'primary',
                                                  size = 'md',
                                                  icon: Icon,
                                                  loading = false,
                                                  children,
                                                  className = '',
                                                  disabled,
                                                  ...props
                                              }) => {
    const { theme } = useTheme();

    const baseClasses =
        "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants: Record<ButtonVariant, string> = {
        primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg",
        secondary: theme === 'dark'
            ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
        ghost: theme === 'dark'
            ? "bg-transparent hover:bg-white/10 text-gray-300 hover:text-white"
            : "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900"
    };

    const sizes: Record<ButtonSize, string> = {
        sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
        md: "px-4 py-2 text-sm rounded-lg gap-2",
        lg: "px-6 py-3 text-base rounded-xl gap-2"
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                />
            ) : Icon ? (
                <Icon className="w-4 h-4" aria-hidden="true" />
            ) : null}
            {children}
        </button>
    );
};