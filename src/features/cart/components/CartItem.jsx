import React from 'react';
import { useCart } from '../context/useCart';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center justify-between bg-[#2A2A2A] rounded-2xl p-4 mb-4 shadow-md hover:shadow-lg hover:border hover:border-[#8B5CF6] transition-all">
      
      {/* Imagen y detalles */}
      <div className="flex items-center gap-4">
        <img
          src={item.image || '/placeholder.png'}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-xl"
        />
        <div>
          <h3 className="text-lg font-michroma text-white">{item.name}</h3>
          {item.size && (
            <p className="text-sm text-[#CFCFCF]">Talla: {item.size}</p>
          )}
          <p className="text-sm text-[#8B5CF6] mt-1 font-quantico">
            ${(item.price || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Cantidad */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
          className="px-3 py-1 bg-[#1A1A1B] text-white font-quantico rounded-xl hover:bg-[#6D28D9] transition-all"
        >
          -
        </button>
        <div className="w-8 text-center text-white font-michroma">{item.quantity}</div>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="px-3 py-1 bg-[#1A1A1B] text-white font-quantico rounded-xl hover:bg-[#6D28D9] transition-all"
        >
          +
        </button>
      </div>

      {/* Total */}
      <div className="w-24 text-right font-quantico text-[#E11D74] text-lg">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      {/* Botón eliminar */}
      <button
        onClick={() => removeItem(item.id)}
        className="text-[#E11D74] hover:text-[#8B5CF6] font-quantico ml-4 transition"
      >
        Eliminar
      </button>
    </div>
  );
}
