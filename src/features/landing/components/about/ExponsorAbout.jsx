import React from 'react'
import { motion } from 'framer-motion'

const sponsors = [
  {
    name: 'Zara',
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=80',
    description: 'Moda rápida sostenible'
  },
  {
    name: 'H&M',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80',
    description: 'Conscious Collection'
  },
  {
    name: 'Uniqlo',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80',
    description: 'LifeWear'
  },
  {
    name: 'COS',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80',
    description: 'Diseño minimalista'
  },
  {
    name: 'Everlane',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80',
    description: 'Transparencia radical'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
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

export default function ExponsorAbout() {
  return (
    <motion.section 
      className="bg-gradient-to-br from-gray-50 to-white py-16 sm:py-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-light tracking-tight text-gray-900 sm:text-4xl mb-4">
            Marcas que
            <span className="block font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Confían en Nosotros
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trabajamos con las mejores marcas de moda para ofrecerte una experiencia de compra única
          </p>
        </motion.div>

        {/* Sponsors Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              className="group relative"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                {/* Logo Container */}
                <motion.div 
                  className="relative w-20 h-20 mb-4 overflow-hidden rounded-xl"
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <img
                    alt={`Logo de ${sponsor.name}`}
                    src={sponsor.logo}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.div>

                {/* Brand Name */}
                <motion.h3 
                  className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {sponsor.name}
                </motion.h3>

                {/* Description */}
                <p className="text-sm text-gray-500 text-center group-hover:text-gray-700 transition-colors duration-300">
                  {sponsor.description}
                </p>

                {/* Decorative Element */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  initial={false}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="text-gray-600">¿Querés ser nuestro socio?</span>
            <motion.a
              href="/contact"
              className="text-rose-600 hover:text-rose-700 font-semibold transition-colors duration-300"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Contactanos →
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}