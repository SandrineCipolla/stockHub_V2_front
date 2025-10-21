import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import du Design System StockHub (Web Components)
import './lib/design-system';
import '@stockhub/design-system/dist/tokens/design-tokens.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);