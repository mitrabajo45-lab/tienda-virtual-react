// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400">
      {/* 💳 Tarjeta centrada */}
      <Card className="w-[380px] shadow-2xl border border-white/20 bg-white/20 backdrop-blur-xl text-gray-800">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-white drop-shadow-md">
            🛍️ Mi Almacén
          </CardTitle>
          <p className="text-gray-100/90 text-sm font-medium">
            Inicia sesión para administrar tus productos
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <div>
              <label className="text-sm font-medium text-white/90 mb-1 block">
                Correo electrónico
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@correo.com"
                required
                className="bg-white/80 border-white/30 placeholder-gray-500 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-gray-800"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white/90 mb-1 block">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/80 border-white/30 placeholder-gray-500 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-gray-800"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-100 bg-red-500/20 border border-red-400/40 rounded-md p-3 text-sm font-medium backdrop-blur-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="bg-indigo-700 hover:bg-indigo-800 shadow-md hover:shadow-lg text-white font-semibold py-2 rounded-md transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-white/80 text-xs mt-2">
          © {new Date().getFullYear()} Mi Almacén de Electrodomésticos
        </CardFooter>
      </Card>
    </div>
  );
}
