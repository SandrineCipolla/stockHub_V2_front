import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import StockHub Design System Web Components
import '@stockhub/design-system';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);