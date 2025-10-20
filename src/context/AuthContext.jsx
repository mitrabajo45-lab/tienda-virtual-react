// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onUserStateChange, logout } from "../auth"; // 👈 tu lógica de Firebase Auth
import { db } from "../firebase"; // 👈 conexión a tu Firestore
import { collection, getDocs } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escucha cambios de autenticación
    const unsubscribe = onUserStateChange((u) => setUser(u));

    // Obtiene lista de admins
    const fetchAdmins = async () => {
      try {
        const snapshot = await getDocs(collection(db, "admins"));
        const lista = snapshot.docs.map((doc) => doc.data().email);
        setAdmins(lista);
      } catch (error) {
        console.error("Error al obtener admins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();

    return () => unsubscribe();
  }, []);

  const isAdmin = user && admins.includes(user.email);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);
