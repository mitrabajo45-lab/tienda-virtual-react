import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  // El estado 'menuOpen' controla el menú de Bootstrap en móviles
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header>
      {/* Navbar de Bootstrap: expand-lg para desktop, shadow para sombra */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          
          {/* 1. Logo/Título */}
          <Link to="/" className="navbar-brand fw-bold fs-4 text-dark">
            <span className="text-primary me-2">🛍️</span> Mi Almacén
          </Link>

          {/* Botón de toggle para móvil */}
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen ? "true" : "false"}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* 2. Contenido del menú */}
          {/* Usar 'show' condicionalmente para Bootstrap en React */}
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
            
            {/* 'ms-auto' para mover los enlaces a la derecha */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
              
              {/* GRUPO A: Enlaces de navegación principales */}
              <li className="nav-item">
                <Link to="/" className="nav-link">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link to="/productos" className="nav-link">Productos</Link>
              </li>
              <li className="nav-item">
                <Link to="/contacto" className="nav-link">Contacto</Link>
              </li>
              
              {/* ========================================================= */}
              {/* GRUPO B: Botones de acción (Lógica Condicional Corregida) */}
              {/* ========================================================= */}
              
              {user ? (
                // ⬇️ OPCIÓN A: USUARIO LOGUEADO (Muestra Admin y Cerrar Sesión)
                <>
                  {/* Mostrar Admin solo si es administrador */}
                  {isAdmin && (
                    <li className="nav-item">
                      {/* Cambié a btn-info para que no se confunda con 'Iniciar Sesión' */}
                      <Link to="/admin" className="btn btn-info btn-sm ms-lg-2 mt-2 mt-lg-0 text-white">
                        Admin
                      </Link>
                    </li>
                  )}
                  
                  {/* Botón de Cerrar Sesión (Siempre que haya un usuario) */}
                  <li className="nav-item">
                    <button 
                      onClick={handleLogout} 
                      className="btn btn-danger btn-sm ms-lg-2 mt-2 mt-lg-0" 
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
                // ⬇️ OPCIÓN B: USUARIO NO LOGUEADO (Muestra Iniciar Sesión)
                <li className="nav-item">
                  <Link to="/login" className="btn btn-primary btn-sm ms-lg-2 mt-2 mt-lg-0">
                    Iniciar Sesión
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}