import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importar tus páginas existentes
import LandingPage from '../features/landing/page/LandingPage';
import ShopPage from '../features/shop/page/shopPage';
import { DashboardAdmin, AdminProfilePage } from '../features/admin';
import { DashboardContent } from '../features/admin/components';
import AdminUsersPage from '../features/admin/pages/AdminUsersPage';
import CartPage from '../features/cart/pages/cartpage';

// Importar nuevas páginas
import UserProfilePage from '../features/user-profile/pages/UserProfilePage';
import OrderHistoryPage from '../features/order-history/pages/OrderHistoryPage';
import OrderDetailPage from '../features/order-history/pages/OrderDetailPage';
import OrderReviewPage from '../features/order-history/pages/OrderReviewPage';
import PaymentSuccessPage from '../features/payment/pages/PaymentSuccessPage';
import PaymentFailurePage from '../features/payment/pages/PaymentFailurePage';
import PaymentPendingPage from '../features/payment/pages/PaymentPendingPage';

// Importar páginas de autenticación
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import ChangePasswordPage from '../features/auth/pages/ChangePasswordPage';
import UnauthorizedPage from '../features/auth/pages/UnauthorizedPage';
import AboutPage from '../features/landing/page/AboutPage';
import ContactPage from '../features/landing/page/ContactPage';

// Importar componentes de protección de rutas
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import AdminRoute from '../features/auth/components/AdminRoute';

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
      
      {/* Redirigir /orders a /order-history */}
      <Route path="/orders" element={
        <ProtectedRoute>
          <Navigate to="/order-history" replace />
        </ProtectedRoute>
      } />
      
      {/* Rutas de perfil de usuario - Protegidas */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/order-history" element={
        <ProtectedRoute>
          <OrderHistoryPage />
        </ProtectedRoute>
      } />
      <Route path="/orders/:orderId" element={
        <ProtectedRoute>
          <OrderDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/orders/:orderId/review" element={
        <ProtectedRoute>
          <OrderReviewPage />
        </ProtectedRoute>
      } />
      
      {/* Rutas de pago de Mercado Pago */}
      <Route path="/payment/success" element={
        <ProtectedRoute>
          <PaymentSuccessPage />
        </ProtectedRoute>
      } />
      <Route path="/payment/failure" element={
        <ProtectedRoute>
          <PaymentFailurePage />
        </ProtectedRoute>
      } />
      <Route path="/payment/pending" element={
        <ProtectedRoute>
          <PaymentPendingPage />
        </ProtectedRoute>
      } />
      
      {/* Rutas del dashboard de admin - Solo para administradores */}
      <Route path="/admin" element={
        <AdminRoute>
          <DashboardAdmin />
        </AdminRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardContent />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>
      
      {/* Rutas de autenticación */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/change-password" element={
        <ProtectedRoute>
          <ChangePasswordPage />
        </ProtectedRoute>
      } />
      
      {/* Página de acceso denegado */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Ruta de prueba para verificar que las rutas funcionan */}
      <Route path="/test-verify" element={<div>Ruta de prueba funcionando</div>} />
      
      {/* Ruta 404 - debe ir al final */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
