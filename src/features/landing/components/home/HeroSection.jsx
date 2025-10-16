import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <motion.div 
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="pt-20 pb-80 sm:pt-32 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-6 sm:static sm:px-8 lg:px-12">
          <motion.div 
            className="sm:max-w-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl font-light tracking-tight text-gray-900 sm:text-7xl lg:text-8xl leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Estilo que
              <span className="block font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Trasciende
              </span>
            </motion.h1>
            <motion.p 
              className="mt-6 text-xl sm:text-2xl text-gray-600 leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Descubrí nuestra nueva colección de verano, diseñada para acompañarte 
              en cada momento especial con elegancia y comodidad.
            </motion.p>
          </motion.div>
          
          <div>
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {/* Grid de imágenes decorativas */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:translate-x-8 lg:-translate-y-1/2">
                  <div className="flex items-center space-x-4 lg:space-x-6">
                    <motion.div 
                      className="grid shrink-0 grid-cols-1 gap-y-4 lg:gap-y-6"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    >
                      <div className="h-56 w-40 overflow-hidden rounded-2xl sm:opacity-0 lg:opacity-100 shadow-xl">
                        <img
                          alt="Moda femenina elegante"
                          src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="h-56 w-40 overflow-hidden rounded-2xl shadow-xl">
                        <img
                          alt="Estilo urbano moderno"
                          src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="grid shrink-0 grid-cols-1 gap-y-4 lg:gap-y-6"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                    >
                      <div className="h-56 w-40 overflow-hidden rounded-2xl shadow-xl">
                        <img
                          alt="Accesorios de moda"
                          src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="h-56 w-40 overflow-hidden rounded-2xl shadow-xl">
                        <img
                          alt="Ropa casual cómoda"
                          src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="h-56 w-40 overflow-hidden rounded-2xl shadow-xl">
                        <img
                          alt="Tendencias actuales"
                          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="grid shrink-0 grid-cols-1 gap-y-4 lg:gap-y-6"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4, duration: 0.8 }}
                    >
                      <div className="h-56 w-40 overflow-hidden rounded-2xl shadow-xl">
                        <img
                          alt="Moda masculina"
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="h-56 w-40 overflow-hidden rounded-2xl shadow-xl">
                        <img
                          alt="Calzado de diseño"
                          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              <motion.a
                href="/catalogo"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-4 text-center font-medium text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
              >
                Explorar Colección
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}