import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      // La lógica de manejo de errores se mantiene igual
      setError("Credenciales inválidas. Intenta de nuevo.");
    }
  };

  return (
    // Estructura principal de Bootstrap: centrar vertical y horizontalmente
    <div className="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">
      <div className="row justify-content-center w-100">
        {/* Limita el ancho del formulario en pantallas medianas y grandes */}
        <div className="col-sm-10 col-md-7 col-lg-5 col-xl-4">
          
          {/* Tarjeta de Login (Componente Card) */}
          <div className="card shadow-lg border-0 rounded-3">
            
            {/* Cabecera de la Tarjeta */}
            <div className="card-header bg-primary text-white text-center rounded-top-3">
              <h1 className="h4 fw-bold my-3">
                <span role="img" aria-label="shop">🛍️</span> Mi Almacén
              </h1>
              <p className="text-white-50 small">Accede a tu panel de administración</p>
            </div>
            
            {/* Cuerpo del Formulario */}
            <div className="card-body p-4 p-md-5">
              
              {/* Mensaje de Error (Alert de Bootstrap) */}
              {error && (
                <div className="alert alert-danger py-2 text-center" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                
                {/* Campo de Email con Form-Floating */}
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="inputEmail"
                    type="email"
                    placeholder="admin@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="inputEmail">Correo Electrónico</label>
                </div>

                {/* Campo de Contraseña con Form-Floating */}
                <div className="form-floating mb-4">
                  <input
                    className="form-control"
                    id="inputPassword"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="inputPassword">Contraseña</label>
                </div>

                {/* Botón de Enviar (d-grid para ancho completo) */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </form>
            </div>
            
            {/* Pie de página de la tarjeta */}
            <div className="card-footer text-center py-3 bg-light border-0">
              <footer className="text-muted small">
                © 2025 Mi Almacén de Electrodomésticos
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}