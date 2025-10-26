import React, { useState, useEffect } from 'react';
import ProductoCard from "../components/ProductoCard"; // ✅ Ajuste de ruta (asumiendo src/pages y src/components)

// IMPORTACIONES DE FIREBASE: DESCOMENTA ESTAS LÍNEAS y asegúrate de que la ruta a tu archivo 'firebase.js' sea correcta
import { db } from '../firebase'; 
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; 

export default function Productos() {
    // ======================================================================
    // ESTADOS Y LÓGICA
    // ======================================================================
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FUNCIÓN DE CARGA: Obtiene datos REALES de Firestore
    const fetchProductos = async () => {
        try {
            // 1. Obtener la referencia a la colección
            const productosCollection = collection(db, "productos");
            
            // 2. Obtener los documentos
            const snapshot = await getDocs(productosCollection);
            
            // 3. Mapear los documentos para incluir el ID
            const data = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            
            return data;
            
        } catch (err) {
            console.error("Error al cargar productos:", err);
            // Propaga un error más amigable para el usuario
            throw new Error("No se pudo conectar con la base de datos para cargar productos.");
        }
    };
    
    // FUNCIÓN DE ELIMINACIÓN: Llama a deleteDoc de Firebase
    const eliminarProducto = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            return;
        }

        try {
            // 1. Referencia al documento:
            const productoDoc = doc(db, "productos", id);
            
            // 2. Eliminar de Firebase
            await deleteDoc(productoDoc);
            
            // 3. Actualizar el estado local (para que se quite de la UI inmediatamente)
            setProductos(prev => prev.filter(p => p.id !== id));
            console.log(`Producto con ID: ${id} eliminado con éxito de Firebase y UI.`);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            alert("Hubo un error al eliminar el producto de la base de datos.");
        }
    };

    // EFECTO: Carga los datos al iniciar el componente
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchProductos();
                setProductos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    
    // ======================================================================
    // RENDERIZADO (Bootstrap 5)
    // ======================================================================
    
    if (loading) {
        return <div className="text-center my-5 fs-4 text-primary">Cargando catálogo...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center my-5" role="alert">Error al cargar el catálogo: {error}</div>;
    }

    return (
        <div className="container my-5">
            {/* Encabezado con badge para el conteo */}
            <h2 className="text-center display-6 mb-4 fw-bold text-dark">
                Catálogo de Productos 
                <span className="badge bg-primary rounded-pill align-middle ms-2">
                    {productos.length}
                </span>
            </h2>

            {/* Grid de Productos con clases de Bootstrap para responsividad */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 my-4">
                
                {/* Mapeo que llama al nuevo componente ProductoCard */}
                {productos.map(producto => (
                    <ProductoCard 
                        key={producto.id} 
                        producto={producto} 
                        onEliminar={eliminarProducto} 
                    />
                ))}

            </div>
            
            {productos.length === 0 && (
                <div className="alert alert-info text-center mt-5" role="alert">
                    No hay productos disponibles en el catálogo.
                </div>
            )}
        </div>
    );
}