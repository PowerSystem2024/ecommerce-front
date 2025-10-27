// Configuración de la aplicación
export const config = {
  // URL base de la API
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  
  // Configuración de la aplicación
  APP_NAME: import.meta.env.VITE_APP_NAME || 'La Tiendita',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // URLs de las rutas principales
  ROUTES: {
    HOME: '/',
    SHOP: '/shop',
    CART: '/cart',
    PROFILE: '/profile',
    ORDER_HISTORY: '/order-history',
    LOGIN: '/login',
    REGISTER: '/register',
    ADMIN: '/admin'
  },
  
  // Configuración de la API
  API_ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      CHANGE_PASSWORD: '/auth/change-password',
      VERIFY_EMAIL: '/auth/verify-email',
      RESEND_VERIFICATION: '/auth/resend-verification',
      ME: '/auth/me'
    },
    USER: {
      PROFILE: '/user/profile',
      ORDERS: '/user/orders',
      ADDRESSES: '/user/addresses'
    },
    PRODUCTS: {
      LIST: '/products',
      DETAIL: '/products',
      CATEGORIES: '/products/categories'
    },
    ORDERS: {
      LIST: '/orders',
      CREATE: '/orders',
      DETAIL: '/orders'
    }
  }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${config.API_BASE_URL}${endpoint}`;
};

// Función helper para verificar si estamos en desarrollo
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

// Función helper para logging en desarrollo
export const devLog = (message, data = null) => {
  if (isDevelopment()) {
    console.log(`🔧 [${config.APP_NAME}] ${message}`, data || '');
  }
};

export default config;
