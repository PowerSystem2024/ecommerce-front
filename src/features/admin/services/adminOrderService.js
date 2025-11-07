import { BaseService } from './baseService';

/**
 * Servicio para gestionar las operaciones de pedidos en el panel de administración
 */
class AdminOrderService extends BaseService {
  constructor() {
    super('/admin');
  }

  /**
   * Obtener lista de pedidos con filtros y paginación
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Array>} Lista de pedidos
   */
  async getOrders(params = {}) {
    return this.get('/orders', params);
  }

  /**
   * Obtener un pedido específico por su ID
   * @param {string} orderId - ID del pedido
   * @returns {Promise<Object>} Datos del pedido
   */
  async getOrderById(orderId) {
    if (!orderId) throw new Error('Se requiere un ID de pedido válido');
    return this.get(`/orders/${orderId}`);
  }

  /**
   * Obtener estadísticas de pedidos
   * @returns {Promise<Object>} Estadísticas de pedidos
   */
  async getOrderStats() {
    return this.get('/orders/stats');
  }

  /**
   * Actualizar el estado de un pedido
   * @param {string} orderId - ID del pedido
   * @param {string} status - Nuevo estado del pedido
   * @returns {Promise<Object>} Respuesta de la operación
   */
  async updateOrderStatus(orderId, status) {
    if (!orderId || !status) {
      throw new Error('Se requieren ID de pedido y estado válidos');
    }
    
    const response = await this.put(`/orders/${orderId}/status`, { status });
    
    if (response && !response.success) {
      throw new Error(response.message || 'Error al actualizar el estado del pedido');
    }
    
    return { success: true, data: response };
  }

  /**
   * Obtener pedidos recientes
   * @param {number} limit - Número máximo de pedidos a devolver
   * @returns {Promise<Array>} Lista de pedidos recientes
   */
  async getRecentOrders(limit = 10) {
    return this.get(`/orders/recent?limit=${limit}`);
  }

  /**
   * Cancelar un pedido
   * @param {string} orderId - ID del pedido a cancelar
   * @param {string} reason - Razón de la cancelación
   * @returns {Promise<Object>} Respuesta de la operación
   */
  async cancelOrder(orderId, reason) {
    if (!orderId || !reason) {
      throw new Error('Se requieren ID de pedido y motivo de cancelación');
    }
    return this.put(`/orders/${orderId}/cancel`, { reason });
  }

  /**
   * Reactivar un pedido cancelado (solución temporal)
   * @param {string} orderId - ID del pedido a reactivar
   * @returns {Promise<Object>} Respuesta simulada de la operación
   */
  async reactivateOrder(orderId) {
    if (!orderId) {
      throw new Error('Se requiere un ID de pedido válido');
    }
    
    return { 
      success: true, 
      message: 'Orden reactivada localmente',
      data: { _id: orderId, status: 'pendiente' }
    };
  }
}

export const adminOrderService = new AdminOrderService();
