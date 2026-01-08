import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { HeaderWrapper } from '../HeaderWrapper';

// Mock useTheme
const mockToggleTheme = vi.fn();
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'dark',
    toggleTheme: mockToggleTheme,
  }),
}));

// Mock MSAL hooks
const mockLoginRedirect = vi.fn();
const mockLogoutRedirect = vi.fn();
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      loginRedirect: mockLoginRedirect,
      logoutRedirect: mockLogoutRedirect,
    },
  }),
  useIsAuthenticated: () => true, // Always return true for tests
}));

// Mock console.log to avoid noise in tests
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('HeaderWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<HeaderWrapper />);
      expect(container.querySelector('sh-header')).toBeInTheDocument();
    });

    it('should create web component with sh-header tag', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');
      expect(header).toBeInTheDocument();
    });

    it('should render with custom userName', () => {
      const { container } = render(<HeaderWrapper userName="John Doe" />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('username')).toBe('John Doe');
    });

    it('should render with custom notificationCount', () => {
      const { container } = render(<HeaderWrapper notificationCount={5} />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('notificationcount')).toBe('5');
    });
  });

  describe('Props mapping', () => {
    it('should map userName prop correctly', () => {
      const { container } = render(<HeaderWrapper userName="Test User" />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('username')).toBe('Test User');
    });

    it('should map notificationCount prop correctly', () => {
      const { container } = render(<HeaderWrapper notificationCount={10} />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('notificationcount')).toBe('10');
    });

    it('should always set isLoggedIn to true', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');
      // Boolean true doesn't always create 'true' string in React.createElement
      // Check attribute exists or is truthy
      expect(header?.hasAttribute('isloggedin')).toBe(true);
    });

    it('should apply className correctly', () => {
      const { container } = render(<HeaderWrapper className="custom-header" />);
      const header = container.querySelector('sh-header');
      expect(header?.classList.contains('custom-header')).toBe(true);
    });
  });

  describe('Default props', () => {
    it('should use default userName "Sandrine Cipolla"', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('username')).toBe('Sandrine Cipolla');
    });

    it('should use default notificationCount of 3', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('notificationcount')).toBe('3');
    });

    it('should use empty string as default className', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');
      expect(header?.classList.length).toBe(0);
    });
  });

  describe('Theme integration', () => {
    it('should apply theme via data-theme attribute', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('data-theme')).toBe('dark');
    });

    it('should call toggleTheme when sh-theme-toggle event fires', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');

      const event = new Event('sh-theme-toggle', { bubbles: true });
      header?.dispatchEvent(event);

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple theme toggle events', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');

      const event1 = new Event('sh-theme-toggle', { bubbles: true });
      const event2 = new Event('sh-theme-toggle', { bubbles: true });

      header?.dispatchEvent(event1);
      header?.dispatchEvent(event2);

      expect(mockToggleTheme).toHaveBeenCalledTimes(2);
    });
  });

  describe('Event handling - Notifications', () => {
    it('should handle notification click event', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');

      const event = new Event('sh-notification-click', { bubbles: true });
      header?.dispatchEvent(event);

      expect(consoleLogSpy).toHaveBeenCalledWith('🔔 Notifications clicked');
    });

    it('should not crash on multiple notification clicks', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');

      const event1 = new Event('sh-notification-click', { bubbles: true });
      const event2 = new Event('sh-notification-click', { bubbles: true });

      expect(() => {
        header?.dispatchEvent(event1);
        header?.dispatchEvent(event2);
      }).not.toThrow();

      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Event handling - Logout', () => {
    it('should handle logout click event', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');

      const event = new Event('sh-logout-click', { bubbles: true });
      header?.dispatchEvent(event);

      expect(consoleLogSpy).toHaveBeenCalledWith('👋 Logout clicked');
    });

    it('should not crash on multiple logout clicks', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');

      const event1 = new Event('sh-logout-click', { bubbles: true });
      const event2 = new Event('sh-logout-click', { bubbles: true });

      expect(() => {
        header?.dispatchEvent(event1);
        header?.dispatchEvent(event2);
      }).not.toThrow();
    });
  });

  describe('Event handling - All events', () => {
    it('should handle all three events independently', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');

      const notifEvent = new Event('sh-notification-click', { bubbles: true });
      const themeEvent = new Event('sh-theme-toggle', { bubbles: true });
      const logoutEvent = new Event('sh-logout-click', { bubbles: true });

      header?.dispatchEvent(notifEvent);
      header?.dispatchEvent(themeEvent);
      header?.dispatchEvent(logoutEvent);

      expect(consoleLogSpy).toHaveBeenCalledWith('🔔 Notifications clicked');
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith('👋 Logout clicked');
    });
  });

  describe('Notification count variations', () => {
    it('should handle zero notifications', () => {
      const { container } = render(<HeaderWrapper notificationCount={0} />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('notificationcount')).toBe('0');
    });

    it('should handle single notification', () => {
      const { container } = render(<HeaderWrapper notificationCount={1} />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('notificationcount')).toBe('1');
    });

    it('should handle large notification count', () => {
      const { container } = render(<HeaderWrapper notificationCount={99} />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('notificationcount')).toBe('99');
    });

    it('should handle very large notification count', () => {
      const { container } = render(<HeaderWrapper notificationCount={999} />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('notificationcount')).toBe('999');
    });
  });

  describe('User name variations', () => {
    it('should handle short user name', () => {
      const { container } = render(<HeaderWrapper userName="A" />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('username')).toBe('A');
    });

    it('should handle long user name', () => {
      const longName = 'Marie-Christine De La Fontaine-Beauregard';
      const { container } = render(<HeaderWrapper userName={longName} />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('username')).toBe(longName);
    });

    it('should handle user name with special characters', () => {
      const { container } = render(<HeaderWrapper userName="Jean-François O'Brien" />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('username')).toBe("Jean-François O'Brien");
    });

    it('should handle empty user name', () => {
      const { container } = render(<HeaderWrapper userName="" />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('username')).toBe('');
    });
  });

  describe('Real-world scenarios', () => {
    it('should render production header config', () => {
      const { container } = render(
        <HeaderWrapper userName="Sandrine Cipolla" notificationCount={5} className="app-header" />
      );
      const header = container.querySelector('sh-header');

      expect(header?.getAttribute('username')).toBe('Sandrine Cipolla');
      expect(header?.getAttribute('notificationcount')).toBe('5');
      expect(header?.hasAttribute('isloggedin')).toBe(true);
      expect(header?.getAttribute('data-theme')).toBe('dark');
      expect(header?.classList.contains('app-header')).toBe(true);
    });

    it('should render header without notifications', () => {
      const { container } = render(<HeaderWrapper userName="Guest User" notificationCount={0} />);
      const header = container.querySelector('sh-header');
      expect(header?.getAttribute('notificationcount')).toBe('0');
    });

    it('should handle rapid theme toggles', () => {
      const { container } = render(<HeaderWrapper />);
      const header = container.querySelector('sh-header');

      // Simulate rapid theme switching
      for (let i = 0; i < 5; i++) {
        const event = new Event('sh-theme-toggle', { bubbles: true });
        header?.dispatchEvent(event);
      }

      expect(mockToggleTheme).toHaveBeenCalledTimes(5);
    });
  });

  describe('Props updates', () => {
    it('should update userName when prop changes', () => {
      const { container, rerender } = render(<HeaderWrapper userName="Initial Name" />);
      let header = container.querySelector('sh-header');
      expect(header?.getAttribute('username')).toBe('Initial Name');

      rerender(<HeaderWrapper userName="Updated Name" />);
      header = container.querySelector('sh-header');
      expect(header?.getAttribute('username')).toBe('Updated Name');
    });

    it('should update notificationCount when prop changes', () => {
      const { container, rerender } = render(<HeaderWrapper notificationCount={3} />);
      let header = container.querySelector('sh-header');
      expect(header?.getAttribute('notificationcount')).toBe('3');

      rerender(<HeaderWrapper notificationCount={10} />);
      header = container.querySelector('sh-header');
      expect(header?.getAttribute('notificationcount')).toBe('10');
    });

    it('should update className when prop changes', () => {
      const { container, rerender } = render(<HeaderWrapper className="initial" />);
      let header = container.querySelector('sh-header');
      expect(header?.classList.contains('initial')).toBe(true);

      rerender(<HeaderWrapper className="updated" />);
      header = container.querySelector('sh-header');
      expect(header?.classList.contains('updated')).toBe(true);
    });
  });
});
