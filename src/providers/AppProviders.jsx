import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../features/cart/context/CartContext';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { ToasterProvider } from './ToasterProvider';

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToasterProvider />
          {children}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
