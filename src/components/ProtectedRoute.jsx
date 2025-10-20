// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onUserStateChange, logout } from "../auth";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // 🔹 Obtenemos los emails de admins desde Firestore
    const fetchAdmins = async () => {
      const snapshot = await getDocs(collection(db, "admins"));
      const lista = snapshot.docs.map((doc) => doc.data().email);
      setAdmins(lista);
    };

    fetchAdmins();

    // 🔹 Obtenemos el usuario actual
    onUserStateChange((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Cargando...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (!admins.includes(user.email)) {
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

  return children;
}
