import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider.tsx';
import { CookieBanner } from '@/components/common/CookieBanner';
import './styles/index.css';

// Lazy loading des pages pour améliorer les performances initiales
const Dashboard = lazy(() =>
  import('@/pages/Dashboard.tsx').then(module => ({ default: module.Dashboard }))
);
const Analytics = lazy(() =>
  import('@/pages/Analytics.tsx').then(module => ({ default: module.Analytics }))
);
const Privacy = lazy(() =>
  import('@/pages/Privacy.tsx').then(module => ({ default: module.Privacy }))
);

// Composant de chargement accessible
const LoadingFallback = () => (
  <main id="main-content" className="min-h-screen flex items-center justify-center bg-slate-900">
    <h1 className="sr-only">StockHub V2 — Chargement en cours</h1>
    <div
      role="status"
      aria-live="polite"
      aria-label="Chargement de la page en cours"
      className="flex flex-col items-center gap-4"
    >
      <div
        className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      />
      <p className="text-gray-300 text-sm">Chargement...</p>
    </div>
  </main>
);

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* AJOUT OBLIGATOIRE pour RGAA : Skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-purple-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
        >
          Aller au contenu principal
        </a>

        <CookieBanner />

        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
