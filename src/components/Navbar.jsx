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

  // Clases base para los enlaces (Link)
  const linkClasses = "text-gray-700 hover:text-indigo-600 font-medium transition duration-200";
  // Clases base para el botón Cerrar Sesión
  const buttonClasses = "bg-red-600 text-white font-semibold px-4 py-1.5 rounded-lg shadow-md hover:bg-red-700 transition duration-200 focus:outline-none whitespace-nowrap";

  return (
    // Header con sombra y fondo claro
    <header className="bg-white shadow-lg sticky top-0 z-20">
      {/* Contenedor principal para limitar el ancho del contenido */}
      <div className="w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* 1. Logo/Título */}
        <h1 className="text-xl font-extrabold text-gray-900 flex items-center">
          <span className="text-indigo-600 mr-2">🛍️</span> Mi Almacén
        </h1>

        {/* 2. Menú para pantallas grandes (Desktop) */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          
          {/* Enlaces de navegación principales */}
          <Link to="/" className={linkClasses}>Inicio</Link>
          <Link to="/productos" className={linkClasses}>Productos</Link>
          <Link to="/contacto" className={linkClasses}>Contacto</Link>
          
          {/* Enlaces y botones condicionales (Alineados a la derecha y espaciados) */}
          <div className="flex items-center space-x-4 ml-4 border-l pl-4">
            
            {/* Botón/Link Admin (Destacado) */}
            {isAdmin && (
              <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 font-bold transition duration-200">
                Admin
              </Link>
            )}

            {/* Iniciar Sesión */}
            {!user && (
              <Link to="/login" className="bg-indigo-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition duration-200">
                Iniciar Sesión
              </Link>
            )}

            {/* Botón Cerrar Sesión (Estilizado) */}
            {user && (
              <button 
                onClick={handleLogout} 
                className={buttonClasses} // Usa las clases rojas estilizadas
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </nav>

        {/* Botón de menú móvil */}
        <button className="md:hidden text-2xl p-1" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* 3. Menú móvil desplegable */}
      <nav
        className={`flex flex-col items-stretch bg-gray-50 md:hidden text-base transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100 py-3 border-t border-gray-200" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <Link onClick={() => setMenuOpen(false)} to="/" className="py-2 px-6 hover:bg-gray-200">Inicio</Link>
        <Link onClick={() => setMenuOpen(false)} to="/productos" className="py-2 px-6 hover:bg-gray-200">Productos</Link>
        <Link onClick={() => setMenuOpen(false)} to="/contacto" className="py-2 px-6 hover:bg-gray-200">Contacto</Link>
        {isAdmin && <Link onClick={() => setMenuOpen(false)} to="/admin" className="py-2 px-6 text-indigo-600 hover:bg-gray-200 font-bold">Admin</Link>}
        {!user && <Link onClick={() => setMenuOpen(false)} to="/login" className="py-2 px-6 text-indigo-600 hover:bg-gray-200">Iniciar Sesión</Link>}
        {user && <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left py-2 px-6 text-red-600 hover:bg-gray-200">Cerrar sesión</button>}
      </nav>
    </header>
  );
}