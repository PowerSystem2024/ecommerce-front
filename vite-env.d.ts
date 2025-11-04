/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API
  readonly VITE_API_URL: string;
  
  // Frontend
  readonly VITE_FRONTEND_URL: string;
  
  // MercadoPago
  readonly VITE_MERCADOPAGO_PUBLIC_KEY: string;
  
  // Autenticación
  readonly VITE_JWT_EXPIRES_IN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Para compatibilidad con código que usa process.env
declare namespace NodeJS {
  interface ProcessEnv {
    VITE_API_URL: string;
    VITE_FRONTEND_URL: string;
    VITE_MERCADOPAGO_PUBLIC_KEY: string;
    VITE_JWT_EXPIRES_IN: string;
  }
}
