import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 2,
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'coverage/',
        // Scripts et outils
        'audits/**',
        'scripts/**',
        'documentation/**',
        // Points d'entrée (difficiles à tester)
        'src/main.tsx',
        'src/App.tsx',
        // Fichiers de types (pas de logique à tester)
        'src/types/**',
        // Utilitaires simples
        'src/utils/theme.ts',
        // Configuration statique (constantes, seuils — pas de logique)
        'src/constants/**',
        // Infrastructure MSAL (config Azure B2C, singleton)
        'src/config/**',
        // Infrastructure API (token manager, helper fetch — testés indirectement)
        'src/services/api/ConfigManager.ts',
        'src/services/api/utils.ts',
        // Page statique sans logique métier
        'src/pages/Privacy.tsx',
        // Modules ML/simulation — intégration backend prévue Phase 2
        'src/utils/mlSimulation.ts',
        'src/utils/stockPredictions.ts',
        // Tracking conteneurs — intégration backend prévue Phase 2
        'src/utils/containerManager.ts',
        // Logger — utilitaire pur (noop en production, bind en dev)
        'src/utils/logger.ts',
      ],
      thresholds: {
        branches: 80,
        lines: 80,
        statements: 80,
        functions: 65,
      },
    },
  },
});
