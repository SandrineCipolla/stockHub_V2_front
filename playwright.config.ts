import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e-frontend',
  fullyParallel: false,
  // Un seul worker : tous les tests du projet 'authenticated' partagent le
  // même compte Azure B2C réel. Des tests en parallèle déclenchent des
  // acquisitions de token MSAL concurrentes, un bug déjà rencontré côté app
  // (voir ETAT-DU-PROJET.md, session du 23 juillet 2026 — verrou
  // interaction_in_progress) qui casse le dashboard ("Se reconnecter").
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    // Contourne le mur Vercel Deployment Protection sur les URLs de preview
    // (ex. le staging git-branch) — sans ce header, toute requête est
    // redirigée vers vercel.com/sso-api avant même d'atteindre l'app.
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
      : undefined,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'authenticated',
      testMatch: /.*\.e2e\.test\.ts/,
      use: {
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
