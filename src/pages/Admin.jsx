import React, { useState, useEffect } from "react";
// Importaciones de Firebase para CREAR y MODIFICAR
import { db, storage } from "../firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// Importaciones de Router para leer la URL y navegar
import { useSearchParams, useNavigate } from "react-router-dom"; 

// ======================================================================
// DEFINICIÓN DE CATEGORÍAS FIJAS
// ======================================================================
const CATEGORIAS_PRODUCTOS = [
    { label: "Audio", value: "Audio" },
    { label: "Televisores (TV)", value: "TV" },
    { label: "Mueblería", value: "Muebleria" },
    { label: "Congeladores", value: "Congeladores" },
    { label: "Escritorios", value: "Escritorios" },
    { label: "Sillas de Oficina", value: "Sillas Oficina" },
    { label: "Tecnología", options: [
        { label: "Computadores", value: "Tecnologia-Computadores" },
        { label: "Celulares", value: "Tecnologia-Celulares" }
    ]},
    { label: "Electro Menores", options: [
        { label: "Licuadoras", value: "Electro-Licuadoras" },
        { label: "Sanducheras", value: "Electro-Sanducheras" },
        { label: "Vajillas", value: "Electro-Vajillas" },
        { label: "Freidoras", value: "Electro-Freidoras" },
        { label: "Hornos", value: "Electro-Hornos" },
        { label: "Estufas", value: "Electro-Estufas" },
        { label: "Baldes", value: "Electro-Baldes" },
        { label: "Cestas", value: "Electro-Cestas" },
        { label: "Cubiertos", value: "Electro-Cubiertos" },
        { label: "Extractores de Jugo", value: "Electro-Extractores" }
    ]}
];

