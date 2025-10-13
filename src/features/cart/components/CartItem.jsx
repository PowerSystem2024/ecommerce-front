import React from 'react';
import { useCart } from '../context/useCart';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center space-x-4 py-3 border-b">
      <img src={item.image || '/placeholder.png'} alt={item.name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <div className="font-medium text-gray-900">{item.name}</div>
        <div className="text-sm text-gray-500">{item.size ? `Talla: ${item.size}` : ''}</div>
        <div className="text-sm text-gray-700 mt-2">${(item.price || 0).toFixed(2)}</div>
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2 py-1 bg-gray-100 rounded">-</button>
        <div className="w-8 text-center">{item.quantity}</div>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-100 rounded">+</button>
      </div>

      <div className="w-24 text-right font-semibold">${((item.price || 0) * item.quantity).toFixed(2)}</div>

      <button onClick={() => removeItem(item.id)} className="text-red-500 ml-4">Eliminar</button>
    </div>
  );
}
