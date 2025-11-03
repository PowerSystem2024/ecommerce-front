import React from 'react';
import RatingStars from './RatingStars';

/**
 * Componente de tarjeta individual para mostrar una reseña
 * 
 * @param {object} review - Objeto con los datos de la reseña
 * @param {string} review.userName - Nombre del usuario
 * @param {string} review.userAvatar - URL del avatar del usuario (opcional)
 * @param {string} review.comment - Comentario de la reseña
 * @param {number} review.rating - Calificación (1-5)
 * @param {string|Date} review.date - Fecha de publicación
 * @param {string} className - Clases CSS adicionales
 */
export default function ReviewCard({ review, className = '' }) {
  const {
    userName = 'Usuario Anónimo',
    userAvatar = null,
    comment = '',
    rating = 5,
    date = new Date()
  } = review;

  // Formatear fecha
  const formatDate = (dateValue) => {
    const dateObj = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }

    const now = new Date();
    const diffTime = Math.abs(now - dateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Si es hoy
    if (diffDays === 1) {
      return 'Hoy';
    }

    // Si es ayer
    if (diffDays === 2) {
      return 'Ayer';
    }

    // Si es menos de una semana
    if (diffDays < 7) {
      return `Hace ${diffDays - 1} días`;
    }

    // Si es menos de un mes
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    }

    // Si es menos de un año
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
    }

    // Formato completo para fechas antiguas
    return dateObj.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Obtener iniciales del nombre
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 ${className}`}>
      {/* Header de la reseña */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar del usuario */}
        <div className="flex-shrink-0">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {getInitials(userName)}
              </span>
            </div>
          )}
        </div>

        {/* Información del usuario y calificación */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-[#0F0F10] font-['Quantico',_sans-serif] text-sm truncate">
              {userName}
            </h4>
            <span className="text-xs text-[#2A2A2A] font-['Rajdhani',_sans-serif] flex-shrink-0">
              {formatDate(date)}
            </span>
          </div>
          
          {/* Estrellas de calificación */}
          <div className="flex items-center gap-2">
            <RatingStars 
              rating={rating} 
              editable={false} 
              size="sm"
            />
            <span className="text-xs text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Comentario */}
      {comment && (
        <p className="text-[#2A2A2A] text-sm font-['Rajdhani',_sans-serif] leading-relaxed">
          {comment}
        </p>
      )}
    </div>
  );
}

