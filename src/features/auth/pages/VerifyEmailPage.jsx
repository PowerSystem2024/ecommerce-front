import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// ✅ CONTROL GLOBAL DE VERIFICACIÓN
let isVerifying = false;

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // ✅ PREVENIR MÚLTIPLES EJECUCIONES
    if (isVerifying) {
      setMessage('⏳ Verificación en progreso...');
      setLoading(false);
      return;
    }

    // ✅ VERIFICAR SI YA ESTÁ VERIFICADO
    if (success) {
      return;
    }

    // ✅ VERIFICAR TOKEN
    if (!token) {
      setMessage('❌ No se proporcionó un token de verificación');
      setLoading(false);
      return;
    }

    // ✅ FUNCIÓN ASÍNCRONA PARA VERIFICAR
    const verifyToken = async () => {
      // Evitar múltiples verificaciones
      if (isVerifying) return;

      // ✅ MARCAR COMO VERIFICANDO
      isVerifying = true;

      try {
        // ✅ UNA SOLA PETICIÓN AL BACKEND
        await authService.verifyEmail(token);
        
        setSuccess(true);
        setMessage('✅ ¡Email verificado correctamente!');
        
        // ✅ UNA SOLA REDIRECCIÓN DESPUÉS DE 2 SEGUNDOS
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
        
      } catch (error) {
        console.error('❌ Error en verificación:', error);
        setMessage('❌ Error: El token ya fue usado o expiró');
        setSuccess(false);
      } finally {
        setLoading(false);
        // ✅ LIBERAR EL FLAG DESPUÉS DE 5 SEGUNDOS
        setTimeout(() => {
          isVerifying = false;
        }, 5000);
      }
    };

    verifyToken();
  }, []); // ✅ ARRAY VACÍO - SOLO SE EJECUTA UNA VEZ

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          {loading ? (
            <>
              {/* Loading State */}
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                🔄 Verificando email...
              </h2>
              <p className="text-gray-600">Procesando tu solicitud...</p>
            </>
          ) : (
            <>
              {success ? (
                <>
                  {/* Success State */}
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-green-600 mb-2">
                    ¡Verificación Exitosa!
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    {message}
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-sm text-green-800">
                      🎉 Serás redirigido al login en unos segundos...
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Error State */}
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-red-600 mb-2">
                    Error de Verificación
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    {message}
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/login', { replace: true })}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Ir al Login
                    </button>
                    
                    <button
                      onClick={() => navigate('/register', { replace: true })}
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Registrarse de Nuevo
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
