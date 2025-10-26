// ProductoCard.jsx

import React from 'react';

// Se reciben las props: el objeto 'producto' y la función 'onEliminar' del padre
const ProductoCard = ({ producto, onEliminar }) => {
    
    // Función para manejar el clic del botón Eliminar
    const handleEliminarClick = () => {
        // Dispara la función recibida, pasando el ID del producto
        onEliminar(producto.id); 
    };

    // Formateo de moneda (asumiendo formato colombiano 'es-CO' y 'COP' como en tu imagen)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
    };

    // Lógica para manejar precios con y sin oferta (asumiendo que tienes un campo de precio y precioAnterior)
    const precioActual = formatCurrency(producto.precio);
    const precioAnterior = producto.precioAnterior ? formatCurrency(producto.precioAnterior) : null;
    const tieneOferta = producto.precioAnterior && producto.precio < producto.precioAnterior;

    return (
        <div className="col">
            <div className="card h-100 shadow-sm border-0 position-relative">
                
                {/* Etiqueta de Oferta (Lógica de Bootstrap) */}
                {tieneOferta && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2 z-1">
                        ¡Oferta!
                    </span>
                )}
                
                <img 
                    src={producto.urlImagen} 
                    className="card-img-top p-3" 
                    alt={producto.nombre} 
                    style={{ objectFit: 'contain', height: '200px' }}
                />
                
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-truncate">{producto.nombre}</h5>
                    <p className="card-text text-muted small">{producto.categoria}</p> 
                    
                    <div className="mt-auto pt-2">
                        {/* Precio Anterior (Tachado) */}
                        {precioAnterior && (
                            <p className="text-decoration-line-through text-secondary mb-0 small">
                                {precioAnterior}
                            </p>
                        )}
                        {/* Precio Actual (Destacado) */}
                        <h4 className="text-danger fw-bold">
                            {precioActual}
                        </h4>
                    </div>
                    
                    {/* Botón de Eliminación (LOGICA CRITICA: Usa el handler local) */}
                    <div className="d-grid mt-3">
                        <button 
                            type="button" 
                            className="btn btn-danger btn-sm"
                            onClick={handleEliminarClick} 
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductoCard;