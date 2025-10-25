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

  // Clases para los botones azules (Inicio, Productos, Contacto, Admin, Login)
  const primaryButtonClasses = "bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-lg shadow-md hover:bg-indigo-600 transition duration-200 whitespace-nowrap";
  // Clases para el botón Cerrar Sesión (rojo)
  const logoutButtonClasses = "bg-red-600 text-white font-semibold px-3 py-1.5 rounded-lg shadow-md hover:bg-red-700 transition duration-200 focus:outline-none whitespace-nowrap";

  // 🚨 ESTILO IN-LINE TEMPORAL para anular bordes y márgenes de los separadores 🚨
  const inlineResetStyle = { 
    textDecoration: 'none', 
    borderRight: 'none', 
    marginRight: '0',
    paddingRight: '0'
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-20">
      
      {/* ⚠️ CONTENEDOR PRINCIPAL: justify-center para centrar todo ⚠️ */}
      <div className="w-full mx-auto px-4 py-3 flex items-center justify-center"> 
        
        {/* Contenedor interno: max-w-4xl para limitar y centrar el grupo de elementos */}
        <div className="flex items-center space-x-8 max-w-4xl w-full justify-center relative">
          
          {/* 1. Logo/Título - Posición absoluta para no interferir en el centrado del nav */}
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center absolute left-0">
            <span className="text-indigo-600 mr-2">🛍️</span> Mi Almacén
          </h1>

          {/* 2. Menú para pantallas grandes (Desktop) - Estará CENTRADO */}
          <nav className="hidden md:flex items-center space-x-4 text-sm">
            
            {/* GRUPO A: Enlaces de navegación principales (Aplicamos estilos in-line) */}
            <Link to="/" className={primaryButtonClasses} style={inlineResetStyle}>Inicio</Link>
            <Link to="/productos" className={primaryButtonClasses} style={inlineResetStyle}>Productos</Link>
            <Link to="/contacto" className={primaryButtonClasses} style={inlineResetStyle}>Contacto</Link>
            
            {/* GRUPO B: Botones de acción (Condicionales) */}
            <div className="flex items-center space-x-4 ml-4">
              
              {isAdmin && (
                <Link to="/admin" className={primaryButtonClasses}>
                  Admin
                </Link>
              )}

              {!user && (
                <Link 
                  to="/login" 
                  className={primaryButtonClasses}
                >
                  Iniciar Sesión
                </Link>
              )}

              {user && (
                <button 
                  onClick={handleLogout} 
                  className={logoutButtonClasses} 
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </nav>

          {/* Botón de menú móvil (Movido a la derecha absoluta) */}
          <button className="md:hidden text-2xl p-1 absolute right-0" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
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