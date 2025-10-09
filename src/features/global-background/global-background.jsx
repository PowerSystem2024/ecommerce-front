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
    <div className={`w-full h-full ${className}`}>
      {children}
    </div>
  );
}
