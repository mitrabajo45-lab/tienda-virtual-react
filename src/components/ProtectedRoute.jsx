// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { onUserStateChange, logout } from "../auth";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

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

  if (!user) return <Navigate to="/login" replace />;

  if (noPermisos) {
    return (
      <AnimatePresence>
        <motion.div
          key="no-permisos"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-4"
          >
            <p className="text-red-600 font-bold text-lg mb-4">
              ❌ No tienes permisos para acceder a esta sección.
            </p>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return children;
}
