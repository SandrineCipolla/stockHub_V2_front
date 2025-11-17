/**
 * @fileoverview SearchInputWrapper - React wrapper for sh-search-input web component
 * @description Wrapper React pour le web component sh-search-input du Design System
 *
 * Ce wrapper gère correctement les événements custom émis par le web component.
 *
 * @see {@link https://github.com/SandrineCipolla/stockhub_design_system/tree/main/src/components/atoms/search}
 */

import React, { useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

/**
 * Props for SearchInputWrapper component
 */
export interface SearchInputWrapperProps {
  /** Texte du placeholder */
  placeholder?: string;
  /** Valeur actuelle du champ */
  value?: string;
  /** Délai de debounce en ms */
  debounce?: number;
  /** Afficher le bouton clear */
  clearable?: boolean;
  /** Callback appelé lors du changement de valeur */
  onSearchChange?: (query: string) => void;
  /** Callback appelé lors du clear */
  onSearchClear?: () => void;
  /** Label ARIA */
  ariaLabel?: string;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * SearchInputWrapper component - Wrapper pour sh-search-input
 *
 * Gère les événements custom émis par le web component :
 * - sh-search-change : émis lors du changement de valeur (avec debounce)
 * - sh-search-clear : émis lors du clic sur le bouton clear
 *
 * @example
 * ```tsx
 * <SearchInputWrapper
 *   placeholder="Rechercher..."
 *   value={searchTerm}
 *   onSearchChange={(query) => setSearchTerm(query)}
 *   onSearchClear={() => setSearchTerm('')}
 * />
 * ```
 */
export const SearchInputWrapper: React.FC<SearchInputWrapperProps> = ({
  placeholder = 'Rechercher...',
  value = '',
  debounce = 300,
  clearable = true,
  onSearchChange,
  onSearchClear,
  ariaLabel,
  className = '',
}) => {
  const { theme } = useTheme();
  const searchRef = useRef<HTMLElement>(null);

  // Écouter l'événement sh-search-change
  useEffect(() => {
    const handleSearchChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ query: string }>;
      if (customEvent.detail && typeof customEvent.detail.query === 'string') {
        onSearchChange?.(customEvent.detail.query);
      }
    };

    const element = searchRef.current;
    if (element) {
      element.addEventListener('sh-search-change', handleSearchChange);
      return () => element.removeEventListener('sh-search-change', handleSearchChange);
    }
  }, [onSearchChange]);

  // Écouter l'événement sh-search-clear
  useEffect(() => {
    const handleSearchClear = () => {
      onSearchClear?.();
    };

    const element = searchRef.current;
    if (element) {
      element.addEventListener('sh-search-clear', handleSearchClear);
      return () => element.removeEventListener('sh-search-clear', handleSearchClear);
    }
  }, [onSearchClear]);

  // Synchroniser la valeur du web component avec la prop value
  useEffect(() => {
    if (searchRef.current) {
      customElements.whenDefined('sh-search-input').then(() => {
        if (searchRef.current) {
          // @ts-expect-error - propriété native du web component
          searchRef.current.value = value;
        }
      });
    }
  }, [value]);

  return React.createElement('sh-search-input', {
    ref: searchRef,
    placeholder,
    debounce,
    clearable: clearable ? '' : undefined,
    'data-theme': theme,
    'aria-label': ariaLabel,
    className,
  });
};
