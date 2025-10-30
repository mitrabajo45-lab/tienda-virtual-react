// src/components/CategoryBar.jsx (VERSIÓN FINAL Y SIMPLE)

import React from 'react';

// Lista de Categorías con TODAS las opciones como botones simples
const CATEGORIAS_LIST = [
    { label: "Todos", value: "" }, 
    { label: "Audio y Sonido", value: "Audio" },
    { label: "Televisores (TV)", value: "TV" },
    { label: "Muebles", value: "Muebleria" },
    { label: "Congeladores", value: "Congeladores" },
    { label: "Escritorios", value: "Escritorios" },
    // 🚨 ELIMINAMOS EL BOTÓN DE TECNOLOGÍA AGRUPADOR
    
    // Subcategorías de Tecnología como botones separados
    { label: "Computadores", value: "Tecnologia-Computadores" }, 
    { label: "Celulares", value: "Tecnologia-Celulares" },    
    
    { label: "Electrodomésticos", value: "Electro" }, 
];

export default function CategoryBar({ activeCategory, onCategoryChange }) {
    // Si aún ves el botón de Tecnología dropdown, tienes que buscar en tu código
    // si el botón de Tecnología fue definido ANTES como un dropdown.
    
    return (
        // Estructura limpia de Bootstrap
        <div className="bg-light shadow-sm py-3 border-bottom">
            <nav className="container d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                {CATEGORIAS_LIST.map((cat) => (
                    // SOLAMENTE BOTONES SIMPLES
                    <button
                        key={cat.value}
                        onClick={() => onCategoryChange(cat.value)}
                        className={`btn btn-sm text-uppercase fw-bold ${
                            activeCategory === cat.value ? 'btn-primary text-white' : 'btn-outline-secondary'
                        }`}
                        style={{ minWidth: '100px' }}
                    >
                        {cat.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}