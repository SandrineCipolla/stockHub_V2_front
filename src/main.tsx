import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import du Design System StockHub (Web Components)
// Importer tous les composants web depuis le package npm
import '@stockhub/design-system';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);