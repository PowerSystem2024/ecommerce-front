import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../features/cart/context/CartContext';
import { AuthProvider } from '../features/auth/context/AuthContext';

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
