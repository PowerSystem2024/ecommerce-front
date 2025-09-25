import React, { useState, useEffect } from 'react';
import { NavbarAdmin } from './NavbarAdmin';  

export const AdminLayout = ({ children, noScroll }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      // En móvil, cerrar sidebar por defecto
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      {/* Navbar fijo en la parte superior */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarAdmin 
          onMenuToggle={handleMenuToggle}
        />
      </div>

      {/* Contenedor principal con padding-top para el navbar */}
      <div className="flex min-h-screen pt-16 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
        {/* Contenido principal */}
        <main className={`
          flex-1 transition-all duration-300 ${noScroll ? 'overflow-y-hidden' : 'overflow-y-auto'} transition-colors bg-gray-50 dark:bg-gray-900
          ${isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}
        `}>
          <div className="w-full h-full min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};