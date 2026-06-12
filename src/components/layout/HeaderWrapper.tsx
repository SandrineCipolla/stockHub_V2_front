import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  notificationCount = 0,
  notificationTooltip,
  isLoggedIn: isLoggedInProp,
}) => {
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
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

    const onShow = () => {
      const rect = bellButton?.getBoundingClientRect();
      if (rect) setTooltipPos({ top: rect.bottom + 6, left: rect.left + rect.width / 2 });
    };
    const onHide = () => setTooltipPos(null);

    const headerEl = headerRef.current;
    const bellButton = headerEl?.shadowRoot?.querySelector<HTMLElement>(
      'button[title="Notifications"]'
    );
    bellButton?.addEventListener('mouseenter', onShow);
    bellButton?.addEventListener('mouseleave', onHide);

    // Sur mobile (pas de hover), toggle au tap via l'événement custom du DS
    const onBellClick = () => {
      setTooltipPos(prev => {
        if (prev) return null;
        const rect = bellButton?.getBoundingClientRect();
        return rect ? { top: rect.bottom + 6, left: rect.left + rect.width / 2 } : null;
      });
    };

    // Fermer le tooltip si on clique ailleurs
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element) || !target.closest('sh-header')) setTooltipPos(null);
    };

    document.addEventListener('sh-logout-click', onLogout);
    document.addEventListener('sh-button-click', onButtonClick);
    document.addEventListener('sh-notification-click', onBellClick);
    document.addEventListener('click', onClickOutside);

    return () => {
      document.removeEventListener('sh-logout-click', onLogout);
      document.removeEventListener('sh-button-click', onButtonClick);
      document.removeEventListener('sh-notification-click', onBellClick);
      document.removeEventListener('click', onClickOutside);
      bellButton?.removeEventListener('mouseenter', onShow);
      bellButton?.removeEventListener('mouseleave', onHide);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {React.createElement('sh-header', {
        ref: headerRef,
        userName: resolvedUserName,
        notificationCount,
        'data-theme': theme,
        className,
        'onsh-notification-click': handleNotifications,
        'onsh-theme-toggle': handleThemeToggle,
        'onsh-login-click': handleLogin,
        'onsh-logout-click': handleLogout,
      })}
      {notificationTooltip && notificationTooltip.length > 0 && tooltipPos && (
        <div
          role="tooltip"
          style={{
            position: 'fixed',
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: 'translateX(-50%)',
          }}
          className={`z-50 rounded-lg shadow-xl px-3 py-2 text-xs whitespace-nowrap pointer-events-none border ${
            theme === 'dark'
              ? 'bg-slate-800 text-gray-100 border-slate-600'
              : 'bg-white text-gray-800 border-gray-200'
          }`}
        >
          {notificationTooltip.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
};
