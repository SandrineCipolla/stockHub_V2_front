import React from "react";

// ========================================
// TYPES DASHBOARD/MÉTRIQUES
// ========================================

export type MetricIcon = 'package' | 'alert-triangle' | 'trending-up';
export type MetricColor = 'success' | 'warning' | 'info';
export type ChangeType = 'increase' | 'decrease';

// Type pour le mapping des icônes Lucide
export type IconComponentMap = Record<MetricIcon, React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>>;

export interface MetricCardData {
    title: string;
    value: string | number;
    icon: MetricIcon;
    color: MetricColor;
    change?: {
        value: number;
        type: ChangeType;
        period?: string;
    };
}

export interface MetricCardProps extends MetricCardData {
    className?: string;
    enableAnimation?: boolean; // Pour désactiver l'animation dans les tests
}

// Types pour la navigation
export interface BreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
    icon?: React.ElementType;
}

export interface FooterLink {
    label: string;
    href: string;
    external?: boolean;
}

// Props pour les composants layout
export interface NavSectionProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    className?: string;
}

export interface HeaderProps {
    className?: string;
    userName?: string;
    notificationCount?: number;
}

export interface FooterProps {
    className?: string;
    companyName?: string;
    year?: number;
    links?: FooterLink[];
}
