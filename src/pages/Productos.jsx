import React, { useState, useEffect } from "react";
// Importamos solo lo necesario para leer de Firebase
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Referencia a la colección 'productos'
  const productosRef = collection(db, "productos");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const snapshot = await getDocs(productosRef);
        // Mapeamos los documentos para incluir el ID
        const productosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(productosData);
        setCargando(false);
      } catch (e) {
        console.error("Error al cargar productos:", e);
        setError("❌ No se pudieron cargar los productos. Intenta de nuevo más tarde.");
        setCargando(false);
      }
    };
    cargarProductos();
  }, []); // Se ejecuta solo al montar el componente

  // --- Renderizado de Estados ---
  if (cargando) {
    return <h2 className="p-6 text-xl text-center">Cargando productos... ⏳</h2>;
  }

  if (error) {
    return <h2 className="p-6 text-xl text-center text-red-600">{error}</h2>;
  }
  
  if (productos.length === 0) {
      return <h2 className="p-6 text-xl text-center">¡No hay productos en stock! 😟</h2>;
  }

  // --- Renderizado de la Lista de Productos ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">🛒 Nuestros Productos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productos.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300 ease-in-out flex flex-col"
          >
            {/* Imagen del Producto */}
            <div className="relative h-48 w-full">
                <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="object-cover w-full h-full"
                />
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              {/* Nombre y Categoría */}
              <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1 flex-1">{p.nombre}</h3>
              <p className="text-sm text-indigo-600 mb-2">{p.categoria}</p>

              {/* Descripción (Limitada a 2 líneas) */}
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{p.descripcion}</p>
              
              <div className="mt-auto">
                {/* Precio y Stock */}
                <div className="flex justify-between items-center mb-3 pt-2 border-t border-gray-100">
                    <span className="text-2xl font-extrabold text-gray-900">${p.precio}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}
                    </span>
                </div>

                {/* Botón de Comprar */}
                <button
                  disabled={p.stock <= 0}
                  className={`w-full py-2 rounded-lg font-semibold transition duration-150 ${
                    p.stock > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {p.stock > 0 ? "Añadir al Carrito" : "Sin Stock"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}