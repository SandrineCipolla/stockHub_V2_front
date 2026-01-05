import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { EventType } from '@azure/msal-browser';
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

// Composant protégé qui capture le token d'authentification
function ProtectedComponent() {
  const { instance } = useMsal();

  useEffect(() => {
    const acquireAccessToken = async () => {
      const account = instance.getActiveAccount();
      if (!account) {
        console.log('❌ Aucun compte actif pour acquérir le token');
        return;
      }

      try {
        // Importer loginRequest depuis authConfig
        const { loginRequest } = await import('@/config/authConfig');

        console.log("🔄 Acquisition du Access Token pour l'API avec scopes:", loginRequest.scopes);

        // Acquérir silencieusement un Access token avec les scopes API
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: account,
        });

        console.log('✅ Access Token acquis:', response.accessToken ? 'OUI' : 'NON');
        console.log('🔑 Token type:', response.tokenType);
        console.log('📋 Scopes:', response.scopes);

        // Stocker le Access Token pour l'API
        localStorage.setItem('authToken', response.accessToken);
        console.log('✅ Access Token stocké dans localStorage');
      } catch (error) {
        console.error("❌ Erreur lors de l'acquisition du Access Token:", error);
      }
    };

    const callbackId = instance.addEventCallback(event => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload;

        // Type guard: vérifier que payload a account
        if ('account' in payload && payload.account) {
          console.log('✅ Login réussi, acquisition du Access Token...');
          // Après un login réussi, acquérir le Access Token pour l'API
          acquireAccessToken();
        }
      }
    });

    // Acquérir le token au chargement si l'utilisateur est déjà connecté
    if (instance.getActiveAccount()) {
      console.log('🔄 Utilisateur déjà connecté, acquisition du Access Token...');
      acquireAccessToken();
    }

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

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
