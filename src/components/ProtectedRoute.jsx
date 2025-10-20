// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, isAdmin, children }) {
  // Si no hay usuario, redirige a login
  if (!user) return <Navigate to="/login" replace />;

  // Si hay usuario pero no es admin, mostrar mensaje
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-4">
          <p className="text-red-600 font-bold text-lg mb-4">
            ❌ No tienes permisos para acceder a esta sección.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Si es admin, renderiza el contenido
  return children;
}
