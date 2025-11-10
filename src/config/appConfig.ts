/**
 * Función para construir URLs de la API
 */
// URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const buildApiUrl = (endpoint: string): string => {
  // Asegurarse de que el endpoint empiece con /
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${formattedEndpoint}`;
};

/**
 * Función para logging en desarrollo
 */
const devLog = (message: string, data?: unknown): void => {
  if (import.meta.env.DEV) {
    console.log(`[DEV] ${message}`, data || '');
  }
};

export const config = {
  // URL base de la API
  API_BASE_URL,
  
  // Configuración de la aplicación
  APP_NAME: 'La Tiendita',
  APP_VERSION: '1.0.0',
  
  // URLs de las rutas principales
  ROUTES: {
    HOME: '/',
    SHOP: '/shop',
    CART: '/cart',
    PROFILE: '/profile',
    ORDER_HISTORY: '/order-history',
    LOGIN: '/login',
    REGISTER: '/register',
    ADMIN: '/admin',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_ORDERS: '/admin/orders',
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_REVIEWS: '/admin/reviews',
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
      ME: '/auth/me',
    },
    USERS: {
      BASE: '/users',
      PROFILE: '/users/profile',
      AVATAR: '/users/avatar',
      PASSWORD: '/users/password',
    },
    PRODUCTS: {
      BASE: '/products',
      SEARCH: '/products/search',
      CATEGORIES: '/products/categories',
      UPLOAD_IMAGE: '/products/upload',
    },
    ORDERS: {
      BASE: '/orders',
      MY_ORDERS: '/orders/my-orders',
      CANCEL: (id: string) => `/orders/${id}/cancel`,
    },
    REVIEWS: {
      BASE: '/reviews',
      PRODUCT: (productId: string) => `/reviews/product/${productId}`,
    },
    ADMIN: {
      DASHBOARD: {
        STATS: '/admin/dashboard/stats',
        RECENT_ORDERS: '/admin/dashboard/recent-orders',
        TOP_PRODUCTS: '/admin/dashboard/top-products',
      },
      USERS: {
        BASE: '/admin/users',
        TOGGLE_ACTIVE: (id: string) => `/admin/users/${id}/toggle-active`,
        CHANGE_ROLE: (id: string) => `/admin/users/${id}/change-role`,
      },
      ORDERS: {
        BASE: '/admin/orders',
        UPDATE_STATUS: (id: string) => `/admin/orders/${id}/status`,
      },
      PRODUCTS: {
        BASE: '/admin/products',
        UPLOAD_IMAGES: '/admin/products/upload',
      },
      REVIEWS: {
        BASE: '/admin/reviews',
        TOGGLE_VISIBILITY: (id: string) => `/admin/reviews/${id}/toggle-visibility`,
      },
    },
  },
  
  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    DEFAULT_SORT_BY: 'createdAt',
    DEFAULT_ORDER: 'desc',
  },
  
  // Configuración de autenticación
  AUTH: {
    TOKEN_KEY: 'token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    TOKEN_EXPIRES_IN: 7 * 24 * 60 * 60, // 7 días en segundos
  },
  
  // Configuración de MercadoPago
  MERCADOPAGO: {
    PUBLIC_KEY: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '',
  },
} as const;

// Tipos de datos para la configuración
export type AppConfig = typeof config;
export type ApiEndpoints = typeof config.API_ENDPOINTS;

export { buildApiUrl, devLog };

// Exportar configuración por defecto
export default config;
