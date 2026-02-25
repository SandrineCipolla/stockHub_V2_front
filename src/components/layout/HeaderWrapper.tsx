import React, { useCallback, useEffect, useRef } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useTheme } from '@/hooks/useTheme';
import { loginRequest } from '@/config/authConfig';
import { logger } from '@/utils/logger';
import type { HeaderProps } from '@/types';

/**
 * Wrapper React pour le web component sh-header
 */
export const HeaderWrapper: React.FC<HeaderProps> = ({
  className = '',
  userName = 'Sandrine Cipolla',
  notificationCount = 3,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { instance } = useMsal();

  // Déterminer si l'utilisateur est connecté (hook React safe)
  const isLoggedIn = useIsAuthenticated();

  const handleNotifications = () => {
    logger.debug('Notifications clicked');
    // TODO: Ouvrir le panneau de notifications
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  // Fonction handleLogin (identique à V1)
  const handleLogin = async () => {
    try {
      logger.debug('Login clicked');
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      logger.error('Erreur lors de la connexion:', error);
    }
  };

  // Fonction de nettoyage du localStorage (identique à V1)
  const clearLocalStorage = () => {
    localStorage.removeItem('msal.idtoken');
    localStorage.removeItem('msal.accesstoken');
    localStorage.removeItem('authToken'); // Notre token custom V2
  };

  // Fonction handleLogout (identique à V1 avec ajout de authToken)
  const handleLogout = useCallback(() => {
    logger.debug('Logout clicked');
    clearLocalStorage();
    instance.logoutRedirect({ postLogoutRedirectUri: '/' })?.catch((err: unknown) => {
      logger.error('Erreur lors du logout:', err);
    });
  }, [instance]);

  // Ref toujours à jour vers la dernière version de handleLogout.
  // Permet d'utiliser des deps [] dans useEffect (listener ajouté une seule fois,
  // jamais supprimé/ré-ajouté lors des re-renders MSAL) tout en appelant
  // toujours la version fraîche de la fonction.
  const handleLogoutRef = useRef(handleLogout);
  handleLogoutRef.current = handleLogout;

  useEffect(() => {
    const onLogout = () => handleLogoutRef.current();

    const onButtonClick = (e: Event) => {
      const isLogoutButton = e
        .composedPath()
        .some(
          node =>
            node instanceof Element &&
            node.tagName === 'SH-BUTTON' &&
            node.getAttribute('icon-before') === 'LogOut'
        );
      if (isLogoutButton) handleLogoutRef.current();
    };

    document.addEventListener('sh-logout-click', onLogout);
    document.addEventListener('sh-button-click', onButtonClick);

    return () => {
      document.removeEventListener('sh-logout-click', onLogout);
      document.removeEventListener('sh-button-click', onButtonClick);
    };
  }, []);

  return React.createElement('sh-header', {
    userName,
    notificationCount,
    isLoggedIn, // Maintenant dynamique basé sur activeAccount
    'data-theme': theme,
    className,
    'onsh-notification-click': handleNotifications,
    'onsh-theme-toggle': handleThemeToggle,
    'onsh-login-click': handleLogin,
  });
};
