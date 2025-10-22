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
export const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost'] ;
export const BUTTON_SIZES = ['sm', 'md', 'lg'];
export const BADGE_VARIANTS = ['success', 'warning', 'danger'] ;
export const THEMES = ['light', 'dark'] ;

// Type guards UI
export const isTheme = (theme: string): theme is Theme => {
    return THEMES.some(validTheme => validTheme === theme);
};

export const isButtonVariant = (variant: string): variant is ButtonVariant => {
    return BUTTON_VARIANTS.some(validVariant => validVariant === variant);
};

// Props pour les providers
export interface ThemeProviderProps {
    children: React.ReactNode;
}
