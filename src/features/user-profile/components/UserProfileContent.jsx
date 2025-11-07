import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { userService } from '../services/userService';

const UserProfileContent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [avatar, setAvatar] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'México'
    },
    preferences: {
      newsletter: false,
      notifications: true,
      language: 'es'
    }
  });

  const loadUserProfile = async () => {
    if (!isAuthenticated) {
      setIsLoadingProfile(false);
      return;
    }

    try {
      setIsLoadingProfile(true);
      setMessage({ type: '', text: '' });
      
      // Cargar perfil completo desde la API
      const response = await userService.getProfile();
      
      console.log('Datos cargados del servidor (completo):', response);
      
      // Extraer los datos del objeto response
      const profileData = response.data || response;
      
      console.log('Datos extraídos:', profileData);
      
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        birthDate: profileData.birthDate ? profileData.birthDate.split('T')[0] : '',
        address: {
          street: profileData.address?.street || '',
          city: profileData.address?.city || '',
          state: profileData.address?.state || '',
          zipCode: profileData.address?.zipCode || profileData.address?.postalCode || '',
          country: profileData.address?.country || 'México'
        },
        preferences: {
          newsletter: profileData.preferences?.newsletter || false,
          notifications: profileData.preferences?.notifications !== false,
          language: profileData.preferences?.language || 'es'
        }
      });

      // Cargar avatar si existe
      if (profileData.avatar) {
        setAvatar(profileData.avatar);
        try { localStorage.setItem('userData', JSON.stringify({ ...(user || {}), avatar: profileData.avatar })); } catch {}
        if (updateUser) updateUser({ avatar: profileData.avatar });
      }
      
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error al cargar el perfil. Inténtalo de nuevo.' 
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    loadUserProfile();
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Transformar los datos para enviar al servidor (zipCode -> postalCode)
      const dataToSend = {
        ...formData,
        address: {
          ...formData.address,
          postalCode: formData.address.zipCode
        }
      };
      // Eliminar zipCode de los datos a enviar
      delete dataToSend.address.zipCode;
      
      console.log('Datos a enviar al servidor:', dataToSend);
      
      // Actualizar perfil usando la API real
      const response = await userService.updateProfile(dataToSend);
      
      console.log('Datos actualizados del servidor:', response);
      
      // Extraer los datos del objeto response
      const updatedProfile = response.data || response;
      
      // Actualizar el formulario con los datos retornados por el servidor
      setFormData({
        name: updatedProfile.name || formData.name,
        email: updatedProfile.email || formData.email,
        phone: updatedProfile.phone || formData.phone,
        birthDate: updatedProfile.birthDate ? updatedProfile.birthDate.split('T')[0] : formData.birthDate,
        address: {
          street: updatedProfile.address?.street || formData.address.street,
          city: updatedProfile.address?.city || formData.address.city,
          state: updatedProfile.address?.state || formData.address.state,
          zipCode: updatedProfile.address?.zipCode || updatedProfile.address?.postalCode || formData.address.zipCode,
          country: updatedProfile.address?.country || formData.address.country
        },
        preferences: updatedProfile.preferences || formData.preferences
      });
      
      // Actualizar el avatar si cambió
      if (updatedProfile.avatar) {
        setAvatar(updatedProfile.avatar);
      }
      
      setMessage({ 
        type: 'success', 
        text: 'Perfil actualizado correctamente' 
      });
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al actualizar el perfil. Inténtalo de nuevo.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar datos originales
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'México'
        },
        preferences: {
          newsletter: user.preferences?.newsletter || false,
          notifications: user.preferences?.notifications !== false,
          language: user.preferences?.language || 'es'
        }
      });
    }
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleChangePassword = () => {
    navigate('/change-password', { state: { from: '/profile' } });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setMessage({ 
        type: 'error', 
        text: 'Por favor selecciona un archivo de imagen válido.' 
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ 
        type: 'error', 
        text: 'El archivo es demasiado grande. Máximo 5MB.' 
      });
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setMessage({ type: '', text: '' });

      const result = await userService.uploadAvatar(file);
      
      const newAvatar = result.avatar || result.avatarUrl;
      setAvatar(newAvatar);
      if (updateUser) updateUser({ avatar: newAvatar });
      try { localStorage.setItem('userData', JSON.stringify({ ...(user || {}), avatar: newAvatar })); } catch {}
      
      setMessage({ 
        type: 'success', 
        text: 'Avatar actualizado correctamente' 
      });
      
    } catch (error) {
      console.error('Error subiendo avatar:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al subir el avatar. Inténtalo de nuevo.' 
      });
    } finally {
      setIsUploadingAvatar(false);
      // Limpiar el input para permitir subir el mismo archivo otra vez
      e.target.value = '';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(26, 26, 27, 0.95) 0%, rgba(15, 15, 16, 0.98) 50%, rgba(30, 10, 25, 0.95) 100%)"
          }}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-[#E11D74] to-[#6D28D9] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-[#E11D74] mb-3 font-['Orbitron',sans-serif] uppercase tracking-wide"
          >
            Acceso requerido
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[#CFCFCF] mb-6 text-lg font-['Rajdhani',sans-serif]"
          >
            Debes iniciar sesión para acceder a tu perfil
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(26, 26, 27, 0.95) 0%, rgba(15, 15, 16, 0.98) 50%, rgba(30, 10, 25, 0.95) 100%)"
          }}
        >
          <div className="animate-spin w-12 h-12 border-4 border-[#E11D74] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#CFCFCF] text-lg font-['Rajdhani',sans-serif]">Cargando perfil...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 shadow-lg bg-gradient-to-br from-[#E11D74] to-[#6D28D9] flex items-center justify-center">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              
              {/* Botón de subir avatar */}
              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#E11D74] to-[#6D28D9] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                title="Cambiar avatar"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
                {isUploadingAvatar ? (
                  <svg className="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </motion.label>
            </motion.div>

            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-[#E11D74] mb-3 font-['Orbitron',sans-serif] uppercase tracking-wide"
              >
                Mi Perfil
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[#CFCFCF] text-lg mb-4 font-['Rajdhani',sans-serif]"
              >
                Gestiona tu información personal y preferencias
              </motion.p>
            </div>
          </div>
          {!isEditing && (
            <div className="flex space-x-3">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleChangePassword}
                className="px-6 py-3 bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white rounded-xl hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl font-['Quantico',sans-serif] uppercase"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-medium">Cambiar Contraseña</span>
              </motion.button>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white rounded-xl hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl font-['Quantico',sans-serif] uppercase"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="font-medium">Editar Perfil</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mensaje de estado */}
      {message.text && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mb-6 p-4 rounded-xl shadow-lg border ${
            message.type === 'success' 
              ? 'bg-green-900/30 text-green-200 border-green-500' 
              : 'bg-red-900/30 text-red-200 border-red-500'
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

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información Personal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -2 }}
          className="backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 p-8 hover:shadow-xl transition-all duration-300 hover:border-[#E11D74]/50"
          style={{
            background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
          }}
        >
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-[#E11D74] mb-8 flex items-center space-x-3 font-['Orbitron',sans-serif] uppercase tracking-wide"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#E11D74] to-[#6D28D9] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span>Información Personal</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#CFCFCF]/50 group-focus-within:text-[#E11D74] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] disabled:bg-[#0F0F10]/50 disabled:text-[#CFCFCF]/50 transition-all duration-300 hover:border-[#E11D74]/50 hover:shadow-md focus:shadow-lg bg-[#0F0F10]/90 backdrop-blur-sm text-[#CFCFCF] placeholder:text-[#CFCFCF]/50 font-['Rajdhani',sans-serif]"
                  placeholder="Nombre completo"
                  required
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#CFCFCF]/50 group-focus-within:text-[#E11D74] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] disabled:bg-[#0F0F10]/50 disabled:text-[#CFCFCF]/50 transition-all duration-300 hover:border-[#E11D74]/50 hover:shadow-md focus:shadow-lg bg-[#0F0F10]/90 backdrop-blur-sm text-[#CFCFCF] placeholder:text-[#CFCFCF]/50 font-['Rajdhani',sans-serif]"
                  placeholder="Correo electrónico"
                  required
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative group"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#CFCFCF]/50 group-focus-within:text-[#E11D74] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] disabled:bg-[#0F0F10]/50 disabled:text-[#CFCFCF]/50 transition-all duration-300 hover:border-[#E11D74]/50 hover:shadow-md focus:shadow-lg bg-[#0F0F10]/90 backdrop-blur-sm text-[#CFCFCF] placeholder:text-[#CFCFCF]/50 font-['Rajdhani',sans-serif]"
                  placeholder="Teléfono"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#CFCFCF]/50 group-focus-within:text-[#E11D74] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] disabled:bg-[#0F0F10]/50 disabled:text-[#CFCFCF]/50 transition-all duration-300 hover:border-[#E11D74]/50 hover:shadow-md focus:shadow-lg bg-[#0F0F10]/90 backdrop-blur-sm text-[#CFCFCF] placeholder:text-[#CFCFCF]/50 font-['Rajdhani',sans-serif]"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Dirección */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -2 }}
          className="backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 p-8 hover:shadow-xl transition-all duration-300 hover:border-[#E11D74]/50"
          style={{
            background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
          }}
        >
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-[#E11D74] mb-8 flex items-center space-x-3 font-['Orbitron',sans-serif] uppercase tracking-wide"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#E11D74] to-[#6D28D9] rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span>Dirección</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 relative group"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#CFCFCF]/50 group-focus-within:text-[#E11D74] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] disabled:bg-[#0F0F10]/50 disabled:text-[#CFCFCF]/50 transition-all duration-300 hover:border-[#E11D74]/50 hover:shadow-md focus:shadow-lg bg-[#0F0F10]/90 backdrop-blur-sm text-[#CFCFCF] placeholder:text-[#CFCFCF]/50 font-['Rajdhani',sans-serif]"
                  placeholder="Calle y número"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative group"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#CFCFCF]/50 group-focus-within:text-[#E11D74] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] disabled:bg-[#0F0F10]/50 disabled:text-[#CFCFCF]/50 transition-all duration-300 hover:border-[#E11D74]/50 hover:shadow-md focus:shadow-lg bg-[#0F0F10]/90 backdrop-blur-sm text-[#CFCFCF] placeholder:text-[#CFCFCF]/50 font-['Rajdhani',sans-serif]"
                  placeholder="Ciudad"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#CFCFCF]/50 group-focus-within:text-[#E11D74] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] disabled:bg-[#0F0F10]/50 disabled:text-[#CFCFCF]/50 transition-all duration-300 hover:border-[#E11D74]/50 hover:shadow-md focus:shadow-lg bg-[#0F0F10]/90 backdrop-blur-sm text-[#CFCFCF] placeholder:text-[#CFCFCF]/50 font-['Rajdhani',sans-serif]"
                  placeholder="Estado"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative group"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#CFCFCF]/50 group-focus-within:text-[#E11D74] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] disabled:bg-[#0F0F10]/50 disabled:text-[#CFCFCF]/50 transition-all duration-300 hover:border-[#E11D74]/50 hover:shadow-md focus:shadow-lg bg-[#0F0F10]/90 backdrop-blur-sm text-[#CFCFCF] placeholder:text-[#CFCFCF]/50 font-['Rajdhani',sans-serif]"
                  placeholder="Código postal"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative group"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#CFCFCF]/50 group-focus-within:text-[#E11D74] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <select
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-10 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] disabled:bg-[#0F0F10]/50 disabled:text-[#CFCFCF]/50 transition-all duration-300 hover:border-[#E11D74]/50 hover:shadow-md focus:shadow-lg bg-[#0F0F10]/90 backdrop-blur-sm appearance-none text-[#CFCFCF] font-['Rajdhani',sans-serif]"
                >
                  <option value="México">México</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Canadá">Canadá</option>
                  <option value="España">España</option>
                  <option value="Argentina">Argentina</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#CFCFCF]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>


        {/* Botones de acción */}
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-end space-x-4 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleCancel}
              className="px-8 py-3 border-2 border-white/20 text-[#CFCFCF] rounded-xl hover:bg-[#0F0F10]/80 hover:border-[#E11D74] hover:text-[#E11D74] transition-all duration-200 font-['Quantico',sans-serif] uppercase"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white rounded-xl hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl font-['Quantico',sans-serif] uppercase"
            >
              {isLoading && (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span>{isLoading ? 'Guardando...' : 'Guardar Cambios'}</span>
            </motion.button>
          </motion.div>
        )}
      </form>

      </div>
    </div>
  );
};

export default UserProfileContent;
