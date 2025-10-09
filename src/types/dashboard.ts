import React from "react";

// ========================================
// TYPES DASHBOARD/MÉTRIQUES
// ========================================

export type MetricIcon = 'package' | 'alert-triangle' | 'trending-up';
export type MetricColor = 'success' | 'warning' | 'info';
export type ChangeType = 'increase' | 'decrease';

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
