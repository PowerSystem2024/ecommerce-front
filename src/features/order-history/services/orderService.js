// Servicio para comunicación con la API de pedidos
import { config, buildApiUrl, devLog } from '../../../config/appConfig';

const API_BASE_URL = config.API_BASE_URL;

class OrderService {
  // Método privado para hacer requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    devLog('OrderService - URL:', url);
    
    const token = this.getToken();
    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...(options.credentials ? { credentials: options.credentials } : {}),
      ...options,
    };

    try {
      devLog('OrderService - Enviando request:', { url, method: requestConfig.method || 'GET' });
      
      const response = await fetch(url, requestConfig);
      const text = await response.text();
      
      devLog('OrderService - Respuesta recibida:', { 
        status: response.status, 
        statusText: response.statusText,
        hasBody: !!text 
      });
      
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (_e) {
        devLog('OrderService - Respuesta no es JSON:', text.substring(0, 200));
        throw new Error(`Unexpected response from server (status ${response.status}). Expected JSON but got: ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        devLog('OrderService - Error en respuesta:', { status: response.status, data });
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      devLog('OrderService - Request exitoso:', data);
      return data;
    } catch (error) {
      devLog('OrderService - Error completo:', error);
      throw error;
    }
  }

  // OBTENER HISTORIAL DE PEDIDOS DEL USUARIO
  async getUserOrders() {
    console.log('🚀 OrderService - Iniciando getUserOrders');
    try {
      const result = await this.makeRequest('/orders', {
        method: 'GET',
      });
      console.log('✅ OrderService - getUserOrders exitoso:', result);
      return result;
    } catch (error) {
      console.error('❌ OrderService - Error en getUserOrders:', error);
      throw error;
    }
  }

  // OBTENER DETALLES DE UN PEDIDO ESPECÍFICO
  async getOrderById(orderId) {
    return this.makeRequest(`/orders/${orderId}`, {
      method: 'GET',
    });
  }

  // DESCARGAR FACTURA DE UN PEDIDO
  async downloadInvoice(orderId) {
    const url = `${API_BASE_URL}/orders/${orderId}/invoice`;
    const token = this.getToken();
    
    devLog('OrderService - Descargando factura:', { url, orderId });
    
    const requestConfig = {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    try {
      const response = await fetch(url, requestConfig);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (_e) {
          errorData = { message: errorText };
        }
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Si la respuesta es un PDF, devolver el blob
      if (response.headers.get('content-type')?.includes('application/pdf')) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `factura-${orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        return { success: true, message: 'Factura descargada exitosamente' };
      } else {
        // Si no es PDF, devolver la respuesta JSON
        const data = await response.json();
        return data;
      }
    } catch (error) {
      devLog('OrderService - Error en descarga de factura:', error);
      throw error;
    }
  }

  // REORDENAR PRODUCTOS DE UN PEDIDO
  async reorderOrder(orderId) {
    return this.makeRequest(`/orders/${orderId}/reorder`, {
      method: 'POST',
    });
  }

  // OBTENER TOKEN DEL LOCALSTORAGE
  getToken() {
    return localStorage.getItem('authToken');
  }
}

// Exportar instancia única del servicio
export const orderService = new OrderService();
export default orderService;
