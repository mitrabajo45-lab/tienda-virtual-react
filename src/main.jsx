import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Asegúrate de que BrowserRouter esté aquí o en App.jsx
import App from './App.jsx';
import './index.css';

// 🔑 CLAVE: Importación del CSS de Bootstrap para que los estilos funcionen
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { AuthProvider } from './context/AuthContext.jsx'; // Asume esta ruta

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* Asegúrate de que el AuthProvider envuelva la App */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)