import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Admin() {
    // ... (Estados y funciones de Firebase y estado omitidos por brevedad)
    const [formData, setFormData] = useState({ /* ... */ });
    const [mensaje, setMensaje] = useState(null);
    const [tipoMensaje, setTipoMensaje] = useState("");
    const [imagenArchivo, setImagenArchivo] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const productosRef = collection(db, "productos");
    
    useEffect(() => {}, []);
    const mostrarMensaje = (msg, tipo) => { /* ... */ };
    const handleChange = (e) => { /* ... */ };
    const handleUpload = () => { /* ... */ };
    const handleSubmit = async (e) => { /* ... */ };

    // 🔑 CLAVE: Estilos inline para anular el CSS global estricto
    const styleAnchoCorto = { width: '320px', maxWidth: '320px' };
    const styleAnchoDescripcion = { maxWidth: '512px' }; // Maximo 512px para descripcion

    return (
        <> 
            {/* Mensaje de Notificación (Toast) */}
            {mensaje && (
                <div
                    className={`fixed top-6 right-6 px-5 py-3 rounded-lg text-white font-bold shadow-lg z-50 ${
                        tipoMensaje === "exito" ? "bg-green-600" : "bg-red-600"
                    }`}
                >
                    {mensaje}
                </div>
            )}

            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Panel de Administración</h2>

            {/* FORMULARIO: Contenedor más compacto (max-w-lg) y diseño de 2 columnas */}
            <form
                onSubmit={handleSubmit}
                // max-w-lg (512px) y md:grid-cols-2 para uniformidad y simetría
                className="container mx-auto p-8 bg-white rounded-3xl shadow-xl grid gap-x-8 gap-y-6 md:grid-cols-2 max-w-lg mb-10"
            >
                {/* Nombre - COLUMNA 1 */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Nombre</label>
                    <input
                        type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                        // 🔑 CLAVE: Aplicamos style inline con ancho fijo
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" 
                        style={styleAnchoCorto}
                        placeholder="Ej: Televisor LG 55”"
                    />
                </div>
                {/* Precio - COLUMNA 2 */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Precio</label>
                    <input
                        type="number" name="precio" value={formData.precio} onChange={handleChange}
                        // 🔑 CLAVE: Aplicamos style inline con ancho fijo
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        style={styleAnchoCorto}
                        placeholder="Ej: 1200"
                    />
                </div>
                {/* Categoría - COLUMNA 1 */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Categoría</label>
                    <input
                        type="text" name="categoria" value={formData.categoria} onChange={handleChange}
                        // 🔑 CLAVE: Aplicamos style inline con ancho fijo
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        style={styleAnchoCorto}
                        placeholder="Ej: Televisores"
                    />
                </div>
                {/* Stock - COLUMNA 2 */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Stock</label>
                    <input
                        type="number" name="stock" value={formData.stock} onChange={handleChange}
                        // 🔑 CLAVE: Aplicamos style inline con ancho fijo
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        style={styleAnchoCorto}
                        placeholder="Ej: 25"
                    />
                </div>

                {/* DESCRIPCIÓN: Ocupa las dos columnas */}
                <div className="md:col-span-2"> 
                    <label className="block text-sm font-medium mb-1 text-gray-700">Descripción</label>
                    <textarea
                        name="descripcion" value={formData.descripcion} onChange={handleChange}
                        // 🔑 CLAVE: Aplicamos style inline con ancho limitado
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        style={styleAnchoDescripcion} 
                        rows="3" placeholder="Describe el producto..."
                    ></textarea>
                </div>

                {/* IMAGEN: Ocupa las dos columnas */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Imagen</label>
                    
                    <div className="flex items-center gap-3">
                        <input
                            type="file" accept="image/*" onChange={(e) => setImagenArchivo(e.target.files[0])}
                            // 🔑 CLAVE: Aplicamos style inline con ancho limitado al input file
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-500 block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                            style={styleAnchoDescripcion}
                        />
                        <button
                            type="button" onClick={handleUpload} disabled={subiendo}
                            className={`bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg w-auto flex-shrink-0 ${
                                subiendo ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700 shadow-md"
                            }`}
                        >
                            {subiendo ? `Subiendo... ${progreso}%` : "Subir Imagen"}
                        </button>
                    </div>
                </div>

                {/* Botón de Submit (Ocupa dos columnas y se alinea a la derecha) */}
                <div className="md:col-span-2 flex justify-end pt-4"> 
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md w-auto" 
                    >
                        Agregar Producto
                    </button>
                </div>
            </form>
        </>
    );
}