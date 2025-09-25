import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar tus páginas existentes
import LandingPage from '../features/landing/page/LandingPage';
import DashboardUser from '../features/dashboard-user/pages/dashboardUser';
import DashboardAdmin from '../features/dashboard-admin/pages/dashboardAdmin';

// Página 404
const NotFoundPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <p className="text-gray-600 dark:text-gray-400">Página no encontrada</p>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Ruta principal */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Rutas del dashboard de usuario */}
      <Route path="/dashboard" element={<DashboardUser />} />
      
      {/* Rutas del dashboard de admin */}
      <Route path="/admin" element={<DashboardAdmin />} />
      
      {/* Ruta 404 - debe ir al final */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
