// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onUserStateChange, logout } from "../auth";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noPermisos, setNoPermisos] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const snapshot = await getDocs(collection(db, "admins"));
        const lista = snapshot.docs.map((doc) => doc.data().email);
        setAdmins(lista);
      } catch (error) {
        console.error("Error al obtener admins:", error);
      }
    };

    fetchAdmins();

    const unsubscribe = onUserStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser && !admins.includes(currentUser.email)) {
        setNoPermisos(true);
      } else {
        setNoPermisos(false);
      }
    });

    return () => unsubscribe();
  }, [admins]);

  if (loading) return <p>Cargando...</p>;

  // 🔹 Si no hay usuario, mostrar login
  if (!user) return <Navigate to="/login" replace />;

  // 🔹 Si el usuario no tiene permisos
  if (noPermisos) {
    return (
      <div className="flex flex-col items-center justify-center mt-24">
        <p className="text-red-600 text-lg font-semibold mb-4">
          ❌ No tienes permisos para acceder a esta sección.
        </p>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  // 🔹 Usuario autenticado y admin
  return children;
}
