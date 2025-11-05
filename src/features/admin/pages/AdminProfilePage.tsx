import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../shared/components/navigations';
import AdminProfileContent from '../components/AdminProfileContent';
import { FiArrowLeft } from 'react-icons/fi';

const AdminProfilePage = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  return (
    <AdminLayout noScroll={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen p-4"
      >
        <button
          onClick={handleBackToDashboard}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Volver al Dashboard
        </button>
        <AdminProfileContent />
      </motion.div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
