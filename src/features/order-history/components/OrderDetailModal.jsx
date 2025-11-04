import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';

const OrderDetailModal = ({ orderId, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrder();
    } else {
      // Limpiar estado al cerrar
      setOrder(null);
      setError(null);
    }
  }, [isOpen, orderId]);

  const loadOrder = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await orderService.getOrderById(orderId);
      const orderData = response?.data || response;
      
      console.log('📦 Datos del pedido recibidos en modal:', {
        orderId,
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
      setError({
        type: 'server',
        message: 'Error al cargar el pedido',
        details: err.message || 'Ocurrió un error inesperado.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En camino':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Entregado':
      case 'entregado':
      case 'entregada':
      case 'Entregada':
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
      case 'entregado':
      case 'entregada':
      case 'Entregada':
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

  const handleDownloadInvoice = async (orderId) => {
    setIsDownloading(true);
    try {
      await orderService.downloadInvoice(orderId);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Error al descargar la factura');
    } finally {
      setIsDownloading(false);
    }
  };

  const isOrderDelivered = () => {
    if (!order?.status) return false;
    const statusLower = order.status.toLowerCase();
    return statusLower.includes('entregado') || statusLower.includes('entregada');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 md:p-6">
          <DialogPanel
            transition
            className="flex w-full max-w-4xl transform text-left transition data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:md:translate-y-0 data-closed:md:scale-95"
          >
            <div className="relative flex w-full flex-col max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-orbitron">
                    Detalles del Pedido
                  </h2>
                  {order && (
                    <p className="text-sm text-gray-600 mt-1">
                      Pedido #{order.id || order._id} • {new Date(order.date || order.createdAt || Date.now()).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <span className="sr-only">Cerrar</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 px-6 py-6">
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="ml-4 text-gray-600">Cargando detalles del pedido...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-800 font-semibold">{error.message}</p>
                    <p className="text-red-600 text-sm mt-1">{error.details}</p>
                  </div>
                )}

                {!isLoading && !error && order && (
                  <div className="space-y-6">
                    {/* Estado del pedido */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold shadow-md border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span>{order.status}</span>
                          </span>
                          <div className="text-gray-700">
                            <p className="font-medium">Total: ${(order.total || order.totalAmount || order.amount || 0).toFixed(2)}</p>
                            <p className="text-sm">
                              {Array.isArray(order.items) ? order.items.length : 0} {Array.isArray(order.items) && order.items.length === 1 ? 'artículo' : 'artículos'}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownloadInvoice(order.id || order._id)}
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
                          {isOrderDelivered() && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                onClose();
                                navigate(`/orders/${order.id || order._id}/review`);
                              }}
                              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              <span>Dejar Reseña</span>
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Productos del pedido */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 font-orbitron flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>Productos</span>
                      </h3>
                      <div className="space-y-4">
                        {Array.isArray(order.items) && order.items.length > 0 ? (
                          order.items.map((item, index) => {
                            const product = item.product || {};
                            const productName = product.name || item.name || item.productName || 'Producto sin nombre';
                            const productDescription = product.description || item.description || '';
                            const productImage = product.image || product.images?.[0] || item.image || item.productImage || null;
                            const itemPrice = item.price || item.unitPrice || product.price || 0;
                            const itemQuantity = item.quantity || item.qty || 1;

                            return (
                              <motion.div
                                key={item.id || product._id || product.id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                {productImage && (
                                  <img
                                    src={productImage}
                                    alt={productName}
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                )}
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900">{productName}</h4>
                                  {productDescription && (
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{productDescription}</p>
                                  )}
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="text-sm text-gray-600">
                                      Cantidad: {itemQuantity} × ${itemPrice.toFixed(2)}
                                    </div>
                                    <div className="font-bold text-gray-900">
                                      ${(itemPrice * itemQuantity).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          <div className="text-gray-500 text-center py-8">
                            <p>No hay productos disponibles en este pedido</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Resumen y detalles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Resumen del pedido */}
                      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 font-orbitron">Resumen del Pedido</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span>${(order.subtotal || order.subTotal || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Envío:</span>
                            <span>${(order.shipping || order.shippingCost || order.shippingFee || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Impuestos:</span>
                            <span>${(order.tax || order.taxes || 0).toFixed(2)}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-3">
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                              <span>Total:</span>
                              <span>${(order.total || order.totalAmount || order.amount || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Información de envío y pago */}
                      <div className="space-y-6">
                        {/* Dirección de envío */}
                        {order.shippingAddress && (
                          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 font-orbitron">Dirección de Envío</h3>
                            <div className="space-y-2 text-gray-700 text-sm">
                              <p className="font-semibold">{order.shippingAddress.recipientName}</p>
                              <p>{order.shippingAddress.street}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>
                        )}

                        {/* Método de pago */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-4 font-orbitron">Método de Pago</h3>
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
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                  >
                    Cerrar
                  </motion.button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default OrderDetailModal;

