// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, onUserStateChange } from "../auth"; // onUserStateChange para detectar usuario logueado

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState(""); // "exito" o "error"
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Detectar si el usuario ya está logueado
  useEffect(() => {
    const unsubscribe = onUserStateChange((u) => {
      setUser(u);
      if (u) {
        navigate("/"); // si ya está logueado, redirige a Home
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const mostrarMensaje = (msg, tipo) => {
    setMensaje(msg);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje(null);
      setTipoMensaje("");
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      mostrarMensaje("✅ Sesión iniciada correctamente", "exito");

      // Redirigir según rol admin
      setTimeout(() => {
        const adminEmails = ["admin@correo.com"]; // aquí podrías traer desde Firestore
        if (adminEmails.includes(email)) {
          navigate("/admin");
        } else {
          navigate("/"); // usuarios normales van a Home
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      mostrarMensaje("❌ Email o contraseña incorrectos", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>

      {/* Toast */}
      {mensaje && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: tipoMensaje === "exito" ? "#16a34a" : "#dc2626",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 9999,
            fontWeight: "bold",
          }}
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="admin@correo.com"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}
