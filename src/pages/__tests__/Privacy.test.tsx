import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Privacy } from '@/pages/Privacy';
import { createMockUseTheme } from '@/test/fixtures/hooks';

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => createMockUseTheme(),
}));

vi.mock('@/hooks/usePendingContributionsCount', () => ({
  usePendingContributionsCount: () => ({ count: 0 }),
}));

vi.mock('@/components/layout/HeaderWrapper', () => ({ HeaderWrapper: () => null }));
vi.mock('@/components/layout/NavSection', () => ({ NavSection: () => null }));
vi.mock('@/components/layout/FooterWrapper', () => ({ FooterWrapper: () => null }));

const renderPrivacy = () =>
  render(
    <MemoryRouter>
      <Privacy />
    </MemoryRouter>
  );

describe('Privacy', () => {
  // Les emplacements sont ceux du code : authConfig.ts, CookieBanner.tsx, HeaderWrapper.tsx
  // et ThemeProvider.tsx. Ce test échoue si la page et le code divergent à nouveau (#350).
  it.each([
    ['Jetons Azure B2C', 'sessionStorage'],
    ['stockhub_consent', 'sessionStorage'],
    ['stockhub_username', 'localStorage'],
    ['stockhub-theme', 'localStorage'],
  ])('annonce %s dans %s', (donnee, emplacement) => {
    renderPrivacy();

    const table = screen.getByRole('table', { name: 'Tableau des traitements de données' });
    const row = within(table)
      .getAllByRole('row')
      .find(r => r.textContent?.includes(donnee));

    expect(row).toBeDefined();
    expect(row?.textContent).toContain(`(${emplacement})`);
  });

  it('explique que le consentement se retire dans le sessionStorage', () => {
    renderPrivacy();

    expect(screen.getByText(/dans le sessionStorage de votre navigateur/)).toBeInTheDocument();
  });
});
