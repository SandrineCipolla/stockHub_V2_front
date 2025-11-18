import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'sh-status-badge': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        status?: 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked';
        size?: 'sm' | 'md' | 'lg';
        'show-icon'?: boolean;
        'data-theme'?: 'light' | 'dark';
      };
      'sh-search-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        placeholder?: string;
        value?: string;
        debounce?: number;
        clearable?: boolean;
        disabled?: boolean;
        error?: boolean;
        'data-theme'?: 'light' | 'dark';
        'onsh-search'?: (e: CustomEvent<{ value: string }>) => void;
        'onsh-search-change'?: (e: CustomEvent<{ value: string }>) => void;
        'onsh-search-clear'?: (e: CustomEvent) => void;
      };
      'sh-footer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'app-name'?: string;
        year?: string;
        'data-theme'?: 'light' | 'dark';
        'onsh-footer-link-click'?: (e: CustomEvent<{ link: string }>) => void;
      };
    }
  }
}

