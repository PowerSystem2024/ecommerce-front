import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          setLoading(false);
          return;
        }

        try {
          const response = await authService.getCurrentUser();
          
          // Extraer el usuario de la respuesta (puede venir en response.data.user o response.user)
          const userData = response?.data?.user || response?.user || response;
          
          const normalizedUser = {
            name: userData.name,
            email: userData.email,
            role: userData.role || 'user',
            avatar: userData.avatar,
            _id: userData._id
          };
          
          setUser(normalizedUser);
          localStorage.setItem('userData', JSON.stringify(normalizedUser));
          setIsAuthenticated(true);
        } catch (_e) {
          console.error('Error al obtener usuario actual:', _e);
          const saved = localStorage.getItem('userData');
          if (saved) {
            setUser(JSON.parse(saved));
            setIsAuthenticated(true);
          } else {
            authService.removeToken();
            localStorage.removeItem('userData');
          }
        }
      } catch (_e) {
        authService.removeToken();
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (!response?.token) throw new Error('No token received');
    authService.saveToken(response.token);
    
    // Extraer el usuario de la respuesta
    const userFromResponse = response.user || response.data?.user || {};
    const userData = {
      name: userFromResponse.name || 'Usuario',
      email: userFromResponse.email || email,
      role: userFromResponse.role || 'user',
      avatar: userFromResponse.avatar,
      _id: userFromResponse._id
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return { success: true, user: userData };
  };

  const logout = async () => {
    try {
      // Limpiar el estado local primero
      setUser(null);
      setIsAuthenticated(false);
      
      // Limpiar almacenamiento local
      authService.removeToken();
      localStorage.removeItem('userData');
      
      // Hacer logout en el servidor
      await authService.logout();
      
      // Limpiar cookies accesibles
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      
      // Forzar recarga para limpiar todo el estado
      window.location.href = '/';
      
    } catch (_error) {
      // Forzar limpieza y recarga en caso de error
      authService.removeToken();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  const register = async (data) => {
    const res = await authService.register(data);
    return { success: true, message: res?.message };
  };

  const updateUser = (partial) => {
    setUser(prev => {
      const next = { ...(prev || {}), ...(partial || {}) };
      try { localStorage.setItem('userData', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const value = { user, isAuthenticated, loading, login, logout, register, updateUser };
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}


