import React, { useState } from 'react';
import { useCart } from '../context/useCart';
import { orderService } from '../../order-history/services/orderService';
import { userService } from '../../user-profile/services/userService';
import PaymentModal from '../../payment/components/PaymentModal';

export default function CartSummary() {
  const { items, totalCount, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [paymentInitPoint, setPaymentInitPoint] = useState(null);

  const handleCheckout = async () => {
    if (!items || items.length === 0) {
      setError('Tu carrito está vacío');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Obtener el perfil del usuario para la dirección de envío
      const profileResponse = await userService.getProfile();
      const profileData = profileResponse?.data || profileResponse;
      const userAddress = profileData.address;

      if (!userAddress || !userAddress.street || !userAddress.city) {
        throw new Error('Por favor, completa tu dirección de envío en tu perfil antes de realizar la compra');
      }

      // Construir la dirección de envío (estructura exacta que espera el backend)
      const shippingAddress = {
        street: userAddress.street,
        city: userAddress.city,
        zipCode: userAddress.zipCode || userAddress.postalCode || '',
        country: userAddress.country || 'México',
      };

      // Crear la orden con los items del carrito (estructura exacta que espera el backend)
      const orderData = {
        products: items.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity,
        })),
        shippingAddress,
      };

      const orderResponse = await orderService.createOrder(orderData);
      const orderId = orderResponse?.data?._id || orderResponse?.data?.id || orderResponse?._id || orderResponse?.id;

      if (!orderId) {
        throw new Error('No se pudo obtener el ID de la orden');
      }

      // Crear el pago de Mercado Pago
      const paymentResponse = await orderService.createPayment(orderId);
      const initPoint = paymentResponse?.data?.initPoint;

      if (!initPoint) {
        throw new Error('No se pudo obtener el link de pago');
      }

      // Guardar el orderId y initPoint para el modal
      setCurrentOrderId(orderId);
      setPaymentInitPoint(initPoint);
      
      // Mostrar el modal de pago (que abrirá Mercado Pago en nueva pestaña)
      setShowPaymentModal(true);
      setIsProcessing(false);
    } catch (err) {
      console.error('Error en el proceso de compra:', err);
      setError(err.message || 'Error al procesar el pago. Por favor, intenta nuevamente.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-fit text-[#FFFFFF] font-['Rajdhani',_sans-serif]">
      
      {/* Título */}
      <h2 className="text-2xl font-['Orbitron',_sans-serif] text-[#E11D74] mb-6 uppercase tracking-widest">
        Resumen
      </h2>

      {/* Totales */}
      <div className="flex justify-between text-[#CFCFCF] mb-2">
        <span>Items</span>
        <span>{totalCount}</span>
      </div>
      <div className="flex justify-between font-bold text-white text-lg mb-6">
        <span>Total</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Botones */}
      <div className="space-y-3">
        <button 
          onClick={handleCheckout}
          disabled={isProcessing || !items || items.length === 0}
          className="w-full py-3 rounded-xl text-white font-['Quantico',_sans-serif] uppercase bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#6D28D9] shadow-md hover:shadow-fuchsia-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Procesando...' : 'Ir a pagar'}
        </button>
        <button
          onClick={clearCart}
          disabled={isProcessing}
          className="w-full py-3 rounded-xl text-white font-['Quantico',_sans-serif] uppercase bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Vaciar carrito
        </button>
      </div>

      {/* Modal de pago */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={(paymentWasSuccessful) => {
          setShowPaymentModal(false);
          setCurrentOrderId(null);
          setPaymentInitPoint(null);
          // Limpiar el carrito solo si el pago fue exitoso
          if (paymentWasSuccessful && items && items.length > 0) {
            clearCart();
          }
        }}
        orderId={currentOrderId}
        initPoint={paymentInitPoint}
      />
    </div>
  );
}
