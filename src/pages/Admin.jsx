import React, { useState } from "react";

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    imagen: ""
  });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.precio || !formData.categoria || !formData.imagen) {
      alert("Por favor completa todos los campos");
      return;
    }

    // Agrega el nuevo producto a la lista
    setProductos([...productos, { ...formData, id: Date.now() }]);

    // Limpia el formulario
    setFormData({ nombre: "", precio: "", categoria: "", imagen: "" });
  };

  // Eliminar producto
  const handleDelete = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>

      {/* Formulario para agregar producto */}
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
