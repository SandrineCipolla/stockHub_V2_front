import React from 'react';
import { useTheme } from '@/hooks/useTheme';

// Types pour les props du composant
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ElementType;
    helperText?: string;
}

export const Input: React.FC<InputProps> = ({
                                                label,
                                                error,
                                                icon: Icon,
                                                helperText,
                                                className = '',
                                                id,
                                                ...props
                                            }) => {
    const { theme } = useTheme();

    // Générer un ID unique si non fourni
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const inputClasses = theme === 'dark'
        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

    const errorClasses = error
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "focus:ring-2 focus:ring-purple-500 focus:border-transparent";

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium mb-2"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                        aria-hidden="true"
                    />
                )}
                <input
                    id={inputId}
                    className={`
            w-full px-4 py-3 rounded-xl transition-all
            ${Icon ? 'pl-10' : ''}
            ${inputClasses}
            ${errorClasses}
            ${className}
          `}
                    aria-describedby={
                        error ? `${inputId}-error` :
                            helperText ? `${inputId}-helper` : undefined
                    }
                    aria-invalid={error ? 'true' : 'false'}
                    {...props}
                />
            </div>
            {error && (
                <p
                    id={`${inputId}-error`}
                    className="mt-1 text-sm text-red-500"
                    role="alert"
                >
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p
                    id={`${inputId}-helper`}
                    className={`mt-1 text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
};