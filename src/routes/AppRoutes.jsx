import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar tus páginas existentes
import LandingPage from '../features/landing/page/LandingPage';
import { ShopLayout } from '../features/shared/components/navigations';
import OrdersPage from '../features/orders/pages/OrdersPage';
import DashboardAdmin from '../features/dashboard-admin/pages/dashboardAdmin';

// Página 404
const NotFoundPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600">Página no encontrada</p>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Ruta principal */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Rutas del shop/e-commerce */}
      <Route path="/shop" element={<ShopLayout />} />
      <Route path="/orders" element={<OrdersPage />} />
      
      {/* Rutas del dashboard de admin */}
      <Route path="/admin" element={<DashboardAdmin />} />
      
      {/* Ruta 404 - debe ir al final */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
