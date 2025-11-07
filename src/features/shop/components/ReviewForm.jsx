import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';

/**
 * Componente de formulario para crear o editar una reseña
 * 
 * @param {object} props
 * @param {string} props.productId - ID del producto
 * @param {object} props.existingReview - Reseña existente para editar (opcional)
 * @param {function} props.onSubmit - Callback cuando se envía el formulario
 * @param {function} props.onCancel - Callback cuando se cancela (solo en modo edición)
 * @param {boolean} props.disabled - Si el formulario está deshabilitado
 * @param {string} props.className - Clases CSS adicionales
 */
export default function ReviewForm({
  productId,
  existingReview = null,
  onSubmit,
  onCancel,
  disabled = false,
  className = ''
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resetear formulario cuando cambia la reseña existente
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 0);
      setComment(existingReview.comment || '');
      setErrors({});
    } else {
      setRating(0);
      setComment('');
      setErrors({});
    }
  }, [existingReview]);

  // Validaciones
  const validate = () => {
    const newErrors = {};

    // Validar calificación
    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = 'Debes seleccionar una calificación de 1 a 5 estrellas';
    }

    // Validar comentario
    if (!comment.trim()) {
      newErrors.comment = 'El comentario es requerido';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'El comentario debe tener al menos 10 caracteres';
    } else if (comment.trim().length > 1000) {
      newErrors.comment = 'El comentario no puede tener más de 1000 caracteres';
    }

    // Validación de contenido apropiado (palabras ofensivas básicas)
    const inappropriateWords = ['spam', 'estafa', 'fraude']; // Ejemplo básico
    const lowerComment = comment.toLowerCase();
    const hasInappropriateContent = inappropriateWords.some(word => 
      lowerComment.includes(word)
    );
    
    if (hasInappropriateContent) {
      newErrors.comment = 'El comentario contiene contenido no apropiado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        comment: comment.trim()
      });
      // Limpiar formulario solo si no es edición
      if (!existingReview) {
        setRating(0);
        setComment('');
      }
      setErrors({});
    } catch (error) {
      // El error se maneja en el componente padre
      console.error('Error al enviar reseña:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!existingReview;

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="backdrop-blur-sm rounded-lg border border-white/10 p-6"
        style={{
          background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
        }}
      >
        <h3 className="text-lg font-semibold text-[#E11D74] font-['Quantico',_sans-serif] mb-4 uppercase tracking-wide">
          {isEditing ? 'Editar tu reseña' : 'Escribir una reseña'}
        </h3>

        {/* Campo de calificación */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#E11D74] mb-2 font-['Rajdhani',_sans-serif] uppercase tracking-wide">
            Calificación <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <RatingStars
              rating={rating}
              editable={!disabled && !isSubmitting}
              size="lg"
              onChange={setRating}
            />
            {rating > 0 && (
              <span className="text-sm text-[#CFCFCF] font-['Rajdhani',_sans-serif]">
                {rating.toFixed(1)} estrellas
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600 font-['Rajdhani',_sans-serif]">
              {errors.rating}
            </p>
          )}
        </div>

        {/* Campo de comentario */}
        <div className="mb-4">
          <label htmlFor="review-comment" className="block text-sm font-medium text-[#0F0F10] mb-2 font-['Rajdhani',_sans-serif]">
            Comentario <span className="text-red-500">*</span>
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              // Limpiar error cuando el usuario empieza a escribir
              if (errors.comment) {
                setErrors(prev => ({ ...prev, comment: null }));
              }
            }}
            rows={4}
            disabled={disabled || isSubmitting}
            placeholder="Compartí tu experiencia con este producto..."
            className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] font-['Rajdhani',_sans-serif] transition-colors text-[#CFCFCF] placeholder:text-[#CFCFCF]/50 ${
              errors.comment
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-white/20'
            } ${disabled || isSubmitting ? 'bg-[#0F0F10]/50 cursor-not-allowed' : 'bg-[#0F0F10]/90 backdrop-blur-sm'}`}
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.comment && (
              <p className="text-sm text-red-600 font-['Rajdhani',_sans-serif]">
                {errors.comment}
              </p>
            )}
            <span className={`text-xs ml-auto font-['Rajdhani',_sans-serif] ${
              comment.length > 1000 ? 'text-red-600' : 'text-[#CFCFCF]/60'
            }`}>
              {comment.length}/1000
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end">
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting || disabled}
              className="px-4 py-2 border border-white/20 rounded-lg text-[#CFCFCF] bg-[#0F0F10]/80 hover:bg-gradient-to-r hover:from-[#E11D74] hover:to-[#6D28D9] hover:text-white hover:border-transparent transition font-['Rajdhani',_sans-serif] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || disabled || rating === 0 || !comment.trim()}
            className={`px-6 py-2 rounded-lg text-white font-['Quantico',_sans-serif] transition flex items-center gap-2 uppercase tracking-wide shadow-lg ${
              isSubmitting || disabled || rating === 0 || !comment.trim()
                ? 'bg-[#0F0F10]/30 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#E11D74] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#8B5CF6]'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEditing ? 'Guardando...' : 'Enviando...'}
              </>
            ) : (
              isEditing ? 'Guardar cambios' : 'Enviar reseña'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}


