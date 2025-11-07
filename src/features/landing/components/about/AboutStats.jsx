import React from 'react'
import { motion } from 'framer-motion'

const estadisticas = [
  { 
    label: 'Transacciones cada 24 horas', 
    value: '2.4 millones',
    icon: (
      <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  { 
    label: 'Productos en inventario', 
    value: '15,000+',
    icon: (
      <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  { 
    label: 'Nuevos usuarios anuales', 
    value: '46,000',
    icon: (
      <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
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

export default function AboutStats() {
  return (
    <motion.section 
      className="bg-[#0F0F10] py-20 sm:py-32 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-light tracking-tight text-white sm:text-5xl mb-6">
              Nuestra
              <span className="block font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Misión
              </span>
            </h2>
          </motion.div>

          <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
            {/* Content */}
            <motion.div 
              className="lg:w-full lg:max-w-2xl lg:flex-auto"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.p 
                className="text-xl/8 text-gray-400 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                En Ropa Moderna, creemos que la moda debe ser accesible, sostenible y auténtica. 
                Nuestra misión es democratizar el estilo, ofreciendo prendas de calidad que 
                permitan a cada persona expresar su personalidad única.
              </motion.p>
              
              <motion.p 
                className="max-w-xl text-base/7 text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Trabajamos con diseñadores locales y marcas éticas para crear colecciones que 
                no solo se ven bien, sino que también hacen bien. Cada prenda en nuestro catálogo 
                ha sido cuidadosamente seleccionada por su calidad, diseño y compromiso con 
                prácticas sostenibles.
              </motion.p>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="lg:flex lg:flex-auto lg:justify-center"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <dl className="w-64 space-y-8 xl:w-80">
                {estadisticas.map((stat) => (
                  <motion.div 
                    key={stat.label} 
                    className="flex flex-col-reverse gap-y-4 group"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, x: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Icon */}
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {stat.icon}
                      </motion.div>
                    </div>
                    
                    {/* Label */}
                    <dt className="text-base/7 text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                      {stat.label}
                    </dt>
                    
                    {/* Value */}
                    <dd className="text-4xl font-bold tracking-tight text-white group-hover:text-rose-400 transition-colors duration-300">
                      {stat.value}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.a
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Descubrir Nuestra Historia
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}