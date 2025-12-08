import React from 'react';
import ReactDOM from 'react-dom/client';
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
