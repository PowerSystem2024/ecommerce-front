import { motion } from 'framer-motion';
import { AdminLayout } from '../../shared/components/navigations';
import AdminProfileContent from '../components/AdminProfileContent';

const AdminProfilePage = () => {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <AdminProfileContent />
      </motion.div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
