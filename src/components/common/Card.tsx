import React from 'react';
import { useTheme } from '@/hooks/useTheme';

// Types pour les props du composant
interface CardProps {
    children: React.ReactNode;
    hover?: boolean;
    className?: string;
    onClick?: () => void;
    role?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              hover = true,
                                              className = '',
                                              onClick,
                                              role,
                                              ...ariaProps
                                          }) => {
    const { theme } = useTheme();

    const baseClasses = theme === 'dark'
        ? "bg-white/5 border-white/10"
        : "bg-white/80 border-gray-200 shadow-sm";

    const hoverClasses = hover
        ? theme === 'dark'
            ? "hover:bg-white/10 hover:border-purple-500/30 hover:-translate-y-1"
            : "hover:bg-white hover:border-purple-300 hover:shadow-md hover:-translate-y-1"
        : "";

    const clickableClasses = onClick ? "cursor-pointer" : "";

    return (
        <div
            className={`
        ${baseClasses} 
        backdrop-blur-sm border rounded-xl p-6
        transition-all duration-300
        ${hoverClasses}
        ${clickableClasses}
        ${className}
      `}
            onClick={onClick}
            role={role}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            } : undefined}
            {...ariaProps}
        >
            {children}
        </div>
    );
};