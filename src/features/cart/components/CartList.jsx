import React from 'react';
import CartItem from './CartItem';
import { useCart } from '../context/useCart';

// Función helper para generar clave única (debe coincidir con CartContext)
const getCartItemKey = (item) => {
  const productId = item._id || item.id;
  const color = item.selectedColor || '';
  const size = item.selectedSize || '';
  return `${productId}_${color}_${size}`;
};

export default function CartList() {
  const { items } = useCart();

  if (!items || items.length === 0) {
    return <div className="p-6 text-center text-[#CFCFCF] font-['Rajdhani',sans-serif]">Tu carrito está vacío.</div>;
  }

  return (
    <div className="divide-y">
      {items.map((it) => {
        const itemKey = getCartItemKey(it);
        return <CartItem key={itemKey} item={it} />;
      })}
    </div>
  );
}
