import React from 'react';


export type ButtonProps = {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children?: React.ReactNode;
    icon?: React.ElementType;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    [key: string]: any;
};

export type CardProps = {
    children?: React.ReactNode;
    hover?: boolean;
    className?: string;
    [key: string]: any;
};

export type BadgeProps = {
    variant: 'success' | 'warning' | 'danger';
    children?: React.ReactNode;
};


export const MockButton = ({
                               variant = 'primary',
                               size = 'md',
                               children,
                               icon: Icon,
                               className = "",
                               disabled = false,
                               onClick,
                               ...props
                           }: ButtonProps) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2";

    const variants = {
        primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
        md: "px-4 py-2 text-sm rounded-lg gap-2",
        lg: "px-6 py-3 text-base rounded-xl gap-2"
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
};


export const MockCard = ({ children, hover = true, className = "", ...props }: CardProps) => (
    <div
        className={`
      backdrop-blur-sm border rounded-xl p-6 transition-all duration-300
      ${hover ? 'hover:-translate-y-1' : ''} ${className}
    `}
        {...props}
    >
        {children}
    </div>
);


export const MockBadge = ({ variant, children }: BadgeProps) => {
    const variants = {
        success: "bg-emerald-100 text-emerald-700 border-emerald-300",
        warning: "bg-amber-100 text-amber-700 border-amber-300",
        danger: "bg-red-100 text-red-700 border-red-300"
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
    );
};