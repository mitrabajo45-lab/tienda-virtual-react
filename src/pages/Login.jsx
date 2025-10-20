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
      setError("❌ Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-50 px-4">
      {/* 💳 Tarjeta centrada con tamaño fijo */}
      <Card className="w-[380px] shadow-2xl border border-indigo-100 bg-white/90 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-indigo-700">
            🛍️ Bienvenido
          </CardTitle>
          <p className="text-gray-500 text-sm mt-2">
            Inicia sesión para administrar tus productos
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 w-full"
          >
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Correo electrónico
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@correo.com"
                required
                className="focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3 text-sm font-medium">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Mi Almacén de Electrodomésticos
        </CardFooter>
      </Card>
    </div>
  );
}
