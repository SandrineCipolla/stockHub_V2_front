import React, { useCallback, useEffect, useRef } from 'react';
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
  const headerRef = useRef<HTMLElement>(null);
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
  // 1. Host listener sur sh-logout-click (API officielle du web component, couvre les tests)
  // 2. Shadow root listener sur sh-button-click (couvre le navigateur réel où sh-logout-click
  //    n'est pas toujours reçu via la liaison de prop React 19)
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    el.addEventListener('sh-logout-click', handleLogout);

    const onShadowButtonClick = (e: Event) => {
      if (!(e.target instanceof Element)) return;
      if (e.target.tagName === 'SH-BUTTON' && e.target.getAttribute('icon-before') === 'LogOut') {
        handleLogout();
      }
    };
    el.shadowRoot?.addEventListener('sh-button-click', onShadowButtonClick);

    return () => {
      el.removeEventListener('sh-logout-click', handleLogout);
      el.shadowRoot?.removeEventListener('sh-button-click', onShadowButtonClick);
    };
  }, [handleLogout]);

  return React.createElement('sh-header', {
    ref: headerRef,
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
