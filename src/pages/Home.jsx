// src/pages/Home.jsx

import React from 'react';

export default function Home() {
  return (
    <div className="container text-center my-5 py-5">
      
      {/* Jumbotron/Hero Section con colores de Bootstrap */}
      <div className="p-5 bg-light rounded-3 shadow-sm">
        <h1 className="display-4 fw-bold text-primary mb-3">
          ¡Bienvenido a Mi Almacén! 🛍️
        </h1>
        <p className="fs-5 text-muted mb-4">
          Tu destino para los mejores productos de Audio, Tecnología y Electrodomésticos.
        </p>
        
        {/* Call to Action: Enlace al catálogo de productos */}
        <p className="lead">
          Explora nuestro catálogo completo y encuentra lo que necesitas.
        </p>
        <a 
          className="btn btn-primary btn-lg mt-3" 
          href="/productos" 
          role="button"
        >
          Ver Productos Ahora
        </a>
      </div>
      
      {/* Sección de Breve Información */}
      <div className="row mt-5 pt-4">
        <div className="col-md-4">
          <h3 className="fw-bold text-dark">Calidad Garantizada</h3>
          <p className="text-muted">Solo trabajamos con las mejores marcas y ofrecemos garantía en todos nuestros artículos.</p>
        </div>
        <div className="col-md-4">
          <h3 className="fw-bold text-dark">Atención Personalizada</h3>
          <p className="text-muted">Contáctanos por WhatsApp para recibir información y cotizaciones de inmediato.</p>
        </div>
        <div className="col-md-4">
          <h3 className="fw-bold text-dark">Actualización Constante</h3>
          <p className="text-muted">Nuestro inventario se actualiza semanalmente con las últimas novedades del mercado.</p>
        </div>
      </div>
    </div>
  );
}