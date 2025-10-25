import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

export default function Productos() {
    
    // ======================================================================
    // ESTADOS Y AUTENTICACIÓN (Tu lógica original que funciona)
    // ======================================================================
    const [esAdmin, setEsAdmin] = useState(false);
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authInstance = getAuth();
        const unsubscribeAuth = onAuthStateChanged(authInstance, (user) => {
            setEsAdmin(!!user); 
        });

        const productosRef = collection(db, 'productos');
        const q = query(productosRef, orderBy('fechaCreacion', 'desc')); 

        const unsubscribeFirestore = onSnapshot(q, 
            (snapshot) => {
                const productosArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProductos(productosArray);
                setCargando(false);
            },
            (err) => {
                console.error("Error al cargar productos de Firestore:", err);
                setError("No se pudieron cargar los productos. Revisa la conexión o las reglas de seguridad.");
                setCargando(false);
            }
        );

        return () => {
            unsubscribeAuth();
            unsubscribeFirestore();
        };
    }, []);

    // ======================================================================
    // FUNCIÓN DE ELIMINACIÓN
    // ======================================================================
    const handleDelete = async (id, nombre) => {
        if (!esAdmin) {
            alert("Acceso denegado. Solo los administradores pueden eliminar productos.");
            return;
        }

        if (!window.confirm(`¿Estás seguro de que quieres eliminar el producto: "${nombre}"? Esta acción es irreversible.`)) {
            return;
        }

        try {
            await deleteDoc(doc(db, "productos", id));
        } catch (err) {
            console.error("Error al eliminar el producto:", err);
            alert("Hubo un error al intentar eliminar el producto. Revisa los permisos.");
        }
    };
    
    // Función de utilería para formatear el precio
    const formatPrice = (price) => {
        if (price === undefined || price === null) return '';
        // Usamos Intl.NumberFormat para un formato de moneda más limpio
        return new Intl.NumberFormat('es-CO', { 
            style: 'currency', 
            currency: 'COP', 
            minimumFractionDigits: 0 
        }).format(Number(price));
    };

    // ======================================================================
    // RENDERIZADO CONDICIONAL Y DISEÑO DE CUADRÍCULA
    // ======================================================================
    if (cargando) {
        return <div className="text-center py-5">Cargando catálogo... <span className="spinner-border spinner-border-sm"></span></div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center">{error}</div>;
    }
    
    if (productos.length === 0) {
        return <div className="alert alert-info text-center">¡El catálogo está vacío!</div>;
    }
    
    return (
        <div className="py-3"> 
            
            <h2 className="text-center fw-bold mb-5 border-bottom pb-3">
                🛒 Catálogo de Productos ({productos.length})
            </h2>
    
            {/* CLAVE: Diseño de cuadrícula de Bootstrap (4 columnas en pantallas grandes) */}
            <div className="row g-4">
                {productos.map((p) => (
                    // Columna: 12 en móvil, 6 en tablet (sm), 4 en md, 3 en desktop (lg/xl)
                    <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div className="card h-100 shadow-sm border-0 position-relative">
                            
                            {/* Etiqueta de Oferta (Simulada) */}
                            {p.stock > 10 && ( 
                                <span className="badge bg-dark position-absolute top-0 end-0 rounded-0 rounded-bottom-0">
                                    ¡Oferta!
                                </span>
                            )}

                            {/* Icono de Corazón/Favorito */}
                            <button className="btn btn-light btn-sm position-absolute top-0 start-0 m-2 rounded-circle" style={{ zIndex: 10 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                  <path d="m8 2.748-.717-.737C5.6.281 2.387 1.155.49 3.197c-.246.25-.47.525-.674.832-.455.688-.847 1.543-1.096 2.513-.243.959-.356 1.954-.356 2.94v.34c0 1.045.183 2.052.54 2.978.36.953.844 1.834 1.442 2.607.618.795 1.341 1.537 2.148 2.22 1.833 1.54 4.545 2.152 7.152 2.152 2.607 0 5.319-.612 7.152-2.152.807-.683 1.53-1.425 2.148-2.22.598-.773 1.082-1.654 1.442-2.607.357-.926.54-1.933.54-2.978v-.34c0-.986-.113-1.981-.356-2.94-.249-.97-.641-1.825-1.096-2.513-.204-.307-.428-.582-.674-.832C13.613 1.155 10.398.281 8.717 2.011L8 2.748zM8.717 1.283c.725-.742 1.848-1.127 3.018-1.127 1.056 0 2.053.385 2.87.971.218.156.408.332.578.53.398.47.747 1.026.974 1.638.169.467.276.956.326 1.46.049.497.054.996.054 1.493v.34c0 .99-.11 1.962-.326 2.919-.227.612-.576 1.168-.974 1.638-.17.198-.36.374-.578.53-.817.586-1.814.971-2.87.971-1.17 0-2.293-.385-3.018-1.127L8 3.52 7.283 1.283z"/>
                                </svg>
                            </button>

                            {/* IMAGEN del Producto */}
                            <div className="p-4 d-flex justify-content-center align-items-center" style={{ height: '180px' }}>
                                <img
                                    src={p.urlImagen} 
                                    alt={p.nombre}
                                    className="img-fluid"
                                    style={{ objectFit: 'contain', maxHeight: '100%' }}
                                />
                            </div>
                            
                            {/* CUERPO de la Tarjeta */}
                            <div className="card-body text-center d-flex flex-column flex-grow-1 border-top">
                                
                                {/* Categoría */}
                                <p className="text-muted small mb-1">{p.categoria}</p>

                                {/* Nombre */}
                                <h5 className="card-title fw-bold fs-6 mb-3 flex-grow-1">
                                    {p.nombre}
                                </h5>

                                {/* Precios */}
                                <div className="mt-auto">
                                    {/* Precio anterior (Simulado) */}
                                    <p className="text-secondary small text-decoration-line-through mb-0">
                                        {p.stock > 0 && formatPrice(Number(p.precio) * 1.3)}
                                    </p>
                                    
                                    {/* Precio de Oferta / Actual */}
                                    <h4 className="fw-bolder text-dark">
                                        {formatPrice(p.precio)}
                                    </h4>
                                </div>
                            </div>

                            {/* Botón de Acción */}
                            <div className="card-footer bg-white border-0 p-3">
                                {esAdmin ? (
                                    // Botón de Admin (Eliminar)
                                    <button
                                        onClick={() => handleDelete(p.id, p.nombre)}
                                        className="btn btn-danger w-100 fw-bold shadow-sm"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                ) : (
                                    // Botón de Cliente (Negro)
                                    <button
                                        disabled={p.stock <= 0}
                                        className={`btn w-100 fw-bold shadow-sm ${p.stock > 0 ? 'btn-dark' : 'btn-secondary'}`}
                                    >
                                        {p.stock > 0 ? "Añadir al carrito" : "Agotado"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}