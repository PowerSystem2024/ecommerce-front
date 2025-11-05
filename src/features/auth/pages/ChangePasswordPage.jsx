import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../services/authService';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await authService.changePassword(currentPassword, newPassword, confirmPassword);
      setMessage({ 
        type: 'success', 
        text: res?.message || 'Contraseña actualizada correctamente' 
      });
      
      // Redirigir de vuelta al perfil después de 2 segundos
      setTimeout(() => {
        // Si venía del perfil de admin, redirigir ahí, si no, al perfil de usuario
        const previousPath = location.state?.from || '/profile';
        navigate(previousPath);
      }, 2000);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'No pudimos cambiar la contraseña' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Luces animadas de fondo - más orgánicas y con más movimiento */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Luz Púrpura Principal */}
        <motion.div
          animate={{
            x: [0, 120, -40, 80, 0],
            y: [0, 70, 120, 50, 0],
            opacity: [0.2, 0.35, 0.25, 0.3, 0.2],
            scale: [1, 1.2, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full bg-[#6D28D9] blur-3xl"
        />
        {/* Luz Rosa */}
        <motion.div
          animate={{
            x: [0, -100, 60, -80, 0],
            y: [0, 150, 80, 120, 0],
            opacity: [0.2, 0.35, 0.25, 0.3, 0.2],
            scale: [1, 0.9, 1.3, 0.95, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-20 right-10 w-[450px] h-[450px] rounded-full bg-[#E11D74] blur-3xl"
        />
        {/* Luz Púrpura Claro */}
        <motion.div
          animate={{
            x: [0, 80, -60, 100, 0],
            y: [0, -100, 60, -80, 0],
            opacity: [0.15, 0.3, 0.2, 0.25, 0.15],
            scale: [1, 1.1, 0.85, 1.15, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7
          }}
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-[#8B5CF6] blur-3xl"
        />
        {/* Luz adicional púrpura */}
        <motion.div
          animate={{
            x: [0, -120, 90, -70, 0],
            y: [0, -80, 110, -50, 0],
            opacity: [0.1, 0.25, 0.15, 0.2, 0.1],
            scale: [1, 1.25, 0.75, 1.05, 1],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 12
          }}
          className="absolute top-10 right-1/4 w-[380px] h-[380px] rounded-full bg-[#6D28D9] blur-3xl"
        />
        {/* Luz adicional rosa */}
        <motion.div
          animate={{
            x: [0, 100, -90, 70, 0],
            y: [0, 90, -110, 80, 0],
            opacity: [0.12, 0.28, 0.18, 0.22, 0.12],
            scale: [1, 0.95, 1.2, 0.88, 1],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 18
          }}
          className="absolute bottom-10 left-1/3 w-[420px] h-[420px] rounded-full bg-[#E11D74] blur-3xl"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-8 max-w-2xl w-full relative z-10"
      >
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-[#0F0F10] mb-6 flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg">
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
          className="text-[#2A2A2A] mb-6 text-base"
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
                : 'bg-gradient-to-r from-rose-50 to-red-50 text-[#E11D74] border border-[#E11D74]/20'
            }`}
          >
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-[#E11D74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <label className="block text-sm font-semibold text-[#0F0F10] mb-2">
              Contraseña Actual
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#2A2A2A]/40 group-focus-within:text-[#6D28D9] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="current"
                type={showPasswords.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-[#2A2A2A]/20 rounded-xl focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-all duration-300 hover:border-[#6D28D9]/40 hover:shadow-md focus:shadow-lg bg-white/90 backdrop-blur-sm"
                placeholder="Ingresa tu contraseña actual"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#2A2A2A]/40 hover:text-[#6D28D9] transition-colors duration-300"
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
            <label className="block text-sm font-semibold text-[#0F0F10] mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#2A2A2A]/40 group-focus-within:text-[#6D28D9] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="new"
                type={showPasswords.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-[#2A2A2A]/20 rounded-xl focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-all duration-300 hover:border-[#6D28D9]/40 hover:shadow-md focus:shadow-lg bg-white/90 backdrop-blur-sm"
                placeholder="Ingresa tu nueva contraseña"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#2A2A2A]/40 hover:text-[#6D28D9] transition-colors duration-300"
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
          </motion.div>

          {/* Confirmar nueva contraseña */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative group"
          >
            <label className="block text-sm font-semibold text-[#0F0F10] mb-2">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#2A2A2A]/40 group-focus-within:text-[#6D28D9] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                id="confirm"
                type={showPasswords.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-[#2A2A2A]/20 rounded-xl focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-all duration-300 hover:border-[#6D28D9]/40 hover:shadow-md focus:shadow-lg bg-white/90 backdrop-blur-sm"
                placeholder="Confirma tu nueva contraseña"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#2A2A2A]/40 hover:text-[#6D28D9] transition-colors duration-300"
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

          {/* Botón de acción */}
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
              onClick={() => navigate(location.state?.from || '/profile')}
              className="px-6 py-3 border-2 border-[#2A2A2A] text-[#2A2A2A] rounded-xl hover:bg-[#2A2A2A] hover:text-white hover:border-[#6D28D9] transition-all duration-300 font-medium"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#6D28D9] to-[#E11D74] text-white rounded-xl hover:from-[#8B5CF6] hover:to-[#E11D74] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl font-medium"
            >
              {loading && (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span>{loading ? 'Cambiando...' : 'Cambiar Contraseña'}</span>
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
