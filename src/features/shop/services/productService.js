import { config, buildApiUrl, devLog } from '../../../config/appConfig';

const API_BASE_URL = config.API_BASE_URL;

class ProductService {
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    devLog('ProductService - URL:', url);
    
    const token = localStorage.getItem('authToken');
    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    try {
      devLog('ProductService - Enviando request:', { url, method: requestConfig.method || 'GET' });
      
      const response = await fetch(url, requestConfig);
      const text = await response.text();
      
      devLog('ProductService - Respuesta recibida:', { 
        status: response.status, 
        statusText: response.statusText,
        hasBody: !!text 
      });
      
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (_e) {
        devLog('ProductService - Respuesta no es JSON:', text.substring(0, 200));
        throw new Error(`Unexpected response from server (status ${response.status})`);
      }

      if (!response.ok) {
        devLog('ProductService - Error en respuesta:', { status: response.status, data });
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      devLog('ProductService - Request exitoso:', data);
      return data;
    } catch (error) {
      devLog('ProductService - Error completo:', error);
      throw error;
    }
  }

  // Obtener todos los productos con filtros opcionales
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return this.makeRequest(endpoint, {
      method: 'GET',
    });
  }

  // Obtener un producto por ID
  async getProductById(id) {
    return this.makeRequest(`/products/${id}`, {
      method: 'GET',
    });
  }

  // Obtener categorías
  async getCategories() {
    return this.makeRequest('/categories', {
      method: 'GET',
    });
  }

  // Crear/enviar una reseña para un producto
  async createReview(productId, { rating, comment, orderId }) {
    if (!productId) throw new Error('productId es requerido');
    const payload = {
      rating: Number(rating),
      comment: comment?.trim?.() || '',
      orderId,
    };
    return this.makeRequest(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

// Exportar instancia única del servicio
export const productService = new ProductService();
export default productService;
