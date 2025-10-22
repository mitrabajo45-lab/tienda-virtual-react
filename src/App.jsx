import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Header — SIEMPRE visible */}
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold flex items-center gap-1">
            🛍️ <span>Mi Almacén</span>
          </h1>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="hover:underline">Inicio</Link>
            <Link to="/productos" className="hover:underline">Productos</Link>
            <Link to="/contacto" className="hover:underline">Contacto</Link>
            {isAdmin && (
              <Link to="/admin" className="hover:underline text-indigo-600">
                Admin
              </Link>
            )}
            {!user && (
              <Link to="/login" className="hover:underline text-indigo-600">
                Iniciar Sesión
              </Link>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="hover:underline text-red-500"
              >
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
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

      {/* Footer — SIEMPRE visible */}
      <footer className="border-t text-center py-4 text-sm text-slate-500">
        © {new Date().getFullYear()} Mi Almacén de Electrodomésticos
      </footer>
    </div>
  );
}
