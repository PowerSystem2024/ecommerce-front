import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/shop', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage('¡Email verificado exitosamente! Ahora puedes iniciar sesión.');
    }
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('¡Registro exitoso! Verifica tu email para poder iniciar sesión.');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(formData.email, formData.password);
      console.log('🔍 LoginPage - Resultado del login:', result);
      console.log('🔍 LoginPage - Usuario:', result?.user);
      console.log('🔍 LoginPage - Role:', result?.user?.role);
      
      // Redirigir según el rol del usuario
      if (result?.user?.role === 'admin') {
        console.log('✅ Usuario admin detectado, redirigiendo a /admin');
        navigate('/admin');
      } else {
        console.log('✅ Usuario normal detectado, redirigiendo a /shop');
        navigate('/shop');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <div className="flex items-center justify-between">
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Crear cuenta
            </Link>
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


