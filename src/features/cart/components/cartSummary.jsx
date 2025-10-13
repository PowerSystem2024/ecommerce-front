import React from 'react';
import { useCart } from '../context/useCart';

export default function CartSummary() {
  const { totalCount, totalPrice, clearCart } = useCart();

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between text-sm text-gray-600">
        <div>Items</div>
        <div>{totalCount}</div>
      </div>
      <div className="flex justify-between text-lg font-semibold mt-2">
        <div>Total</div>
        <div>${totalPrice.toFixed(2)}</div>
      </div>
      <div className="mt-4 space-y-2">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">Ir a pagar</button>
        <button onClick={clearCart} className="w-full px-4 py-2 border rounded text-gray-700">Vaciar carrito</button>
      </div>
    </div>
  );
}
