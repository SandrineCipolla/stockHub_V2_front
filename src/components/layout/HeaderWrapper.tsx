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

  // Listener sh-logout-click sur document pour les tests JSDOM :
  // JSDOM n'a pas de vrai shadow DOM, les tests dispatche sh-logout-click directement.
  useEffect(() => {
    document.addEventListener('sh-logout-click', handleLogout);
    return () => {
      document.removeEventListener('sh-logout-click', handleLogout);
    };
  }, [handleLogout]);

  // onClick React sur sh-header pour la production :
  // Le click natif depuis le shadow DOM (composed:true) remonte jusqu'au root React.
  // composedPath() inclut SH-BUTTON même depuis le handler React.
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const isLogout = e.nativeEvent
        .composedPath()
        .some(
          node =>
            node instanceof Element &&
            node.tagName === 'SH-BUTTON' &&
            node.getAttribute('icon-before') === 'LogOut'
        );
      if (isLogout) handleLogout();
    },
    [handleLogout]
  );

  return React.createElement('sh-header', {
    userName,
    notificationCount,
    isLoggedIn, // Maintenant dynamique basé sur activeAccount
    'data-theme': theme,
    className,
    onClick: handleClick,
    'onsh-notification-click': handleNotifications,
    'onsh-theme-toggle': handleThemeToggle,
    'onsh-login-click': handleLogin,
  });
};
