import React from 'react';
import CartList from './CartList';
import CartSummary from './cartSummary';

export default function Cart() {
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10 text-white">
      {/* Sección izquierda: lista de productos */}
      <div className="lg:col-span-2 bg-[#1A1A1B] rounded-2xl shadow-lg p-6 border border-[#2A2A2A]">
        <h2 className="text-2xl font-orbitron text-[#E11D74] mb-6 uppercase tracking-widest">
          Tu Carrito
        </h2>
        <div className="border-t border-[#2A2A2A] pt-4">
          <CartList />
        </div>
      </div>

      {/* Sección derecha: resumen */}
      <div className="bg-[#0F0F10] rounded-2xl shadow-lg p-6 border border-[#2A2A2A]">
        <CartSummary />
      </div>
    </div>
  );
}

