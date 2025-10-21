// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onUserStateChange } from "../auth"; // 👈 importa la función de tu auth.js

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onUserStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Cargando...
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;

  // 🔹 Si quisieras validar admin en el futuro (por email, por ejemplo)
  // const isAdmin = user.email === "admin@tuempresa.com";
  // if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
