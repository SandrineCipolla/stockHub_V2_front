import React, { useCallback, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useTheme } from '@/hooks/useTheme';
import { loginRequest } from '@/config/authConfig';
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
    console.log('🔔 Notifications clicked');
    // TODO: Ouvrir le panneau de notifications
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  // Fonction handleLogin (identique à V1)
  const handleLogin = async () => {
    try {
      console.log('🔐 Login clicked');
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
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
    console.log('👋 Logout clicked');
    clearLocalStorage();
    instance.logoutRedirect({
      postLogoutRedirectUri: '/',
    });
  }, [instance]);

  // Double stratégie sur document (zéro dépendance de timing DOM) :
  // 1. sh-logout-click  — API officielle du web component, couvre les tests JSDOM
  // 2. sh-button-click  — fallback production via composedPath() ; les deux events sont
  //    composed:true + bubbles:true donc remontent jusqu'à document sans querySelector
  useEffect(() => {
    const onButtonClick = (e: Event) => {
      const isLogoutButton = e
        .composedPath()
        .some(
          node =>
            node instanceof Element &&
            node.tagName === 'SH-BUTTON' &&
            node.getAttribute('icon-before') === 'LogOut'
        );
      if (isLogoutButton) handleLogout();
    };

    document.addEventListener('sh-logout-click', handleLogout);
    document.addEventListener('sh-button-click', onButtonClick);

    return () => {
      document.removeEventListener('sh-logout-click', handleLogout);
      document.removeEventListener('sh-button-click', onButtonClick);
    };
  }, [handleLogout]);

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
