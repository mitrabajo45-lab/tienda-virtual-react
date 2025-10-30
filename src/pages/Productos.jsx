import React, { useState, useEffect } from 'react';
import ProductoCard from "../components/ProductoCard";
import CategoryBar from "../components/CategoryBar"; // ⬅️ NUEVA IMPORTACIÓN
import { useNavigate } from 'react-router-dom'; 

// IMPORTACIONES DE FIREBASE
import { db } from '../firebase'; 
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; 

export default function Productos() {
    // ======================================================================
    // ESTADOS
    // ======================================================================
    // ⬇️ ESTADOS DE FILTRADO
    const [productos, setProductos] = useState([]); // Productos MOSTRADOS (filtrados)
    const [allProducts, setAllProducts] = useState([]); // Lista completa de productos cargados
    const [activeCategory, setActiveCategory] = useState(""); // Categoría activa ("" = Todos)

    // ESTADOS AUXILIARES
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    // ======================================================================
    // FUNCIONES DE DATOS Y ADMIN
    // ======================================================================

    // FUNCIÓN DE CARGA: Obtiene datos REALES de Firestore
    const fetchProductos = async () => {
        try {
            const productosCollection = collection(db, "productos");
            const snapshot = await getDocs(productosCollection);
            
            // Lógica de mapeo y gestión de imágenes (Mantenida)
            const data = snapshot.docs.map(doc => {
                const data = doc.data();
                
                let imageArray;
                if (data.imagenesUrls && Array.isArray(data.imagenesUrls)) {
                    imageArray = data.imagenesUrls;
                } else if (data.urlImagen) {
                    imageArray = [data.urlImagen];
                } else {
                    imageArray = [];
                }
                
                return { 
                    id: doc.id, 
                    ...data, 
                    imagenesUrls: imageArray 
                }; 
            });
            
            return data;
            
        } catch (err) {
            console.error("Error al cargar productos:", err);
            throw new Error("No se pudo conectar con la base de datos para cargar productos.");
        }
    };
    
    // FUNCIÓN DE ELIMINACIÓN
    const eliminarProducto = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            return;
        }

        try {
            const productoDoc = doc(db, "productos", id);
            await deleteDoc(productoDoc);
            
            // 🚨 Actualizar ambas listas (completa y filtrada) para refrescar la UI
            setAllProducts(prev => prev.filter(p => p.id !== id));
            setProductos(prev => prev.filter(p => p.id !== id));
            console.log(`Producto con ID: ${id} eliminado con éxito de Firebase y UI.`);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            alert("Hubo un error al eliminar el producto de la base de datos.");
        }
    };

    // FUNCIÓN DE MODIFICACIÓN (Mantenida)
    const modificarProducto = (id) => {
        navigate(`/admin?productoId=${id}`); 
    };

    // FUNCIÓN PARA CAMBIAR LA CATEGORÍA ACTIVA
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    // ======================================================================
    // EFECTOS
    // ======================================================================

    // EFECTO 1: Carga inicial de datos
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchProductos();
                setAllProducts(data); // Guardamos la lista completa
                // setProductos(data); // No es necesario aquí, lo hace el Efecto 2
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // EFECTO 2: Lógica de Filtrado por Categoría
    useEffect(() => {
        if (allProducts.length === 0) {
            setProductos([]); // No hay productos para mostrar
            return;
        }

        if (activeCategory === "") {
            // Si es "Todos", muestra la lista completa
            setProductos(allProducts);
        } else {
            // Filtra por la categoría seleccionada (insensible a mayúsculas/minúsculas)
            const filtered = allProducts.filter(product => {
                const categoriaProducto = product.categoria?.toLowerCase() || '';
                const categoriaFiltro = activeCategory.toLowerCase();
                
                // Usamos includes() para manejar categorías agrupadas (como 'Tecnologia-Celulares')
                return categoriaProducto.includes(categoriaFiltro);
            });
            setProductos(filtered);
        }
    }, [activeCategory, allProducts]); // Depende de la categoría y de la lista completa de productos
    
    // ======================================================================
    // RENDERIZADO
    // ======================================================================
    
    if (loading) {
        return <div className="text-center my-5 fs-4 text-primary">Cargando catálogo...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center my-5" role="alert">Error al cargar el catálogo: {error}</div>;
    }

    return (
        <>
            {/* ⬅️ BARRA DE CATEGORÍAS */}
            <CategoryBar 
                activeCategory={activeCategory} 
                onCategoryChange={handleCategoryChange} 
            />

            <div className="container my-5">
                {/* Encabezado con badge para el conteo */}
                <h2 className="text-center display-6 mb-4 fw-bold text-dark">
                    Catálogo de Productos 
                    <span className="badge bg-primary rounded-pill align-middle ms-2">
                        {productos.length}
                    </span>
                </h2>

                {/* Grid de Productos */}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 my-4">
                    
                    {productos.map(producto => (
                        <ProductoCard 
                            key={producto.id} 
                            producto={producto} 
                            onEliminar={eliminarProducto} 
                            onModificar={modificarProducto} 
                        />
                    ))}

                </div>
                
                {productos.length === 0 && (
                    <div className="alert alert-info text-center mt-5" role="alert">
                        No se encontraron productos {activeCategory ? `en la categoría "${activeCategory}"` : "en el catálogo"}.
                    </div>
                )}
            </div>
        </>
    );
}