export default function Admin() {
    
    // ======================================================================
    // ESTADOS (ACTUALIZADO: 'urlImagen' reemplazado por 'imagenesUrls' ARRAY)
    // ======================================================================
    const [formData, setFormData] = useState({ 
        nombre: "", 
        categoria: "", 
        codigo: "",        
        descripcion: "", 
        marca: "",         
        imagenesUrls: []   // ⬅️ ARRAY para URLs
    });
    const [mensaje, setMensaje] = useState(null);
    const [tipoMensaje, setTipoMensaje] = useState("");
    const [imagenArchivo, setImagenArchivo] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);

    const productosRef = collection(db, "productos");

    // Lógica de Edición
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const productoId = searchParams.get("productoId"); 
    const [isEditing, setIsEditing] = useState(false); 
    
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

    // FUNCIÓN PARA ELIMINAR UNA IMAGEN DEL ARRAY DE VISTA PREVIA
    const handleRemoveImage = (indexToRemove) => {
        const newUrls = formData.imagenesUrls.filter((_, index) => index !== indexToRemove);
        setFormData(prev => ({ 
            ...prev, 
            imagenesUrls: newUrls 
        }));
        mostrarMensaje(`Imagen ${indexToRemove + 1} eliminada de la galería local.`, "info");
    };


    // FUNCIÓN handleUpload (ACTUALIZADO: Agrega la URL a un array)
    const handleUpload = () => {
        if (!imagenArchivo) {
            mostrarMensaje("Selecciona un archivo de imagen primero.", "error");
            return;
        }
        
        if (formData.imagenesUrls.length >= 5) {
            mostrarMensaje("Máximo 5 imágenes permitidas en la galería.", "error");
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
                    // AÑADIR LA NUEVA URL AL ARRAY EXISTENTE
                    setFormData(prev => ({ 
                        ...prev, 
                        imagenesUrls: [...prev.imagenesUrls, downloadURL] 
                    }));
                    // Limpiar el archivo seleccionado para permitir otra subida
                    setImagenArchivo(null); 
                    mostrarMensaje(`Imagen ${formData.imagenesUrls.length + 1} subida con éxito.`, "exito");
                });
            }
        );
    };

    // ======================================================================
    // EFECTO DE CARGA PARA EDICIÓN
    // ======================================================================
    useEffect(() => {
        if (productoId) {
            setIsEditing(true);
            const fetchProducto = async () => {
                try {
                    const docRef = doc(db, "productos", productoId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        
                        // Cargar datos en el formulario: Inicializa imagenesUrls como array
                        const loadedData = { 
                            ...data,
                            imagenesUrls: data.imagenesUrls || [], // ⬅️ Carga el array de URLs
                            codigo: data.codigo || "",
                            marca: data.marca || "",
                        };
                        setFormData(loadedData);
                        mostrarMensaje("Modo Modificación: Producto cargado.", "info"); 
                    } else {
                        mostrarMensaje("Producto para modificar no encontrado.", "error");
                        navigate("/admin", { replace: true });
                    }
                } catch (error) {
                    mostrarMensaje("Error al cargar datos de edición.", "error");
                    navigate("/admin", { replace: true });
                }
            };
            fetchProducto();
        } else {
            // Modo Creación
            setIsEditing(false);
            // Limpia el estado inicial correctamente
            setFormData({ nombre: "", categoria: "", codigo: "", descripcion: "", marca: "", imagenesUrls: [] });
        }
    }, [productoId, navigate]);

    // ======================================================================
    // FUNCIÓN handleSubmit (UNIFICADA)
    // ======================================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validaciones
        if (formData.imagenesUrls.length === 0) { // ⬅️ Validación de ARRAY
            mostrarMensaje("Debes subir al menos una imagen a la galería.", "error");
            return;
        }
        if (!formData.nombre || !formData.categoria || !formData.codigo || !formData.marca) {
            mostrarMensaje("Por favor, completa el nombre, categoría, código y marca.", "error");
            return;
        }

        // Objeto de datos a guardar (Incluye el array de URLs y NO el precio)
        const dataToSave = {
            nombre: formData.nombre,
            categoria: formData.categoria,
            codigo: formData.codigo,
            descripcion: formData.descripcion,
            marca: formData.marca,
            imagenesUrls: formData.imagenesUrls, // ⬅️ Guardando el array completo
        };

        try {
            if (isEditing) {
                // MODO MODIFICAR
                const productoDoc = doc(db, "productos", productoId);
                await updateDoc(productoDoc, dataToSave);
                mostrarMensaje("Producto MODIFICADO con éxito.", "exito");
            } else {
                // MODO CREAR
                await addDoc(productosRef, {
                    ...dataToSave,
                    fechaCreacion: new Date(), 
                });
                mostrarMensaje("Producto AGREGADO con éxito.", "exito");
            }
            
            // Limpiar formulario y salir del modo edición después de la operación
            setFormData({ nombre: "", categoria: "", codigo: "", descripcion: "", marca: "", imagenesUrls: [] });
            setImagenArchivo(null);
            setProgreso(0);
            setIsEditing(false);
            
            if (isEditing) {
                navigate("/admin", { replace: true });
            }

        } catch (error) {
            console.error("Error al guardar/modificar producto:", error);
            mostrarMensaje("Error en la operación con Firestore.", "error");
        }
    };

    // ======================================================================
    // RENDERIZADO (Diseño con Bootstrap 5) - JSX FINAL
    // ======================================================================
    return (
        <div className="container my-5"> 
            
            {/* Mensaje de Notificación (Toast flotante) */}
            {mensaje && (
                <div 
                    className={`alert alert-${tipoMensaje === "exito" ? "success" : "danger"} 
                                fixed-top end-0 m-4 shadow-lg`}
                    style={{ zIndex: 1050 }} 
                    role="alert"
                >
                    {mensaje}
                </div>
            )}

            {/* TÍTULO DINÁMICO */}
            <h2 className="mb-5 text-center text-primary fw-bold">
                {isEditing ? "MODIFICAR PRODUCTO EXISTENTE" : "AGREGAR NUEVO PRODUCTO"}
            </h2>

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
                                    
                                    {/* NOMBRE DEL PRODUCTO */}
                                    <div className="col-md-6">
                                        <label htmlFor="nombre" className="form-label fw-bold">NOMBRE DEL PRODUCTO</label>
                                        <input
                                            type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                                            className="form-control" 
                                            id="nombre" placeholder="Ej: Parlante de Torre JLC" required
                                        />
                                    </div>

                                    {/* MARCA */}
                                    <div className="col-md-6">
                                        <label htmlFor="marca" className="form-label fw-bold">MARCA</label>
                                        <input
                                            type="text" name="marca" value={formData.marca} onChange={handleChange}
                                            className="form-control" 
                                            id="marca" placeholder="Ej: Samsung, LG, Oster" required
                                        />
                                    </div>


                                    {/* CATEGORÍA (CAMPO DESPLEGABLE) */}
                                    <div className="col-md-6">
                                        <label htmlFor="categoria" className="form-label fw-bold">CATEGORÍA</label>
                                        <select
                                            name="categoria" 
                                            value={formData.categoria} 
                                            onChange={handleChange}
                                            className="form-select"
                                            id="categoria" 
                                            required
                                        >
                                            <option value="" disabled>Seleccionar Categoría...</option>
                                            {CATEGORIAS_PRODUCTOS.map((cat, index) => (
                                                cat.options ? (
                                                    // Es un grupo de opciones (optgroup)
                                                    <optgroup key={index} label={cat.label}>
                                                        {cat.options.map((opt) => (
                                                            <option key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ) : (
                                                    // Es una opción simple
                                                    <option key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </option>
                                                )
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {/* CÓDIGO */}
                                    <div className="col-md-6">
                                        <label htmlFor="codigo" className="form-label fw-bold">CÓDIGO</label>
                                        <input
                                            type="text" name="codigo" value={formData.codigo} onChange={handleChange}
                                            className="form-control"
                                            id="codigo" placeholder="Ej: JLC-15CYDL" required
                                        />
                                    </div>

                                    {/* DESCRIPCIÓN */}
                                    <div className="col-12"> 
                                        <label htmlFor="descripcion" className="form-label fw-bold">DESCRIPCIÓN</label>
                                        <textarea
                                            name="descripcion" value={formData.descripcion} onChange={handleChange}
                                            className="form-control"
                                            id="descripcion" rows="3" placeholder="Detalles técnicos y características principales..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CARD 2: Gestión de Imagen y Subida (Galería) */}
                        <div className="card shadow-lg mb-4">
                            <div className="card-header bg-light text-primary fw-bold">
                                Subida de Imágenes (Galería)
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
                                            disabled={subiendo || formData.imagenesUrls.length >= 5}
                                        />
                                        <div className="form-text">Máximo 5 imágenes.</div>
                                    </div>
                                    
                                    <div className="col-md-4 d-grid">
                                        <button
                                            type="button" onClick={handleUpload} 
                                            disabled={subiendo || !imagenArchivo || formData.imagenesUrls.length >= 5}
                                            className={`btn btn-primary ${subiendo ? "disabled" : ""}`}
                                        >
                                            {subiendo ? `Subiendo... ${progreso}%` : "Añadir Imagen a Galería"}
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

                                    {/* VISTA PREVIA Y GESTIÓN DE LAS IMÁGENES SUBIDAS */}
                                    {formData.imagenesUrls.length > 0 && (
                                        <div className="col-12 mt-3">
                                            <h6 className="fw-bold">Galería de Imágenes ({formData.imagenesUrls.length})</h6>
                                            <div className="d-flex flex-wrap gap-2">
                                                {formData.imagenesUrls.map((url, index) => (
                                                    <div key={index} className="position-relative border p-1 rounded">
                                                        <img src={url} alt={`Vista ${index + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0"
                                                            style={{ lineHeight: '1', width: '20px', height: '20px' }}
                                                            onClick={() => handleRemoveImage(index)}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-success fw-bold mt-2">
                                                ✅ Galería lista para guardar.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botón de Submit Final - DINÁMICO */}
                        <div className="d-grid gap-2 col-md-6 mx-auto mt-5"> 
                            <button
                                type="submit"
                                className={`btn ${isEditing ? 'btn-warning' : 'btn-success'} btn-lg shadow-sm`} 
                            >
                                {isEditing ? "GUARDAR MODIFICACIONES" : "AGREGAR PRODUCTO"}
                            </button>
                            
                            {/* BOTÓN CANCELAR (Visible solo en modo Edición) */}
                            {isEditing && (
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-lg"
                                    onClick={() => navigate("/admin", { replace: true })}
                                >
                                    Cancelar Edición
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}