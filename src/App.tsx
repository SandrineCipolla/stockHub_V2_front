import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '@/config/authConfig';
import { ThemeProvider } from '@/components/providers/ThemeProvider.tsx';
import './styles/index.css';

// Lazy loading des pages pour améliorer les performances initiales
const Dashboard = lazy(() =>
  import('@/pages/Dashboard.tsx').then(module => ({ default: module.Dashboard }))
);
const Analytics = lazy(() =>
  import('@/pages/Analytics.tsx').then(module => ({ default: module.Analytics }))
);

// Composant de chargement accessible
const LoadingFallback = () => (
  <div
    className="min-h-screen flex items-center justify-center bg-slate-900"
    role="status"
    aria-live="polite"
    aria-label="Chargement de la page en cours"
  >
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      />
      <p className="text-gray-300 text-sm">Chargement...</p>
    </div>
  </div>
);

// Écran de connexion affiché si l'utilisateur n'est pas authentifié
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900" role="main">
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-white">StockHub</h1>
      <p className="text-gray-400 text-sm">Connectez-vous pour accéder à votre tableau de bord</p>
      <button
        onClick={onLogin}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Se connecter
      </button>
    </div>
  </div>
);

function ProtectedComponent() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={() => {
          instance.loginRedirect(loginRequest).catch(console.error);
        }}
      />
    );
  }

  return (
    <BrowserRouter>
      {/* AJOUT OBLIGATOIRE pour RGAA : Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-purple-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
      >
        Aller au contenu principal
      </a>

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ProtectedComponent />
    </ThemeProvider>
  );
}

export default App;
