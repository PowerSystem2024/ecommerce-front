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
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('userData', JSON.stringify(currentUser));
        } catch (_e) {
          const saved = localStorage.getItem('userData');
          if (saved) setUser(JSON.parse(saved));
        }
        setIsAuthenticated(true);
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
    const userData = {
      name: response.user?.name || response.data?.user?.name || 'Usuario',
      email: response.user?.email || response.data?.user?.email || email,
      role: response.user?.role || response.data?.user?.role || 'user'
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return { success: true, user: userData };
  };

  const logout = async () => {
    try { await authService.logout(); } catch (_e) {}
    authService.removeToken();
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (data) => {
    const res = await authService.register(data);
    return { success: true, message: res?.message };
  };

  const value = { user, isAuthenticated, loading, login, logout, register };
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}


