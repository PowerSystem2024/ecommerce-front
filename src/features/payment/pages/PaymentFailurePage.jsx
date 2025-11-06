import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopLayout } from '../../shared/components/navigations';

export default function PaymentFailurePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Obtener información del pago fallido
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    
    console.log('Pago fallido:', { paymentId, status });
  }, [searchParams]);

  return (
    <ShopLayout>
      <div className="min-h-screen bg-[#0F0F10] text-white py-12 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-[#1A1A1B] rounded-2xl shadow-lg p-8 border border-[#2A2A2A] text-center">
          {/* Ícono de error */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-['Orbitron',_sans-serif] text-[#E11D74] mb-4 uppercase tracking-widest">
            Pago Fallido
          </h1>

          {/* Mensaje */}
          <p className="text-[#CFCFCF] mb-6 font-['Rajdhani',_sans-serif] text-lg">
            No pudimos procesar tu pago. Por favor, intenta nuevamente o contacta con soporte si el problema persiste.
          </p>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/cart', { replace: true })}
              className="w-full py-3 rounded-xl text-white font-['Quantico',_sans-serif] uppercase bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#6D28D9] shadow-md hover:shadow-fuchsia-700 transition-all"
            >
              Intentar nuevamente
            </button>
            <button
              onClick={() => navigate('/shop', { replace: true })}
              className="w-full py-3 rounded-xl text-white font-['Quantico',_sans-serif] uppercase bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-all"
            >
              Volver a la tienda
            </button>
            <button
              onClick={() => navigate('/order-history', { replace: true })}
              className="w-full py-3 rounded-xl text-white font-['Quantico',_sans-serif] uppercase bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-all"
            >
              Ver mis órdenes
            </button>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}

