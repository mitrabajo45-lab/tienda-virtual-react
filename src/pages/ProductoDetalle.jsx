// src/pages/ProductoDetalle.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; // ⬅️ Asegúrate de que esta ruta sea correcta
import { doc, getDoc } from 'firebase/firestore';

export default function ProductoDetalle() {
    // 1. Obtener el ID de la URL
    const { id } = useParams(); 
    
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState(''); 

    // Número de WhatsApp
    const WHATSAPP_NUMBER = "573001234567";

    // 2. Cargar datos del producto
    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError("ID de producto no proporcionado.");
            return;
        }

        const fetchProducto = async () => {
            try {
                const docRef = doc(db, "productos", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    // Lógica para manejar la migración de datos (urlImagen a imagenesUrls)
                    const images = data.imagenesUrls || (data.urlImagen ? [data.urlImagen] : []);
                    data.imagenesUrls = images; 
                    
                    setProducto(data);
                    // Establecer la primera imagen como la principal al cargar
                    setMainImage(images.length > 0 ? images[0] : 'https://via.placeholder.com/600x400/AAAAAA/FFFFFF?text=Imagen+No+Disponible'); 
                } else {
                    setError("Producto no encontrado.");
                }
            } catch (err) {
                console.error("Error al cargar detalle:", err);
                setError("Hubo un error al cargar los detalles del producto.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
    }, [id]);
    
    // Función para manejar el clic de WhatsApp
    const handleWhatsappClick = () => {
        const message = `Hola, estoy interesado en el producto: ${producto.nombre} (Código: ${producto.codigo || 'N/A'}). Marca: ${producto.marca || 'N/A'}. ¿Podrían darme más información?`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    // 3. Renderizado de carga y error
    if (loading) {
        return <div className="container my-5 text-center text-primary fs-5">Cargando detalles del producto...</div>;
    }

    if (error) {
        return <div className="container my-5 alert alert-danger text-center" role="alert">{error}</div>;
    }

    if (!producto) return null;

    // 4. Renderizado Final (Diseño con Bootstrap)
    return (
        <div className="container my-5">
            <div className="row">
                
                {/* Columna de Galería (Imágenes) */}
                <div className="col-md-6">
                    <div className="card shadow-sm p-3 mb-4">
                        {/* Imagen Principal Grande */}
                        <img 
                            src={mainImage} 
                            alt={producto.nombre} 
                            className="img-fluid rounded mb-3"
                            style={{ maxHeight: '450px', objectFit: 'contain', width: '100%' }}
                        />
                        
                        {/* Galería de Miniaturas */}
                        <div className="d-flex flex-wrap gap-2 justify-content-center">
                            {producto.imagenesUrls.length > 0 ? (
                                producto.imagenesUrls.map((url, index) => (
                                    <img 
                                        key={index} 
                                        src={url} 
                                        alt={`Miniatura ${index + 1}`} 
                                        className={`img-thumbnail ${url === mainImage ? 'border-primary border-3' : ''}`}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => setMainImage(url)} // Cambiar imagen principal al hacer clic
                                    />
                                ))
                            ) : (
                                <p className="text-muted">No hay miniaturas disponibles.</p>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Columna de Información */}
                <div className="col-md-6">
                    <h1 className="display-5 fw-bold text-dark">{producto.nombre}</h1>
                    <p className="text-muted small mb-4">
                        <span className="fw-bold text-dark">Marca:</span> {producto.marca} | 
                        <span className="fw-bold text-dark ms-2">Categoría:</span> {producto.categoria}
                    </p>
                    
                    <h3 className="text-primary mt-4">Descripción</h3>
                    <p>{producto.descripcion}</p>
                    
                    {/* ⬇️ CAMBIO A SOLO "Código" */}
                    <p className="fw-bold mt-4">Código: {producto.codigo}</p>

                    {/* Botón de Contacto (WhatsApp) */}
                    <button 
                        className="btn btn-success btn-lg mt-4 w-100"
                        onClick={handleWhatsappClick}
                    >
                        Preguntar por WhatsApp
                    </button>

                </div>
            </div>
        </div>
    );
}