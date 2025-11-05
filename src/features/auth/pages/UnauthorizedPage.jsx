import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F10] via-[#1A1A1B] to-[#2A2A2A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#E11D74] to-[#8B5CF6] rounded-full flex items-center justify-center">
            <ShieldExclamationIcon className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-white mb-4 font-['Orbitron',_sans-serif]"
        >
          Acceso Denegado
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 mb-2 font-['Rajdhani',_sans-serif] text-lg"
        >
          No tienes permisos para acceder a esta sección.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 mb-8 font-['Rajdhani',_sans-serif]"
        >
          Esta área está restringida solo para administradores.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white rounded-lg transition-all duration-300 font-['Quantico',_sans-serif] border border-[#E11D74]/30"
          >
            Volver atrás
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-[#E11D74] to-[#8B5CF6] hover:from-[#C91563] hover:to-[#7C3AED] text-white rounded-lg transition-all duration-300 font-['Quantico',_sans-serif] shadow-lg hover:shadow-[#E11D74]/50"
          >
            Ir al inicio
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 p-4 bg-[#1A1A1B] border border-[#2A2A2A] rounded-lg"
        >
          <p className="text-sm text-gray-400 font-['Rajdhani',_sans-serif]">
            Si crees que deberías tener acceso a esta sección, por favor contacta al administrador del sistema.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}