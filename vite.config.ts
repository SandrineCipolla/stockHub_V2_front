import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || '/';
  return {
    base,
    plugins: [react()], // mkcert() nécessite mkcert installé système
    server: {
      port: 5173,
      strictPort: true, // Erreur si le port est occupé au lieu de changer
      host: true,
      // Le plugin mkcert() génère automatiquement les certificats
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      // Garantit une seule instance React dans tous les chunks (évite "unstable_now" error)
      dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // React + scheduler + MSAL React dans le même chunk (MSAL dépend des hooks React)
            if (
              id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/scheduler') ||
              id.includes('@azure/msal')
            ) {
              return 'react-vendor';
            }

            // Design System (lazy loaded, non-critique)
            if (id.includes('@stockhub/design-system')) {
              return 'design-system';
            }

            // Framer Motion (animations, non-critique)
            if (id.includes('framer-motion')) {
              return 'animations';
            }

            // Lucide icons (nombreuses icônes, lazy load possible)
            if (id.includes('lucide-react')) {
              return 'icons';
            }

            // React Router (critique mais séparable)
            if (id.includes('react-router-dom')) {
              return 'router';
            }

            // Séparer les pages en chunks individuels pour route-based splitting
            if (id.includes('/src/pages/Dashboard')) {
              return 'page-dashboard';
            }
            if (id.includes('/src/pages/Analytics')) {
              return 'page-analytics';
            }

            // Autres node_modules dans un chunk commun
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
      // Limite d'avertissement plus stricte pour forcer l'optimisation
      // Objectif : tous les chunks < 500 KB
      chunkSizeWarningLimit: 500,
      // Activer la minification
      minify: 'terser',
      terserOptions: {
        compress: {
          // ✅ Ne PAS supprimer les console.* en production
          // On utilise src/utils/logger.ts pour un contrôle fin des logs
          // Avantages :
          // - Les erreurs critiques restent visibles en production pour le débogage
          // - Les logs de debug sont automatiquement désactivés en production
          // - Pas besoin de drop_console qui supprime TOUT (y compris les erreurs)
          drop_console: false,
          drop_debugger: true, // Supprimer les debugger (ceux-ci sont toujours inutiles en prod)
          // Optimisations supplémentaires pour réduire la taille
          passes: 2, // Deux passes d'optimisation
          pure_funcs: ['console.log'], // Supprimer uniquement console.log (garder warn/error)
        },
        mangle: {
          safari10: true, // Compatibilité Safari 10+
        },
      },
    },
  };
});
