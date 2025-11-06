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
        return 'bg-[#6D28D9]/30 text-[#8B5CF6] border-[#6D28D9]/50';
      case 'Entregado':
      case 'entregado':
      case 'entregada':
      case 'Entregada':
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
            <div className="relative flex w-full flex-col max-h-[90vh] overflow-hidden backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10"
              style={{
                background: "linear-gradient(135deg, rgba(26, 26, 27, 0.95) 0%, rgba(15, 15, 16, 0.98) 50%, rgba(30, 10, 25, 0.95) 100%)"
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-[#E11D74] font-['Orbitron',sans-serif] uppercase tracking-wide">
                    Detalles del Pedido
                  </h2>
                  {order && (
                    <p className="text-sm text-[#CFCFCF] mt-1 font-['Rajdhani',sans-serif]">
                      Pedido #{order.id || order._id} • {new Date(order.date || order.createdAt || Date.now()).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[#CFCFCF] hover:text-[#E11D74] transition-colors"
                >
                  <span className="sr-only">Cerrar</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 px-6 py-6">
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-[#E11D74] border-t-transparent rounded-full"></div>
                    <p className="ml-4 text-[#CFCFCF] font-['Rajdhani',sans-serif]">Cargando detalles del pedido...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-center">
                    <p className="text-red-200 font-semibold font-['Quantico',sans-serif]">{error.message}</p>
                    <p className="text-red-300 text-sm mt-1 font-['Rajdhani',sans-serif]">{error.details}</p>
                  </div>
                )}

                {!isLoading && !error && order && (
                  <div className="space-y-6">
                    {/* Estado del pedido */}
                    <div className="backdrop-blur-sm rounded-xl p-4 border border-white/10"
                      style={{
                        background: "linear-gradient(135deg, rgba(15, 15, 16, 0.9) 0%, rgba(26, 26, 27, 0.95) 50%, rgba(15, 15, 16, 0.9) 100%)"
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold shadow-md border ${getStatusColor(order.status)} font-['Quantico',sans-serif]`}>
                            {getStatusIcon(order.status)}
                            <span>{order.status}</span>
                          </span>
                          <div className="text-[#CFCFCF] font-['Rajdhani',sans-serif]">
                            <p className="font-medium">Total: <span className="text-[#E11D74] font-['Orbitron',sans-serif]">${(order.total || order.totalAmount || order.amount || 0).toFixed(2)}</span></p>
                            <p className="text-sm">
                              {(() => {
                                const orderProducts = Array.isArray(order.products) 
                                  ? order.products 
                                  : (Array.isArray(order.items) ? order.items : []);
                                return `${orderProducts.length} ${orderProducts.length === 1 ? 'artículo' : 'artículos'}`;
                              })()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownloadInvoice(order.id || order._id)}
                            disabled={isDownloading}
                            className="flex items-center space-x-2 px-4 py-2 bg-[#0F0F10]/80 border border-white/20 text-[#CFCFCF] rounded-lg hover:bg-gradient-to-r hover:from-[#E11D74] hover:to-[#6D28D9] hover:text-white hover:border-transparent transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-['Quantico',sans-serif] uppercase"
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
                              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white rounded-lg hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg font-['Quantico',sans-serif] uppercase"
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
                    <div className="backdrop-blur-sm rounded-xl shadow-md border border-white/10 p-6"
                      style={{
                        background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
                      }}
                    >
                      <h3 className="text-xl font-bold text-[#E11D74] mb-4 font-['Orbitron',sans-serif] uppercase tracking-wide flex items-center space-x-2">
                        <svg className="w-5 h-5 text-[#CFCFCF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>Productos</span>
                      </h3>
                      <div className="space-y-4">
                        {(() => {
                          // Normalizar productos/items - el backend usa 'products'
                          const orderProducts = Array.isArray(order.products) 
                            ? order.products 
                            : (Array.isArray(order.items) ? order.items : []);
                          
                          return orderProducts.length > 0 ? (
                            orderProducts.map((item, index) => {
                              // El backend usa: products[].product.name, products[].product.description, etc.
                              const product = item.product || {};
                              const productName = product.name || item.name || item.productName || 'Producto sin nombre';
                              const productDescription = product.description || item.description || '';
                              // Manejar images como array o string
                              const productImage = Array.isArray(product.images) && product.images.length > 0
                                ? product.images[0]
                                : (product.image || item.image || item.productImage || null);
                              const itemPrice = item.price || product.price || 0;
                              const itemQuantity = item.quantity || item.qty || 1;

                              return (
                                <motion.div
                                  key={item.id || item._id || product._id || product.id || index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start space-x-4 p-4 backdrop-blur-sm rounded-lg border border-white/10"
                                  style={{
                                    background: "linear-gradient(135deg, rgba(15, 15, 16, 0.9) 0%, rgba(26, 26, 27, 0.95) 50%, rgba(15, 15, 16, 0.9) 100%)"
                                  }}
                                >
                                  {productImage && (
                                    <img
                                      src={productImage}
                                      alt={productName}
                                      className="w-20 h-20 object-cover rounded-lg border border-white/20"
                                      style={{
                                        background: "linear-gradient(135deg, #0F0F10 0%, #1A0A15 100%)"
                                      }}
                                    />
                                  )}
                                  <div className="flex-1">
                                    <h4 className="font-bold text-[#E11D74] font-['Quantico',sans-serif]">{productName}</h4>
                                    {productDescription && (
                                      <p className="text-sm text-[#CFCFCF] mt-1 line-clamp-2 font-['Rajdhani',sans-serif]">{productDescription}</p>
                                    )}
                                    <div className="flex items-center justify-between mt-2">
                                      <div className="text-sm text-[#CFCFCF] font-['Rajdhani',sans-serif]">
                                        Cantidad: {itemQuantity} × ${itemPrice.toFixed(2)}
                                      </div>
                                      <div className="font-bold text-[#E11D74] font-['Orbitron',sans-serif]">
                                        ${(itemPrice * itemQuantity).toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })
                          ) : (
                            <div className="text-[#CFCFCF] text-center py-8 font-['Rajdhani',sans-serif]">
                              <p>No hay productos disponibles en este pedido</p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Resumen y detalles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Resumen del pedido */}
                      <div className="backdrop-blur-sm rounded-xl shadow-md border border-white/10 p-6"
                        style={{
                          background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
                        }}
                      >
                        <h3 className="text-lg font-bold text-[#E11D74] mb-4 font-['Orbitron',sans-serif] uppercase tracking-wide">Resumen del Pedido</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between text-[#CFCFCF] font-['Rajdhani',sans-serif]">
                            <span>Subtotal:</span>
                            <span>${(order.subtotal || order.subTotal || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-[#CFCFCF] font-['Rajdhani',sans-serif]">
                            <span>Envío:</span>
                            <span>${(order.shipping || order.shippingCost || order.shippingFee || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-[#CFCFCF] font-['Rajdhani',sans-serif]">
                            <span>Impuestos:</span>
                            <span>${(order.tax || order.taxes || 0).toFixed(2)}</span>
                          </div>
                          <div className="border-t border-white/10 pt-3">
                            <div className="flex justify-between text-lg font-bold text-[#E11D74] font-['Orbitron',sans-serif]">
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
                          <div className="backdrop-blur-sm rounded-xl shadow-md border border-white/10 p-6"
                            style={{
                              background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
                            }}
                          >
                            <h3 className="text-lg font-bold text-[#E11D74] mb-4 font-['Orbitron',sans-serif] uppercase tracking-wide">Dirección de Envío</h3>
                            <div className="space-y-2 text-[#CFCFCF] text-sm font-['Rajdhani',sans-serif]">
                              <p className="font-semibold">{order.shippingAddress.recipientName}</p>
                              <p>{order.shippingAddress.street}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>
                        )}

                        {/* Método de pago */}
                        <div className="backdrop-blur-sm rounded-xl shadow-md border border-white/10 p-6"
                          style={{
                            background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
                          }}
                        >
                          <h3 className="text-lg font-bold text-[#E11D74] mb-4 font-['Orbitron',sans-serif] uppercase tracking-wide">Método de Pago</h3>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#E11D74] to-[#6D28D9] rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </div>
                            <div>
                              {order.paymentMethod && typeof order.paymentMethod === 'object' ? (
                                <>
                                  <p className="font-semibold text-[#E11D74] font-['Quantico',sans-serif]">
                                    {order.paymentMethod.type || order.paymentMethod.method || 'Método de pago'}
                                  </p>
                                  {order.paymentMethod.brand && order.paymentMethod.last4 && (
                                    <p className="text-sm text-[#CFCFCF] font-['Rajdhani',sans-serif]">
                                      {order.paymentMethod.brand} terminada en {order.paymentMethod.last4}
                                    </p>
                                  )}
                                </>
                              ) : (
                                <p className="font-semibold text-[#E11D74] font-['Quantico',sans-serif]">
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
              <div className="px-6 py-4 border-t border-white/10"
                style={{
                  background: "linear-gradient(135deg, rgba(15, 15, 16, 0.9) 0%, rgba(26, 26, 27, 0.95) 50%, rgba(15, 15, 16, 0.9) 100%)"
                }}
              >
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-6 py-2 bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white rounded-lg hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-all duration-300 font-semibold shadow-md hover:shadow-lg font-['Quantico',sans-serif] uppercase"
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

