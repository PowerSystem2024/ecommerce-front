import React from 'react';
import { useCart } from '../context/useCart';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center justify-between backdrop-blur-sm rounded-2xl p-4 mb-4 shadow-md hover:shadow-lg hover:border hover:border-[#E11D74]/50 transition-all border border-white/10"
      style={{
        background: "linear-gradient(135deg, rgba(15, 15, 16, 0.9) 0%, rgba(26, 26, 27, 0.95) 50%, rgba(15, 15, 16, 0.9) 100%)"
      }}
    >
      
      {/* Imagen y detalles */}
      <div className="flex items-center gap-4">
        <img
          src={item.image || '/placeholder.png'}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-xl"
          style={{
            background: "linear-gradient(135deg, #0F0F10 0%, #1A0A15 100%)"
          }}
        />
        <div>
          <h3 className="text-lg font-['Quantico',sans-serif] text-[#E11D74]">{item.name}</h3>
          {item.size && (
            <p className="text-sm text-[#CFCFCF] font-['Rajdhani',sans-serif]">Talla: {item.size}</p>
          )}
          <p className="text-sm text-[#6D28D9] mt-1 font-['Quantico',sans-serif]">
            ${(item.price || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Cantidad */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
          className="px-3 py-1 bg-[#0F0F10]/80 text-white font-['Quantico',sans-serif] rounded-xl hover:bg-gradient-to-r hover:from-[#E11D74] hover:to-[#6D28D9] transition-all border border-white/20"
        >
          -
        </button>
        <div className="w-8 text-center text-white font-['Quantico',sans-serif]">{item.quantity}</div>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="px-3 py-1 bg-[#0F0F10]/80 text-white font-['Quantico',sans-serif] rounded-xl hover:bg-gradient-to-r hover:from-[#E11D74] hover:to-[#6D28D9] transition-all border border-white/20"
        >
          +
        </button>
      </div>

      {/* Total */}
      <div className="w-24 text-right font-['Quantico',sans-serif] text-[#E11D74] text-lg">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      {/* Botón eliminar */}
      <button
        onClick={() => removeItem(item.id)}
        className="text-[#E11D74] hover:text-[#6D28D9] font-['Quantico',sans-serif] ml-4 transition"
      >
        Eliminar
      </button>
    </div>
  );
}
