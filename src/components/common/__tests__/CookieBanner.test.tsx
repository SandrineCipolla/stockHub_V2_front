import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CookieBanner } from '../CookieBanner';
import { createLocalStorageMock } from '@/test/fixtures/localStorage';

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

const localStorageMock = createLocalStorageMock();

beforeEach(() => {
  localStorageMock.clear();
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  vi.clearAllMocks();
});

const renderBanner = () =>
  render(
    <MemoryRouter>
      <CookieBanner />
    </MemoryRouter>
  );

describe('CookieBanner', () => {
  it("s'affiche quand aucun consentement n'est stocké", () => {
    renderBanner();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it("ne s'affiche pas quand stockhub_consent = 'accepted'", () => {
    localStorageMock.setItem('stockhub_consent', 'accepted');
    renderBanner();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it("ne s'affiche pas quand stockhub_consent = 'refused'", () => {
    localStorageMock.setItem('stockhub_consent', 'refused');
    renderBanner();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it("stocke 'accepted' et disparaît au clic sur Accepter", () => {
    renderBanner();
    fireEvent.click(screen.getByText('Accepter'));
    expect(localStorageMock.getItem('stockhub_consent')).toBe('accepted');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it("stocke 'refused' et disparaît au clic sur Refuser", () => {
    renderBanner();
    fireEvent.click(screen.getByText('Refuser'));
    expect(localStorageMock.getItem('stockhub_consent')).toBe('refused');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('affiche les deux boutons Accepter et Refuser', () => {
    renderBanner();
    expect(screen.getByText('Accepter')).toBeInTheDocument();
    expect(screen.getByText('Refuser')).toBeInTheDocument();
  });
});
