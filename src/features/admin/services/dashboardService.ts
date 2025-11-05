import { BaseService } from './baseService';
import {
  DashboardStats,
  OrderSummary,
  TopProduct,
  SalesByCategory,
  MonthlySales,
  DashboardFilters,
  DateRangeFilter,
  DashboardOverviewResponse,
  RecentOrdersResponse,
  TopProductsResponse,
  SalesAnalyticsResponse,
} from '../types/dashboard.types';
import { Product, Category, ProductsResponse } from '../types/product.types';

// Tipos para las respuestas de la API
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type Order = {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  items: Array<{
    product: string | { _id: string; name: string; price: number };
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pendiente' | 'confirmada' | 'enviada' | 'entregada' | 'cancelada';
  shippingAddress: any;
  paymentMethod: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
};

type Review = {
  _id: string;
  user: string | { _id: string; name: string };
  product: string | { _id: string; name: string };
  rating: number;
  comment: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export class DashboardService extends BaseService {
  constructor() {
    super(''); // Usamos string vacío para tener más control sobre las rutas
  }

  // ==================== DASHBOARD ====================

  /**
   * Obtiene las estadísticas generales del dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await this.get<ApiResponse<DashboardStats>>('/dashboard');
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener las estadísticas del dashboard');
      }
      return response.data!;
    } catch (error) {
      console.error('Error en getDashboardStats:', error);
      throw error;
    }
  }

  /**
   * Obtiene el reporte de ventas
   */
  async getSalesReport(filters: { startDate?: string; endDate?: string } = {}) {
    try {
      const response = await this.get<ApiResponse<any>>('/admin/sales-report', filters);
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener el reporte de ventas');
      }
      return response.data!;
    } catch (error) {
      console.error('Error en getSalesReport:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de usuarios
   */
  async getUserStats(filters?: DateRangeFilter): Promise<any> {
    return this.get('/stats/users', filters);
  }

  /**
   * Obtiene estadísticas de productos
   */
  async getProductStats(filters?: DateRangeFilter): Promise<any> {
    return this.get('/stats/products', filters);
  }

  /**
   * Obtiene estadísticas de ingresos
   */
  async getRevenueStats(filters?: DateRangeFilter): Promise<any> {
    return this.get('/stats/revenue', filters);
  }

  // ==================== ÓRDENES ====================

  /**
   * Obtiene las órdenes recientes con paginación
   */
  async getRecentOrders(
    page: number = 1,
    limit: number = 5,
    filters?: Omit<DashboardFilters, 'page' | 'limit'>
  ): Promise<RecentOrdersResponse['data']> {
    return this.get<RecentOrdersResponse['data']>('/recent-orders', {
      ...filters,
      page,
      limit,
    });
  }

  // ==================== PRODUCTOS MÁS VENDIDOS ====================

  /**
   * Obtiene los productos más vendidos
   */
  async getTopProducts(
    limit: number = 5,
    filters?: DateRangeFilter
  ): Promise<TopProduct[]> {
    const response = await this.get<{data: TopProduct[]}>('/top-products', {
      ...filters,
      limit,
    });
    return response.data || [];
  }

  // ==================== VENTAS POR CATEGORÍA ====================


  // ==================== ANÁLISIS DE VENTAS ====================

  /**
   * Obtiene el análisis de ventas mensuales
   */
  async getMonthlySales(filters?: DateRangeFilter): Promise<MonthlySales[]> {
    return this.get<MonthlySales[]>('/monthly-sales', filters);
  }

  // ==================== GESTIÓN DE USUARIOS ====================

  /**
   * Obtiene la lista de usuarios con paginación
   */
  async getUsers(
    page: number = 1,
    limit: number = 10,
    filters: { role?: 'user' | 'admin'; isActive?: boolean; search?: string } = {}
  ): Promise<PaginatedResponse<User>> {
    try {
      const params = {
        page,
        limit,
        ...(filters.role && { role: filters.role }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
        ...(filters.search && { search: filters.search })
      };

      const response = await this.get<ApiResponse<PaginatedResponse<User>>>('/users', params);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener la lista de usuarios');
      }
      
      return response.data!;
    } catch (error) {
      console.error('Error en getUsers:', error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario por su ID
   */
  async getUserById(userId: string): Promise<User> {
    try {
      const response = await this.get<ApiResponse<User>>(`/admin/users/${userId}`);
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener el usuario');
      }
      return response.data!;
    } catch (error) {
      console.error('Error en getUserById:', error);
      throw error;
    }
  }

  /**
   * Actualiza el rol de un usuario
   */
  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
    try {
      const response = await this.put<ApiResponse<User>>(
        `/admin/users/${userId}/role`,
        { role }
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar el rol del usuario');
      }
      
      return response.data!;
    } catch (error) {
      console.error('Error en updateUserRole:', error);
      throw error;
    }
  }

  /**
   * Activa o desactiva un usuario
   */
  async toggleUserStatus(userId: string, isActive: boolean): Promise<User> {
    try {
      const response = await this.put<ApiResponse<User>>(
        `/admin/users/${userId}/status`,
        { isActive }
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar el estado del usuario');
      }
      
      return response.data!;
    } catch (error) {
      console.error('Error en toggleUserStatus:', error);
      throw error;
    }
  }

  // ==================== GESTIÓN DE PEDIDOS ====================

  /**
   * Actualiza el estado de un pedido
   */
  async updateOrderStatus(orderId: string, status: string) {
    return this.patch(`/orders/${orderId}/status`, { status });
  }

  // ==================== GESTIÓN DE CATEGORÍAS ====================

  /**
   * Obtiene todas las categorías
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.get<ApiResponse<Category[]>>('/categories');
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener las categorías');
      }
      return response.data || [];
    } catch (error) {
      console.error('Error en getCategories:', error);
      throw error;
    }
  }

  // ==================== GESTIÓN DE PRODUCTOS ====================

  /**
   * Obtiene la lista de productos con paginación
   */
  async getProducts(
    page: number = 1,
    limit: number = 10,
    filters: { 
      category?: string; 
      minPrice?: number | string; 
      maxPrice?: number | string;
      inStock?: boolean; 
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      sizes?: string | string[];
      colors?: string | string[];
    } = {}
  ): Promise<PaginatedResponse<Product>> {
    try {
      // Crear un objeto de parámetros vacío
      const params = new URLSearchParams();
      
      // Añadir paginación
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      // Añadir filtros de búsqueda - Asegurarse de que search se envíe como 'name' al backend
      if (filters.search && filters.search.trim() !== '') {
        params.append('name', filters.search.trim());
      }
      
      // Añadir filtros de categoría y disponibilidad
      if (filters.category) {
        params.append('category', filters.category);
      }
      
      if (filters.inStock !== undefined) {
        params.append('inStock', filters.inStock.toString());
      }
      
      // Añadir filtros de precio
      if (filters.minPrice && filters.minPrice !== '') {
        const minPrice = typeof filters.minPrice === 'string' ? parseFloat(filters.minPrice) : filters.minPrice;
        if (!isNaN(minPrice)) {
          params.append('minPrice', minPrice.toString());
        }
      }
      
      if (filters.maxPrice && filters.maxPrice !== '') {
        const maxPrice = typeof filters.maxPrice === 'string' ? parseFloat(filters.maxPrice) : filters.maxPrice;
        if (!isNaN(maxPrice)) {
          params.append('maxPrice', maxPrice.toString());
        }
      }
      
      // Añadir filtros de tallas
      if (filters.sizes && filters.sizes.length > 0) {
        const sizes = Array.isArray(filters.sizes) ? filters.sizes : [filters.sizes];
        sizes.forEach(size => {
          if (size && size.trim() !== '') {
            params.append('sizes', size.trim().toUpperCase());
          }
        });
      }
      
      // Añadir filtros de colores
      if (filters.colors && filters.colors.length > 0) {
        const colors = Array.isArray(filters.colors) ? filters.colors : [filters.colors];
        colors.forEach(color => {
          if (color && color.trim() !== '') {
            params.append('colors', color.trim().toLowerCase());
          }
        });
      }
      
      // Añadir ordenación
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
        params.append('sortOrder', filters.sortOrder || 'asc');
      }

      // Parámetros de búsqueda enviados al backend
      const response = await this.get<ApiResponse<{ products: Product[]; pagination: any }>>(`/products?${params.toString()}`);
      
      if (!response.success || !response.data) {
        // Error en la respuesta de la API
        return { data: [], total: 0, page, limit, totalPages: 0 };
      }
      
      const { products, pagination } = response.data;
      
      if (!Array.isArray(products)) {
        // La respuesta no contiene un array de productos
        return { data: [], total: 0, page, limit, totalPages: 0 };
      }
      
      return {
        data: products,
        total: pagination?.totalProducts || 0,
        page: pagination?.currentPage || page,
        limit,
        totalPages: pagination?.totalPages || 1
      };
    } catch (error) {
      // Error en getProducts
      throw error;
    }
  }

  /**
   * Crea un nuevo producto
   */
  async createProduct(productData: FormData): Promise<Product> {
    try {
      const response = await this.post<ApiResponse<Product>>(
        '/admin/products',
        {
          body: productData,
          // No establecer 'Content-Type' para que el navegador lo haga automáticamente con el FormData
        }
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Error al crear el producto');
      }
      
      return response.data!;
    } catch (error) {
      console.error('Error en createProduct:', error);
      throw error;
    }
  }

  /**
   * Actualiza un producto existente
   */
  async updateProduct(productId: string, productData: FormData): Promise<Product> {
    try {
      const response = await this.put<ApiResponse<Product>>(
        `/admin/products/${productId}`,
        {
          body: productData,
          // No establecer 'Content-Type' para que el navegador lo haga automáticamente con el FormData
        }
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar el producto');
      }
      
      return response.data!;
    } catch (error) {
      console.error('Error en updateProduct:', error);
      throw error;
    }
  }

  /**
   * Elimina un producto
   */
  async deleteProduct(productId: string): Promise<{ success: boolean }> {
    try {
      // Verificar que el ID sea válido
      if (!productId || typeof productId !== 'string') {
        throw new Error('ID de producto no válido');
      }
      
      // Usar la ruta REST estándar
      const url = `/products/${productId}`;
      
      // Realizar la petición DELETE
      const response = await this.delete<ApiResponse<{ success: boolean }>>(url);
      
      // Si la respuesta es exitosa, devolvemos el éxito
      if (response && response.success) {
        return { success: true };
      }
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Error en deleteProduct:', error);
      
      // Si es un error de red
      if (error instanceof TypeError) {
        console.error('Error de red - Verifica la conexión y la URL del servidor');
        throw new Error('Error de conexión. Verifica tu conexión a internet o contacta al administrador.');
      }
      
      // Si es un error de respuesta HTTP
      if (error instanceof Response) {
        const errorText = await error.text();
        console.error('Error HTTP:', error.status, error.statusText, errorText);
        
        // Intentar extraer un mensaje de error si es un JSON
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Error al eliminar el producto');
        } catch (e) {
          // Si no es JSON, devolver el texto del error
          throw new Error(errorText || `Error ${error.status}: ${error.statusText}`);
        }
      }
      
      // Si ya es un Error, lo lanzamos tal cual
      if (error instanceof Error) {
        // Si el mensaje de error es HTML, mostramos un mensaje más amigable
        if (error.message.includes('<!DOCTYPE html>')) {
          throw new Error('Error en el servidor. Por favor, inténtalo de nuevo más tarde.');
        }
        throw error;
      }
      
      // Cualquier otro tipo de error
      throw new Error('Error inesperado al intentar eliminar el producto');
    }
  }


  /**
   * Obtiene los ingresos totales en un rango de fechas
   */
  async getRevenueReport(filters: DateRangeFilter): Promise<{ 
    total: number; 
    data: Array<{ date: string; amount: number }> 
  }> {
    return this.get('/revenue-report', filters);
  }

  /**
   * Obtiene el conteo de órdenes por estado
   */
  async getOrderStatusCount(filters?: DateRangeFilter): Promise<Record<string, number>> {
    return this.get('/order-status-count', filters);
  }

  /**
   * Obtiene el rendimiento de ventas (comparación con el período anterior)
   */
  async getSalesPerformance(filters: DateRangeFilter): Promise<{
    currentPeriod: { total: number; count: number };
    previousPeriod: { total: number; count: number };
    percentageChange: number;
  }> {
    return this.get('/sales-performance', filters);
  }
}

export const dashboardService = new DashboardService();
