// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

// 🚨 1. LISTA DE CORREOS ADMINISTRADORES 🚨
// Puedes agregar o quitar correos electrónicos de esta lista para gestionar los permisos de administrador.
const ADMIN_EMAILS = [
    "pythonpcmocoa@gmail.com", // El correo administrador original
    "pintowilmer138@gmail.com",  // Ejemplo de un segundo administrador
    "supervisor@tutienda.com",  // Ejemplo de un tercer administrador
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Iniciar sesión
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Cerrar sesión
  const logout = () => signOut(auth);

  // Escucha los cambios de sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // 🔹 Lógica para verificar múltiples correos de admin 🔹
      // Verifica si hay un usuario logueado Y si su email está en la lista ADMIN_EMAILS
      if (currentUser?.email && ADMIN_EMAILS.includes(currentUser.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);