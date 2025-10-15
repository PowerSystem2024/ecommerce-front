// Servicio para comunicación con la API de autenticación
const API_BASE_URL = import.meta.env.VITE_API_URL;

class AuthService {
  // Método privado para hacer requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const token = this.getToken();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      // Si el backend usa cookies httpOnly, habilitar credenciales
      ...(options.credentials ? { credentials: options.credentials } : {}),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (_e) {
        // Respuesta no-JSON (probablemente HTML)
        throw new Error(`Unexpected response from server (status ${response.status}).`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('Error en AuthService:', error);
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
    return this.makeRequest('/auth/logout', {
      method: 'GET',
    });
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
