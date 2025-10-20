import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

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
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Subir imagen a Firebase Storage
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
        const progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgreso(Math.round(progreso));
      },
      (error) => {
        console.error("Error al subir imagen:", error);
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
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(lista);

      setFormData({
        nombre: "",
        precio: "",
        categoria: "",
        descripcion: "",
        stock: "",
        imagen: "",
      });
      setImagenArchivo(null);
      mostrarMensaje("✅ Producto guardado correctamente", "exito");
    } catch (error) {
      console.error("Error al guardar producto:", error);
      mostrarMensaje("❌ Error al guardar el producto", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      setProductos(productos.filter((p) => p.id !== id));
      mostrarMensaje("🗑️ Producto eliminado correctamente", "exito");
    } catch (error) {
      console.error("Error al eliminar:", error);
      mostrarMensaje("❌ Error al eliminar producto", "error");
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Panel de Administración
      </h2>

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

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow grid gap-4 sm:grid-cols-2"
      >
        <div className="sm:col-span-1">
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

        <div className="sm:col-span-2">
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

        <div className="sm:col-span-2 flex flex-col gap-2">
          <label className="block text-sm font-medium mb-1">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagenArchivo(e.target.files[0])}
            className="w-full border rounded-md px-3 py-2"
          />
          <button
            type="button"
            onClick={handleUpload}
            disabled={subiendo}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md ${
              subiendo ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {subiendo ? `Subiendo... ${progreso}%` : "Subir Imagen"}
          </button>
        </div>

        <div className="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Agregar Producto
          </button>
        </div>
      </form>

      {/* Lista de productos */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Productos agregados</h3>
      {productos.length === 0 ? (
        <p className="text-gray-500">No hay productos aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {productos.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
            >
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="font-semibold text-lg">{p.nombre}</h4>
                <p className="text-sm text-gray-600 mb-1">{p.categoria}</p>
                <p className="text-sm text-gray-500 flex-1">{p.descripcion}</p>
                <div className="font-bold text-indigo-600 mt-2">
                  ${p.precio}
                </div>
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
      )}
    </div>
  );
}
