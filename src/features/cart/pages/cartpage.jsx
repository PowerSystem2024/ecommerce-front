import React from 'react';
import Cart from '../components/cart';
import { ShopLayout } from '../../shared/components/navigations';

export default function CartPage() {
  return (
    <ShopLayout>
    <div className="min-h-screen bg-[#0F0F10] text-white py-12 px-4 flex flex-col items-center">
      
      <div className="w-full max-w-6xl">
        <Cart />
      </div>
    </div>
    </ShopLayout>
  );
}
