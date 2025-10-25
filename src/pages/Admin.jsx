import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Admin() {
    
    // ======================================================================
    // ESTADOS
    // ======================================================================
    const [formData, setFormData] = useState({ 
        nombre: "", 
        precio: "", 
        categoria: "", 
        stock: "", 
        descripcion: "", 
        urlImagen: "" 
    });
    const [mensaje, setMensaje] = useState(null);
    const [tipoMensaje, setTipoMensaje] = useState("");
    const [imagenArchivo, setImagenArchivo] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const productosRef = collection(db, "productos");
    
    // ======================================================================
    // FUNCIONES DE UTILIDAD Y LÓGICA
    // ======================================================================
    
    useEffect(() => {}, []);

    const mostrarMensaje = (msg, tipo) => {
        setMensaje(msg);
        setTipoMensaje(tipo);
        setTimeout(() => {
            setMensaje(null);
        }, 4000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpload = () => {
        if (!imagenArchivo) {
            mostrarMensaje("Selecciona un archivo de imagen primero.", "error");
            return;
        }

        const fileName = `${Date.now()}_${imagenArchivo.name}`;
        const storageRef = ref(storage, `imagenes_productos/${fileName}`);

        const uploadTask = uploadBytesResumable(storageRef, imagenArchivo);
        setSubiendo(true);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgreso(progress);
            },
            (error) => {
                setSubiendo(false);
                setProgreso(0);
                console.error("Error al subir imagen:", error);
                mostrarMensaje(`Error de subida: ${error.message}`, "error"); 
            },
            () => {
                setSubiendo(false);
                
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData(prev => ({ ...prev, urlImagen: downloadURL }));
                    mostrarMensaje("Imagen subida con éxito.", "exito");
                });
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.urlImagen) {
            mostrarMensaje("Debes subir la imagen primero usando el botón 'Subir Imagen'.", "error");
            return;
        }

        if (!formData.nombre || !formData.precio || !formData.categoria || !formData.stock) {
            mostrarMensaje("Por favor, completa todos los campos del formulario.", "error");
            return;
        }

        try {
            await addDoc(productosRef, {
                nombre: formData.nombre,
                precio: Number(formData.precio),
                categoria: formData.categoria,
                stock: Number(formData.stock),
                descripcion: formData.descripcion,
                urlImagen: formData.urlImagen, 
                fechaCreacion: new Date(),
            });

            mostrarMensaje("Producto agregado con éxito a Firestore.", "exito");
            
            // Limpiar formulario y estados
            setFormData({ nombre: "", precio: "", categoria: "", stock: "", descripcion: "", urlImagen: "" });
            setImagenArchivo(null);
            setProgreso(0);
        } catch (error) {
            console.error("Error al agregar producto:", error);
            mostrarMensaje("Error al guardar el producto en Firestore.", "error");
        }
    };

    // ======================================================================
    // RENDERIZADO
    // ======================================================================
    return (
        // Contenedor principal para centrar el contenido debajo del Navbar
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen"> 
            
            {/* Mensaje de Notificación (Toast) */}
            {mensaje && (
                <div
                    className={`fixed top-6 right-6 px-5 py-3 rounded-lg text-white font-bold shadow-xl z-50 transition-opacity duration-300 ${
                        tipoMensaje === "exito" ? "bg-green-600" : "bg-red-600"
                    }`}
                >
                    {mensaje}
                </div>
            )}

            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Panel de Administración</h2>

            <form
                onSubmit={handleSubmit}
                // 🔑 CLASE ACTUALIZADA: max-w-3xl y grid-cols-4 para mejor distribución
                className="mx-auto p-8 bg-white rounded-xl shadow-2xl grid gap-x-8 gap-y-6 md:grid-cols-4 max-w-3xl" 
            >
                {/* Nombre (columna 1) */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Nombre</label>
                    <input
                        type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm" 
                        placeholder="Ej: Televisor LG 55”"
                    />
                </div>

                {/* Precio (columna 2) */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Precio</label>
                    <input
                        type="number" name="precio" value={formData.precio} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                        placeholder="Ej: 1200"
                    />
                </div>

                {/* Categoría (columna 3) */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Categoría</label>
                    <input
                        type="text" name="categoria" value={formData.categoria} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                        placeholder="Ej: Televisores"
                    />
                </div>

                {/* Stock (columna 4) */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Stock</label>
                    <input
                        type="number" name="stock" value={formData.stock} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                        placeholder="Ej: 25"
                    />
                </div>

                {/* DESCRIPCIÓN (Ocupa las 4 columnas) */}
                <div className="md:col-span-4"> 
                    <label className="block text-sm font-medium mb-1 text-gray-700">Descripción</label>
                    <textarea
                        name="descripcion" value={formData.descripcion} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm resize-none"
                        rows="3" placeholder="Describe el producto..."
                    ></textarea>
                </div>

                {/* IMAGEN (Ocupa las 4 columnas) */}
                <div className="md:col-span-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Imagen</label>
                    
                    <div className="flex items-center gap-3">
                        <input
                            type="file" accept="image/*" onChange={(e) => setImagenArchivo(e.target.files[0])}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-500 block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 shadow-sm" 
                        />
                        <button
                            type="button" onClick={handleUpload} disabled={subiendo || !imagenArchivo}
                            className={`bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg w-auto flex-shrink-0 transition duration-150 shadow-md ${
                                subiendo ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
                            }`}
                        >
                            {subiendo ? `Subiendo... ${progreso}%` : "Subir Imagen"}
                        </button>
                    </div>
                    {formData.urlImagen && (
                        <p className="text-sm text-green-600 mt-2">✅ Imagen cargada y URL lista.</p>
                    )}
                </div>

                {/* Botón de Submit (Ocupa las 4 columnas y centrado) */}
                <div className="md:col-span-4 flex justify-center pt-4"> 
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md w-auto" 
                    >
                        Agregar Producto
                    </button>
                </div>
            </form>
        </div>
    );
}