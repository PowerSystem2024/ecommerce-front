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

  // Activar/Desactivar reseña (moderación)
  async updateReviewStatus(reviewId, isActive) {
    return this.put(`/reviews/${reviewId}/status`, { isActive });
  }

  // Eliminar reseña
  async deleteReview(reviewId) {
    return this.delete(`/reviews/${reviewId}`);
  }
}

export const adminReviewService = new AdminReviewService();
