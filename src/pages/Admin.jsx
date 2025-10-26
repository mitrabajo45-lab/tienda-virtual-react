import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Admin() {
    
    // ======================================================================
    // ESTADOS (Sin cambios en la lógica)
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
    // FUNCIONES DE UTILIDAD Y LÓGICA (Sin cambios en la lógica)
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
            mostrarMensaje("Por favor, completa todos los campos requeridos.", "error");
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
    // RENDERIZADO (Diseño con Bootstrap 5)
    // ======================================================================
    return (
        // Contenedor principal con margen superior e inferior y centrado
        <div className="container my-5"> 
            
            {/* Mensaje de Notificación (Toast flotante) */}
            {mensaje && (
                <div 
                    className={`alert alert-${tipoMensaje === "exito" ? "success" : "danger"} 
                                fixed-top end-0 m-4 shadow-lg`}
                    style={{ zIndex: 1050 }} // Estilo para asegurar que esté encima de otros elementos
                    role="alert"
                >
                    {mensaje}
                </div>
            )}

            <h2 className="mb-5 text-center text-primary fw-bold">Panel de Administración de Productos</h2>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <form onSubmit={handleSubmit}>
                        
                        {/* CARD 1: Información Principal */}
                        <div className="card shadow-lg mb-4">
                            <div className="card-header bg-light text-primary fw-bold">
                                Información Básica del Producto
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    
                                    {/* Nombre */}
                                    <div className="col-md-6">
                                        <label htmlFor="nombre" className="form-label fw-bold">Nombre</label>
                                        <input
                                            type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                                            className="form-control" 
                                            id="nombre" placeholder="Ej: Televisor LG 55”" required
                                        />
                                    </div>

                                    {/* Categoría */}
                                    <div className="col-md-6">
                                        <label htmlFor="categoria" className="form-label fw-bold">Categoría</label>
                                        <input
                                            type="text" name="categoria" value={formData.categoria} onChange={handleChange}
                                            className="form-control"
                                            id="categoria" placeholder="Ej: Audio/Video" required
                                        />
                                    </div>

                                    {/* Precio */}
                                    <div className="col-md-6">
                                        <label htmlFor="precio" className="form-label fw-bold">Precio ($)</label>
                                        <input
                                            type="number" name="precio" value={formData.precio} onChange={handleChange}
                                            className="form-control"
                                            id="precio" placeholder="Ej: 1200000" required
                                        />
                                    </div>

                                    {/* Stock */}
                                    <div className="col-md-6">
                                        <label htmlFor="stock" className="form-label fw-bold">Stock</label>
                                        <input
                                            type="number" name="stock" value={formData.stock} onChange={handleChange}
                                            className="form-control"
                                            id="stock" placeholder="Ej: 25" required
                                        />
                                    </div>

                                    {/* DESCRIPCIÓN (Ocupa todo el ancho) */}
                                    <div className="col-12"> 
                                        <label htmlFor="descripcion" className="form-label fw-bold">Descripción</label>
                                        <textarea
                                            name="descripcion" value={formData.descripcion} onChange={handleChange}
                                            className="form-control"
                                            id="descripcion" rows="3" placeholder="Detalles técnicos y características principales..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CARD 2: Gestión de Imagen y Subida */}
                        <div className="card shadow-lg mb-4">
                            <div className="card-header bg-light text-primary fw-bold">
                                Subida de Imagen
                            </div>
                            <div className="card-body">
                                <div className="row align-items-center g-3">
                                    <div className="col-md-8">
                                        <label htmlFor="imagen" className="form-label fw-bold">Seleccionar Archivo</label>
                                        <input
                                            className="form-control" 
                                            type="file" 
                                            id="imagen" 
                                            accept="image/*" 
                                            onChange={(e) => setImagenArchivo(e.target.files[0])}
                                        />
                                        <div className="form-text">Sube una imagen JPG o PNG para el producto.</div>
                                    </div>
                                    
                                    <div className="col-md-4 d-grid">
                                        <button
                                            type="button" onClick={handleUpload} disabled={subiendo || !imagenArchivo}
                                            className={`btn btn-primary ${subiendo ? "disabled" : ""}`}
                                        >
                                            {subiendo ? `Subiendo... ${progreso}%` : "Subir Imagen"}
                                        </button>
                                    </div>
                                    
                                    {/* Barra de Progreso */}
                                    {subiendo && (
                                        <div className="col-12 mt-3">
                                            <div className="progress">
                                                <div 
                                                    className="progress-bar progress-bar-striped progress-bar-animated" 
                                                    role="progressbar" 
                                                    style={{ width: `${progreso}%` }} 
                                                    aria-valuenow={progreso} 
                                                    aria-valuemin="0" 
                                                    aria-valuemax="100"
                                                >
                                                    {progreso}%
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Feedback de URL lista */}
                                    {formData.urlImagen && (
                                        <div className="col-12">
                                            <p className="text-success fw-bold mt-2">
                                                ✅ Imagen cargada: URL lista para guardar.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botón de Submit Final */}
                        <div className="d-grid gap-2 col-md-6 mx-auto mt-5"> 
                            <button
                                type="submit"
                                className="btn btn-success btn-lg shadow-sm" 
                            >
                                AGREGAR PRODUCTO
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}