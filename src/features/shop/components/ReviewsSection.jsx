import React, { useState, useMemo } from 'react';
import RatingStars from './RatingStars';
import ReviewCard from './ReviewCard';
import ReviewsPagination from './ReviewsPagination';

/**
 * Sección completa de reseñas para el detalle del producto
 * 
 * @param {object} props
 * @param {array} props.reviews - Array de reseñas
 * @param {number} props.averageRating - Calificación promedio
 * @param {number} props.reviewsCount - Cantidad total de reseñas
 * @param {number} props.reviewsPerPage - Reseñas por página (default: 5)
 * @param {string} className - Clases CSS adicionales
 */
export default function ReviewsSection({ 
  reviews = [], 
  averageRating = 0, 
  reviewsCount = 0,
  reviewsPerPage = 5,
  className = '' 
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular promedio y cantidad si no se proporcionan
  const calculatedStats = useMemo(() => {
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const average = totalRating / reviews.length;
    
    return {
      average: average.toFixed(1),
      count: reviews.length
    };
  }, [reviews]);

  const finalAverageRating = averageRating || parseFloat(calculatedStats.average);
  const finalReviewsCount = reviewsCount || calculatedStats.count;

  // Calcular páginas
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  // Obtener reseñas de la página actual
  const currentReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    return reviews.slice(startIndex, endIndex);
  }, [reviews, currentPage, reviewsPerPage]);

  // Resetear a página 1 cuando cambian las reseñas
  React.useEffect(() => {
    setCurrentPage(1);
  }, [reviews.length]);

  // Si no hay reseñas, mostrar mensaje
  if (reviews.length === 0) {
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
          className="text-2xl font-bold text-[#0F0F10] mb-4 font-['Quantico',_sans-serif]"
        >
          Reseñas
        </h3>

        {/* Estadísticas de reseñas */}
        <div className="flex flex-wrap items-center gap-6 mb-6">
          {/* Promedio de calificación */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#0F0F10] font-['Orbitron',_sans-serif]">
                {finalAverageRating.toFixed(1)}
              </div>
              <div className="text-sm text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
                de 5
              </div>
            </div>
            <div>
              <RatingStars rating={finalAverageRating} editable={false} size="lg" />
              <div className="text-sm text-[#2A2A2A] font-['Rajdhani',_sans-serif] mt-1">
                {finalReviewsCount} {finalReviewsCount === 1 ? 'reseña' : 'reseñas'}
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
                const count = reviews.filter(r => Math.round(r.rating || 0) === star).length;
                const percentage = finalReviewsCount > 0 ? (count / finalReviewsCount) * 100 : 0;
                
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
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-4 mb-6">
        {currentReviews.map((review, index) => (
          <ReviewCard 
            key={review._id || review.id || index} 
            review={review} 
          />
        ))}
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

