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
