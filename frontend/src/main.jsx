import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DocumentProvider } from './context/DocumentContext.jsx';
import App from './App.jsx';

// --- THIS IS THE CRITICAL IMPORT ---
import './index.css';
// ---------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DocumentProvider>
        <App />
      </DocumentProvider>
    </BrowserRouter>
  </React.StrictMode>
);