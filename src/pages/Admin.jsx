import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    imagen: ""
  });
  const [mensaje, setMensaje] = useState(null); // null cuando no hay mensaje
  const [tipoMensaje, setTipoMensaje] = useState(""); // "exito" o "error"

  const productosRef = collection(db, "productos");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const snapshot = await getDocs(productosRef);
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductos(lista);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        mostrarMensaje("❌ Error al cargar productos", "error");
      }
    };

    cargarProductos();
  }, []);

  const mostrarMensaje = (msg, tipo) => {
    setMensaje(msg);
    setTipoMensaje(tipo);

    setTimeout(() => {
      setMensaje(null);
      setTipoMensaje("");
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Depuración con console.log
    console.log("handleSubmit ejecutado");
    console.log("Datos del formulario:", formData);

    if (!formData.nombre || !formData.precio || !formData.categoria || !formData.imagen) {
      console.log("Campos incompletos");
      mostrarMensaje("❌ Por favor completa todos los campos", "error");
      return;
    }

    try {
      await addDoc(productosRef, formData);
      console.log("Producto agregado correctamente");

      // Recargar productos
      const snapshot = await getDocs(productosRef);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setProductos(lista);

      setFormData({ nombre: "", precio: "", categoria: "", imagen: "" });
      mostrarMensaje("✅ Producto guardado correctamente", "exito");
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      mostrarMensaje("❌ Hubo un problema al guardar el producto", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      setProductos(productos.filter((p) => p.id !== id));
      mostrarMensaje("🗑️ Producto eliminado correctamente", "exito");
    } catch (error) {
      console.error("Error al eliminar en Firestore:", error);
      mostrarMensaje("❌ Hubo un problema al eliminar el producto", "error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>

      {/* Mensaje */}
      <div>
        <p>Mensaje actual: {mensaje ? mensaje : "no hay mensaje"}</p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow mb-6 grid gap-3 md:grid-cols-2"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Ej: Televisor LG 55”"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Precio</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Ej: 1200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Ej: Televisores"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL de Imagen</label>
          <input
            type="text"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Ej: https://picsum.photos/seed/tv/600/400"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Agregar Producto
          </button>
        </div>
      </form>

      {/* Lista de productos */}
      <h3 className="text-xl font-semibold mb-2">Productos agregados</h3>

      {productos.length === 0 ? (
        <p className="text-gray-500">No hay productos aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productos.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
            >
              <img src={p.imagen} alt={p.nombre} className="w-full h-40 object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="font-semibold">{p.nombre}</h4>
                <p className="text-sm text-gray-500 mb-2">{p.categoria}</p>
                <div className="font-bold text-indigo-600 mb-3">${p.precio}</div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="mt-auto bg-red-500 text-white text-sm px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
