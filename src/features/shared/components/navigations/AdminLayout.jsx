import React, { useState, useEffect } from 'react';
import { NavbarAdmin } from './NavbarAdmin';  
import GlobalBackground from '../../../global-background/global-background';

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
    <div className="min-h-screen">
      {/* Background fijo que ocupa toda la pantalla (no tapa la navbar) */}
      <GlobalBackground 
        className="fixed top-0 left-0 right-0 bottom-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80' width='40' height='40' fill='none'%3E%3Ccircle fill='%23fca5a5' id='pattern-circle' cx='20' cy='20' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          backgroundColor: 'white'
        }}
      />
      {/* Navbar fijo en la parte superior */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarAdmin 
          onMenuToggle={handleMenuToggle}
        />
      </div>

      {/* Contenedor principal con padding-top para el navbar */}
      <div className="flex min-h-screen pt-16 relative z-10">
        {/* Contenido principal */}
        <main className={`
          flex-1 ${noScroll ? 'overflow-y-hidden' : 'overflow-y-auto'} 
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