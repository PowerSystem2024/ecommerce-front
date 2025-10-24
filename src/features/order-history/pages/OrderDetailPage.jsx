import React from 'react';
import { motion } from 'framer-motion';
import OrderDetail from '../components/OrderDetail';
import { ShopLayout } from '../../shared/components/navigations/ShopLayout';

const OrderDetailPage = () => {
  return (
    <ShopLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30"
      >
        <OrderDetail />
      </motion.div>
    </ShopLayout>
  );
};

export default OrderDetailPage;
