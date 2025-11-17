import { useState, useEffect } from 'react';

/**
 * Hook pour détecter si l'utilisateur préfère une animation réduite
 * Respecte la préférence système prefers-reduced-motion
 *
 * @returns boolean - true si l'utilisateur préfère moins d'animations
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 *
 * const variants = {
 *   animate: {
 *     scale: prefersReducedMotion ? 1 : 1.05
 *   }
 * };
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Vérifier si l'API matchMedia est disponible
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Définir la valeur initiale
    setPrefersReducedMotion(mediaQuery.matches);

    // Fonction de callback pour les changements
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Écouter les changements de préférence
    // Utiliser addEventListener si disponible (moderne)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback pour anciens navigateurs
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};
