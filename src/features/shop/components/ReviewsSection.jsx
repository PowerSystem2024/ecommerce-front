import React, { useState, useMemo, useEffect, useCallback } from 'react';
import RatingStars from './RatingStars';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import ReviewsPagination from './ReviewsPagination';
import productService from '../services/productService';
import { useAuth } from '../../auth/context/AuthContext';
import { orderService } from '../../order-history/services/orderService';

/**
 * Sección completa de reseñas para el detalle del producto
 * 
 * @param {object} props
 * @param {string} props.productId - ID del producto (requerido para cargar desde API)
 * @param {array} props.reviews - Array de reseñas (opcional, si no se proporciona se carga desde API)
 * @param {number} props.averageRating - Calificación promedio
 * @param {number} props.reviewsCount - Cantidad total de reseñas
 * @param {object} props.ratingSummary - Resumen de calificaciones del backend (meta.ratingSummary)
 * @param {number} props.reviewsPerPage - Reseñas por página (default: 5)
 * @param {boolean} props.canReview - Si el usuario puede reseñar este producto
 * @param {function} props.onReviewAdded - Callback cuando se agrega una reseña
 * @param {string} className - Clases CSS adicionales
 */
export default function ReviewsSection({ 
  productId,
  reviews: initialReviews = null,
  averageRating: initialAverageRating = 0, 
  reviewsCount: initialReviewsCount = 0,
  ratingSummary = null,
  reviewsPerPage = 5,
  canReview = false,
  onReviewAdded,
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
  const [editingReview, setEditingReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Cargar pedidos del usuario para verificar si puede reseñar
  const loadUserOrders = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setLoadingOrders(true);
    try {
      const ordersData = await orderService.getUserOrders();
      
      // Normalizar respuesta según estructura del backend
      let ordersList = [];
      if (Array.isArray(ordersData)) {
        ordersList = ordersData;
      } else if (ordersData && ordersData.orders) {
        ordersList = ordersData.orders;
      } else if (ordersData && ordersData.data) {
        ordersList = ordersData.data;
      }
      
      setUserOrders(ordersList || []);
    } catch (err) {
      console.error('Error al cargar pedidos del usuario:', err);
      setUserOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [isAuthenticated, user]);

  // Verificar si el usuario puede reseñar este producto
  const checkCanReview = useCallback((productId, orders) => {
    if (!productId || !orders || orders.length === 0) return false;

    // Buscar si hay algún pedido entregado que contenga este producto
    return orders.some(order => {
      // Verificar que el pedido esté entregado
      if (order.status !== 'Entregado') return false;

      // Verificar que el pedido tenga items
      if (!order.items || !Array.isArray(order.items)) return false;

      // Buscar si alguno de los items contiene el producto
      return order.items.some(item => {
        const itemProductId = item.productId || item.product?._id || item.product?.id || item.id;
        return itemProductId === productId || itemProductId?.toString() === productId?.toString();
      });
    });
  }, []);

  // Cargar pedidos cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated && user && productId) {
      loadUserOrders();
    }
  }, [isAuthenticated, user, productId, loadUserOrders]);

  // Calcular si el usuario puede reseñar
  const canUserReview = useMemo(() => {
    if (!productId || !isAuthenticated || userOrders.length === 0) {
      // Si se pasa canReview como prop, usarlo como fallback
      return canReview;
    }
    return checkCanReview(productId, userOrders);
  }, [productId, isAuthenticated, userOrders, canReview, checkCanReview]);

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

  // Handlers para crear/editar/eliminar reseñas
  const handleCreateReview = async (reviewData) => {
    if (!productId) return;

    setSubmitError('');
    setSubmitSuccess('');
    try {
      await productService.createReview(productId, reviewData);
      setSubmitSuccess('¡Reseña creada exitosamente!');
      setShowReviewForm(false);
      
      // Recargar reseñas
      if (productId && initialReviews === null) {
        await loadReviews(currentPage, sortBy);
      } else {
        // Si se usan reseñas iniciales, recargar página
        if (onReviewAdded) {
          onReviewAdded();
        }
      }
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSubmitSuccess(''), 3000);
    } catch (err) {
      setSubmitError(err.message || 'Error al crear la reseña. Por favor, intenta nuevamente.');
    }
  };

  const handleUpdateReview = async (reviewData) => {
    if (!productId || !editingReview?._id) return;

    setSubmitError('');
    setSubmitSuccess('');
    try {
      await productService.updateReview(productId, editingReview._id, reviewData);
      setSubmitSuccess('¡Reseña actualizada exitosamente!');
      setEditingReview(null);
      
      // Recargar reseñas
      if (productId && initialReviews === null) {
        await loadReviews(currentPage, sortBy);
      } else {
        // Actualizar reseña localmente
        setReviews(prev => prev.map(r => 
          r._id === editingReview._id 
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
    if (!productId || !reviewId) return;

    setSubmitError('');
    setSubmitSuccess('');
    try {
      await productService.deleteReview(productId, reviewId);
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

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
    setSubmitError('');
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setShowReviewForm(false);
    setSubmitError('');
  };

  // Verificar si el usuario ya reseñó
  const userReview = useMemo(() => {
    if (!user?._id) return null;
    return reviews.find(r => {
      const reviewUserId = r.userId || r.user?._id || r.user?.id;
      return reviewUserId === user._id;
    });
  }, [reviews, user]);

  const showCanReviewIndicator = canUserReview && isAuthenticated && userReview;

  // Estados de loading
  if (loading && reviews.length === 0) {
    return (
      <section className={`mt-8 ${className}`}>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-[#E11D74] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
            Cargando reseñas...
          </p>
        </div>
      </section>
    );
  }

  // Si no hay reseñas, mostrar mensaje
  if (!loading && reviews.length === 0 && !showReviewForm) {
    return (
      <section className={`mt-8 ${className}`}>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <RatingStars rating={0} editable={false} size="lg" />
          </div>
          <p className="text-[#2A2A2A] font-['Rajdhani',_sans-serif] text-lg">
            Aún no hay reseñas para este producto
          </p>
          <p className="text-[#2A2A2A]/70 font-['Rajdhani',_sans-serif] text-sm mt-2">
            Sé el primero en dejar una reseña
          </p>
          {canUserReview && isAuthenticated && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="mt-4 px-6 py-2 bg-[#0F0F10] text-white rounded-lg hover:bg-[#E11D74] transition font-['Quantico',_sans-serif]"
            >
              Escribir reseña
            </button>
          )}
          {!canUserReview && isAuthenticated && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-['Rajdhani',_sans-serif] text-center">
                ℹ️ Para reseñar este producto, primero debes comprarlo y recibir tu pedido. Revisa tus pedidos entregados en la sección "Mis Pedidos".
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
        <div className="flex items-center justify-between mb-4">
          <h3 
            id="reviews-heading" 
            className="text-2xl font-bold text-[#0F0F10] font-['Quantico',_sans-serif]"
          >
            Reseñas
          </h3>
          
          {/* Botón para escribir reseña */}
          {canUserReview && isAuthenticated && !showReviewForm && !editingReview && !userReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-[#0F0F10] text-white rounded-lg hover:bg-[#E11D74] transition font-['Quantico',_sans-serif] text-sm"
            >
              Escribir reseña
            </button>
          )}
          {/* Mensaje si no puede reseñar */}
          {!canUserReview && isAuthenticated && !userReview && (
            <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-['Rajdhani',_sans-serif]">
                ⚠️ Solo puedes reseñar productos de pedidos entregados
              </p>
            </div>
          )}
        </div>

        {/* Indicador de "ya reseñaste" */}
        {showCanReviewIndicator && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-['Rajdhani',_sans-serif]">
              ✓ Ya has reseñado este producto
            </p>
          </div>
        )}
        {/* Indicador si no tiene pedidos entregados */}
        {!canUserReview && isAuthenticated && !userReview && !showCanReviewIndicator && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-['Rajdhani',_sans-serif]">
              ℹ️ Para reseñar este producto, primero debes comprarlo y recibir tu pedido. Revisa tus pedidos entregados en la sección "Mis Pedidos".
            </p>
          </div>
        )}

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

        {/* Formulario de reseña */}
        {showReviewForm && (
          <div className="mb-6">
            <ReviewForm
              productId={productId}
              existingReview={editingReview}
              onSubmit={editingReview ? handleUpdateReview : handleCreateReview}
              onCancel={editingReview ? handleCancelEdit : () => setShowReviewForm(false)}
            />
          </div>
        )}

        {/* Estadísticas de reseñas */}
        {!showReviewForm && (
          <div className="flex flex-wrap items-center gap-6 mb-6">
            {/* Promedio de calificación */}
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#0F0F10] font-['Orbitron',_sans-serif]">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-sm text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
                  de 5
                </div>
              </div>
              <div>
                <RatingStars rating={averageRating} editable={false} size="lg" />
                <div className="text-sm text-[#2A2A2A] font-['Rajdhani',_sans-serif] mt-1">
                  {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
                </div>
              </div>
            </div>

            {/* Separador visual */}
            <div className="hidden md:block h-12 w-px bg-gray-300"></div>

            {/* Distribución de calificaciones */}
            <div className="flex-1 min-w-[200px]">
              <div className="text-sm font-semibold text-[#0F0F10] mb-2 font-['Quantico',_sans-serif]">
                Distribución de calificaciones
              </div>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingDistribution[star] || 0;
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-[#2A2A2A] font-['Rajdhani',_sans-serif] w-8">
                        {star}★
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#2A2A2A] font-['Rajdhani',_sans-serif] w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Selector de ordenamiento */}
        {!showReviewForm && reviews.length > 0 && (
          <div className="mb-4">
            <label htmlFor="sort-reviews" className="text-sm font-medium text-[#0F0F10] mr-2 font-['Rajdhani',_sans-serif]">
              Ordenar por:
            </label>
            <select
              id="sort-reviews"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm font-['Rajdhani',_sans-serif] focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74]"
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
          <div className="w-6 h-6 border-2 border-gray-300 border-t-[#E11D74] rounded-full animate-spin mx-auto" />
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
      {!showReviewForm && (
        <div className="space-y-4 mb-6">
          {loading && reviews.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-[#E11D74] rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Cargando reseñas...</p>
            </div>
          ) : currentReviews.length > 0 ? (
            currentReviews.map((review, index) => (
              <ReviewCard 
                key={review._id || review.id || index} 
                review={review}
                currentUserId={user?._id}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 font-['Rajdhani',_sans-serif]">
              No hay reseñas en esta página
            </div>
          )}
        </div>
      )}

      {/* Paginación */}
      {!showReviewForm && totalPages > 1 && (
        <ReviewsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}

