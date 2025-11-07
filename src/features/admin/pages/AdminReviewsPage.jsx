import React, { useState, useEffect, useCallback } from 'react';
import { adminReviewService } from '../services/adminReviewService';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    rating: '',
    productId: '',
    userId: '',
    isActive: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [pagination.page, filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // Convertir isActive a boolean si no está vacío
      if (filters.isActive !== '') {
        params.isActive = filters.isActive === 'true';
      }
      
      const response = await adminReviewService.getReviews(params);
      
      if (response.success && response.data) {
        setReviews(response.data);
        
        // Manejar paginación
        let total = response.pagination?.total || response.total;
        if (!total) {
          if (response.data.length === pagination.limit) {
            total = response.data.length + 1;
          } else {
            total = ((pagination.page - 1) * pagination.limit) + response.data.length;
          }
        }
        
        const totalPages = response.pagination?.totalPages || Math.ceil(total / pagination.limit);
        
        setPagination(prev => ({
          ...prev,
          total: total,
          totalPages: totalPages
        }));
      } else {
        setError('No se pudieron cargar las reseñas');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al cargar reseñas');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminReviewService.getReviewStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const handleStatusChange = async (reviewId, isActive) => {
    try {
      await adminReviewService.updateReviewStatus(reviewId, isActive);
      const statusText = isActive ? 'activada' : 'desactivada';
      alert(`Reseña ${statusText} exitosamente`);
      fetchReviews();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleDelete = async (reviewId, productName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar esta reseña de "${productName}"?\n\nEsta acción no se puede deshacer.`)) {
      try {
        setLoading(true);
        await adminReviewService.deleteReview(reviewId);
        alert('Reseña eliminada exitosamente');
        fetchReviews();
      } catch (error) {
        console.error('Error al eliminar reseña:', error);
        alert('Error al eliminar la reseña: ' + (error.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D74]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg text-[#0F0F10] font-['Orbitron',_sans-serif]">Gestión de reseñas</h4>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={fetchReviews}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg text-[#0F0F10] font-['Orbitron',_sans-serif]">Gestión de reseñas</h4>
          <p className="text-sm text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
            Total: {pagination.total} reseñas
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-[#E11D74]">{stats.totalReviews || 0}</div>
            <div className="text-sm text-gray-600">Total Reseñas</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.activeReviews || 0}</div>
            <div className="text-sm text-gray-600">Activas</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{stats.inactiveReviews || 0}</div>
            <div className="text-sm text-gray-600">Inactivas</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-yellow-500">
              {stats.averageRating ? `⭐ ${stats.averageRating.toFixed(1)}` : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Promedio</div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Todas las calificaciones</option>
            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
            <option value="4">⭐⭐⭐⭐ (4)</option>
            <option value="3">⭐⭐⭐ (3)</option>
            <option value="2">⭐⭐ (2)</option>
            <option value="1">⭐ (1)</option>
          </select>
        </div>
        <div>
          <select
            value={filters.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="true">Activas</option>
            <option value="false">Inactivas</option>
          </select>
        </div>
        <div>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Fecha desde"
          />
        </div>
        <div>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Fecha hasta"
          />
        </div>
        <div>
          <button
            onClick={() => {
              setFilters({ rating: '', productId: '', userId: '', isActive: '', startDate: '', endDate: '' });
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Lista de Reseñas */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay reseñas que coincidan con los filtros</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header de la reseña */}
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {review.rating}/5
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        por <span className="font-medium">{review.user?.name || 'Usuario'}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          review.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {review.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>

                    {/* Producto */}
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-900">
                        Producto: {review.product?.name || 'Producto no disponible'}
                      </span>
                    </div>

                    {/* Comentario */}
                    <div className="mb-4">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleStatusChange(review._id, !review.isActive)}
                      className={`p-2 rounded-full transition-colors ${
                        review.isActive
                          ? 'text-orange-600 hover:bg-orange-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={review.isActive ? 'Desactivar reseña' : 'Activar reseña'}
                    >
                      {review.isActive ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                          <line x1="12" y1="2" x2="12" y2="12" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22,4 12,14.01 9,11.01" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(review._id, review.product?.name || 'producto')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Eliminar reseña"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      {(pagination.totalPages > 1 || pagination.total > pagination.limit) && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} reseñas
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 border rounded-md text-sm ${
                    pagination.page === pageNum
                      ? 'bg-[#E11D74] text-white border-[#E11D74]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
