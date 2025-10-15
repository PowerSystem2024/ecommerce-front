import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await authService.forgotPassword(email);
      setSent(true);
      setMessage(res?.message || 'Hemos enviado un email con instrucciones.');
    } catch (err) {
      setError(err.message || 'No pudimos enviar el email.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 p-8 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900">Email enviado</h2>
          <p className="text-gray-600">
            {message || 'Revisa tu bandeja de entrada (y spam). Sigue el enlace para restablecer tu contraseña.'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Recuperar contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@email.com"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>
      </div>
    </div>
  );
}


