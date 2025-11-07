import { BaseService } from './baseService';

class AdminReviewService extends BaseService {
  constructor() {
    super('/admin');
  }

  // Obtener lista de reseñas con filtros y paginación
  async getReviews(params = {}) {
    return this.get('/reviews', params);
  }

  // Obtener reseña específica
  async getReviewById(reviewId) {
    return this.get(`/reviews/${reviewId}`);
  }

  // Obtener estadísticas de reseñas
  async getReviewStats() {
    return this.get('/reviews/stats');
  }

  // Obtener reseñas recientes
  async getRecentReviews(limit = 10) {
    return this.get(`/reviews/recent?limit=${limit}`);
  }

  // Activar/Desactivar reseña (moderación) - Admin endpoint
  async updateReviewStatus(reviewId, isActive) {
    try {
      console.log('🔄 Actualizando estado de reseña:', { reviewId, isStatus: isActive });
      
      // Primero obtenemos la reseña para asegurarnos de que existe
      const { data: review } = await this.getReviewById(reviewId);
      
      if (!review) {
        throw new Error('No se encontró la reseña');
      }
      
      // Usamos el order de la reseña o 0 si no existe
      const order = review.order || 0;
      
      // Incluimos un timestamp para evitar caché
      const timestamp = new Date().getTime();
      const response = await this.put(`/reviews/${reviewId}/status?t=${timestamp}`, { 
        isActive,
        order
      });
      
      console.log('✅ Estado actualizado:', response);
      
      // Forzar actualización del caché en el navegador
      if (window && window.caches) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error);
      throw error;
    }
  }

  // Eliminar reseña
  async deleteReview(reviewId) {
    return this.delete(`/reviews/${reviewId}`);
  }
}

export const adminReviewService = new AdminReviewService();
