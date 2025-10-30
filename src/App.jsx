// src/App.jsx (Contenido RESTAURADO)

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
// Importa todos tus componentes de página
import Home from './pages/Home';
import Productos from './pages/Productos';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProductoDetalle from './pages/ProductoDetalle';
import ProtectedRoute from './components/ProtectedRoute'; // Para la ruta de admin

export default function App() {
  return (
    <>
      {/* El Navbar se renderiza en todas las páginas */}
      <Navbar /> 

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<ProductoDetalle />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida para administradores */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta de error 404 (Opcional) */}
        <Route path="*" element={<p className="text-center my-5">404: Página no encontrada</p>} />
      </Routes>
    </>
  );
}