import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../order-history/services/orderService';

export default function PaymentModal({ isOpen, onClose, orderId, initPoint }) {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('waiting'); // waiting, success, failed
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);
  const statusRef = useRef('waiting');

  // Mantener el ref sincronizado con el estado
  useEffect(() => {
    statusRef.current = paymentStatus;
  }, [paymentStatus]);

  useEffect(() => {
    if (!isOpen || !orderId || !initPoint) {
      return;
    }

    // Abrir Mercado Pago en nueva pestaña
    window.open(initPoint, '_blank');
    
    // Resetear estado
    setPaymentStatus('waiting');
    statusRef.current = 'waiting';
    setError(null);
    
    // Iniciar polling para verificar el estado del pago
    let intervalId;
    let timeoutId;

    const checkPaymentStatus = async () => {
      // Verificar el estado actual usando el ref
      if (statusRef.current !== 'waiting') {
        return; // Detener si ya cambió el estado
      }

      try {
        setIsChecking(true);
        const response = await orderService.getOrderById(orderId);
        const orderData = response?.data || response;

        // Log detallado para debug
        console.log('🔍 Verificando estado del pago:', {
          orderId,
          isPaid: orderData.isPaid,
          status: orderData.status,
          paymentStatus: orderData.paymentStatus,
          paidAt: orderData.paidAt,
          orderData: orderData
        });

        // Verificar múltiples campos posibles para determinar si el pago fue completado
        const isPaid = 
          orderData.isPaid === true || 
          orderData.isPaid === 'true' ||
          orderData.status === 'confirmada' || 
          orderData.status === 'confirmado' ||
          orderData.status === 'paid' ||
          orderData.paymentStatus === 'paid' ||
          orderData.paymentStatus === 'approved' ||
          orderData.paymentStatus === 'accredited' || // Mercado Pago usa este estado
          (orderData.paidAt && orderData.paidAt !== null);

        // Verificar si fue cancelado o rechazado
        const isCancelled = 
          orderData.status === 'cancelada' || 
          orderData.status === 'cancelado' ||
          orderData.status === 'cancelled' ||
          orderData.paymentStatus === 'cancelled' ||
          orderData.paymentStatus === 'rejected' ||
          orderData.paymentStatus === 'rejected' ||
          orderData.paymentStatus === 'cancelled';

        // Si paymentStatus existe y NO es 'pending', puede ser que el webhook esté procesando
        // pero aún no haya actualizado isPaid o status
        const paymentInProcess = 
          orderData.paymentStatus && 
          orderData.paymentStatus !== 'pending' && 
          orderData.paymentStatus !== 'in_process' &&
          !isPaid && 
          !isCancelled;

        if (isPaid) {
          console.log('✅ Pago detectado como exitoso');
          setPaymentStatus('success');
          statusRef.current = 'success';
          if (intervalId) clearInterval(intervalId);
          if (timeoutId) clearTimeout(timeoutId);
        } else if (isCancelled) {
          console.log('❌ Pago detectado como cancelado');
          setPaymentStatus('failed');
          statusRef.current = 'failed';
          if (intervalId) clearInterval(intervalId);
          if (timeoutId) clearTimeout(timeoutId);
        } else if (paymentInProcess) {
          console.log('🔄 PaymentStatus cambió pero aún no está confirmado:', orderData.paymentStatus);
          // Si el paymentStatus cambió de 'pending', puede ser que el webhook esté procesando
          // Continuar verificando pero mostrar un mensaje diferente
        } else {
          console.log('⏳ Pago aún pendiente - paymentStatus:', orderData.paymentStatus, 'isPaid:', orderData.isPaid);
        }
      } catch (err) {
        console.error('❌ Error verificando estado del pago:', err);
        // No mostrar error en cada intento, solo si pasa mucho tiempo
      } finally {
        setIsChecking(false);
      }
    };

    // Verificar inmediatamente
    checkPaymentStatus();

    // Luego verificar cada 2 segundos (más frecuente para mejor UX)
    intervalId = setInterval(() => {
      if (statusRef.current === 'waiting') {
        checkPaymentStatus();
      }
    }, 2000);

    // Limpiar el intervalo después de 5 minutos (timeout de seguridad)
    timeoutId = setTimeout(() => {
      if (intervalId) clearInterval(intervalId);
      if (statusRef.current === 'waiting') {
        setError('El tiempo de espera se agotó. Por favor, verifica el estado de tu orden en el historial.');
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
      setPaymentStatus('waiting');
      statusRef.current = 'waiting';
      setError(null);
    };
  }, [isOpen, orderId, initPoint]);


  const handleClose = () => {
    if (paymentStatus === 'success') {
      // Si el pago fue exitoso, redirigir al historial de órdenes
      onClose(true); // Pasar true para indicar que el pago fue exitoso
      navigate('/order-history');
    } else {
      // Si no, solo cerrar el modal
      onClose(false); // Pasar false para indicar que el pago no fue exitoso
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#1A1A1B] border border-[#2A2A2A] p-8 text-left align-middle shadow-xl transition-all"
          >
            {paymentStatus === 'waiting' && (
              <>
                {/* Estado: Esperando pago */}
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-['Orbitron',sans-serif] text-[#E11D74] mb-4 uppercase tracking-widest">
                    Esperando Pago
                  </h3>

                  <p className="text-[#CFCFCF] mb-6 font-['Rajdhani',sans-serif] text-lg">
                    Completa el pago en Mercado Pago.
                  </p>

                  {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        onClose(false);
                        navigate('/order-history');
                      }}
                      className="w-full py-3 rounded-xl text-white font-['Quantico',sans-serif] uppercase bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-all"
                    >
                      Ver Mis Órdenes
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-3 rounded-xl text-white font-['Quantico',sans-serif] uppercase bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-all"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </>
            )}

            {paymentStatus === 'success' && (
              <>
                {/* Estado: Pago exitoso */}
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-['Orbitron',sans-serif] text-[#E11D74] mb-4 uppercase tracking-widest">
                    ¡Pago Exitoso!
                  </h3>

                  <p className="text-[#CFCFCF] mb-6 font-['Rajdhani',sans-serif] text-lg">
                    Tu pago se ha procesado correctamente. Tu orden está siendo procesada.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        onClose(true);
                        navigate('/order-history');
                      }}
                      className="w-full py-3 rounded-xl text-white font-['Quantico',sans-serif] uppercase bg-linear-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#6D28D9] shadow-md hover:shadow-fuchsia-700 transition-all"
                    >
                      Ver mi orden
                    </button>
                    <button
                      onClick={() => {
                        onClose(true);
                        navigate('/shop');
                      }}
                      className="w-full py-3 rounded-xl text-white font-['Quantico',sans-serif] uppercase bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-all"
                    >
                      Continuar comprando
                    </button>
                  </div>
                </div>
              </>
            )}

            {paymentStatus === 'failed' && (
              <>
                {/* Estado: Pago fallido */}
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-['Orbitron',sans-serif] text-[#E11D74] mb-4 uppercase tracking-widest">
                    Pago Cancelado
                  </h3>

                  <p className="text-[#CFCFCF] mb-6 font-['Rajdhani',sans-serif] text-lg">
                    El pago fue cancelado. Puedes intentar nuevamente.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={onClose}
                      className="w-full py-3 rounded-xl text-white font-['Quantico',sans-serif] uppercase bg-linear-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#6D28D9] shadow-md hover:shadow-fuchsia-700 transition-all"
                    >
                      Intentar nuevamente
                    </button>
                    <button
                      onClick={() => navigate('/order-history')}
                      className="w-full py-3 rounded-xl text-white font-['Quantico',sans-serif] uppercase bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-all"
                    >
                      Ver mis órdenes
                    </button>
                  </div>
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

