import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay token al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          // Intentar obtener datos del usuario desde el backend
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
            localStorage.setItem('userData', JSON.stringify(userData));
          } catch (error) {
            console.log('No se pudieron obtener datos del usuario, usando datos guardados');
            // Si falla, usar datos guardados en localStorage
            const savedUser = localStorage.getItem('userData');
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            } else {
              setUser({
                name: 'Usuario',
                email: 'usuario@email.com',
                role: 'user'
              });
            }
          }
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        authService.removeToken();
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      if (response.token) {
        authService.saveToken(response.token);
        
        // Crear datos del usuario con la información que tenemos
        const userData = {
          name: response.user?.name || response.data?.user?.name || 'Usuario',
          email: response.user?.email || response.data?.user?.email || email,
          role: response.user?.role || response.data?.user?.role || 'user'
        };
        
        console.log('Datos del usuario obtenidos:', userData);
        
        // Guardar datos del usuario en localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, user: userData };
      }
      
      throw new Error('No se recibió token del servidor');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      authService.removeToken();
      localStorage.removeItem('userData'); // Limpiar datos del usuario
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, message: response.message };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
