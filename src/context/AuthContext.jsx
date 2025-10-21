// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onUserStateChange, logout as firebaseLogout } from "../auth";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1️⃣ Escucha el estado de autenticación
    const unsubscribe = onUserStateChange((u) => {
      setUser(u);
    });

    // 2️⃣ Carga la lista de correos admin desde Firestore
    const fetchAdmins = async () => {
      try {
        const snapshot = await getDocs(collection(db, "admins"));
        const lista = snapshot.docs.map((doc) => doc.data().email);
        setAdmins(lista);
      } catch (error) {
        console.error("❌ Error al obtener admins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();

    return () => unsubscribe();
  }, []);

  // 3️⃣ Comprueba si el usuario autenticado está en la lista de admins
  const isAdmin = user ? admins.includes(user.email) : false;

  // 4️⃣ Cerrar sesión
  const logout = async () => {
    await firebaseLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout }}>
      {/* 🔹 Muestra el contenido solo cuando terminó de cargar */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook para acceder fácilmente al contexto
export const useAuth = () => useContext(AuthContext);
