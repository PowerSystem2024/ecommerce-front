import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-[#0F0F10] border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {/* Main Footer Content - Centrados con 2cm de separación */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-60 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-[#E11D74] to-[#8B5CF6] flex items-center justify-center text-white font-orbitron font-bold shadow-lg">
              FS
            </div>
            <span className="font-orbitron text-white text-2xl tracking-wider uppercase">
              Fatal Store
            </span>
          </motion.div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <div className="space-y-2 text-rajdhani text-[#CFCFCF]">
              <p>📧 info@fatalstore.com</p>
              <p>📱 +54 11 1234-5678</p>
              <p>📍 Buenos Aires, Argentina</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Centrado */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-rajdhani text-[#CFCFCF] text-sm">
            © 2024 Fatal Store. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;