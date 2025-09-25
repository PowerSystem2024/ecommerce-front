"use client";

import React from "react";
import { useLocation } from "react-router-dom";

export default function GlobalBackground({ 
  children, 
  className = "", 
  fullHeight = true 
}) {
  const location = useLocation();
  
  // No renderizar el fondo global en la ruta de admin/workflow-view
  const shouldRenderBackground = !location.pathname.includes('/admin/workflow-view/');
  
  if (!shouldRenderBackground) {
    return <>{children}</>;
  }

  return (
    <div 
      className={`w-full ${fullHeight ? 'h-screen min-h-screen' : 'min-h-fit'} bg-white dark:bg-gray-900 transition-colors duration-300 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80' width='40' height='40' fill='none'%3E%3Ccircle fill='%233b82f6' id='pattern-circle' cx='20' cy='20' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        height: fullHeight ? '100vh' : 'auto',
        minHeight: fullHeight ? '100vh' : 'auto',
        position: 'relative',
        marginTop: fullHeight ? '-64px' : '0',
        paddingTop: fullHeight ? '64px' : '0',
      }}
    >
      {children}
    </div>
  );
}
