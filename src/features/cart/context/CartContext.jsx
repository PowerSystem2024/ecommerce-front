import React, { createContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

// Función helper para generar una clave única para cada item del carrito
// Considera ID del producto + color seleccionado + talle seleccionado
const getCartItemKey = (item) => {
  const productId = item._id || item.id;
  const color = item.selectedColor || '';
  const size = item.selectedSize || '';
  return `${productId}_${color}_${size}`;
};

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      // Normalizar el ID del producto (puede ser _id o id)
      const productId = product._id || product.id;
      
      if (!productId) {
        console.warn('Producto sin ID válido:', product);
        return prev;
      }
      
      // Generar clave única para este item (considerando variantes)
      const newItemKey = getCartItemKey(product);
      
      // Buscar el producto existente usando la clave única (ID + color + talle)
      const idx = prev.findIndex((i) => {
        const itemKey = getCartItemKey(i);
        return itemKey === newItemKey;
      });
      
      if (idx !== -1) {
        // Si el producto con la misma variante ya existe, incrementar la cantidad
        const copy = [...prev];
        const currentQuantity = Number(copy[idx].quantity) || 0;
        const newQuantity = currentQuantity + Number(quantity);
        copy[idx] = { ...copy[idx], quantity: newQuantity };
        return copy;
      }
      
      // Si no existe (o es una variante diferente), agregar nuevo item
      // Remover cualquier propiedad quantity que pueda venir del producto original
      const { quantity: _, ...productWithoutQuantity } = product;
      return [...prev, { ...productWithoutQuantity, quantity: Number(quantity) }];
    });
  };

  const removeItem = (itemKey) => {
    setItems((prev) => prev.filter((i) => {
      const currentKey = getCartItemKey(i);
      return currentKey !== itemKey;
    }));
  };

  const updateQuantity = (itemKey, quantity) => {
    setItems((prev) => prev.map((i) => {
      const currentKey = getCartItemKey(i);
      return currentKey === itemKey ? { ...i, quantity } : i;
    }));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const totalCount = items.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
    return { totalCount, totalPrice };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, ...totals }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
