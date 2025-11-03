/**
 * Types pour les événements custom des Web Components
 *
 * Ces types définissent la structure des événements émis par les composants
 * du Design System StockHub.
 */

// ============================================
// Web Component Status Types
// ============================================

/**
 * Type de statut accepté par les web components du Design System
 * (format kebab-case)
 */
export type WebComponentStatus = 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked';

// ============================================
// Search Input Events
// ============================================

export interface SearchChangeEventDetail {
  query: string;
}

export type SearchChangeEvent = CustomEvent<SearchChangeEventDetail>;

export type SearchClearEvent = CustomEvent<void>;

// ============================================
// Button Events
// ============================================

export type ButtonClickEvent = CustomEvent<void>;

// ============================================
// Card Events
// ============================================

export type CardClickEvent = CustomEvent<void>;

// ============================================
// Metric Card Events
// ============================================

export interface MetricClickEventDetail {
  value: number | string;
}

export type MetricClickEvent = CustomEvent<MetricClickEventDetail>;

// ============================================
// Stock Card Events
// ============================================

export interface StockCardEventDetail {
  stockId?: number | string;
}

export type StockSessionClickEvent = CustomEvent<StockCardEventDetail>;
export type StockDetailsClickEvent = CustomEvent<StockCardEventDetail>;
export type StockEditClickEvent = CustomEvent<StockCardEventDetail>;
export type StockDeleteClickEvent = CustomEvent<StockCardEventDetail>;

// ============================================
// Footer Events
// ============================================

export interface FooterLinkClickEventDetail {
  link: 'mentions-legales' | 'politique-confidentialite' | 'cgu' | 'cookies';
}

export type FooterLinkClickEvent = CustomEvent<FooterLinkClickEventDetail>;

// ============================================
// Header Events
// ============================================

export interface ThemeToggleEventDetail {
  previousTheme: string;
  newTheme: string;
}

export type ThemeToggleEvent = CustomEvent<ThemeToggleEventDetail>;

export interface NotificationClickEventDetail {
  count: number;
}

export type NotificationClickEvent = CustomEvent<NotificationClickEventDetail>;

export interface LogoutClickEventDetail {
  userName: string;
}

export type LogoutClickEvent = CustomEvent<LogoutClickEventDetail>;

// ============================================
// IA Alert Banner Events
// ============================================

export interface IAAlertItemClickEventDetail {
  product: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

export type IAAlertItemClickEvent = CustomEvent<IAAlertItemClickEventDetail>;
