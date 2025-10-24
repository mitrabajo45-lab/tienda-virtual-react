import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

export default function Productos() {
    
    // ======================================================================
    // ESTADOS
    // ======================================================================
    const [esAdmin, setEsAdmin] = useState(false);
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // ======================================================================
    // EFECTOS y LÓGICA DE CARGA/AUTENTICACIÓN
    // ======================================================================
    useEffect(() => {
        // Lógica de Autenticación
        const authInstance = getAuth();
        const unsubscribeAuth = onAuthStateChanged(authInstance, (user) => {
            setEsAdmin(!!user); 
        });

        // Carga de datos de Firestore en tiempo real
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
            console.log(`Producto ${id} eliminado con éxito.`);
        } catch (err) {
            console.error("Error al eliminar el producto:", err);
            alert("Hubo un error al intentar eliminar el producto. Revisa los permisos.");
        }
    };
    
    // ======================================================================
    // RENDERIZADO
    // ======================================================================
    if (cargando) {
        return <div className="p-10 text-center text-gray-500">Cargando productos...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-600 font-bold">Error: {error}</div>;
    }

    if (productos.length === 0) {
        return <div className="p-10 text-center text-gray-500">Aún no hay productos cargados en la base de datos.</div>;
    }
    
    return (
        <div className="min-h-screen bg-white p-6 md:p-10">
            <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-900 border-b pb-4">
                🛒 Catálogo de Productos ({productos.length})
            </h2>
            
            <div className="container mx-auto grid gap-6 max-w-4xl"> 
                {productos.map((producto) => (
                    // CARD del Producto en formato HORIZONTAL
                    <div 
                        key={producto.id} 
                        className="bg-white rounded-xl shadow-lg overflow-hidden flex border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                    >
                        
                        {/* 1. IMAGEN: Bloque Fijo y Centrado */}
                        {producto.urlImagen && (
                            <div 
                                className="relative flex-shrink-0 p-4 flex justify-center items-center bg-gray-50 border-r border-gray-100" 
                                style={{ width: '16rem', height: '16rem' }}
                            > 
                                <img 
                                    src={producto.urlImagen} 
                                    alt={producto.nombre} 
                                    className="w-full h-full object-contain" 
                                />
                            </div>
                        )}

                        {/* 2. CONTENIDO: Bloque Flexible */}
                        <div className="p-4 flex flex-col justify-between w-full">
                            <div className="flex justify-between items-start mb-2">
                                {/* Bloque de Nombre y Descripción */}
                                <div className="w-full pr-4">
                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                                        {producto.nombre}
                                    </h3>
                                    <span className="inline-block text-indigo-600 text-xs font-semibold mt-1">
                                        {producto.categoria}
                                    </span>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                        {producto.descripcion}
                                    </p>
                                </div>

                                {/* Bloque de Precio y Stock (Derecha) */}
                                <div className="flex flex-col items-end flex-shrink-0 pl-4">
                                    <p className="text-2xl font-extrabold text-red-600">${producto.precio}</p>
                                    <p className={`text-sm font-medium mt-1 ${producto.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        Stock: {producto.stock}
                                    </p>
                                </div>
                            </div>

                            {/* Línea de Acción (Botón Admin) */}
                            <div className="pt-2 border-t border-gray-100 mt-auto">
                                {esAdmin && (
                                    <div className="flex justify-start">
                                        <button
                                            onClick={() => handleDelete(producto.id, producto.nombre)}
                                            className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
                                            style={{ width: 'auto' }} 
                                        >
                                            Eliminar Producto
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}