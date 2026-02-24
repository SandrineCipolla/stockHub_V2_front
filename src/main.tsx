import React from 'react';
import ReactDOM from 'react-dom/client';
import { EventType } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { b2cPolicies, loginRequest } from './config/authConfig';
import { msalInstance } from './config/msalInstance';
import App from './App';
import './styles/index.css';

// Importer UNIQUEMENT les CSS tokens (variables CSS) - Critique pour le rendu
import '@stockhub/design-system/dist/tokens/design-tokens.css';

// Lazy loading du Design System (Web Components) - Non critique pour le premier rendu
// Les composants seront chargés en arrière-plan après le rendu initial
setTimeout(() => {
  // @ts-expect-error - Le Design System n'a pas de fichier .d.ts, mais fonctionne en runtime
  import('@stockhub/design-system').catch(err => {
    console.error('❌ Erreur lors du chargement du Design System:', err);
  });
}, 100); // Délai de 100ms pour laisser React charger d'abord

// Fonction d'initialisation asynchrone
async function initializeMsal() {
  try {
    console.log('🔄 Initialisation de MSAL...');
    await msalInstance.initialize();
    console.log('✅ MSAL initialisé avec succès');

    // Auto-sélection du premier compte si disponible
    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
      msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    // Event listener pour gérer l'authentification
    msalInstance.addEventCallback(event => {
      console.debug('MSAL Event received:', event.eventType);

      // Cas: utilisateur a cliqué sur "Forgot password"
      if (event.eventType === EventType.LOGIN_FAILURE && event.error) {
        const error = event.error;
        const message =
          ('errorMessage' in error ? error.errorMessage : '') ||
          ('message' in error ? error.message : '') ||
          '';

        if (message.includes('AADB2C90118')) {
          console.warn('Forgot Password triggered → redirecting to password reset flow');

          msalInstance.loginRedirect({
            authority: b2cPolicies.authorities.forgotPassword.authority,
            scopes: loginRequest.scopes,
          });
          return;
        }

        console.error('Login failure:', event.error);
      }

      // Authentification réussie → setActiveAccount
      if (
        (event.eventType === EventType.LOGIN_SUCCESS ||
          event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
          event.eventType === EventType.SSO_SILENT_SUCCESS) &&
        event.payload
      ) {
        const payload = event.payload;

        // Type guard: vérifier que payload a la propriété account
        if ('account' in payload && payload.account) {
          msalInstance.setActiveAccount(payload.account);
        }
      }
    });

    // Monter l'application React après initialisation MSAL
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de MSAL:", error);
  }
}

// Lancer l'initialisation
initializeMsal();
