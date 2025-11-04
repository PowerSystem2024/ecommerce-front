import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { orderService } from '../services/orderService';
import OrderDetailModal from './OrderDetailModal';

const OrderHistoryContent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Error boundary simple
  const [hasError, setHasError] = useState(false);
  
  // Capturar errores de renderizado
  if (hasError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error en el componente</h2>
          <p className="text-red-600 mb-4">Algo salió mal al cargar el historial de pedidos.</p>
          <button 
            onClick={() => {
              setHasError(false);
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState(null);

  // Estado para los pedidos reales
  const [orders, setOrders] = useState([]);
  
  // Estado para el modal de detalles
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar pedidos del usuario
  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) {
        setIsLoadingOrders(false);
        return;
      }

      try {
        setIsLoadingOrders(true);
        setError(null);
        
        console.log('🔍 Cargando pedidos del usuario...');
        const ordersData = await orderService.getUserOrders();
        console.log('📦 Datos recibidos:', ordersData);
        
        // Manejar diferentes formatos de respuesta
        let ordersList = [];
        if (Array.isArray(ordersData)) {
          ordersList = ordersData;
        } else if (ordersData && ordersData.orders) {
          ordersList = ordersData.orders;
        } else if (ordersData && ordersData.data) {
          ordersList = ordersData.data;
        } else {
          console.warn('⚠️ Formato de respuesta inesperado:', ordersData);
          ordersList = [];
        }
        
        console.log('📋 Pedidos procesados:', ordersList);
        
        // Log detallado para debug
        if (ordersList.length > 0) {
          console.log('📦 Primer pedido de ejemplo:', {
            id: ordersList[0].id || ordersList[0]._id,
            status: ordersList[0].status,
            items: ordersList[0].items,
            itemsCount: ordersList[0].items?.length || 0,
            total: ordersList[0].total,
            totalAmount: ordersList[0].totalAmount,
            paymentMethod: ordersList[0].paymentMethod
          });
        }
        
        setOrders(ordersList);
        
      } catch (error) {
        console.error('❌ Error cargando pedidos:', error);
        console.error('❌ Detalles del error:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        setError(error.message || 'Error al cargar los pedidos');
      } finally {
        setIsLoadingOrders(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'En camino':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Entregado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Procesando':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'En camino':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'Entregado':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'Procesando':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Cancelado':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Mapear estados a categorías (DEBE ESTAR ANTES DE SU USO)
  // Mejorado para manejar variaciones: entregada, entregado, Entregada, Entregado, etc.
  const mapStatusToCategory = (status) => {
    if (!status) return 'other';
    const statusLower = (status || '').toString().toLowerCase().trim();
    
    // Pendientes
    if (statusLower.includes('pendiente') || statusLower === 'procesando' || statusLower === 'nuevo') {
      return 'pendientes';
    }
    
    // Confirmados
    if (
      statusLower.includes('confirmado') || 
      statusLower.includes('confirmada') || 
      statusLower.includes('en camino') || 
      statusLower.includes('preparando') ||
      statusLower.includes('enviado') ||
      statusLower.includes('enviada')
    ) {
      return 'confirmados';
    }
    
    // Entregados - Manejar todas las variaciones
    if (
      statusLower.includes('entregado') || 
      statusLower.includes('entregada') ||
      statusLower === 'delivered' ||
      statusLower === 'completado' ||
      statusLower === 'completada'
    ) {
      return 'entregados';
    }
    
    return 'other';
  };

  // Función para abrir el modal de detalles
  const handleViewDetails = (order) => {
    const orderIdToUse = order.id || order._id;
    if (orderIdToUse) {
      setSelectedOrderId(orderIdToUse);
      setIsModalOpen(true);
    } else {
      alert('Error: No se pudo obtener el ID del pedido');
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const filteredOrders = orders.filter(order => {
    // Verificar que el pedido existe y tiene las propiedades necesarias
    if (!order || typeof order !== 'object') return false;
    
    // Filtro por tab activo
    if (activeTab !== 'all') {
      const category = mapStatusToCategory(order.status);
      if (category !== activeTab) return false;
    }

    // Filtro por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (order.id && order.id.toLowerCase().includes(searchLower)) ||
        (order.items && Array.isArray(order.items) && order.items.some(item => 
          item && item.name && item.name.toLowerCase().includes(searchLower)
        )) ||
        (order.shippingAddress && order.shippingAddress.city && 
         order.shippingAddress.city.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // Ordenar órdenes
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // Verificar que ambos pedidos existen
    if (!a || !b) return 0;
    
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = a.date ? new Date(a.date) : new Date(0);
        bValue = b.date ? new Date(b.date) : new Date(0);
        break;
      case 'total':
        aValue = a.total || 0;
        bValue = b.total || 0;
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      default:
        aValue = a.date ? new Date(a.date) : new Date(0);
        bValue = b.date ? new Date(b.date) : new Date(0);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Categorizar pedidos (DESPUÉS de definir mapStatusToCategory)
  const categorizedOrders = {
    pendientes: orders.filter(o => o && mapStatusToCategory(o.status) === 'pendientes'),
    confirmados: orders.filter(o => o && mapStatusToCategory(o.status) === 'confirmados'),
    entregados: orders.filter(o => o && mapStatusToCategory(o.status) === 'entregados'),
    other: orders.filter(o => o && mapStatusToCategory(o.status) === 'other')
  };

  const tabs = [
    { id: 'all', label: 'Todos', count: orders.length },
    { id: 'pendientes', label: 'Pendientes', count: categorizedOrders.pendientes.length },
    { id: 'confirmados', label: 'Confirmados', count: categorizedOrders.confirmados.length },
    { id: 'entregados', label: 'Entregados', count: categorizedOrders.entregados.length }
  ];

  const handleReorder = async (order) => {
    try {
      setIsLoading(true);
      
      // Usar el servicio real para reordenar
      const result = await orderService.reorderOrder(order.id);
      
      if (result.success) {
        // Si el servicio devuelve los items, navegar al carrito
        navigate('/cart', { state: { reorderItems: result.items || order.items } });
      } else {
        // Fallback: navegar con los items del pedido actual
        navigate('/cart', { state: { reorderItems: order.items } });
      }
    } catch (error) {
      console.error('Error reordenando:', error);
      // Fallback: navegar con los items del pedido actual
      navigate('/cart', { state: { reorderItems: order.items } });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      setIsLoading(true);
      
      const result = await orderService.downloadInvoice(orderId);
      
      if (result.success) {
        // La descarga se maneja automáticamente en el servicio
        console.log('Factura descargada exitosamente');
      }
    } catch (error) {
      console.error('Error descargando factura:', error);
      alert('Error al descargar la factura. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-12 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-900 mb-3 font-orbitron"
          >
            Acceso requerido
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mb-6 text-lg"
          >
            Debes iniciar sesión para ver tu historial de pedidos
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (isLoadingOrders) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center"
        >
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando historial de pedidos...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200/50 p-12 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-900 mb-3 font-orbitron"
          >
            Error al cargar pedidos
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mb-6 text-lg"
          >
            {error}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            🔄 Reintentar
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Debug: mostrar estado actual
  console.log('🔍 Estado actual:', {
    isAuthenticated,
    isLoadingOrders,
    error,
    ordersCount: orders.length,
    orders: orders.slice(0, 2) // Solo los primeros 2 para debug
  });

  try {
    return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 font-orbitron"
        >
          Mis Pedidos
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-lg"
        >
          Revisa y gestiona todos tus pedidos anteriores
        </motion.p>
      </motion.div>

      {/* Filtros y búsqueda */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8 hover:shadow-xl transition-all duration-300"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative group">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por ID de pedido, producto o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Ordenar */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-semibold text-gray-700">Ordenar por:</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-3 pr-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 bg-white/80 backdrop-blur-sm font-medium"
              >
                <option value="date">Fecha</option>
                <option value="total">Total</option>
                <option value="status">Estado</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              title={`Ordenar ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
            >
              <svg className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 mb-8 overflow-hidden"
      >
        <div className="flex overflow-x-auto">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-3 transition-all duration-300 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`px-2 py-1 text-xs rounded-full font-bold shadow-sm ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {tab.count}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Orders List */}
      <div className="space-y-6">
        {sortedOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-12 text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-2xl font-bold text-gray-900 mb-3 font-orbitron"
            >
              {searchTerm ? 'No se encontraron pedidos' : 'No hay pedidos'}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-gray-600 mb-6 text-lg"
            >
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Aún no tienes pedidos en esta categoría'
              }
            </motion.p>
            {!searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Explorar Productos
              </motion.button>
            )}
          </motion.div>
        ) : (
          sortedOrders.map((order, index) => {
            // Verificar que el pedido existe y tiene las propiedades necesarias
            if (!order || typeof order !== 'object') return null;
            
            return (
            <motion.div
              key={order.id || `order-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -2 }}
              className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                order.status === 'En camino' ? 'border-l-4 border-l-blue-500' :
                order.status === 'Entregado' ? 'border-l-4 border-l-green-500' :
                order.status === 'Procesando' ? 'border-l-4 border-l-yellow-500' :
                order.status === 'Cancelado' ? 'border-l-4 border-l-red-500' :
                'border-l-4 border-l-gray-500'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <motion.h3 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="text-3xl font-bold text-gray-900 font-orbitron"
                      >
                        #{order.id || 'N/A'}
                      </motion.h3>
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold shadow-md ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        <span>{order.status || 'Desconocido'}</span>
                      </motion.span>
                    </div>
                    <motion.p 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="text-sm text-gray-400 font-medium"
                    >
                      {order.date ? new Date(order.date).toLocaleDateString('es-ES') : 'N/A'}
                    </motion.p>
                  </div>

                  {/* Información del pedido */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                  >
                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium text-sm">Total</span>
                          <div className="font-bold text-2xl text-gray-900">
                            ${(order.total || order.totalAmount || order.amount || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium text-sm">Productos</span>
                          <div className="font-bold text-lg text-gray-900">
                            {Array.isArray(order.items) ? order.items.length : 0} {Array.isArray(order.items) && order.items.length === 1 ? 'artículo' : 'artículos'}
                          </div>
                        </div>
                      </div>
                    </div>
                    {order.tracking && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-gray-600 font-medium text-sm">Tracking</span>
                            <div className="font-mono text-sm font-bold text-purple-600">
                              {order.tracking}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Fechas importantes */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {order.estimatedDelivery && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Entrega estimada:</span>
                        <span className="text-gray-900 font-semibold">{new Date(order.estimatedDelivery).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                    {order.deliveredDate && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Entregado el:</span>
                        <span className="text-green-800 font-semibold">{new Date(order.deliveredDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                    {order.cancelledDate && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Cancelado el:</span>
                        <span className="text-red-800 font-semibold">{new Date(order.cancelledDate).toLocaleDateString('es-ES')}</span>
                        {order.cancellationReason && (
                          <span className="text-red-500">({order.cancellationReason})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="flex flex-col space-y-2 ml-6 min-w-[140px]"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewDetails(order)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Ver Detalles</span>
                  </motion.button>
                  {order.tracking && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(`https://tracking.example.com/${order.tracking}`, '_blank')}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span>Rastrear</span>
                    </motion.button>
                  )}
                  {(order.status === 'Entregado' || mapStatusToCategory(order.status) === 'entregados') && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const orderIdToUse = order.id || order._id;
                          if (orderIdToUse) {
                            navigate(`/orders/${orderIdToUse}/review`);
                          } else {
                            alert('Error: No se pudo obtener el ID del pedido');
                          }
                        }}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span>Dejar Reseña</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReorder(order)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Volver a Pedir</span>
                      </motion.button>
                    </>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadInvoice(order.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Factura</span>
                  </motion.button>
                </motion.div>
              </div>

              {/* Lista de productos */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="border-t border-gray-200/50 pt-6 mt-6"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4 font-orbitron flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Productos</span>
                </h4>
                <div className="space-y-3">
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.slice(0, 3).map((item, itemIndex) => {
                      // Obtener datos del producto desde el item (con populate del backend)
                      const product = item.product || {};
                      const productName = product.name || item.name || item.productName || 'Producto sin nombre';
                      const productDescription = product.description || item.description || '';
                      const productImage = product.image || product.images?.[0] || item.image || item.productImage || null;
                      const productId = product._id || product.id || item.productId || item._id || item.id;
                      // Intentar obtener precio desde múltiples fuentes
                      const itemPrice = item.price || item.unitPrice || product.price || 0;
                      const itemQuantity = item.quantity || item.qty || 1;
                      
                      // Si hay más de 3 productos, mostrar un indicador
                      const hasMoreItems = order.items.length > 3 && itemIndex === 2;

                    return (
                      <React.Fragment key={item.id || productId || itemIndex}>
                        <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + index * 0.1 + itemIndex * 0.1 }}
                        className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50/50 to-gray-100/30 rounded-xl hover:from-gray-100/50 hover:to-gray-200/30 transition-all duration-200 border border-gray-200/30"
                      >
                        {/* Imagen del producto */}
                        {productImage ? (
                          <img 
                            src={productImage} 
                            alt={productName}
                            className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200/50"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm border border-blue-200/50">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-lg mb-1 font-['Quantico',_sans-serif]">
                            {productName}
                          </div>
                          {productDescription && (
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2 font-['Rajdhani',_sans-serif]">
                              {productDescription}
                            </p>
                          )}
                          <div className="text-gray-600 font-medium text-sm font-['Rajdhani',_sans-serif]">
                            Cantidad: {itemQuantity} × ${itemPrice.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-2xl text-gray-900 font-['Orbitron',_sans-serif]">
                            ${(itemPrice * itemQuantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 font-['Rajdhani',_sans-serif]">
                            ${itemPrice.toFixed(2)} c/u
                          </div>
                        </div>
                        </motion.div>
                        {hasMoreItems && (
                          <div className="text-center py-2 text-sm text-gray-500 font-medium">
                            +{order.items.length - 3} producto{order.items.length - 3 > 1 ? 's' : ''} más
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      <p className="mb-2">No hay productos disponibles en este pedido</p>
                      {order.items === undefined && (
                        <p className="text-xs text-gray-400">Los items no están disponibles en la respuesta del servidor</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Sección de reseñas para pedidos entregados */}
              {(order.status === 'Entregado' || mapStatusToCategory(order.status) === 'entregados') && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  className="border-t border-gray-200/50 pt-6 mt-6"
                >
                  <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/50 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg font-['Quantico',_sans-serif]">
                            ¿Cómo fue tu experiencia?
                          </h4>
                          <p className="text-gray-600 text-sm font-['Rajdhani',_sans-serif]">
                            Compartí tu opinión sobre los productos que compraste
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const orderIdToUse = order.id || order._id;
                          if (orderIdToUse) {
                            navigate(`/orders/${orderIdToUse}/review`);
                          }
                        }}
                        className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg font-['Quantico',_sans-serif]"
                      >
                        Escribir Reseña
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Información de envío */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="border-t border-gray-200/50 pt-6 mt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Dirección de envío</h4>
                    </div>
                    <p className="text-gray-700 font-medium leading-relaxed">
                      {order.shippingAddress ? order.shippingAddress.street : 'N/A'}<br />
                      {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}` : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Método de pago</h4>
                    </div>
                    <p className="text-gray-700 font-medium">
                      {order.paymentMethod || order.payment?.method || order.paymentMethodName || 'No especificado'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            );
          })
        )}
      </div>

      {/* Modal de detalles del pedido */}
      <OrderDetailModal
        orderId={selectedOrderId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
    );
  } catch (renderError) {
    console.error('❌ Error de renderizado:', renderError);
    setHasError(true);
    return null;
  }
};

export default OrderHistoryContent;
