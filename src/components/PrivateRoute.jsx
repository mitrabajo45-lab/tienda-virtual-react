import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function PrivateRoute() {
    // Obtiene el estado de autenticación y permisos desde el contexto
    const { user, isAdmin, loading } = useAuth(); 

    // Muestra un indicador de carga mientras se verifica el estado de autenticación inicial
    if (loading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    // Lógica de Protección:
    // 1. Si hay un usuario logueado (user) Y
    // 2. Ese usuario está marcado como administrador (isAdmin)
    if (user && isAdmin) {
        // Permite el acceso a la ruta anidada (Admin.jsx en este caso)
        return <Outlet />;
    }

    // Si no cumple la condición (no logueado O no es admin), redirige al login
    return <Navigate to="/login" replace />;
}