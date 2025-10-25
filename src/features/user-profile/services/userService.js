// Servicio para comunicación con la API de perfil de usuario
import { config, buildApiUrl, devLog } from '../../../config/appConfig';

const API_BASE_URL = config.API_BASE_URL;

class UserService {
  // Método privado para hacer requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    devLog('UserService - URL:', url);
    
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
      devLog('UserService - Enviando request:', { url, method: requestConfig.method || 'GET' });
      
      const response = await fetch(url, requestConfig);
      const text = await response.text();
      
      devLog('UserService - Respuesta recibida:', { 
        status: response.status, 
        statusText: response.statusText,
        hasBody: !!text 
      });
      
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (_e) {
        devLog('UserService - Respuesta no es JSON:', text.substring(0, 200));
        throw new Error(`Unexpected response from server (status ${response.status}). Expected JSON but got: ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        devLog('UserService - Error en respuesta:', { status: response.status, data });
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      devLog('UserService - Request exitoso:', data);
      return data;
    } catch (error) {
      devLog('UserService - Error completo:', error);
      throw error;
    }
  }

  // OBTENER PERFIL DEL USUARIO
  async getProfile() {
    return this.makeRequest('/users/profile', {
      method: 'GET',
    });
  }

  // ACTUALIZAR PERFIL DEL USUARIO
  async updateProfile(profileData) {
    return this.makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // SUBIR AVATAR DEL USUARIO
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const url = `${API_BASE_URL}/users/upload-avatar`;
    const token = this.getToken();
    
    devLog('UserService - Subiendo avatar:', { url, fileName: file.name, fileSize: file.size });
    
    const requestConfig = {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // No incluir Content-Type para FormData, el navegador lo maneja automáticamente
      },
      body: formData,
    };

    try {
      const response = await fetch(url, requestConfig);
      const text = await response.text();
      
      devLog('UserService - Respuesta avatar:', { 
        status: response.status, 
        statusText: response.statusText,
        hasBody: !!text 
      });
      
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (_e) {
        devLog('UserService - Respuesta avatar no es JSON:', text.substring(0, 200));
        throw new Error(`Unexpected response from server (status ${response.status}). Expected JSON but got: ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        devLog('UserService - Error en avatar:', { status: response.status, data });
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      devLog('UserService - Avatar subido exitosamente:', data);
      return data;
    } catch (error) {
      devLog('UserService - Error en avatar:', error);
      throw error;
    }
  }

  // OBTENER TOKEN DEL LOCALSTORAGE
  getToken() {
    return localStorage.getItem('authToken');
  }
}

// Exportar instancia única del servicio
export const userService = new UserService();
export default userService;
