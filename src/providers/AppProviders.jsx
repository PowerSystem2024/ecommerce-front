import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Aquí puedes agregar más providers según necesites:
// - AuthProvider (para autenticación)
// - CartProvider (para el carrito de compras)
// - ThemeProvider (para tema oscuro/claro)
// - ProductProvider (para productos)

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
}
