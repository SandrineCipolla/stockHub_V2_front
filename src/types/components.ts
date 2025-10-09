import React from "react";
import type {BadgeVariant, BaseComponentProps, ButtonVariant, ComponentSize, InputType} from './ui';
import type {Stock} from './stock';

// ========================================
// INTERFACES PROPS COMPOSANTS
// ========================================

// Props composants UI communs
export interface BadgeProps {
    variant: BadgeVariant;
    children: React.ReactNode;
    className?: string;
    size?: ComponentSize;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ComponentSize;
    icon?: React.ElementType;
    loading?: boolean;
    children?: React.ReactNode;
}

export interface CardProps extends BaseComponentProps {
    title?: string;
    subtitle?: string;
    footer?: React.ReactNode;
    variant?: 'default' | 'highlighted';
    padding?: ComponentSize;
}

export interface InputProps extends BaseComponentProps {
    type?: InputType;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    error?: string;
    helper?: string;
    label?: string;
    required?: boolean;
    size?: ComponentSize;
}

// Props composants métier Stock
export interface StockCardProps {
    stock: Stock;
    onEdit?: (stock: Stock) => void;
    onDelete?: (id: number) => void;
    className?: string;
}

export interface StockGridProps {
    stocks: Stock[];
    onEdit?: (stock: Stock) => void;
    onDelete?: (id: number) => void;
    loading?: boolean;
    className?: string;
}
