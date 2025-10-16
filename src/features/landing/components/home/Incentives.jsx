import { motion } from "framer-motion"

const beneficios = [
  {
    name: 'Envío Gratuito',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    description: 'Envío gratuito en compras superiores a $50.000. Recibí tus productos en la comodidad de tu hogar sin costo adicional.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Garantía Extendida',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    description: 'Garantía de 12 meses en todos nuestros productos. Comprá con confianza sabiendo que respaldamos la calidad.',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    name: 'Cambios Fáciles',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    description: 'Cambios y devoluciones sin complicaciones hasta 30 días después de tu compra. Tu satisfacción es nuestra prioridad.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Compromiso Sustentable',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
      </svg>
    ),
    description: 'Comprometidos con el medio ambiente. Usamos materiales sustentables y packaging eco-friendly en todos nuestros productos.',
    color: 'from-green-500 to-emerald-500'
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export default function Incentives() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
            ¿Por qué elegir
            <span className="block font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Nuestra Tienda?
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una experiencia de compra excepcional con beneficios únicos para nuestros clientes
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {beneficios.map((beneficio, index) => (
            <motion.div
              key={beneficio.name}
              variants={itemVariants}
              className="group relative"
            >
              <div className="flex items-start space-x-4">
                {/* Icon Container */}
                <motion.div 
                  className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${beneficio.color} flex items-center justify-center text-white shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {beneficio.icon}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <motion.h3 
                    className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-rose-600 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {beneficio.name}
                  </motion.h3>
                  <p className="text-gray-600 leading-relaxed">
                    {beneficio.description}
                  </p>
                </div>
              </div>

              {/* Decorative Element */}
              <motion.div 
                className="absolute -inset-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                initial={false}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.a
            href="/catalogo"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-4 rounded-full font-medium shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Comenzar a Comprar
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}