// Servicio para comunicación con la API de autenticación
import { config, buildApiUrl, devLog } from '../../../config/appConfig';

const API_BASE_URL = config.API_BASE_URL;

class AuthService {
  // Método privado para hacer requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
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
      const response = await fetch(url, requestConfig);
      const text = await response.text();
      
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (_e) {
        throw new Error(`Unexpected response from server (status ${response.status}). Expected JSON but got: ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // REGISTRO DE USUARIO
  async register(userData) {
    const { name, email, password } = userData;
    
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
  }

  // INICIO DE SESIÓN
  async login(email, password) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }

  // CIERRE DE SESIÓN
  async logout() {
    try {
      const token = this.getToken();
      
      // Limpiar el estado local primero
      this.removeToken();
      localStorage.removeItem('userData');
      
      // Hacer logout en el servidor con el token anterior
      const response = await fetch(`${this.API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        credentials: 'include'
      });
      
      return { success: response.ok };
    } catch (_error) {
      this.removeToken();
      localStorage.removeItem('userData');
      return { success: false, error: _error };
    }
  }

  // RECUPERAR CONTRASEÑA (enviar email)
  async forgotPassword(email) {
    return this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // VERIFICAR TOKEN DE RECUPERACIÓN
  async verifyResetToken(token) {
    return this.makeRequest(`/auth/reset-password/${token}`, {
      method: 'GET',
    });
  }

  // CAMBIAR CONTRASEÑA CON TOKEN
  async resetPassword(token, password, passwordConfirm) {
    return this.makeRequest(`/auth/reset-password/${token}`, {
      method: 'PATCH',
      body: JSON.stringify({ password, passwordConfirm }),
    });
  }

  // CAMBIO DE CONTRASEÑA AUTENTICADO
  async changePassword(currentPassword, newPassword, passwordConfirm) {
    return this.makeRequest('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword, passwordConfirm })
    });
  }

  // VERIFICAR EMAIL CON TOKEN
  async verifyEmail(token) {
    return this.makeRequest(`/auth/verify-email/${token}`, {
      method: 'GET',
    });
  }

  // REENVIAR EMAIL DE VERIFICACIÓN
  async resendVerification(email) {
    return this.makeRequest('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // GUARDAR TOKEN EN LOCALSTORAGE
  saveToken(token) {
    localStorage.setItem('authToken', token);
  }

  // OBTENER TOKEN DEL LOCALSTORAGE
  getToken() {
    return localStorage.getItem('authToken');
  }

  // ELIMINAR TOKEN DEL LOCALSTORAGE
  removeToken() {
    localStorage.removeItem('authToken');
  }

  // VERIFICAR SI HAY TOKEN (usuario logueado)
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  // OBTENER DATOS DEL USUARIO ACTUAL
  async getCurrentUser() {
    return this.makeRequest('/auth/me', {
      method: 'GET',
    });
  }
}

// Exportar instancia única del servicio
export const authService = new AuthService();
export default authService;
