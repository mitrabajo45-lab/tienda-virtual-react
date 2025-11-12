// src/pages/ProductoDetalle.jsx
// src/pages/ProductoDetalle.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';

export default function ProductoDetalle() {
    const { id } = useParams(); 
    
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState(''); 
    const [isZoomed, setIsZoomed] = useState(false); 
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); 

    const WHATSAPP_NUMBER = "573001234567";
    const isMobile = window.innerWidth < 768; // Helper para estilos condicionales

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
                    const images = data.imagenesUrls || (data.urlImagen ? [data.urlImagen] : []);
                    data.imagenesUrls = images; 
                    
                    setProducto(data);
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
    
    const handleWhatsappClick = () => {
        const message = `Hola, estoy interesado en el producto: ${producto.nombre} (Código: ${producto.codigo || 'N/A'}). Marca: ${producto.marca || 'N/A'}. ¿Podrían darme más información?`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    const handleMouseMove = (e) => {
        if (!isZoomed) return;

        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        setCursorPosition({ x, y });
    };

    const renderDescription = (description) => {
        if (!description) return <p className="text-muted fst-italic">No se proporcionó una descripción detallada.</p>;

        const lines = description.split('\n').filter(line => line.trim() !== '');
        const isList = lines.every(line => /^\s*[-*•\d]/.test(line.trim()));

        if (isList) {
            return (
                <ul className="list-group list-group-flush border-0">
                    {lines.map((line, index) => (
                        <li key={index} className="list-group-item px-0 border-0 bg-transparent text-secondary">
                            <i className="bi bi-check-circle-fill text-success me-2"></i> 
                            {line.replace(/^\s*[-*•\d]\.?\s*/, '').trim()}
                        </li>
                    ))}
                </ul>
            );
        } else {
            return lines.map((paragraph, index) => (
                <p key={index} className="text-secondary mb-3">
                    {paragraph}
                </p>
            ));
        }
    };

    if (loading) {
        return <div className="container my-5 text-center text-primary fs-5">Cargando detalles del producto...</div>;
    }

    if (error) {
        return <div className="container my-5 alert alert-danger text-center" role="alert">{error}</div>;
    }

    if (!producto) return null;

    const zoomStyle = (isZoomed && !isMobile) ? {
        transform: 'scale(2)', 
        transformOrigin: `${cursorPosition.x * 100}% ${cursorPosition.y * 100}%`,
        transition: 'none', 
        objectFit: 'cover'
    } : {
        transform: 'scale(1)',
        transformOrigin: 'center center',
        transition: 'transform 0.3s ease-in-out',
        objectFit: 'contain'
    };


    return (
        <div className="container my-5">
            
            {/* ⬅️ CONTENEDOR PRINCIPAL: GALERÍA E INFORMACIÓN (COLUMNAS) */}
            <div className="row mb-5 pb-5 border-bottom">
                
                {/* ⬅️ Columna IZQUIERDA: Galería (IMAGEN + MINIATURAS) */}
                {/* d-flex flex-column: Móvil (miniaturas encima o debajo de imagen). 
                   flex-md-row: Escritorio (miniaturas a la izquierda de imagen). */}
                <div className="col-md-7 d-flex flex-column flex-md-row"> 
                    
                    {/* 2. Imagen Principal Grande (AHORA CON order-1 EN MÓVIL) */}
                    {/* En móvil: order-1 (se muestra primero) */}
                    {/* En escritorio: order-md-1 (se mantiene como primer elemento en la fila) */}
                    <div 
                        className="card shadow-lg p-3 flex-grow-1 order-1 order-md-1"
                        style={{ height: isMobile ? 'auto' : '32rem', overflow: 'hidden' }} 
                        onMouseEnter={() => setIsZoomed(true)} 
                        onMouseLeave={() => setIsZoomed(false)} 
                        onMouseMove={handleMouseMove} 
                    >
                        <img 
                            src={mainImage} 
                            alt={producto.nombre} 
                            className="img-fluid rounded"
                            style={{ 
                                ...zoomStyle,
                                maxHeight: isZoomed ? 'none' : '100%', 
                                width: '100%', 
                                cursor: (isZoomed && !isMobile) ? 'zoom-out' : 'zoom-in', 
                            }}
                        />
                    </div>

                    {/* 1. Carrusel de Miniaturas (AHORA CON order-2 EN MÓVIL) */}
                    {/* En móvil: order-2 (se muestra segundo, debajo de la imagen) */}
                    {/* En escritorio: order-md-2 (se mantiene como segundo elemento en la fila) */}
                    {producto.imagenesUrls.length > 1 && (
                        <div 
                            className="d-flex flex-row flex-md-column gap-2 mb-3 mb-md-0 me-md-3 p-1 order-2 order-md-2" 
                            style={{ 
                                maxHeight: isMobile ? 'auto' : '32rem', 
                                minWidth: isMobile ? 'auto' : '95px', 
                                boxSizing: 'content-box',
                                overflowY: isMobile ? 'hidden' : 'scroll', 
                                overflowX: isMobile ? 'scroll' : 'hidden', 
                                whiteSpace: isMobile ? 'nowrap' : 'normal',
                                paddingBottom: isMobile ? '10px' : '0' 
                            }}
                        >
                            {producto.imagenesUrls.map((url, index) => (
                                <img 
                                    key={index} 
                                    src={url} 
                                    alt={`Miniatura ${index + 1}`} 
                                    className={`img-thumbnail p-0 ${url === mainImage ? 'border-primary border-3' : 'border-secondary'}`}
                                    style={{ 
                                        width: '80px', 
                                        height: '80px', 
                                        objectFit: 'cover', 
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s',
                                        flexShrink: 0,
                                    }}
                                    onClick={() => { setMainImage(url); setIsZoomed(false); }} 
                                />
                            ))}
                        </div>
                    )}
                </div>
                
                {/* ⬅️ Columna DERECHA: Información Clave y Contacto (5/12) */}
                <div className="col-md-5">
                    <h1 className="display-5 fw-bold text-dark">{producto.nombre}</h1>
                    <p className="text-muted small mb-4">
                        <span className="fw-bold text-dark">Marca:</span> {producto.marca} | 
                        <span className="fw-bold text-dark ms-2">Categoría:</span> {producto.categoria}
                    </p>
                    
                    <p className="fw-bold">Código: {producto.codigo}</p>

                    <button 
                        className="btn btn-success btn-lg mt-3 w-100 shadow" 
                        onClick={handleWhatsappClick}
                    >
                        Preguntar por WhatsApp
                    </button>

                </div>
            </div>

            {/* ⬇️ SECCIÓN: DESCRIPCIÓN (ANCHO COMPLETO) ⬇️ */}
            <div className="row mt-5">
                <div className="col-12">
                    <div className="card shadow-sm p-4">
                        <h3 className="text-primary fw-bold mb-3">
                            Especificaciones y Descripción Detallada
                        </h3>
                        {renderDescription(producto.descripcion)} 
                    </div>
                </div>
            </div>

        </div>
    );
}