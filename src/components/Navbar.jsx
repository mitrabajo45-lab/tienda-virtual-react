// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">🛍️ Mi Almacén</h1>

        {/* Menú para pantallas grandes */}
        <nav className="hidden md:flex gap-4 text-sm">
          <Link to="/" className="hover:underline">Inicio</Link>
          <Link to="/productos" className="hover:underline">Productos</Link>
          <Link to="/contacto" className="hover:underline">Contacto</Link>
          {isAdmin && (
            <Link to="/admin" className="hover:underline text-indigo-600">Admin</Link>
          )}
          {!user && (
            <Link to="/login" className="hover:underline text-indigo-600">Iniciar Sesión</Link>
          )}
          {user && (
            <button onClick={handleLogout} className="hover:underline text-red-500">
              Cerrar sesión
            </button>
          )}
        </nav>

        {/* Botón de menú móvil */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <nav className="flex flex-col items-center bg-gray-100 md:hidden py-2 space-y-2 text-sm">
          <Link onClick={() => setMenuOpen(false)} to="/">Inicio</Link>
          <Link onClick={() => setMenuOpen(false)} to="/productos">Productos</Link>
          <Link onClick={() => setMenuOpen(false)} to="/contacto">Contacto</Link>
          {isAdmin && (
            <Link onClick={() => setMenuOpen(false)} to="/admin" className="text-indigo-600">Admin</Link>
          )}
          {!user && (
            <Link onClick={() => setMenuOpen(false)} to="/login" className="text-indigo-600">Iniciar Sesión</Link>
          )}
          {user && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-red-500"
            >
              Cerrar sesión
            </button>
          )}
        </nav>
      )}
    </header>
  );
}

