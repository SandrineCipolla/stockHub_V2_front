import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { ThemeProvider } from '@/components/providers/ThemeProvider.tsx';
import { CookieBanner } from '@/components/common/CookieBanner';
import './styles/index.css';

// Lazy loading des pages pour améliorer les performances initiales
const LandingPage = lazy(() =>
  import('@/pages/LandingPage.tsx').then(module => ({ default: module.LandingPage }))
);
const Dashboard = lazy(() =>
  import('@/pages/Dashboard.tsx').then(module => ({ default: module.Dashboard }))
);
const Analytics = lazy(() =>
  import('@/pages/Analytics.tsx').then(module => ({ default: module.Analytics }))
);
const Privacy = lazy(() =>
  import('@/pages/Privacy.tsx').then(module => ({ default: module.Privacy }))
);
const StockDetailPage = lazy(() =>
  import('@/pages/StockDetailPage.tsx').then(module => ({ default: module.StockDetailPage }))
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

// Protège les routes authentifiées — attend la fin de l'init MSAL avant de rediriger
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();

  if (inProgress !== InteractionStatus.None) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      {/* RGAA : Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-purple-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
      >
        Aller au contenu principal
      </a>

      <CookieBanner />

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route
            path="/stocks/:stockId"
            element={
              <ProtectedRoute>
                <StockDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
