import React, { useState, useEffect, useCallback } from 'react';
import { adminOrderService } from '../services/adminOrderService';
import { successToast, errorToast, loadingToast } from '../../../utils/customToast';
import { confirmDialog } from '../../../utils/confirmDialog.jsx';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
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
    status: '',
    startDate: '',
    endDate: '',
    userId: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [pagination.page, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      const response = await adminOrderService.getOrders(params);
      
      if (response.success && response.data) {
        // Obtener las órdenes reactivadas del localStorage
        const reactivatedOrders = getReactivatedOrders();
        
        // Actualizar las órdenes con el estado local
        const updatedOrders = response.data.map(order => {
          if (reactivatedOrders.has(order._id)) {
            return { ...order, status: 'pendiente' };
          }
          return order;
        });
        
        setOrders(updatedOrders);
        
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
        setError('No se pudieron cargar los pedidos');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminOrderService.getOrderStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const toastId = loadingToast('Actualizando estado del pedido...');
      
      // Si se está cambiando a 'pendiente' desde 'cancelada', usar el manejo local
      const order = orders.find(o => o._id === orderId);
      if (order?.status === 'cancelada' && newStatus === 'pendiente') {
        // Actualizar el estado local
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: 'pendiente' }
              : order
          )
        );
        
        // Guardar en localStorage
        saveReactivatedOrder(orderId);
        
        successToast('Pedido reactivado correctamente');
      } else {
        // Para otros cambios de estado, usar la API
        await adminOrderService.updateOrderStatus(orderId, newStatus);
        
        // Actualizar el estado local
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
        
        successToast('Estado del pedido actualizado correctamente');
      }
      
      // Recargar estadísticas
      fetchStats();
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
      errorToast(error.response?.data?.message || 'Error al actualizar el estado del pedido');
    }
  };

  // Clave para el almacenamiento local
  const LOCAL_STORAGE_KEY = 'reactivated_orders';

  // Cargar órdenes reactivadas del almacenamiento local
  const getReactivatedOrders = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      console.error('Error al cargar órdenes reactivadas:', error);
      return new Set();
    }
  };

  // Función para guardar una orden reactivada
  const saveReactivatedOrder = (orderId) => {
    try {
      const reactivated = getReactivatedOrders();
      reactivated.add(orderId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(reactivated)));
    } catch (error) {
      console.error('Error al guardar orden reactivada:', error);
    }
  };

  // Función para verificar si una orden está reactivada
  const isOrderReactivated = (orderId) => {
    const reactivated = getReactivatedOrders();
    return reactivated.has(orderId);
  };

  // Función para reactivar una orden cancelada
  const handleReactivateOrder = async (orderId) => {
    const confirmed = await confirmDialog(
      '⚠️ ¿Estás seguro de reactivar esta orden?',
      {
        confirmText: 'Reactivar',
        cancelText: 'Cancelar',
        confirmColor: '#3B82F6'
      }
    );
    
    if (!confirmed) {
      return;
    }

    try {
      // 1. Actualizar el estado local
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { 
                ...order, 
                status: 'pendiente',
                updatedAt: new Date().toISOString() 
              }
            : order
        )
      );

      // 2. Guardar en localStorage
      saveReactivatedOrder(orderId);
      
      // 3. Mostrar notificación
      successToast('✅ Orden reactivada correctamente');
      
    } catch (error) {
      console.error('Error al reactivar la orden:', error);
      errorToast('❌ Error al reactivar la orden');
    }
  };

  // Función para obtener el estado real de una orden
  const getOrderStatus = (order) => {
    return isOrderReactivated(order._id) ? 'pendiente' : order.status;
  };

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getStatusColor = (status) => {
    const effectiveStatus = typeof status === 'object' ? getOrderStatus(status) : status;
    switch (effectiveStatus) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmada':
      case 'enviado':
        return 'bg-blue-100 text-blue-800';
      case 'en_camino':
      case 'en camino':
        return 'bg-indigo-100 text-indigo-800';
      case 'entregada':
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    const effectiveStatus = typeof status === 'object' ? getOrderStatus(status) : status;
    
    switch (effectiveStatus) {
      case 'pendiente':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"></circle>
            <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round"></line>
            <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" strokeLinejoin="round"></line>
          </svg>
        );
      case 'confirmada':
      case 'enviado':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"></path>
            <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round"></polyline>
          </svg>
        );
      case 'en_camino':
      case 'en camino':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4h15v7H1z" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M16 8h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1v-7z" strokeLinecap="round" strokeLinejoin="round"></path>
            <circle cx="5.5" cy="16.5" r="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
            <circle cx="17.5" cy="16.5" r="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
          </svg>
        );
      case 'entregada':
      case 'entregado':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"></path>
            <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round"></polyline>
          </svg>
        );
      case 'cancelada':
      case 'cancelado':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"></circle>
            <line x1="15" y1="9" x2="9" y2="15" strokeLinecap="round" strokeLinejoin="round"></line>
            <line x1="9" y1="9" x2="15" y2="15" strokeLinecap="round" strokeLinejoin="round"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (loading && orders.length === 0) {
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
          <h4 className="text-lg text-[#0F0F10] font-['Orbitron',_sans-serif]">Gestión de pedidos</h4>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={fetchOrders}
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
          <h4 className="text-lg text-[#0F0F10] font-['Orbitron',_sans-serif]">Gestión de pedidos</h4>
          <p className="text-sm text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
            Total: {pagination.total} pedidos
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-[#E11D74]">{stats.totalOrders || 0}</div>
            <div className="text-sm text-gray-600">Total Pedidos</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders || 0}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.confirmedOrders || 0}</div>
            <div className="text-sm text-gray-600">Confirmados</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.deliveredOrders || 0}</div>
            <div className="text-sm text-gray-600">Entregados</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalRevenue ? formatCurrency(stats.totalRevenue) : '$0'}
            </div>
            <div className="text-sm text-gray-600">Ingresos</div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="enviada">Enviada</option>
            <option value="entregada">Entregada</option>
            <option value="cancelada">Cancelada</option>
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
              setFilters({ status: '', startDate: '', endDate: '', userId: '' });
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No hay pedidos que coincidan con los filtros
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order._id?.slice(-8) || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.products?.length || 0} productos
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.name || 'Usuario desconocido'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || 'Email no disponible'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order)}`}
                      >
                        {getStatusIcon(order)}
                        <span className="ml-1 capitalize">{getOrderStatus(order)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.total || order.totalAmount || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {order.status !== 'entregada' && order.status !== 'cancelada' && (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="enviada">Enviada</option>
                            <option value="entregada">Entregada</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                        )}
                        {order.status === 'entregada' && (
                          <span className="text-green-600 font-medium">✅ Entregado</span>
                        )}
                        {order.status === 'cancelada' && (
                          <div className="flex flex-col space-y-2">
                            <span className="text-red-600 font-medium">❌ Cancelado</span>
                            <button
                              onClick={() => handleReactivateOrder(order._id)}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                              title="Reactivar pedido"
                            >
                              Reactivar Pedido
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {(pagination.totalPages > 1 || pagination.total > pagination.limit) && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} pedidos
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

export default AdminOrdersPage;
