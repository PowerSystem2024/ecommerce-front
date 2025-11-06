import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopLayout } from '../../shared/components/navigations';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Mercado Pago envía diferentes parámetros según el flujo
    // Intentar obtener el orderId de diferentes formas
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');
    const preferenceId = searchParams.get('preference-id');
    
    // El external_reference es el orderId que configuramos en el backend
    if (externalReference) {
      setOrderId(externalReference);
    }

    // Si no hay external_reference, intentar obtenerlo del preference-id
    // El preference-id puede tener el formato: "preferenceId-externalReference"
    if (!externalReference && preferenceId) {
      const parts = preferenceId.split('-');
      // El último segmento podría ser el orderId, pero mejor esperar a que el backend lo envíe
      console.log('Preference ID recibido:', preferenceId);
    }

    console.log('Parámetros de Mercado Pago:', {
      paymentId,
      status,
      externalReference,
      preferenceId,
      allParams: Object.fromEntries(searchParams.entries())
    });

    // Redirigir después de 3 segundos al historial de órdenes
    const timer = setTimeout(() => {
      if (orderId || externalReference) {
        navigate(`/orders/${orderId || externalReference}`, { replace: true });
      } else {
        navigate('/order-history', { replace: true });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, searchParams, orderId]);

  return (
    <ShopLayout>
      <div className="min-h-screen bg-[#0F0F10] text-white py-12 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-[#1A1A1B] rounded-2xl shadow-lg p-8 border border-[#2A2A2A] text-center">
          {/* Ícono de éxito */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-['Orbitron',sans-serif] text-[#E11D74] mb-4 uppercase tracking-widest">
            ¡Pago Exitoso!
          </h1>

          {/* Mensaje */}
          <p className="text-[#CFCFCF] mb-6 font-['Rajdhani',sans-serif] text-lg">
            Tu pago se ha procesado correctamente. Tu orden está siendo procesada.
          </p>

          {/* Botones */}
          <div className="space-y-3">
            {orderId && (
              <button
                onClick={() => navigate(`/orders/${orderId}`, { replace: true })}
                className="w-full py-3 rounded-xl text-white font-['Quantico',sans-serif] uppercase bg-linear-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#6D28D9] shadow-md hover:shadow-fuchsia-700 transition-all"
              >
                Ver mi orden
              </button>
            )}
            <button
              onClick={() => navigate('/order-history', { replace: true })}
              className="w-full py-3 rounded-xl text-white font-['Quantico',sans-serif] uppercase bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-all"
            >
              Ver historial de órdenes
            </button>
            <button
              onClick={() => navigate('/shop', { replace: true })}
              className="w-full py-3 rounded-xl text-white font-['Quantico',sans-serif] uppercase bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-all"
            >
              Continuar comprando
            </button>
          </div>

          {/* Mensaje de redirección automática */}
          <p className="text-sm text-[#8B5CF6] mt-6 font-['Rajdhani',sans-serif]">
            Serás redirigido automáticamente en unos segundos...
          </p>
        </div>
      </div>
    </ShopLayout>
  );
}

