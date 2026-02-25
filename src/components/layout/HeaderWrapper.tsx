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

  // Double stratégie pour déclencher le logout de façon fiable :
  // 1. Host listener sur sh-logout-click (API officielle, couvre les tests)
  // 2. Host listener sur sh-button-click via composedPath() — sh-button-click est composed:true
  //    donc remonte jusqu'au host sans dépendre de shadowRoot (disponible même si le web
  //    component s'upgrade après le premier render en production)
  useEffect(() => {
    const el = document.querySelector('sh-header');
    if (!(el instanceof HTMLElement)) return;

    el.addEventListener('sh-logout-click', handleLogout);

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
    el.addEventListener('sh-button-click', onButtonClick);

    return () => {
      el.removeEventListener('sh-logout-click', handleLogout);
      el.removeEventListener('sh-button-click', onButtonClick);
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
