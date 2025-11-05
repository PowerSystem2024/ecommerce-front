"use client";

import React from "react";
import { useLocation } from "react-router-dom";

export default function GlobalBackground({ 
  children, 
  className = "", 
  fullHeight = true,
  style = {}
}) {
  const location = useLocation();
  
  // No renderizar el fondo global en la ruta de admin/workflow-view
  const shouldRenderBackground = !location.pathname.includes('/admin/workflow-view/');
  
  if (!shouldRenderBackground) {
    return <>{children}</>;
  }

  const heightClass = fullHeight ? 'min-h-screen' : 'h-full';

  return (
    <div className={`w-full ${heightClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
