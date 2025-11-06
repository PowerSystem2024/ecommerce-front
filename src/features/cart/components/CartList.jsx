import React from 'react';
import CartItem from './CartItem';
import { useCart } from '../context/useCart';

export default function CartList() {
  const { items } = useCart();

  if (!items || items.length === 0) {
    return <div className="p-6 text-center text-[#CFCFCF] font-['Rajdhani',sans-serif]">Tu carrito está vacío.</div>;
  }

  return (
    <div className="divide-y">
      {items.map((it) => (
        <CartItem key={it.id} item={it} />
      ))}
    </div>
  );
}
