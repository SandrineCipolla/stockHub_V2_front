import React from 'react';
import { useTheme } from '../../hooks/useTheme';

interface CardProps {
    children?: React.ReactNode;
    hover?: boolean;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, hover = true, className = "" }) => {
    const { themeClasses } = useTheme();

    return (
        <div
            className={`
        ${themeClasses.card} backdrop-blur-sm border rounded-xl p-6
        transition-all duration-300
        ${hover ? `${themeClasses.cardHover} hover:-translate-y-1` : ""}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Card;