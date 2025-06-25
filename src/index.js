import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

fetch('/config.json')
    .then((res) => res.json())
    .then((config) => {
        window.REACT_APP_API_URL = config.REACT_APP_API_URL;

        root.render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        reportWebVitals();
    })
    .catch((err) => {
        console.error('Kan config.json niet laden:', err);
    });
