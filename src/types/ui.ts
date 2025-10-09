import React from "react";

// ========================================
// TYPES UI/COMPOSANTS DE BASE
// ========================================

export type Theme = "dark" | "light";
export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ComponentSize = "sm" | "md" | "lg";
export type BadgeVariant = "success" | "warning" | "danger";
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

// Props de base pour tous les composants
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
    'data-testid'?: string;
}

export interface AccessibleComponentProps extends BaseComponentProps {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-hidden'?: boolean;
    role?: string;
}

// Constantes typées UI
export const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost'] as const;
export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;
export const BADGE_VARIANTS = ['success', 'warning', 'danger'] as const;
export const THEMES = ['light', 'dark'] as const;

// Type guards UI
export const isTheme = (theme: string): theme is Theme => {
    return THEMES.includes(theme as Theme);
};

export const isButtonVariant = (variant: string): variant is ButtonVariant => {
    return BUTTON_VARIANTS.includes(variant as ButtonVariant);
};

// Props pour les providers
export interface ThemeProviderProps {
    children: React.ReactNode;
}
