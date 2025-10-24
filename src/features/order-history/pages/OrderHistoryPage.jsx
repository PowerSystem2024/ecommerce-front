import { motion } from 'framer-motion';
import { ShopLayout } from '../../shared/components/navigations';
import OrderHistoryContent from '../components/OrderHistoryContent';

const OrderHistoryPage = () => {
  return (
    <ShopLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <OrderHistoryContent />
      </motion.div>
    </ShopLayout>
  );
};

export default OrderHistoryPage;
