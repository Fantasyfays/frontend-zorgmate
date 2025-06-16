import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

// Laad config.json eerst en render dan pas de app
fetch('/config.json')
    .then((res) => res.json())
    .then((config) => {
        window.REACT_APP_API_URL = config.REACT_APP_API_URL;

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <App /> // ✅ Geen StrictMode om WebSocket herverbindingsprobleem te vermijden
        );

        reportWebVitals();
    })
    .catch((err) => {
        console.error('Kan config.json niet laden:', err);
    });
