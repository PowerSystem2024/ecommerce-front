import React from 'react';
import CartList from './CartList';
import CartSummary from './cartSummary';

export default function Cart() {
  return (
    <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Tu carrito</h2>
        <CartList />
      </div>
      <div>
        <CartSummary />
      </div>
    </div>
  );
}
