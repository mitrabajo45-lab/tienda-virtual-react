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

  useEffect(() => {
    // 🔹 Traer lista de emails de admins
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

    // 🔹 Escuchar cambios de usuario (sesión Firebase)
    const unsubscribe = onUserStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Cargando...</p>;

  // 🔹 Si no hay usuario, redirige al login
  if (!user) return <Navigate to="/login" replace />;

  // 🔹 Si el usuario no está en la lista de admins, cerrar sesión y redirigir al login
  if (!admins.includes(user.email)) {
    logout(); // opcional: cierra sesión automáticamente
    return <Navigate to="/login" replace />;
  }

  // 🔹 Usuario autenticado y admin: mostrar contenido
  return children;
}
