import React from 'react';
import { useCart } from '../context/useCart';

export default function CartSummary() {
  const { totalCount, totalPrice, clearCart } = useCart();

  return (
    <div className="bg-[#0F0F10] rounded-2xl shadow-lg p-6 border border-[#2A2A2A] h-fit text-[#FFFFFF] font-['Rajdhani',_sans-serif]">
      
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

      {/* Botones */}
      <div className="space-y-3">
        <button className="w-full py-3 rounded-xl text-white font-['Quantico',_sans-serif] uppercase bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#6D28D9] shadow-md hover:shadow-fuchsia-700 transition-all">
          Ir a pagar
        </button>
        <button
          onClick={clearCart}
          className="w-full py-3 rounded-xl text-white font-['Quantico',_sans-serif] uppercase bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-all"
        >
          Vaciar carrito
        </button>
      </div>
    </div>
  );
}
