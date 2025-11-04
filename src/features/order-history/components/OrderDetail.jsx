import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { orderService } from '../services/orderService';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Cargar datos del pedido desde la API
    const loadOrder = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await orderService.getOrderById(orderId);
        // Normalizar respuesta según estructura del backend
        const orderData = response?.data || response;
        
        // Log detallado para debug
        console.log('📦 Datos del pedido recibidos:', {
          orderId,
          response: response,
          orderData: orderData,
          items: orderData?.items,
          itemsCount: orderData?.items?.length || 0,
          total: orderData?.total,
          totalAmount: orderData?.totalAmount,
          paymentMethod: orderData?.paymentMethod,
          status: orderData?.status
        });
        
        setOrder(orderData);
      } catch (err) {
        console.error('Error loading order:', err);
        
        if (err.message.includes('404') || err.message.includes('not found')) {
          setError({
            type: 'not_found',
            message: 'Pedido no encontrado',
            details: `No se encontró un pedido con el ID: ${orderId}`
          });
        } else if (err.message.includes('conexión') || err.message.includes('network')) {
          setError({
            type: 'network',
            message: 'Error de conexión',
            details: 'No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.'
          });
        } else {
          setError({
            type: 'server',
            message: 'Error del servidor',
            details: err.message || 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.'
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderId, isAuthenticated, navigate]);

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

  const handleReorder = async () => {
    // Mostrar confirmación antes de reordenar
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres volver a pedir los productos de este pedido?\n\n` +
      `Se agregarán ${order.items.length} artículos a tu carrito.`
    );
    
    if (confirmed) {
      setIsReordering(true);
      try {
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
        setIsReordering(false);
      }
    }
  };

  const handleDownloadInvoice = async () => {
    // Mostrar confirmación antes de descargar
    const confirmed = window.confirm(
      `¿Descargar la factura del pedido ${order.id}?\n\n` +
      `Total: $${order.total.toFixed(2)}\n` +
      `Fecha: ${new Date(order.date).toLocaleDateString('es-ES')}`
    );
    
    if (confirmed) {
      setIsDownloading(true);
      try {
        // Usar el servicio real para descargar la factura
        const result = await orderService.downloadInvoice(order.id);
        
        if (result.success) {
          // La descarga se maneja automáticamente en el servicio
          // Éxito silencioso
        }
      } catch (error) {
        console.error('Error descargando factura:', error);
        alert('❌ Error al descargar la factura. Inténtalo de nuevo.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleTrackPackage = () => {
    if (order.tracking) {
      const confirmed = window.confirm(
        `¿Abrir el rastreo del paquete?\n\n` +
        `Número de seguimiento: ${order.tracking}\n` +
        `Se abrirá en una nueva pestaña.`
      );
      
      if (confirmed) {
        window.open(`https://tracking.example.com/${order.tracking}`, '_blank');
      }
    }
  };

  if (!isAuthenticated) {
    return null; // El useEffect ya redirige
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center"
        >
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando detalles del pedido...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !order) {
    const getErrorIcon = (errorType) => {
      switch (errorType) {
        case 'network':
          return (
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          );
        case 'not_found':
          return (
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.57M15 6.334c2.33 0 4.334 1.666 4.334 4.666 0 1.5-.666 2.834-1.666 3.666" />
            </svg>
          );
        default:
          return (
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          );
      }
    };

    const getErrorColor = (errorType) => {
      switch (errorType) {
        case 'network':
          return 'from-yellow-500 to-orange-600';
        case 'not_found':
          return 'from-blue-500 to-cyan-600';
        default:
          return 'from-red-500 to-pink-600';
      }
    };

    return (
      <div className="max-w-6xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-12 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`w-20 h-20 bg-gradient-to-br ${getErrorColor(error?.type)} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
          >
            {getErrorIcon(error?.type)}
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-900 mb-3 font-orbitron"
          >
            {error?.message || 'Pedido no encontrado'}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mb-6 text-lg"
          >
            {error?.details || 'No pudimos encontrar el pedido que buscas'}
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              🔄 Reintentar
            </motion.button>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/order-history')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              📋 Volver al Historial
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 font-orbitron"
            >
              Detalles del Pedido
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-lg"
            >
              Pedido #{order.id} • {new Date(order.date).toLocaleDateString('es-ES')}
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/order-history')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver</span>
          </motion.button>
        </div>

        {/* Estado del pedido */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold shadow-md ${getStatusColor(order.status)}`}
              >
                {getStatusIcon(order.status)}
                <span>{order.status}</span>
              </motion.span>
              <div className="text-gray-600">
                <p className="font-medium">Total: ${(order.total || order.totalAmount || order.amount || 0).toFixed(2)}</p>
                <p className="text-sm">
                  {Array.isArray(order.items) ? order.items.length : 0} {Array.isArray(order.items) && order.items.length === 1 ? 'artículo' : 'artículos'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {order.tracking && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTrackPackage}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span>Rastrear</span>
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: isDownloading ? 1 : 1.05 }}
                whileTap={{ scale: isDownloading ? 1 : 0.95 }}
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                <span>{isDownloading ? 'Generando...' : 'Factura'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Timeline del pedido */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-orbitron">Seguimiento del Pedido</span>
            </h2>
            <div className="space-y-4">
              {order.timeline.map((event, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    index === 0 ? 'bg-green-500' : 
                    index === order.timeline.length - 1 ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{event.status}</p>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(event.date).toLocaleString('es-ES')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Productos del pedido */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="font-orbitron">Productos</span>
            </h2>
            <div className="space-y-6">
              {(() => {
                const normalizedItems = Array.isArray(order.items) && order.items.length > 0
                  ? order.items
                  : (Array.isArray(order.products) ? order.products : (Array.isArray(order.orderItems) ? order.orderItems : []));

                return normalizedItems.length > 0 ? (
                  normalizedItems.map((item, index) => {
                // Obtener datos del producto desde el item (con populate del backend)
                const product = item.product || {};
                const productName = product.name || item.name || 'Producto sin nombre';
                const productDescription = product.description || item.description || '';
                const productImage = product.image || product.images?.[0] || item.image || null;
                const productCategory = product.category || item.category || '';
                    const itemPrice = item.price || item.unitPrice || product.price || 0;
                    const itemQuantity = item.quantity || item.qty || 1;

                    return (
                  <motion.div 
                    key={item.id || product._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50/50 to-gray-100/30 rounded-xl hover:from-gray-100/50 hover:to-gray-200/30 transition-all duration-200 border border-gray-200/30"
                  >
                    {/* Imagen del producto */}
                    {productImage ? (
                      <img 
                        src={productImage} 
                        alt={productName}
                        className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200/50 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm border border-blue-200/50 flex-shrink-0">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 font-['Quantico',_sans-serif]">
                        {productName}
                      </h3>
                      {productDescription && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2 font-['Rajdhani',_sans-serif]">
                          {productDescription}
                        </p>
                      )}
                      {productCategory && (
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2 font-['Rajdhani',_sans-serif]">
                          <span>Categoría: {productCategory}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-gray-600 font-medium font-['Rajdhani',_sans-serif]">
                          Cantidad: {itemQuantity} × ${itemPrice.toFixed(2)}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl text-gray-900 font-['Orbitron',_sans-serif]">
                            ${(itemPrice * itemQuantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 font-['Rajdhani',_sans-serif]">
                            ${itemPrice.toFixed(2)} c/u
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
                ) : (
                <div className="text-gray-500 text-center py-8">
                  <p className="mb-2">No hay productos disponibles en este pedido</p>
                  {order.items === undefined && (
                    <p className="text-xs text-gray-400">Los items no están disponibles en la respuesta del servidor</p>
                  )}
                </div>
                );
              })()}
            </div>
          </motion.div>
        </div>

        {/* Columna lateral */}
        <div className="space-y-8">
          {/* Resumen del pedido */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-orbitron">Resumen del Pedido</h3>
            <div className="space-y-3">
              {(() => {
                const items = Array.isArray(order.items) && order.items.length > 0
                  ? order.items
                  : (Array.isArray(order.products) ? order.products : (Array.isArray(order.orderItems) ? order.orderItems : []));
                const computedSubtotal = items.reduce((sum, it) => {
                  const price = it.price || it.unitPrice || it.product?.price || 0;
                  const qty = it.quantity || it.qty || 1;
                  return sum + price * qty;
                }, 0);
                const subtotal = (order.subtotal || order.subTotal);
                const shipping = (order.shipping || order.shippingCost || order.shippingFee || 0);
                const taxes = (order.tax || order.taxes || 0);
                const total = (order.total || order.totalAmount || order.amount);
                const finalSubtotal = subtotal !== undefined ? subtotal : computedSubtotal;
                const finalTotal = total !== undefined ? total : (finalSubtotal + shipping + taxes);
                return (
                  <>
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>${finalSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Envío:</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Impuestos:</span>
                      <span>${taxes.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total:</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>

          {/* Información de envío */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 font-orbitron">Dirección de Envío</h3>
              <button
                onClick={() => setShowFullAddress(!showFullAddress)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
              >
                <span>{showFullAddress ? 'Mostrar menos' : 'Ver completa'}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${showFullAddress ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">{order.shippingAddress.recipientName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              
              {showFullAddress && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <h4 className="font-semibold text-gray-900 mb-2">Información adicional:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Código postal:</span> {order.shippingAddress.zipCode}</p>
                    <p><span className="font-medium">Estado/Provincia:</span> {order.shippingAddress.state}</p>
                    <p><span className="font-medium">País:</span> {order.shippingAddress.country}</p>
                    {order.orderNotes && (
                      <p><span className="font-medium">Notas especiales:</span> {order.orderNotes}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
            {order.estimatedDelivery && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Entrega estimada: {new Date(order.estimatedDelivery).toLocaleDateString('es-ES')}
                </p>
              </div>
            )}
          </motion.div>

          {/* Información de pago */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-orbitron">Método de Pago</h3>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                {order.paymentMethod && typeof order.paymentMethod === 'object' ? (
                  <>
                    <p className="font-semibold text-gray-900">
                      {order.paymentMethod.type || order.paymentMethod.method || 'Método de pago'}
                    </p>
                    {order.paymentMethod.brand && order.paymentMethod.last4 && (
                      <p className="text-sm text-gray-600">
                        {order.paymentMethod.brand} terminada en {order.paymentMethod.last4}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-semibold text-gray-900">
                    {order.paymentMethod || order.payment?.method || order.paymentMethodName || 'No especificado'}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Notas del pedido */}
          {order.orderNotes && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-orbitron">Notas del Pedido</h3>
              <p className="text-gray-700 text-sm">{order.orderNotes}</p>
            </motion.div>
          )}

          {/* Botones de acción */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="space-y-3"
          >
            {/* Removido el botón "Volver a Pedir" según requerimiento */}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/order-history')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Volver al Historial</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
