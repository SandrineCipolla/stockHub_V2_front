/**
 * Type declarations for StockHub Design System Web Components
 *
 * This file provides TypeScript support for the @stockhub/design-system
 * Web Components in JSX/TSX files.
 */

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // ==========================================
      // Atoms
      // ==========================================
      'sh-badge': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
        size?: 'sm' | 'md' | 'lg';
        pill?: boolean;
        'data-theme'?: 'light' | 'dark';
      };

      'sh-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name: string;
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
        color?: 'primary' | 'success' | 'warning' | 'danger' | 'muted' | 'inherit';
      };

      'sh-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
        placeholder?: string;
        value?: string;
        disabled?: boolean;
        error?: boolean;
        errorMessage?: string;
        label?: string;
        'data-theme'?: 'light' | 'dark';
        'onsh-input-change'?: (e: CustomEvent<{ value: string }>) => void;
      };

      'sh-logo': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        size?: 'sm' | 'md' | 'lg';
        variant?: 'full' | 'icon';
      };

      'sh-text': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
        color?: 'primary' | 'secondary' | 'muted';
      };

      // ==========================================
      // Molecules
      // ==========================================
      'sh-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
        size?: 'sm' | 'md' | 'lg';
        disabled?: boolean;
        loading?: boolean;
        iconBefore?: string;
        iconAfter?: string;
        'data-theme'?: 'light' | 'dark';
        'onsh-button-click'?: (e: CustomEvent) => void;
      };

      'sh-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        hover?: boolean;
        clickable?: boolean;
        padding?: 'none' | 'sm' | 'md' | 'lg';
        'data-theme'?: 'light' | 'dark';
        'onsh-card-click'?: (e: CustomEvent) => void;
      };

      'sh-metric-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        icon?: string;
        label?: string;
        value?: string | number;
        trend?: 'increase' | 'decrease' | 'neutral';
        'trend-value'?: string;
        variant?: 'default' | 'success' | 'warning' | 'danger';
        clickable?: boolean;
        loading?: boolean;
        'data-theme'?: 'light' | 'dark';
        'onsh-metric-click'?: (e: CustomEvent) => void;
      };

      'sh-quantity-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: number;
        min?: number;
        max?: number;
        step?: number;
        disabled?: boolean;
        'data-theme'?: 'light' | 'dark';
        'onsh-quantity-change'?: (e: CustomEvent<{ value: number }>) => void;
      };

      'sh-search-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        placeholder?: string;
        value?: string;
        debounce?: number;
        clearable?: boolean;
        disabled?: boolean;
        error?: boolean;
        'data-theme'?: 'light' | 'dark';
        'onsh-search'?: (e: CustomEvent<{ query: string }>) => void;
        'onsh-search-change'?: (e: CustomEvent<{ query: string }>) => void;
        'onsh-search-clear'?: (e: CustomEvent) => void;
      };

      'sh-status-badge': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        status?: 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked';
        size?: 'sm' | 'md' | 'lg';
        'show-icon'?: boolean;
        'data-theme'?: 'light' | 'dark';
      };

      // ==========================================
      // Organisms
      // ==========================================
      'sh-footer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'app-name'?: string;
        year?: string;
        'data-theme'?: 'light' | 'dark';
        'onsh-footer-link-click'?: (e: CustomEvent<{ link: string }>) => void;
      };

      'sh-header': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        userName?: string;
        notificationCount?: number;
        isLoggedIn?: boolean;
        'data-theme'?: 'light' | 'dark';
        'onsh-notification-click'?: (e: CustomEvent<{ count: number }>) => void;
        'onsh-theme-toggle'?: (e: CustomEvent<{ previousTheme: string; newTheme: string }>) => void;
        'onsh-login-click'?: (e: CustomEvent) => void;
        'onsh-logout-click'?: (e: CustomEvent<{ userName: string }>) => void;
      };

      'sh-ia-alert-banner': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        count?: number;
        severity?: 'critical' | 'warning' | 'info';
        message?: string;
        expanded?: boolean;
        'data-theme'?: 'light' | 'dark';
        'onsh-ia-alert-item-click'?: (e: CustomEvent<{ product: string; message: string; severity: string }>) => void;
      };

      'sh-stock-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string;
        category?: string;
        'last-update'?: string;
        percentage?: string | number;
        quantity?: string;
        value?: string;
        status?: 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked';
        'ia-count'?: number;
        'data-theme'?: 'light' | 'dark';
        'onsh-session-click'?: (e: CustomEvent) => void;
        'onsh-details-click'?: (e: CustomEvent) => void;
        'onsh-edit-click'?: (e: CustomEvent) => void;
        'onsh-delete-click'?: (e: CustomEvent) => void;
      };

      'sh-stock-item-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string;
        sku?: string;
        quantity?: number;
        value?: string;
        location?: string;
        status?: 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked';
        loading?: boolean;
        'data-theme'?: 'light' | 'dark';
        'onsh-view-click'?: (e: CustomEvent<{ sku: string }>) => void;
        'onsh-edit-click'?: (e: CustomEvent<{ sku: string }>) => void;
        'onsh-delete-click'?: (e: CustomEvent<{ sku: string }>) => void;
      };
    }
  }
}

export {};
