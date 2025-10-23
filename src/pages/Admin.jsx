import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    descripcion: "",
    stock: "",
    imagen: "",
  });
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);

  const productosRef = collection(db, "productos");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const snapshot = await getDocs(productosRef);
        setProductos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch {
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
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpload = () => {
    if (!imagenArchivo) {
      mostrarMensaje("⚠️ Selecciona una imagen primero", "error");
      return;
    }
    const timestamp = Date.now();
    const storageRef = ref(storage, `uploads/${timestamp}-${imagenArchivo.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imagenArchivo);

    setSubiendo(true);
    setProgreso(0);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgreso(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      () => {
        mostrarMensaje("❌ Error al subir la imagen", "error");
        setSubiendo(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setFormData({ ...formData, imagen: url });
          setSubiendo(false);
          mostrarMensaje("✅ Imagen subida correctamente", "exito");
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.nombre ||
      !formData.precio ||
      !formData.categoria ||
      !formData.descripcion ||
      !formData.stock ||
      !formData.imagen
    ) {
      mostrarMensaje("❌ Completa todos los campos antes de guardar", "error");
      return;
    }
    try {
      await addDoc(productosRef, formData);
      const snapshot = await getDocs(productosRef);
      setProductos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setFormData({ nombre: "", precio: "", categoria: "", descripcion: "", stock: "", imagen: "" });
      setImagenArchivo(null);
      mostrarMensaje("✅ Producto guardado correctamente", "exito");
    } catch {
      mostrarMensaje("❌ Error al guardar el producto", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      setProductos(productos.filter((p) => p.id !== id));
      mostrarMensaje("🗑️ Producto eliminado correctamente", "exito");
    } catch {
      mostrarMensaje("❌ Error al eliminar producto", "error");
    }
  };

  return (
    // Se eliminó el div contenedor externo para usar el w-full del <main> de App.jsx
    <> 
      
      {mensaje && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-lg text-white font-bold shadow-lg z-50 ${
            tipoMensaje === "exito" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {mensaje}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-center">Panel de Administración</h2>

      {/* FORMULARIO: Centrado y con ancho limitado */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg grid gap-8 md:grid-cols-2 w-full max-w-xl mx-auto mb-10"
      >
        {/* Campos del formulario */}
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            // Clases de Tailwind aplicadas directamente, ya que se eliminaron del index.css
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
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Ej: 25"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            rows="3"
            placeholder="Describe el producto..."
          ></textarea>
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="block text-sm font-medium mb-1">Imagen</label>
          
          <div className="flex items-center gap-4"> 
              <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagenArchivo(e.target.files[0])}
                  // Aseguramos las clases de Tailwind aquí
                  className="w-full border rounded-md px-3 py-2 text-sm text-gray-500 block" 
              />
              <button
                  type="button"
                  onClick={handleUpload}
                  disabled={subiendo}
                  className={`bg-blue-600 text-white px-4 py-2 rounded-md w-auto flex-shrink-0 ${ 
                      subiendo ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
              >
                  {subiendo ? `Subiendo... ${progreso}%` : "Subir Imagen"}
              </button>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-auto"
          >
            Agregar Producto
          </button>
        </div>
      </form>

      {/* LISTADO DE PRODUCTOS */}
      <div className="max-w-5xl mx-auto px-4"> 
        <h3 className="text-xl font-semibold mt-12 mb-4">Productos agregados</h3>

        {/* Contenedor Flexbox: con wrap, margen negativo y overflow-hidden para la estabilidad */}
        <div className="flex flex-wrap -mx-3 overflow-hidden"> 
          {productos.map((p) => (
            <div
              key={p.id}
              // ¡CLAVE DE LA SOLUCIÓN! w-1/3 para el ancho y flex-shrink-0 para forzarlo
              className="w-full sm:w-1/2 md:w-1/3 p-3 flex-shrink-0" 
            >
              <div className="bg-white rounded-lg shadow overflow-hidden h-full flex flex-col min-w-0">
                  <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="w-32 h-32 object-cover rounded-md mx-auto mt-3" 
                  />
                  <div className="mt-3 flex-1 flex flex-col text-center gap-1 p-3">
                      <h4 className="font-semibold text-lg leading-tight">{p.nombre}</h4>
                      <p className="text-sm text-gray-600 mb-1">{p.categoria}</p>
                      <p className="text-sm text-gray-500 flex-1">{p.descripcion}</p>
                      <div className="font-bold text-indigo-600 mt-2">${p.precio}</div>
                      <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                      <button
                          onClick={() => handleDelete(p.id)}
                          className="mt-3 bg-red-500 text-white text-sm px-3 py-1 rounded-md hover:bg-red-600 w-auto mx-auto" 
                      >
                          Eliminar
                      </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}