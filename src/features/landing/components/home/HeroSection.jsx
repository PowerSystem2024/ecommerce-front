import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <motion.div 
      className="relative overflow-hidden bg-[#0F0F10] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="pt-20 pb-80 sm:pt-32 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div 
            className="sm:max-w-2xl font-rajdhani"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.h1 
              className="text-[70px] font-['Orbitron',_sans-serif] text-[#E11D74] mb-6 uppercase tracking-widest"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Estilo que desafía
              <span className="block text-4xl font-['Orbitron',_sans-serif] text-white mb-6 uppercase tracking-widest">
                lo convencional
              </span>
            </motion.h1>
            <motion.p 
              className="mt-6 text-xl sm:text-lg leading-relaxed text-[#CFCFCF] font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Sumergite en nuestra colección urbana alternativa: prendas que combinan audacia, identidad y un toque futurista.
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
                          src="https://i.pinimg.com/736x/16/8b/9d/168b9d2903af7873980cb3e36b85d8f0.jpg"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="h-56 w-40 overflow-hidden rounded-2xl shadow-xl">
                        <img
                          alt="Estilo urbano moderno"
                          src="https://i.pinimg.com/736x/45/b5/51/45b55141e014d6c0de9f85040b7fe76a.jpg"
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
                          src="https://i.pinimg.com/1200x/26/ab/d9/26abd96122c0e64b988db078cd1c0499.jpg"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="h-56 w-40 overflow-hidden rounded-2xl shadow-xl">
                        <img
                          alt="Ropa casual cómoda"
                          src="https://i.pinimg.com/736x/90/26/91/90269137cbe0ed5259ab70687abb6189.jpg"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="h-56 w-40 overflow-hidden rounded-2xl shadow-xl">
                        <img
                          alt="Tendencias actuales"
                          src="https://i.pinimg.com/1200x/18/d1/e7/18d1e7d414807a991f9cd6f77575a184.jpg"
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
                          src="https://i.pinimg.com/736x/cf/a2/e1/cfa2e1f3b318e3a26e29a5b4690eb199.jpg"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="h-56 w-40 overflow-hidden rounded-2xl shadow-xl">
                        <img
                          alt="Calzado de diseño"
                          src="https://i.pinimg.com/1200x/e5/f8/fa/e5f8faeefc665288c5985d97040387fb.jpg"
                          className="size-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}