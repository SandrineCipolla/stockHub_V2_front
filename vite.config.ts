import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
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
          'animations': ['framer-motion'],
          // Séparer les icônes Lucide
          'icons': ['lucide-react'],
          // Séparer le Design System
          'design-system': ['@stockhub/design-system'],
        },
      },
    },
    // Augmenter la limite d'avertissement à 1000 kB (temporaire)
    chunkSizeWarningLimit: 1000,
    // Activer la minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer les console.log en production
        drop_debugger: true,
      },
    },
  },
})
