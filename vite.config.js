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
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        // Séparer React et ReactDOM dans leur propre chunk
                        'react-vendor': ['react', 'react-dom'],
                        // Séparer Framer Motion (animations)
                        animations: ['framer-motion'],
                        // Séparer les icônes Lucide
                        icons: ['lucide-react'],
                        // Séparer le Design System
                        'design-system': ['@stockhub/design-system'],
                    },
                },
            },
            // Limite d'avertissement ajustée après optimisations (code-splitting + terser)
            // Le plus gros chunk actuel est design-system.js (472 kB) ce qui est acceptable
            // Objectif futur: Réduire design-system en chargeant uniquement les composants utilisés
            chunkSizeWarningLimit: 1000,
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
                },
            },
        },
    };
});
