import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';

const OrderHistoryContent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock data más completo - luego conectar con API
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      date: '2025-01-15',
      status: 'En camino',
      total: 125.99,
      items: [
        { id: 1, name: 'Laptop Gaming Pro', quantity: 1, price: 89.99, image: '/api/placeholder/80/80' },
        { id: 2, name: 'Mouse Inalámbrico', quantity: 2, price: 18.00, image: '/api/placeholder/80/80' }
      ],
      tracking: 'TRK123456789',
      estimatedDelivery: '2025-01-18',
      shippingAddress: {
        street: 'Av. Reforma 123',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '01000'
      },
      paymentMethod: 'Tarjeta terminada en 1234'
    },
    {
      id: 'ORD-002', 
      date: '2025-01-10',
      status: 'Entregado',
      total: 89.50,
      items: [
        { id: 3, name: 'Teclado Mecánico', quantity: 1, price: 65.50, image: '/api/placeholder/80/80' },
        { id: 4, name: 'Auriculares Bluetooth', quantity: 1, price: 24.00, image: '/api/placeholder/80/80' }
      ],
      tracking: 'TRK987654321',
      estimatedDelivery: '2025-01-13',
      deliveredDate: '2025-01-12',
      shippingAddress: {
        street: 'Calle Principal 456',
        city: 'Guadalajara',
        state: 'Jalisco',
        zipCode: '44100'
      },
      paymentMethod: 'PayPal'
    },
    {
      id: 'ORD-003',
      date: '2025-01-05',
      status: 'Procesando',
      total: 256.00,
      items: [
        { id: 5, name: 'Monitor 4K', quantity: 1, price: 199.99, image: '/api/placeholder/80/80' },
        { id: 6, name: 'Cable HDMI', quantity: 2, price: 15.00, image: '/api/placeholder/80/80' },
        { id: 7, name: 'Soporte Monitor', quantity: 1, price: 26.01, image: '/api/placeholder/80/80' }
      ],
      tracking: null,
      estimatedDelivery: '2025-01-12',
      shippingAddress: {
        street: 'Plaza Central 789',
        city: 'Monterrey',
        state: 'Nuevo León',
        zipCode: '64000'
      },
      paymentMethod: 'Transferencia bancaria'
    },
    {
      id: 'ORD-004',
      date: '2024-12-28',
      status: 'Cancelado',
      total: 67.25,
      items: [
        { id: 8, name: 'Webcam HD', quantity: 1, price: 67.25, image: '/api/placeholder/80/80' }
      ],
      tracking: null,
      estimatedDelivery: null,
      cancelledDate: '2024-12-29',
      cancellationReason: 'Producto agotado',
      shippingAddress: {
        street: 'Av. Insurgentes 321',
        city: 'Puebla',
        state: 'Puebla',
        zipCode: '72000'
      },
      paymentMethod: 'Tarjeta terminada en 5678'
    },
    {
      id: 'ORD-005',
      date: '2024-12-20',
      status: 'Entregado',
      total: 145.75,
      items: [
        { id: 9, name: 'Tablet Pro', quantity: 1, price: 129.99, image: '/api/placeholder/80/80' },
        { id: 10, name: 'Funda Protectora', quantity: 1, price: 15.76, image: '/api/placeholder/80/80' }
      ],
      tracking: 'TRK555666777',
      estimatedDelivery: '2024-12-23',
      deliveredDate: '2024-12-22',
      shippingAddress: {
        street: 'Calle del Sol 654',
        city: 'Tijuana',
        state: 'Baja California',
        zipCode: '22000'
      },
      paymentMethod: 'Efectivo contra entrega'
    }
  ]);

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

  const filteredOrders = orders.filter(order => {
    // Filtro por tab activo
    if (activeTab !== 'all') {
      const statusMatch = order.status.toLowerCase().replace(' ', '') === activeTab;
      if (!statusMatch) return false;
    }

    // Filtro por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower)) ||
        order.shippingAddress.city.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Ordenar órdenes
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'total':
        aValue = a.total;
        bValue = b.total;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = new Date(a.date);
        bValue = new Date(b.date);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const tabs = [
    { id: 'all', label: 'Todos', count: orders.length },
    { id: 'procesando', label: 'Procesando', count: orders.filter(o => o.status === 'Procesando').length },
    { id: 'encamino', label: 'En camino', count: orders.filter(o => o.status === 'En camino').length },
    { id: 'entregado', label: 'Entregado', count: orders.filter(o => o.status === 'Entregado').length },
    { id: 'cancelado', label: 'Cancelado', count: orders.filter(o => o.status === 'Cancelado').length }
  ];

  const handleReorder = (order) => {
    // Simular reordenar productos
    console.log('Reordenando:', order);
    navigate('/cart', { state: { reorderItems: order.items } });
  };

  const handleDownloadInvoice = (orderId) => {
    // Simular descarga de factura
    console.log('Descargando factura para:', orderId);
    // Aquí iría la lógica para generar y descargar la factura
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
          Historial de Pedidos
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
          sortedOrders.map((order, index) => (
            <motion.div
              key={order.id}
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
                        #{order.id}
                      </motion.h3>
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold shadow-md ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </motion.span>
                    </div>
                    <motion.p 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="text-sm text-gray-400 font-medium"
                    >
                      {new Date(order.date).toLocaleDateString('es-ES')}
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
                            ${order.total.toFixed(2)}
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
                            {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
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
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
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
                  {order.status === 'Entregado' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/orders/${order.id}/review`)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span>Evaluar</span>
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
                  {order.items.map((item, itemIndex) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1 + itemIndex * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50/50 to-gray-100/30 rounded-xl hover:from-gray-100/50 hover:to-gray-200/30 transition-all duration-200 border border-gray-200/30"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm border border-blue-200/50">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-lg">{item.name}</div>
                        <div className="text-gray-600 font-medium text-sm">
                          Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-2xl text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} c/u
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

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
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
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
                    <p className="text-gray-700 font-medium">{order.paymentMethod}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryContent;
