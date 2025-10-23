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
    if (!formData.nombre || !formData.precio || !formData.categoria || !formData.descripcion || !formData.stock || !formData.imagen) {
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
    <div className="min-h-screen bg-gray-50 flex justify-center py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">


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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange}
              className="w-full border rounded-md px-3 py-2" placeholder="Ej: Televisor LG 55”" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <input type="number" name="precio" value={formData.precio} onChange={handleChange}
              className="w-full border rounded-md px-3 py-2" placeholder="Ej: 1200" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <input type="text" name="categoria" value={formData.categoria} onChange={handleChange}
              className="w-full border rounded-md px-3 py-2" placeholder="Ej: Televisores" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange}
              className="w-full border rounded-md px-3 py-2" placeholder="Ej: 25" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange}
              className="w-full border rounded-md px-3 py-2" rows="3" placeholder="Describe el producto..."></textarea>
          </div>

          <div className="sm:col-span-2 flex flex-col gap-2">
            <label className="block text-sm font-medium mb-1">Imagen</label>
            <input type="file" accept="image/*" onChange={(e) => setImagenArchivo(e.target.files[0])}
              className="w-full border rounded-md px-3 py-2" />
            <button type="button" onClick={handleUpload} disabled={subiendo}
              className={`bg-blue-600 text-white px-4 py-2 rounded-md ${
                subiendo ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {subiendo ? `Subiendo... ${progreso}%` : "Subir Imagen"}
            </button>
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Agregar Producto
            </button>
          </div>
        </form>

        {/* Lista de productos */}
        {/* --- LISTADO DE PRODUCTOS --- */}
<h3 className="text-xl font-semibold mt-12 mb-4">Productos agregados</h3>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

  {productos.map((p) => (
    <div
  key={p.id}
  className="bg-white rounded-lg shadow overflow-hidden flex flex-col max-w-xs mx-auto p-3"

>

<img
  src={p.imagen}
  alt={p.nombre}
  className="w-32 h-32 object-cover rounded-md border mx-auto mt-3"
/>
      <div className="mt-3 flex-1 flex flex-col text-center gap-1">

        <h4 className="font-semibold text-lg leading-tight">{p.nombre}</h4>
        <p className="text-sm text-gray-600 mb-1">{p.categoria}</p>
        <p className="text-sm text-gray-500 flex-1">{p.descripcion}</p>
        <div className="font-bold text-indigo-600 mt-2">${p.precio}</div>
        <p className="text-sm text-gray-500">Stock: {p.stock}</p>
        <button
          onClick={() => handleDelete(p.id)}
          className="mt-3 bg-red-500 text-white text-sm px-3 py-1 rounded-md hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  ))}
</div>


      </div>
    </div>
  );
}
