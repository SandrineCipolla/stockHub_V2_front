import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { BadgeVariant } from '@/types';

// Types pour les props du composant
interface BadgeProps {
    variant: BadgeVariant;
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
                                                variant,
                                                children,
                                                className = '',
                                                size = 'md'
                                            }) => {
    const { theme } = useTheme();

    const variants: Record<BadgeVariant, string> = {
        success: theme === 'dark'
            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            : "bg-emerald-100 text-emerald-700 border-emerald-300",
        warning: theme === 'dark'
            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
            : "bg-amber-100 text-amber-700 border-amber-300",
        danger: theme === 'dark'
            ? "bg-red-500/20 text-red-400 border-red-500/30"
            : "bg-red-100 text-red-700 border-red-300"
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm"
    };

    return (
        <span
            className={`
        ${sizes[size]} rounded-full font-medium border 
        ${variants[variant]} 
        ${className}
      `}
        >
      {children}
    </span>
    );
};