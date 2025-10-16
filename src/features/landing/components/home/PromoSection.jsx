import { motion } from "framer-motion"

const colecciones = [
  {
    name: "Mujer",
    href: '/categoria/mujer',
    imageSrc: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Mujer con estilo elegante y moderno',
    description: 'Elegancia y sofisticación'
  },
  {
    name: "Hombre",
    href: '/categoria/hombre',
    imageSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Hombre con look urbano y casual',
    description: 'Estilo urbano y versátil'
  },
  {
    name: 'Accesorios',
    href: '/categoria/accesorios',
    imageSrc: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Accesorios de moda y complementos',
    description: 'Complementos únicos'
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
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

export default function PromoSection() {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Hero Background Section */}
      <div className="relative">
        {/* Background image for larger screens */}
        <div aria-hidden="true" className="absolute inset-0 hidden sm:flex sm:flex-col">
          <div className="relative w-full flex-1 bg-gray-900">
            <div className="absolute inset-0 overflow-hidden">
              <motion.img
                alt="Colección de temporada"
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
          </div>
          <div className="h-32 w-full bg-white md:h-40 lg:h-48" />
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto max-w-4xl px-6 pb-96 text-center sm:px-8 sm:pb-0 lg:px-12">
          {/* Background image for mobile */}
          <div aria-hidden="true" className="absolute inset-0 flex flex-col sm:hidden">
            <div className="relative w-full flex-1 bg-gray-900">
              <div className="absolute inset-0 overflow-hidden">
                <img
                  alt="Colección de temporada móvil"
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
            </div>
            <div className="h-48 w-full bg-white" />
          </div>

          {/* Hero Text */}
          <motion.div 
            className="relative py-32 sm:py-40"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.h1 
              className="text-4xl font-light tracking-tight text-white sm:text-6xl md:text-7xl mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Rebajas de
              <span className="block font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                Temporada
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Hasta 50% de descuento en prendas seleccionadas. 
              Renová tu guardarropa con las mejores ofertas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.a
                href="/ofertas"
                className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 px-8 py-4 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Ver Ofertas
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Collections Section */}
      <section aria-labelledby="collection-heading" className="relative -mt-96 sm:mt-0">
        <h2 id="collection-heading" className="sr-only">
          Nuestras Colecciones
        </h2>
        
        <motion.div 
          className="mx-auto grid max-w-md grid-cols-1 gap-6 px-6 sm:max-w-7xl sm:grid-cols-3 sm:gap-8 sm:px-8 lg:px-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {colecciones.map((coleccion, index) => (
            <motion.div
              key={coleccion.name}
              variants={itemVariants}
              className="group relative"
            >
              <motion.a
                href={coleccion.href}
                className="block relative h-96 rounded-3xl bg-white shadow-xl overflow-hidden sm:aspect-4/5 sm:h-auto"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Image Container */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <motion.div 
                    className="absolute inset-0 overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <img 
                      alt={coleccion.imageAlt} 
                      src={coleccion.imageSrc} 
                      className="w-full h-full object-cover" 
                    />
                  </motion.div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Hover Overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/10 transition-colors duration-300"
                    initial={false}
                  />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-end rounded-3xl p-8">
                  <div className="w-full">
                    <motion.p 
                      className="text-sm text-white/80 mb-2 font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {coleccion.description}
                    </motion.p>
                    
                    <motion.h3 
                      className="text-2xl font-bold text-white mb-4 group-hover:text-rose-200 transition-colors duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {coleccion.name}
                    </motion.h3>

                    {/* CTA Button */}
                    <motion.div 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="text-white/90 font-medium group-hover:text-rose-200 transition-colors duration-300">
                        Explorar colección
                      </span>
                      <motion.div
                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg 
                          className="w-4 h-4 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="text-center mt-16 px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <p className="text-gray-600 mb-6 text-lg">
            ¿No encontrás lo que buscás?
          </p>
          <motion.a
            href="/catalogo"
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold text-lg transition-colors duration-300"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Ver catálogo completo
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </section>
    </div>
  )
}