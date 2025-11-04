import { ApiError, ApiResponse } from '../types/api.types';
import { config } from '../../../config/appConfig';

export class BaseService {
  protected baseUrl: string;
  protected apiPrefix: string;

  constructor(apiPrefix: string = '') {
    // Usamos la URL base tal como está configurada
    this.baseUrl = config.API_BASE_URL;
    this.apiPrefix = apiPrefix;
    
    // Configuración de BaseService
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${this.apiPrefix}${endpoint}`;
      const token = localStorage.getItem('authToken');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      };

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        // Si es un error 401, redirigir a login
        if (response.status === 401) {
          // Limpiar token inválido
          localStorage.removeItem('token');
          // Redirigir a login
          window.location.href = '/login';
          return Promise.reject(new Error('No autorizado'));
        }
        
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      try {
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('❌ Error al parsear respuesta JSON:', error);
        throw new Error('Error al procesar la respuesta del servidor');
      }
    } catch (error) {
      console.error('❌ Error en la petición:', error);
      throw error;
    }
  }

  protected async get<T>(endpoint: string, queryParams: Record<string, any> = {}): Promise<T> {
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  protected async post<T>(endpoint: string, data: any = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  protected async put<T>(endpoint: string, data: any = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  protected async patch<T>(endpoint: string, data: any = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.request<T>(endpoint, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
