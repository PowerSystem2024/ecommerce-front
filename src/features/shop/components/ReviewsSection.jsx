import React, { useState, useMemo, useEffect, useCallback } from 'react';
import RatingStars from './RatingStars';
import ReviewCard from './ReviewCard';
import ReviewsPagination from './ReviewsPagination';
import productService from '../services/productService';
import { useAuth } from '../../auth/context/AuthContext';

/**
 * Sección completa de reseñas para el detalle del producto
 * Solo muestra reseñas - NO permite crear reseñas desde aquí
 * Las reseñas solo se pueden crear desde "Mis Pedidos"
 * 
 * @param {object} props
 * @param {string} props.productId - ID del producto (requerido para cargar desde API)
 * @param {array} props.reviews - Array de reseñas (opcional, si no se proporciona se carga desde API)
 * @param {number} props.averageRating - Calificación promedio
 * @param {number} props.reviewsCount - Cantidad total de reseñas
 * @param {object} props.ratingSummary - Resumen de calificaciones del backend (meta.ratingSummary)
 * @param {number} props.reviewsPerPage - Reseñas por página (default: 5)
 * @param {string} className - Clases CSS adicionales
 */
export default function ReviewsSection({ 
  productId,
  reviews: initialReviews = null,
  averageRating: initialAverageRating = 0, 
  reviewsCount: initialReviewsCount = 0,
  ratingSummary = null,
  reviewsPerPage = 5,
  className = '' 
}) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState(initialReviews || []);
  const [loading, setLoading] = useState(initialReviews === null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(initialReviewsCount);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Cargar reseñas desde la API
  const loadReviews = useCallback(async (page = 1, sort = 'newest') => {
    if (!productId) return;

    setLoading(true);
    setError('');
    try {
      const response = await productService.getReviews(productId, {
        page,
        limit: reviewsPerPage,
        sort
      });

      // Normalizar respuesta según estructura del backend
      const data = response?.data || response;
      const reviewsData = data.reviews || data || [];
      const meta = data.meta || {};
      
      setReviews(reviewsData);
      setTotalPages(meta.totalPages || Math.ceil((meta.total || reviewsData.length) / reviewsPerPage));
      setTotalReviews(meta.total || reviewsData.length);
      
      // Usar ratingSummary del backend si está disponible
      if (ratingSummary || meta.ratingSummary) {
        const summary = ratingSummary || meta.ratingSummary;
        setAverageRating(summary.average || 0);
      } else if (meta.averageRating !== undefined) {
        setAverageRating(meta.averageRating);
      } else {
        // Calcular promedio si no viene del backend
        const totalRating = reviewsData.reduce((sum, review) => sum + (review.rating || 0), 0);
        setAverageRating(reviewsData.length > 0 ? totalRating / reviewsData.length : 0);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar las reseñas');
      console.error('Error al cargar reseñas:', err);
    } finally {
      setLoading(false);
    }
  }, [productId, reviewsPerPage, ratingSummary]);

  // Cargar reseñas cuando cambia el producto, página o ordenamiento
  useEffect(() => {
    if (productId && initialReviews === null) {
      loadReviews(currentPage, sortBy);
    } else if (initialReviews !== null) {
      // Si se proporcionan reseñas iniciales, usar esas
      setReviews(initialReviews);
      setTotalPages(Math.ceil(initialReviews.length / reviewsPerPage));
      setTotalReviews(initialReviewsCount);
    }
  }, [productId, currentPage, sortBy, initialReviews, initialReviewsCount, reviewsPerPage, loadReviews]);

  // Resetear a página 1 cuando cambia el ordenamiento
  useEffect(() => {
    if (productId && initialReviews === null) {
      setCurrentPage(1);
    }
  }, [sortBy, productId, initialReviews]);

  // Obtener reseñas de la página actual (si no se usa API)
  const currentReviews = useMemo(() => {
    if (productId && initialReviews === null) {
      // Si se carga desde API, usar las reseñas ya paginadas
      return reviews;
    }
    // Si se proporcionan reseñas iniciales, paginar localmente
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    return reviews.slice(startIndex, endIndex);
  }, [reviews, currentPage, reviewsPerPage, productId, initialReviews]);

  // Calcular distribución de calificaciones desde ratingSummary o reviews
  const ratingDistribution = useMemo(() => {
    if (ratingSummary) {
      return ratingSummary.distribution || {};
    }
    
    // Calcular desde las reseñas actuales
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      const rating = Math.round(review.rating || 0);
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });
    return distribution;
  }, [ratingSummary, reviews]);

  // Handlers para editar/eliminar reseñas (solo el autor puede)
  const handleUpdateReview = async (reviewId, reviewData) => {
    if (!reviewId) return;

    setSubmitError('');
    setSubmitSuccess('');
    try {
      await productService.updateReview(reviewId, reviewData);
      setSubmitSuccess('¡Reseña actualizada exitosamente!');
      
      // Recargar reseñas
      if (productId && initialReviews === null) {
        await loadReviews(currentPage, sortBy);
      } else {
        // Actualizar reseña localmente
        setReviews(prev => prev.map(r => 
          r._id === reviewId 
            ? { ...r, ...reviewData }
            : r
        ));
      }
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSubmitSuccess(''), 3000);
    } catch (err) {
      setSubmitError(err.message || 'Error al actualizar la reseña. Por favor, intenta nuevamente.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!reviewId) return;

    setSubmitError('');
    setSubmitSuccess('');
    try {
      await productService.deleteReview(reviewId);
      setSubmitSuccess('Reseña eliminada exitosamente');
      
      // Recargar reseñas
      if (productId && initialReviews === null) {
        await loadReviews(currentPage, sortBy);
      } else {
        // Eliminar reseña localmente
        setReviews(prev => prev.filter(r => r._id !== reviewId));
        setTotalReviews(prev => Math.max(0, prev - 1));
      }
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSubmitSuccess(''), 3000);
    } catch (err) {
      setSubmitError(err.message || 'Error al eliminar la reseña. Por favor, intenta nuevamente.');
      throw err; // Re-lanzar para que ReviewCard pueda manejarlo
    }
  };

  // Estados de loading
  if (loading && reviews.length === 0) {
    return (
      <section className={`mt-8 ${className}`}>
        <div className="backdrop-blur-sm rounded-lg border border-white/10 p-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
          }}
        >
          <div className="w-10 h-10 border-4 border-white/40 border-t-[#E11D74] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#CFCFCF] font-['Rajdhani',_sans-serif]">
            Cargando reseñas...
          </p>
        </div>
      </section>
    );
  }

  // Si no hay reseñas, mostrar mensaje
  if (!loading && reviews.length === 0) {
    return (
      <section className={`mt-8 ${className}`}>
        <div className="backdrop-blur-sm rounded-lg border border-white/10 p-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
          }}
        >
          <div className="flex justify-center mb-4">
            <RatingStars rating={0} editable={false} size="lg" />
          </div>
          <p className="text-[#0F0F10] font-['Rajdhani',_sans-serif] text-lg">
            Aún no hay reseñas para este producto
          </p>
          <p className="text-[#0F0F10]/70 font-['Rajdhani',_sans-serif] text-sm mt-2">
            Sé el primero en dejar una reseña
          </p>
          {isAuthenticated && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-['Rajdhani',_sans-serif] text-center">
                💡 Para reseñar este producto, primero debes comprarlo y recibir tu pedido. Ve a "Mis Pedidos" para dejar tu reseña.
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={`mt-8 ${className}`} aria-labelledby="reviews-heading">
      {/* Header de la sección */}
      <div className="mb-6">
        <h3 
          id="reviews-heading"
          className="text-2xl font-bold text-[#E11D74] mb-4 font-['Quantico',_sans-serif] uppercase tracking-wide"
        >
          Reseñas
        </h3>

        {/* Mensajes de feedback */}
        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-['Rajdhani',_sans-serif]">
              {submitSuccess}
            </p>
          </div>
        )}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-['Rajdhani',_sans-serif]">
              {submitError}
            </p>
          </div>
        )}

        {/* Estadísticas de reseñas */}
        {totalReviews > 0 ? (
          <div className="flex flex-wrap items-center gap-6 mb-6">
            {/* Promedio de calificación */}
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#E11D74] font-['Orbitron',_sans-serif]">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-sm text-[#CFCFCF] font-['Rajdhani',_sans-serif]">
                  de 5
                </div>
              </div>
              <div>
                <RatingStars rating={averageRating} editable={false} size="lg" />
                <div className="text-sm text-[#0F0F10] font-['Rajdhani',_sans-serif] mt-1">
                  {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
                </div>
              </div>
            </div>

            {/* Separador visual */}
            <div className="hidden md:block h-12 w-px bg-white/30"></div>

            {/* Distribución de calificaciones */}
            <div className="flex-1 min-w-[200px]">
              <div className="text-sm font-semibold text-[#E11D74] mb-2 font-['Quantico',_sans-serif] uppercase tracking-wide">
                Distribución de calificaciones
              </div>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingDistribution[star] || 0;
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-[#0F0F10] font-['Rajdhani',_sans-serif] w-8">
                        {star}★
                      </span>
                      <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#0F0F10] font-['Rajdhani',_sans-serif] w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-[#0F0F10]/50 backdrop-blur-sm rounded-lg border border-white/10">
            <p className="text-sm text-[#CFCFCF] font-['Rajdhani',_sans-serif] text-center">
              Este producto aún no tiene reseñas. Las reseñas solo pueden ser creadas por usuarios que compraron y recibieron el producto.
            </p>
          </div>
        )}

        {/* Selector de ordenamiento */}
        {reviews.length > 0 && (
          <div className="mb-4">
            <label htmlFor="sort-reviews" className="text-sm font-medium text-[#E11D74] mr-2 font-['Rajdhani',_sans-serif] uppercase tracking-wide">
              Ordenar por:
            </label>
            <select
              id="sort-reviews"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-white/20 rounded-lg px-3 py-1 text-sm font-['Rajdhani',_sans-serif] bg-[#0F0F10]/80 text-[#CFCFCF] focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74]"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguas</option>
              <option value="highest">Mayor calificación</option>
              <option value="lowest">Menor calificación</option>
            </select>
          </div>
        )}
      </div>

      {/* Estado de loading durante recarga */}
      {loading && reviews.length > 0 && (
        <div className="mb-4 text-center">
          <div className="w-6 h-6 border-2 border-white/40 border-t-[#E11D74] rounded-full animate-spin mx-auto" />
        </div>
      )}

      {/* Mensaje de error */}
      {error && !loading && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-['Rajdhani',_sans-serif]">
            {error}
          </p>
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-4 mb-6">
        {loading && reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-white/40 border-t-[#E11D74] rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-[#CFCFCF]">Cargando reseñas...</p>
          </div>
        ) : currentReviews.length > 0 ? (
            currentReviews.map((review, index) => (
              <ReviewCard 
                key={review._id || review.id || index} 
                review={review}
                currentUserId={user?._id}
                onEdit={(review) => {
                  // TODO: Implementar modal de edición de reseña
                  // Por ahora, solo mostramos un mensaje
                  alert('Para editar tu reseña, ve a "Mis Pedidos" y busca el pedido donde compraste este producto.');
                }}
                onDelete={handleDeleteReview}
              />
            ))
        ) : (
          <div className="text-center py-8 text-[#CFCFCF] font-['Rajdhani',_sans-serif]">
            No hay reseñas en esta página
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <ReviewsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}

