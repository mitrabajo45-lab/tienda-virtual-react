/*import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("auth") === "true";

  return isAuthenticated ? children : <Navigate to="/login" />;
}*/
// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onUserStateChange, logout } from "../auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // para esperar el estado del auth

  useEffect(() => {
    onUserStateChange(async (u) => {
      if (!u) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Verifica si el usuario está en la colección 'admins'
        const adminRef = doc(db, "admins", u.uid); // usa UID del usuario
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          setUser(u); // es admin
        } else {
          setUser(null); // no es admin
        }
      } catch (error) {
        console.error("Error al verificar admin:", error);
        setUser(null);
      }

      setLoading(false);
    });
  }, []);

  if (loading) return <p>Cargando...</p>;

  if (!user) {
    return (
      <div className="p-4">
        <p>No tienes permisos para acceder a esta sección.</p>
        <button
          onClick={logout}
          className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return children; // usuario admin
}
