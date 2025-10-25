import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar"; // Usamos el componente Navbar corregido
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    // Contenedor principal de la aplicación con flex-column para el sticky footer
    <div className="d-flex flex-column min-vh-100 bg-light">
      
      {/* 1. Navbar con estilo y lógica */}
      <Navbar /> 

      {/* 2. Contenido principal: Centrado y con margen automático (max-width de Bootstrap) */}
      <main className="container flex-grow-1 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} isAdmin={isAdmin}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-top text-center py-3 text-muted">
        &copy; {new Date().getFullYear()} Mi Almacén de Electrodomésticos
      </footer>
    </div>
  );
}