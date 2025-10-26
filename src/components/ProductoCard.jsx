// ProductoCard.jsx

import React from 'react';
import { useAuth } from "../context/AuthContext"; 
import { Link } from 'react-router-dom'; 

const WHATSAPP_NUMBER = "573001234567"; 

// Se reciben las props: el objeto 'producto', y las funciones de administración
const ProductoCard = ({ producto, onEliminar, onModificar }) => {
    
    const { isAdmin } = useAuth(); 

    // Funciones para manejar los clics de administración
    const handleEliminarClick = () => {
        onEliminar(producto.id); 
    };

    const handleModificarClick = () => {
        onModificar(producto.id);
    };

    // Función para manejar el clic de WhatsApp
    const handleWhatsappClick = () => {
        const message = `Hola, estoy interesado en el producto: ${producto.nombre} (Código: ${producto.codigo || 'N/A'}). Marca: ${producto.marca || 'N/A'}. ¿Podrían darme más información?`;
        const encodedMessage = encodeURIComponent(message);
        
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    // Lógica para manejar la etiqueta de oferta (se mantiene)
    const tieneOferta = producto.precioAnterior && producto.precio < producto.precioAnterior;
    
    // Lógica de URL de IMAGEN PRINCIPAL 
    const primaryImageUrl = (producto.imagenesUrls && producto.imagenesUrls.length > 0) 
        ? producto.imagenesUrls[0] 
        : 'https://via.placeholder.com/400x300/CCCCCC/808080?text=SIN+IMAGEN'; // Placeholder por defecto

    return (
        <div className="col">
            
            {/* ⬇️ INYECTAMOS EL ESTILO CSS PARA EL EFECTO HOVER */}
            <style jsx="true">{`
                .card-hover-effect {
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                }
                .card-hover-effect:hover {
                    /* Ligeramente más grande y levantada */
                    transform: translateY(-5px) scale(1.02); 
                    /* Sombra más intensa para simular que flota */
                    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important; 
                    z-index: 10; /* Asegura que flote sobre otras tarjetas */
                }
            `}</style>

            {/* ⬇️ AÑADIMOS LA CLASE 'card-hover-effect' AL DIV PRINCIPAL DE LA TARJETA */}
            <div className="card h-100 shadow-sm border-0 position-relative card-hover-effect">
                
                {/* Etiqueta de Oferta (Se mantiene) */}
                {tieneOferta && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2 z-1">
                        ¡Oferta!
                    </span>
                )}
                
                {/* ENVOLVER LA IMAGEN CON EL LINK PARA NAVEGAR AL DETALLE */}
                <Link to={`/productos/${producto.id}`} className="d-block">
                    <img 
                        src={primaryImageUrl} 
                        className="card-img-top p-3" 
                        alt={producto.nombre} 
                        style={{ objectFit: 'contain', height: '200px' }}
                    />
                </Link>
                
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-truncate">{producto.nombre}</h5>
                    
                    {/* MOSTRAMOS LA MARCA Y EL CÓDIGO */}
                    <p className="card-text text-primary small fw-bold mb-0">{producto.marca}</p> 
                    <p className="card-text text-muted small mb-1">
                        Código: <span className="fw-bold text-dark">{producto.codigo}</span>
                    </p>
                    <p className="card-text text-muted small">{producto.categoria}</p> 
                    
                    {/* Botón de WhatsApp (Visible para todos) */}
                    <div className="d-grid mt-auto pt-2">
                        <button 
                            type="button" 
                            className="btn btn-success fw-bold" 
                            onClick={handleWhatsappClick}
                        >
                            Preguntar por WhatsApp
                        </button>
                    </div>

                    {/* BOTONES DE ADMINISTRACIÓN (SOLO SI ES ADMIN) */}
                    {isAdmin && (
                        <div className="d-flex justify-content-between mt-3 gap-2"> 
                            
                            {/* BOTÓN MODIFICAR */}
                            <button 
                                type="button" 
                                className="btn btn-info btn-sm flex-fill text-white" 
                                onClick={handleModificarClick} 
                            >
                                Modificar
                            </button>
                            
                            {/* BOTÓN ELIMINAR */}
                            <button 
                                type="button" 
                                className="btn btn-danger btn-sm flex-fill" 
                                onClick={handleEliminarClick} 
                            >
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductoCard;