import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';

const ChangePassword = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calcular fortaleza de contraseña cuando cambie la nueva contraseña
    if (name === 'newPassword') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
    
    // Limpiar mensaje de error cuando el usuario empiece a escribir
    if (message.type === 'error') {
      setMessage({ type: '', text: '' });
    }
  };

  const calculatePasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    // Longitud mínima
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Mínimo 8 caracteres');
    }

    // Longitud recomendada
    if (password.length >= 12) {
      score += 1;
    }

    // Contiene minúsculas
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Incluir letras minúsculas');
    }

    // Contiene mayúsculas
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Incluir letras mayúsculas');
    }

    // Contiene números
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Incluir números');
    }

    // Contiene caracteres especiales
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Incluir caracteres especiales (!@#$%^&*)');
    }

    // No contiene patrones comunes
    if (!/(.)\1{2,}/.test(password)) {
      score += 1;
    } else {
      feedback.push('Evitar caracteres repetidos');
    }

    return { score, feedback };
  };

  const getPasswordStrengthColor = (score) => {
    if (score <= 2) return 'text-red-500';
    if (score <= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getPasswordStrengthText = (score) => {
    if (score <= 2) return 'Débil';
    if (score <= 4) return 'Media';
    return 'Fuerte';
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword) {
      setMessage({ type: 'error', text: 'La contraseña actual es requerida' });
      return false;
    }

    if (!newPassword) {
      setMessage({ type: 'error', text: 'La nueva contraseña es requerida' });
      return false;
    }

    // Validaciones de seguridad mejoradas
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 8 caracteres' });
      return false;
    }

    if (newPassword === currentPassword) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe ser diferente a la actual' });
      return false;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' });
      return false;
    }

    // Validar fortaleza de contraseña
    if (passwordStrength.score < 4) {
      setMessage({ 
        type: 'error', 
        text: `La contraseña es muy débil. ${passwordStrength.feedback.join(', ')}` 
      });
      return false;
    }

    // Validar contraseñas comunes
    const commonPasswords = ['password', '123456', '123456789', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.includes(newPassword.toLowerCase())) {
      setMessage({ type: 'error', text: 'Por seguridad, no uses contraseñas comunes' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authService.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      
      setMessage({ 
        type: 'success', 
        text: '¡Contraseña cambiada exitosamente! Tu cuenta está ahora más segura.' 
      });
      
      // Limpiar formulario y estado
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordStrength({ score: 0, feedback: [] });

      // Llamar callback de éxito después de un breve delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);

    } catch (error) {
      console.error('Error changing password:', error);
      
      // Manejo de errores más específico
      let errorMessage = 'Error al cambiar la contraseña. Inténtalo de nuevo.';
      
      if (error.message) {
        if (error.message.includes('current password')) {
          errorMessage = 'La contraseña actual es incorrecta. Verifica e inténtalo de nuevo.';
        } else if (error.message.includes('same password')) {
          errorMessage = 'La nueva contraseña debe ser diferente a la actual.';
        } else if (error.message.includes('weak password')) {
          errorMessage = 'La contraseña es muy débil. Usa una contraseña más segura.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Error de conexión. Verifica tu internet e inténtalo de nuevo.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage({ type: '', text: '' });
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8"
    >
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span className="font-orbitron">Cambiar Contraseña</span>
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 mb-6 text-sm"
      >
        Por seguridad, ingresa tu contraseña actual y luego la nueva contraseña que deseas usar.
      </motion.p>

      {/* Mensaje de estado */}
      {message.text && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mb-6 p-4 rounded-xl shadow-lg ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200' 
              : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contraseña actual */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contraseña Actual
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-300 group-focus-within:text-red-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 hover:border-gray-300 hover:shadow-md focus:shadow-lg bg-white/90 backdrop-blur-sm"
              placeholder="Ingresa tu contraseña actual"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPasswords.current ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </motion.div>

        {/* Nueva contraseña */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative group"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nueva Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-300 group-focus-within:text-red-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 hover:border-gray-300 hover:shadow-md focus:shadow-lg bg-white/90 backdrop-blur-sm"
              placeholder="Ingresa tu nueva contraseña"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPasswords.new ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <div className="mt-2">
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Fortaleza de la contraseña:</span>
                  <span className={`text-xs font-semibold ${getPasswordStrengthColor(passwordStrength.score)}`}>
                    {getPasswordStrengthText(passwordStrength.score)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 2 ? 'bg-red-500' :
                      passwordStrength.score <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  ></div>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="text-xs text-gray-600">
                    <p className="font-medium mb-1">Para mejorar tu contraseña:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {passwordStrength.feedback.slice(0, 3).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {!formData.newPassword && (
              <p className="text-xs text-gray-500">Mínimo 8 caracteres con mayúsculas, minúsculas, números y símbolos</p>
            )}
          </div>
        </motion.div>

        {/* Confirmar nueva contraseña */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative group"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirmar Nueva Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-300 group-focus-within:text-red-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 hover:border-gray-300 hover:shadow-md focus:shadow-lg bg-white/90 backdrop-blur-sm"
              placeholder="Confirma tu nueva contraseña"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPasswords.confirm ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </motion.div>

        {/* Botones de acción */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end space-x-4 pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl font-medium"
          >
            {isLoading && (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            <span>{isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}</span>
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default ChangePassword;
