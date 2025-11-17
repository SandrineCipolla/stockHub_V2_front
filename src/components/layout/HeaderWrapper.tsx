import React from 'react';
import { useTheme } from '@/hooks/useTheme';
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

  const handleNotifications = () => {
    console.log('🔔 Notifications clicked');
    // TODO: Ouvrir le panneau de notifications
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleLogout = () => {
    console.log('👋 Logout clicked');
    // TODO: Implémenter la logique de logout
  };

  return React.createElement('sh-header', {
    userName,
    notificationCount,
    isLoggedIn: true,
    'data-theme': theme,
    className,
    'onsh-notification-click': handleNotifications,
    'onsh-theme-toggle': handleThemeToggle,
    'onsh-logout-click': handleLogout,
  });
};
