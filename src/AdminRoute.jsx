// src/AdminRoute.jsx
import React, { useState, useEffect } from "react";
import { onUserStateChange, logout } from "./auth";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

const ADMINS = ["admin1@example.com", "admin2@example.com"]; // emails de administradores

export default function AdminRoute() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onUserStateChange((u) => setUser(u));
  }, []);

  if (!user) {
    return <Login onLogin={() => {}} />; // Se renderiza login
  }

  if (!ADMINS.includes(user.email)) {
    return (
      <div className="p-4">
        <p>No tienes permisos para acceder a esta sección.</p>
        <button onClick={logout} className="mt-2 bg-red-500 text-white px-3 py-1 rounded">
          Cerrar sesión
        </button>
      </div>
    );
  }

  return <Admin />;
}
