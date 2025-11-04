import React, { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AdminLayout } from '../../shared/components/navigations';
import { useAuth } from '../../../features/auth/context/AuthContext';

export default function DashboardAdmin() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir /admin a /admin/dashboard
  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
  }, [location, navigate]);

  useEffect(() => {
    // Redirigir si no está autenticado
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // Verificar rol de administrador
    if (!loading && isAuthenticated && user?.role !== 'admin') {
      navigate('/unauthorized');
      return;
    }
  }, [isAuthenticated, loading, user, navigate, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 rounded-full animate-spin border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // La redirección se maneja en el efecto
  }

  return (
    <AdminLayout noScroll={false}>
      <Outlet />
    </AdminLayout>
  );
}
