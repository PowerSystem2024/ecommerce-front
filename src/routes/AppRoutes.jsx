import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar tus páginas existentes
import LandingPage from '../features/landing/page/LandingPage';
import ShopPage from '../features/shop/page/shopPage';
import OrdersPage from '../features/orders/pages/OrdersPage';
import DashboardAdmin from '../features/dashboard-admin/pages/dashboardAdmin';
import CartPage from '../features/cart/pages/cartpage';

// Importar páginas de autenticación
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import ChangePasswordPage from '../features/auth/pages/ChangePasswordPage';
import AboutPage from '../features/landing/page/AboutPage';
import ContactPage from '../features/landing/page/ContactPage';

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
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Rutas del shop/e-commerce */}
      <Route path="/shop" element={<ShopPage />} />
  <Route path="/cart" element={<CartPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      
      {/* Rutas del dashboard de admin */}
      <Route path="/admin" element={<DashboardAdmin />} />
      
      {/* Rutas de autenticación */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      
      {/* Ruta de prueba para verificar que las rutas funcionan */}
      <Route path="/test-verify" element={<div>Ruta de prueba funcionando</div>} />
      
      {/* Ruta 404 - debe ir al final */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
