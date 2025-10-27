import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente para proteger rutas que requieren autenticación
 * Redirige a /login si el usuario no está autenticado
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F0F10]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E11D74] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-['Rajdhani',_sans-serif] text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login guardando la ubicación actual
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar el contenido
  return children;
}