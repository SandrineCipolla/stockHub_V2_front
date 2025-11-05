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

// Constantes typées UI
export const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost'];
export const THEMES = ['light', 'dark'];

// Props pour les providers
export interface ThemeProviderProps {
    children: React.ReactNode;
}
