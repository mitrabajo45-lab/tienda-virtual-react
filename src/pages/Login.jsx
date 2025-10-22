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
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* Fondo degradado sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"></div>

      {/* Card principal */}
      <Card className="relative z-10 w-full max-w-md p-8 bg-navy-800 text-white rounded-2xl shadow-xl">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-3xl font-bold">Iniciar Sesión</CardTitle>
          <p className="text-gray-300 text-sm mt-2">
            Accede a tu panel de administración
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Correo electrónico
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@correo.com"
                required
                className="focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-navy-700 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-navy-700 text-white placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-600 rounded-md p-3 text-sm font-medium">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-md transition"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-gray-400 text-sm mt-4">
          © {new Date().getFullYear()} Mi Almacén de Electrodomésticos
        </CardFooter>
      </Card>
    </div>
  );
}
