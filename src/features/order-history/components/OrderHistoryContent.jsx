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
        <div className="backdrop-blur-sm rounded-lg border border-red-500 p-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
          }}
        >
          <h2 className="text-xl font-bold text-red-200 mb-2 font-['Orbitron',sans-serif] uppercase tracking-wide">Error en el componente</h2>
          <p className="text-red-300 mb-4 font-['Rajdhani',sans-serif]">Algo salió mal al cargar el historial de pedidos.</p>
          <button 
            onClick={() => {
              setHasError(false);
              window.location.reload();
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white rounded hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-all font-['Quantico',sans-serif] uppercase"
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
        
        const ordersData = await orderService.getUserOrders();
        
        // Manejar diferentes formatos de respuesta
        let ordersList = [];
        
        if (Array.isArray(ordersData)) {
          ordersList = ordersData; // Si es un array directo
        } else if (ordersData?.data && Array.isArray(ordersData.data)) {
          ordersList = ordersData.data; // Si es { data: [] }
        } else if (ordersData?.orders && Array.isArray(ordersData.orders)) {
          ordersList = ordersData.orders; // Si es { orders: [] }
        }
        
        setOrders(ordersList);
        
      } catch (error) {
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
        return 'bg-[#6D28D9]/30 text-[#8B5CF6] border-[#6D28D9]/50';
      case 'Entregado':
        return 'bg-green-900/30 text-green-200 border-green-500/50';
      case 'Procesando':
        return 'bg-yellow-900/30 text-yellow-200 border-yellow-500/50';
      case 'Cancelado':
        return 'bg-red-900/30 text-red-200 border-red-500/50';
      default:
        return 'bg-[#0F0F10]/50 text-[#CFCFCF] border-white/20';
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
      const orderProducts = Array.isArray(order.products) 
        ? order.products 
        : (Array.isArray(order.items) ? order.items : []);
      
      return (
        (order.id && order.id.toString().toLowerCase().includes(searchLower)) ||
        (orderProducts.some(item => {
          const product = item.product || {};
          const productName = product.name || item.name || '';
          return productName.toLowerCase().includes(searchLower);
        })) ||
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
        const itemsToReorder = result.items || order.products || order.items || [];
        navigate('/cart', { state: { reorderItems: itemsToReorder } });
      } else {
        // Fallback: navegar con los productos del pedido actual
        const itemsToReorder = order.products || order.items || [];
        navigate('/cart', { state: { reorderItems: itemsToReorder } });
      }
    } catch (error) {
      // Fallback: navegar con los items del pedido actual
      const itemsToReorder = order.products || order.items || [];
      navigate('/cart', { state: { reorderItems: itemsToReorder } });
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
        // Éxito silencioso
      }
    } catch (error) {
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
          className="backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(26, 26, 27, 0.95) 0%, rgba(15, 15, 16, 0.98) 50%, rgba(30, 10, 25, 0.95) 100%)"
          }}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-[#E11D74] to-[#6D28D9] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2m0 0l4 4m4-4l4-4" />
            </svg>
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-[#E11D74] mb-3 font-['Orbitron',sans-serif] uppercase tracking-wide"
          >
            Acceso requerido
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[#CFCFCF] mb-6 text-lg font-['Rajdhani',sans-serif]"
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
          className="backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(26, 26, 27, 0.95) 0%, rgba(15, 15, 16, 0.98) 50%, rgba(30, 10, 25, 0.95) 100%)"
          }}
        >
          <div className="animate-spin w-12 h-12 border-4 border-[#E11D74] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#CFCFCF] text-lg font-['Rajdhani',sans-serif]">Cargando historial de pedidos...</p>
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
          className="backdrop-blur-sm rounded-2xl shadow-xl border border-red-500/50 p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(26, 26, 27, 0.95) 0%, rgba(15, 15, 16, 0.98) 50%, rgba(30, 10, 25, 0.95) 100%)"
          }}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-[#E11D74] to-[#6D28D9] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-[#E11D74] mb-3 font-['Orbitron',sans-serif] uppercase tracking-wide"
          >
            Error al cargar pedidos
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[#CFCFCF] mb-6 text-lg font-['Rajdhani',sans-serif]"
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
            className="px-6 py-3 bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white rounded-xl hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-all duration-300 shadow-lg hover:shadow-xl font-['Quantico',sans-serif] uppercase"
          >
            Reintentar
          </motion.button>
        </motion.div>
      </div>
    );
  }

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
          className="text-4xl font-bold text-[#E11D74] mb-3 font-['Orbitron',sans-serif] uppercase tracking-wide"
        >
          Mis Pedidos
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[#CFCFCF] text-lg font-['Rajdhani',sans-serif]"
        >
          Revisa y gestiona todos tus pedidos anteriores
        </motion.p>
      </motion.div>

      {/* Filtros y búsqueda */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 p-6 mb-8 hover:shadow-xl transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative group">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#CFCFCF]/50 group-focus-within:text-[#E11D74] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por ID de pedido, producto o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] transition-all duration-300 hover:border-[#E11D74]/50 bg-[#0F0F10]/90 backdrop-blur-sm text-[#CFCFCF] placeholder:text-[#CFCFCF]/50 font-['Rajdhani',sans-serif]"
              />
            </div>
          </div>

          {/* Ordenar */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-semibold text-[#E11D74] font-['Quantico',sans-serif] uppercase tracking-wide">Ordenar por:</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-3 pr-8 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] transition-all duration-300 hover:border-[#E11D74]/50 bg-[#0F0F10]/90 backdrop-blur-sm font-medium text-[#CFCFCF] font-['Rajdhani',sans-serif]"
              >
                <option value="date">Fecha</option>
                <option value="total">Total</option>
                <option value="status">Estado</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#CFCFCF]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-3 border border-white/20 rounded-xl hover:bg-gradient-to-r hover:from-[#E11D74] hover:to-[#6D28D9] hover:border-transparent transition-all duration-200 bg-[#0F0F10]/80 backdrop-blur-sm"
              title={`Ordenar ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
            >
              <svg className={`w-5 h-5 text-[#CFCFCF] transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        className="backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 mb-8 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
        }}
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
              className={`flex items-center space-x-3 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-3 transition-all duration-300 font-['Quantico',sans-serif] ${
                activeTab === tab.id
                  ? 'border-[#E11D74] text-[#E11D74] bg-[#E11D74]/10'
                  : 'border-transparent text-[#CFCFCF] hover:text-[#E11D74] hover:bg-[#0F0F10]/50'
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
                      ? 'bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white'
                      : 'bg-[#0F0F10]/80 text-[#CFCFCF] border border-white/20'
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
            className="backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-12 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
            }}
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-[#E11D74] to-[#6D28D9] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-2xl font-bold text-[#E11D74] mb-3 font-['Orbitron',sans-serif] uppercase tracking-wide"
            >
              {searchTerm ? 'No se encontraron pedidos' : 'No hay pedidos'}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-[#CFCFCF] mb-6 text-lg font-['Rajdhani',sans-serif]"
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
                className="px-6 py-3 bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white rounded-xl hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-all duration-300 shadow-lg hover:shadow-xl font-['Quantico',sans-serif] uppercase"
              >
                Explorar Productos
              </motion.button>
            )}
          </motion.div>
        ) : (
          sortedOrders.map((order, index) => {
            // Verificar que el pedido existe y tiene las propiedades necesarias
            if (!order || typeof order !== 'object') return null;
            
            // Normalizar productos/items - el backend usa 'products'
            const orderProducts = Array.isArray(order.products) 
              ? order.products 
              : (Array.isArray(order.items) ? order.items : []);
            
            return (
            <motion.div
              key={order.id || `order-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -2 }}
              className="backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <motion.h3 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="text-3xl font-bold text-[#E11D74] font-['Orbitron',sans-serif] uppercase tracking-wide"
                      >
                        #{order.id || 'N/A'}
                      </motion.h3>
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold shadow-md border ${getStatusColor(order.status)} font-['Quantico',sans-serif]`}
                      >
                        {getStatusIcon(order.status)}
                        <span>{order.status || 'Desconocido'}</span>
                      </motion.span>
                    </div>
                    <motion.p 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="text-sm text-[#CFCFCF]/70 font-medium font-['Rajdhani',sans-serif]"
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
                    <div className="backdrop-blur-sm rounded-xl p-4 border border-white/10"
                      style={{
                        background: "linear-gradient(135deg, rgba(15, 15, 16, 0.9) 0%, rgba(26, 26, 27, 0.95) 50%, rgba(15, 15, 16, 0.9) 100%)"
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#E11D74] to-[#6D28D9] rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-[#CFCFCF] font-medium text-sm font-['Rajdhani',sans-serif]">Total</span>
                          <div className="font-bold text-2xl text-[#E11D74] font-['Orbitron',sans-serif]">
                            ${(order.total || order.totalAmount || order.amount || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="backdrop-blur-sm rounded-xl p-4 border border-white/10"
                      style={{
                        background: "linear-gradient(135deg, rgba(15, 15, 16, 0.9) 0%, rgba(26, 26, 27, 0.95) 50%, rgba(15, 15, 16, 0.9) 100%)"
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-[#CFCFCF] font-medium text-sm font-['Rajdhani',sans-serif]">Productos</span>
                          <div className="font-bold text-lg text-[#E11D74] font-['Quantico',sans-serif]">
                            {orderProducts.length} {orderProducts.length === 1 ? 'artículo' : 'artículos'}
                          </div>
                        </div>
                      </div>
                    </div>
                    {order.tracking && (
                      <div className="backdrop-blur-sm rounded-xl p-4 border border-white/10"
                        style={{
                          background: "linear-gradient(135deg, rgba(15, 15, 16, 0.9) 0%, rgba(26, 26, 27, 0.95) 50%, rgba(15, 15, 16, 0.9) 100%)"
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#E11D74] to-[#6D28D9] rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-[#CFCFCF] font-medium text-sm font-['Rajdhani',sans-serif]">Tracking</span>
                            <div className="font-mono text-sm font-bold text-[#8B5CF6]">
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
                      <div className="flex items-center space-x-2 text-[#CFCFCF] font-['Rajdhani',sans-serif]">
                        <svg className="w-4 h-4 text-[#CFCFCF]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Entrega estimada:</span>
                        <span className="text-[#E11D74] font-semibold">{new Date(order.estimatedDelivery).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                    {order.deliveredDate && (
                      <div className="flex items-center space-x-2 text-green-200 font-['Rajdhani',sans-serif]">
                        <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Entregado el:</span>
                        <span className="text-green-200 font-semibold">{new Date(order.deliveredDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                    {order.cancelledDate && (
                      <div className="flex items-center space-x-2 text-red-200 font-['Rajdhani',sans-serif]">
                        <svg className="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Cancelado el:</span>
                        <span className="text-red-200 font-semibold">{new Date(order.cancelledDate).toLocaleDateString('es-ES')}</span>
                        {order.cancellationReason && (
                          <span className="text-red-300">({order.cancellationReason})</span>
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
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white rounded-lg hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg font-['Quantico',sans-serif] uppercase"
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
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] text-white rounded-lg hover:from-[#8B5CF6] hover:to-[#E11D74] transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg font-['Quantico',sans-serif] uppercase"
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
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white rounded-lg hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg font-['Quantico',sans-serif] uppercase"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span>Dejar Reseña</span>
                      </motion.button>
                    </>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadInvoice(order.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#0F0F10]/80 border border-white/20 text-[#CFCFCF] rounded-lg hover:bg-gradient-to-r hover:from-[#E11D74] hover:to-[#6D28D9] hover:text-white hover:border-transparent transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg font-['Quantico',sans-serif] uppercase"
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
                className="border-t border-white/10 pt-6 mt-6"
              >
                <h4 className="text-lg font-bold text-[#E11D74] mb-4 font-['Orbitron',sans-serif] uppercase tracking-wide flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#CFCFCF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Productos</span>
                </h4>
                <div className="space-y-3">
                  {orderProducts.length > 0 ? (
                    orderProducts.slice(0, 3).map((item, itemIndex) => {
                      // Obtener datos del producto desde el item (con populate del backend)
                      // El backend usa: products[].product.name, products[].product.description, etc.
                      const product = item.product || {};
                      const productName = product.name || item.name || item.productName || 'Producto sin nombre';
                      const productDescription = product.description || item.description || '';
                      // Manejar images como array o string
                      const productImage = Array.isArray(product.images) && product.images.length > 0
                        ? product.images[0]
                        : (product.image || item.image || item.productImage || null);
                      const productId = product._id || product.id || item.productId || item._id || item.id;
                      // Intentar obtener precio desde múltiples fuentes
                      const itemPrice = item.price || product.price || 0;
                      const itemQuantity = item.quantity || item.qty || 1;
                      
                      // Si hay más de 3 productos, mostrar un indicador
                      const hasMoreItems = orderProducts.length > 3 && itemIndex === 2;

                    return (
                      <React.Fragment key={item.id || productId || itemIndex}>
                        <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + index * 0.1 + itemIndex * 0.1 }}
                        className="flex items-start space-x-4 p-4 backdrop-blur-sm rounded-xl transition-all duration-200 border border-white/10"
                        style={{
                          background: "linear-gradient(135deg, rgba(15, 15, 16, 0.9) 0%, rgba(26, 26, 27, 0.95) 50%, rgba(15, 15, 16, 0.9) 100%)"
                        }}
                      >
                        {/* Imagen del producto */}
                        {productImage ? (
                          <img 
                            src={productImage} 
                            alt={productName}
                            className="w-20 h-20 object-cover rounded-xl shadow-sm border border-white/20"
                            style={{
                              background: "linear-gradient(135deg, #0F0F10 0%, #1A0A15 100%)"
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-[#E11D74] to-[#6D28D9] rounded-xl flex items-center justify-center shadow-sm border border-white/20">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#E11D74] text-lg mb-1 font-['Quantico',sans-serif]">
                            {productName}
                          </div>
                          {productDescription && (
                            <p className="text-[#CFCFCF] text-sm mb-2 line-clamp-2 font-['Rajdhani',sans-serif]">
                              {productDescription}
                            </p>
                          )}
                          <div className="text-[#CFCFCF] font-medium text-sm font-['Rajdhani',sans-serif]">
                            Cantidad: {itemQuantity} × ${itemPrice.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-2xl text-[#E11D74] font-['Orbitron',sans-serif]">
                            ${(itemPrice * itemQuantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-[#CFCFCF]/70 font-['Rajdhani',sans-serif]">
                            ${itemPrice.toFixed(2)} c/u
                          </div>
                        </div>
                        </motion.div>
                        {hasMoreItems && (
                          <div className="text-center py-2 text-sm text-[#CFCFCF]/70 font-medium font-['Rajdhani',sans-serif]">
                            +{orderProducts.length - 3} producto{orderProducts.length - 3 > 1 ? 's' : ''} más
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })
                    ) : (
                    <div className="text-[#CFCFCF] text-center py-4 font-['Rajdhani',sans-serif]">
                      <p className="mb-2">No hay productos disponibles en este pedido</p>
                      {orderProducts.length === 0 && (
                        <p className="text-xs text-[#CFCFCF]/50">Los productos no están disponibles en la respuesta del servidor</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Sección de reseñas para pedidos entregados - Removida la CTA duplicada "Escribir Reseña" */}

              {/* Información de envío */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="border-t border-white/10 pt-6 mt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="backdrop-blur-sm rounded-xl p-4 border border-white/10"
                    style={{
                      background: "linear-gradient(135deg, rgba(15, 15, 16, 0.9) 0%, rgba(26, 26, 27, 0.95) 50%, rgba(15, 15, 16, 0.9) 100%)"
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-[#E11D74] text-lg font-['Orbitron',sans-serif] uppercase tracking-wide">Dirección de envío</h4>
                    </div>
                    <p className="text-[#CFCFCF] font-medium leading-relaxed font-['Rajdhani',sans-serif]">
                      {order.shippingAddress ? order.shippingAddress.street : 'N/A'}<br />
                      {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}` : 'N/A'}
                    </p>
                  </div>
                  <div className="backdrop-blur-sm rounded-xl p-4 border border-white/10"
                    style={{
                      background: "linear-gradient(135deg, rgba(15, 15, 16, 0.9) 0%, rgba(26, 26, 27, 0.95) 50%, rgba(15, 15, 16, 0.9) 100%)"
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#E11D74] to-[#6D28D9] rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-[#E11D74] text-lg font-['Orbitron',sans-serif] uppercase tracking-wide">Método de pago</h4>
                    </div>
                    <p className="text-[#CFCFCF] font-medium font-['Rajdhani',sans-serif]">
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
