import { motion } from 'framer-motion';
import { ShopLayout } from '../../shared/components/navigations';
import UserProfileContent from '../components/UserProfileContent';

const UserProfilePage = () => {
  return (
    <ShopLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <UserProfileContent />
      </motion.div>
    </ShopLayout>
  );
};

export default UserProfilePage;
