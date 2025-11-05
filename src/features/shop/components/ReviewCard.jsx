import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
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
 * @param {string} review.userId - ID del usuario que hizo la reseña
 * @param {string} review._id - ID de la reseña
 * @param {string} className - Clases CSS adicionales
 * @param {string} currentUserId - ID del usuario actual autenticado
 * @param {function} onEdit - Callback cuando se edita la reseña
 * @param {function} onDelete - Callback cuando se elimina la reseña
 */
export default function ReviewCard({ 
  review, 
  className = '',
  currentUserId,
  onEdit,
  onDelete
}) {
  const {
    userName = 'Usuario Anónimo',
    userAvatar = null,
    comment = '',
    rating = 5,
    date = new Date(),
    userId,
    user,
    _id: reviewId
  } = review;

  // Verificar si el usuario actual es el autor de la reseña
  const reviewUserId = userId || user?._id || user?.id;
  const isOwner = currentUserId && reviewUserId && currentUserId === reviewUserId;
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Manejar eliminación
  const handleDelete = async () => {
    if (!onDelete || !reviewId) return;
    
    setIsDeleting(true);
    try {
      await onDelete(reviewId);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error al eliminar reseña:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#2A2A2A] font-['Rajdhani',_sans-serif] flex-shrink-0">
                  {formatDate(date)}
                </span>
                
                {/* Botones de acción solo para el dueño */}
                {isOwner && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit && onEdit(review)}
                      className="p-1 text-gray-400 hover:text-[#E11D74] transition-colors rounded"
                      title="Editar reseña"
                      aria-label="Editar reseña"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteDialog(true)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded"
                      title="Eliminar reseña"
                      aria-label="Eliminar reseña"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
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

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={showDeleteDialog} onClose={() => !isDeleting && setShowDeleteDialog(false)}>
        <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <DialogPanel className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-[#0F0F10] font-['Quantico',_sans-serif] mb-2">
              ¿Eliminar reseña?
            </h3>
            <p className="text-[#2A2A2A] font-['Rajdhani',_sans-serif] mb-6">
              Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar tu reseña?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-[#2A2A2A] hover:bg-gray-50 transition font-['Rajdhani',_sans-serif] disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-['Quantico',_sans-serif] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

