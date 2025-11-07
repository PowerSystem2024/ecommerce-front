import React, { useState, useEffect } from 'react';
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

  // Cargar fuente Rajdhani de Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

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
    <>
      <style>
        {`
          #current::placeholder,
          #new::placeholder,
          #confirm::placeholder {
            color: rgba(180, 180, 180, 0.4);
            font-family: 'Rajdhani', sans-serif;
            font-weight: 400;
            letter-spacing: 0.03em;
          }
          
          #current:not(:placeholder-shown),
          #new:not(:placeholder-shown),
          #confirm:not(:placeholder-shown) {
            background: rgba(15, 10, 20, 0.85) !important;
            color: #d0d0d0 !important;
          }
          
          #current:-webkit-autofill,
          #current:-webkit-autofill:hover,
          #current:-webkit-autofill:focus,
          #new:-webkit-autofill,
          #new:-webkit-autofill:hover,
          #new:-webkit-autofill:focus,
          #confirm:-webkit-autofill,
          #confirm:-webkit-autofill:hover,
          #confirm:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0px 1000px rgba(15, 10, 20, 0.9) inset !important;
            -webkit-text-fill-color: #d0d0d0 !important;
            border: 1px solid rgba(139, 0, 139, 0.3) !important;
          }
        `}
      </style>
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#000000', background: `
      radial-gradient(ellipse at 20% 30%, rgba(220, 20, 60, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(139, 0, 139, 0.25) 0%, transparent 45%),
      radial-gradient(ellipse at 40% 70%, rgba(75, 0, 130, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(220, 20, 60, 0.2) 0%, transparent 45%),
      radial-gradient(ellipse at 50% 50%, rgba(128, 0, 128, 0.15) 0%, transparent 60%),
      linear-gradient(180deg, #0a0a0f 0%, #1a0a14 50%, #0a0a0f 100%)
    ` }}>
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
          className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(139, 0, 139, 0.4)' }}
        />
        {/* Luz Roja/Crimson */}
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
          className="absolute bottom-20 right-10 w-[450px] h-[450px] rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(220, 20, 60, 0.3)' }}
        />
        {/* Luz Violeta Oscuro */}
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
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(75, 0, 130, 0.25)' }}
        />
        {/* Luz adicional magenta */}
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
          className="absolute top-10 right-1/4 w-[380px] h-[380px] rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(139, 0, 139, 0.35)' }}
        />
        {/* Luz adicional roja */}
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
          className="absolute bottom-10 left-1/3 w-[420px] h-[420px] rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(220, 20, 60, 0.25)' }}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative z-10"
        style={{
          backgroundColor: 'rgba(15, 15, 20, 0.25)',
          backdropFilter: 'blur(25px) saturate(140%)',
          WebkitBackdropFilter: 'blur(25px) saturate(140%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 80px rgba(139, 0, 139, 0.2), 0 0 120px rgba(220, 20, 60, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03), inset 0 -1px 0 rgba(0, 0, 0, 0.2)'
        }}
      >
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-6 flex items-center space-x-3"
          style={{ color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'Orbitron', 'Rajdhani', 'Exo 2', 'Arial Black', sans-serif", fontWeight: '900', background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.95)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.9)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 40px rgba(220, 20, 60, 0.3))' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(90deg, #dc143c 0%, #c71585 30%, #8b008b 70%, #4b0082 100%)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span>Cambiar Contraseña</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-base"
          style={{ color: '#d0d0d0', fontFamily: "'Rajdhani', sans-serif", fontWeight: '400', letterSpacing: '0.02em' }}
        >
          Por seguridad, ingresa tu contraseña actual y luego la nueva contraseña que deseas usar.
        </motion.p>

        {/* Mensaje de estado */}
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              backgroundColor: message.type === 'success' 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              border: message.type === 'success'
                ? '1px solid rgba(34, 197, 94, 0.3)'
                : '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" style={{ color: '#90ee90' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" style={{ color: '#ff6b6b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="font-medium" style={{ color: message.type === 'success' ? '#90ee90' : '#ff6b6b', fontFamily: "'Rajdhani', sans-serif", fontWeight: '400', letterSpacing: '0.02em' }}>{message.text}</span>
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
            <label className="block text-sm font-semibold mb-2" style={{ color: '#b0b0b0', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
              Contraseña Actual
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 transition-colors duration-300" style={{ color: 'rgba(200, 200, 200, 0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="current"
                type={showPasswords.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (e.target.value) {
                    e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                    e.target.style.color = '#d0d0d0';
                  } else {
                    e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                    e.target.style.color = '#d0d0d0';
                  }
                }}
                className="w-full pl-10 pr-12 py-3 rounded-xl transition-all duration-300"
                style={{
                  border: '1px solid rgba(139, 0, 139, 0.3)',
                  backgroundColor: 'rgba(10, 10, 15, 0.7)',
                  color: '#d0d0d0',
                  outline: 'none',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: '400',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease'
                }}
                placeholder="Ingresa tu contraseña actual"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(220, 20, 60, 0.6)';
                  e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.85)';
                  e.target.style.color = '#e0e0e0';
                  e.target.style.boxShadow = '0 0 20px rgba(220, 20, 60, 0.2), inset 0 0 10px rgba(139, 0, 139, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(139, 0, 139, 0.3)';
                  e.target.style.boxShadow = 'none';
                  if (e.target.value) {
                    e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                    e.target.style.color = '#d0d0d0';
                  } else {
                    e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                    e.target.style.color = '#d0d0d0';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300"
                style={{ color: '#da70d6' }}
                onMouseEnter={(e) => e.target.style.color = '#ff1493'}
                onMouseLeave={(e) => e.target.style.color = '#da70d6'}
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
            <label className="block text-sm font-semibold mb-2" style={{ color: '#b0b0b0', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
              Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 transition-colors duration-300" style={{ color: 'rgba(200, 200, 200, 0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="new"
                type={showPasswords.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (e.target.value) {
                    e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                    e.target.style.color = '#d0d0d0';
                  } else {
                    e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                    e.target.style.color = '#d0d0d0';
                  }
                }}
                className="w-full pl-10 pr-12 py-3 rounded-xl transition-all duration-300"
                style={{
                  border: '1px solid rgba(139, 0, 139, 0.3)',
                  backgroundColor: 'rgba(10, 10, 15, 0.7)',
                  color: '#d0d0d0',
                  outline: 'none',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: '400',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease'
                }}
                placeholder="Ingresa tu nueva contraseña"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(220, 20, 60, 0.6)';
                  e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.85)';
                  e.target.style.color = '#e0e0e0';
                  e.target.style.boxShadow = '0 0 20px rgba(220, 20, 60, 0.2), inset 0 0 10px rgba(139, 0, 139, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(139, 0, 139, 0.3)';
                  e.target.style.boxShadow = 'none';
                  if (e.target.value) {
                    e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                    e.target.style.color = '#d0d0d0';
                  } else {
                    e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                    e.target.style.color = '#d0d0d0';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300"
                style={{ color: '#da70d6' }}
                onMouseEnter={(e) => e.target.style.color = '#ff1493'}
                onMouseLeave={(e) => e.target.style.color = '#da70d6'}
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
            <label className="block text-sm font-semibold mb-2" style={{ color: '#b0b0b0', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 transition-colors duration-300" style={{ color: 'rgba(200, 200, 200, 0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                id="confirm"
                type={showPasswords.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value) {
                    e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                    e.target.style.color = '#d0d0d0';
                  } else {
                    e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                    e.target.style.color = '#d0d0d0';
                  }
                }}
                className="w-full pl-10 pr-12 py-3 rounded-xl transition-all duration-300"
                style={{
                  border: '1px solid rgba(139, 0, 139, 0.3)',
                  backgroundColor: 'rgba(10, 10, 15, 0.7)',
                  color: '#d0d0d0',
                  outline: 'none',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: '400',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease'
                }}
                placeholder="Confirma tu nueva contraseña"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(220, 20, 60, 0.6)';
                  e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.85)';
                  e.target.style.color = '#e0e0e0';
                  e.target.style.boxShadow = '0 0 20px rgba(220, 20, 60, 0.2), inset 0 0 10px rgba(139, 0, 139, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(139, 0, 139, 0.3)';
                  e.target.style.boxShadow = 'none';
                  if (e.target.value) {
                    e.target.style.backgroundColor = 'rgba(15, 10, 20, 0.8)';
                    e.target.style.color = '#d0d0d0';
                  } else {
                    e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.7)';
                    e.target.style.color = '#d0d0d0';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300"
                style={{ color: '#da70d6' }}
                onMouseEnter={(e) => e.target.style.color = '#ff1493'}
                onMouseLeave={(e) => e.target.style.color = '#da70d6'}
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
              className="px-6 py-3 border-2 rounded-xl transition-all duration-300 font-medium"
              style={{
                borderColor: 'rgba(139, 0, 139, 0.4)',
                color: '#d0d0d0',
                backgroundColor: 'rgba(10, 10, 15, 0.6)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(20, 20, 25, 0.8)';
                e.target.style.borderColor = 'rgba(220, 20, 60, 0.6)';
                e.target.style.color = '#e0e0e0';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(10, 10, 15, 0.6)';
                e.target.style.borderColor = 'rgba(139, 0, 139, 0.4)';
                e.target.style.color = '#d0d0d0';
              }}
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
              style={{
                fontWeight: '600',
                background: 'linear-gradient(135deg, rgba(220, 20, 60, 0.35) 0%, rgba(139, 0, 139, 0.45) 50%, rgba(75, 0, 130, 0.35) 100%)',
                border: '1px solid rgba(220, 20, 60, 0.4)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(220, 20, 60, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = 'linear-gradient(135deg, rgba(220, 20, 60, 0.5) 0%, rgba(139, 0, 139, 0.6) 50%, rgba(75, 0, 130, 0.5) 100%)';
                  e.target.style.borderColor = 'rgba(220, 20, 60, 0.6)';
                  e.target.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.7), 0 0 30px rgba(220, 20, 60, 0.25), 0 0 40px rgba(139, 0, 139, 0.15)';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = 'linear-gradient(135deg, rgba(220, 20, 60, 0.35) 0%, rgba(139, 0, 139, 0.45) 50%, rgba(75, 0, 130, 0.35) 100%)';
                  e.target.style.borderColor = 'rgba(220, 20, 60, 0.4)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(220, 20, 60, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
              onMouseDown={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.7), 0 0 15px rgba(220, 20, 60, 0.2)';
                }
              }}
              onMouseUp={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.7), 0 0 30px rgba(220, 20, 60, 0.25), 0 0 40px rgba(139, 0, 139, 0.15)';
                }
              }}
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
    </>
  );
}
