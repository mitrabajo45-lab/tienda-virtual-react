
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header / Navegación */}
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">🛍️ Mi Almacén</h1>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="hover:underline">Inicio</Link>
            <Link to="/productos" className="hover:underline">Productos</Link>
            <Link to="/contacto" className="hover:underline">Contacto</Link>
            <Link to="/admin" className="hover:underline text-indigo-600">Admin</Link>
          </nav>
        </div>
      </header>

      {/* Contenido de cada página */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t text-center py-4 text-sm text-slate-500">
        © {new Date().getFullYear()} Mi Almacén de Electrodomésticos
      </footer>
    </div>
  );
}