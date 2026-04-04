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
  userName,
  notificationCount = 3,
  isLoggedIn: isLoggedInProp,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const account = instance.getActiveAccount() ?? accounts[0];
  const emailClaim = account?.idTokenClaims?.['emails'];
  const emailFromToken =
    Array.isArray(emailClaim) && typeof emailClaim[0] === 'string' ? emailClaim[0] : undefined;
  const resolvedUserName =
    userName ??
    account?.idTokenClaims?.name ??
    account?.name ??
    emailFromToken ??
    account?.username ??
    '';

  // Si isLoggedIn est passé en prop (ex: LandingPage force false), on l'utilise directement.
  // Sinon on lit l'état MSAL, en ignorant les transitions de redirect.
  const isLoggedIn =
    isLoggedInProp !== undefined ? isLoggedInProp : isAuthenticated && inProgress === 'none';

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

  const handleLogout = useCallback(() => {
    logger.debug('Logout clicked');
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

  // Ref pour forcer la propriété JS isLoggedIn sur le web component Lit.
  // React 19 supprime l'attribut quand la valeur est false au lieu de définir
  // la propriété à false, ce qui laisse Lit utiliser son défaut (true).
  // L'assignation impérative contourne ce comportement.
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      Reflect.set(headerRef.current, 'isLoggedIn', isLoggedIn);
    }
  }, [isLoggedIn]);

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
    ref: headerRef,
    userName: resolvedUserName,
    notificationCount,
    'data-theme': theme,
    className,
    'onsh-notification-click': handleNotifications,
    'onsh-theme-toggle': handleThemeToggle,
    'onsh-login-click': handleLogin,
    'onsh-logout-click': handleLogout,
  });
};
