import React from "react";
import type {BadgeVariant, ButtonVariant, ComponentSize, InputType} from './ui';
import type {Stock, StockStatus} from './stock';

// ========================================
// INTERFACES PROPS COMPOSANTS
// ========================================


export interface BadgeProps {
    variant: BadgeVariant;
    children: React.ReactNode;
    className?: string;
    size?: ComponentSize;
}

export interface StatusBadgeProps {
    status: StockStatus;
    showIcon?: boolean;
    size?: ComponentSize;
    className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ComponentSize;
    icon?: React.ElementType;
    loading?: boolean;
    children?: React.ReactNode;
}

export interface CardProps {
    children: React.ReactNode;
    hover?: boolean;
    className?: string;
    onClick?: () => void;
    role?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ElementType;
    helperText?: string;
    type?: InputType;
}

export interface StockCardProps {
    stock: Stock;
    index?: number;
    isLoaded?: boolean;
    onView?: (stockId: number) => void;
    onEdit?: (stockId: number) => void;
    onDelete?: (stockId: number) => void;
    isUpdating?: boolean;
    isDeleting?: boolean;
    className?: string;
}

export interface StockGridProps {
    stocks: Stock[];
    isLoaded?: boolean;
    onView?: (stockId: number) => void;
    onEdit?: (stockId: number) => void;
    onDelete?: (stockId: number) => void;
    isUpdating?: boolean;
    isDeleting?: boolean;
    className?: string;
}
