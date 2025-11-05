import { motion } from "framer-motion"
import { Link } from 'react-router-dom'

const colecciones = [
  {
    name: "Mujer",
    href: '/categoria/mujer',
    imageSrc: 'https://i.pinimg.com/1200x/b6/4e/3a/b64e3aacc165b7b041e5fd5309245e0f.jpg',
    imageAlt: 'Mujer con estilo elegante y moderno',
  },
  {
    name: "Hombre",
    href: '/categoria/hombre',
    imageSrc: 'https://i.pinimg.com/736x/04/0f/20/040f2051d3493a9416cc2ee04948b413.jpg',
    imageAlt: 'Hombre con look urbano y casual',
  },
  {
    name: 'Accesorios',
    href: '/categoria/accesorios',
    imageSrc: 'https://i.pinimg.com/736x/a6/ee/bc/a6eebccbe86b8c55185618a1092a7b94.jpg',
    imageAlt: 'Accesorios de moda y complementos',
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

// Crear motion components con Link
const MotionLink = motion(Link);

export default function PromoSection() {
  return (
    <div className="relative bg-[#0F0F10] overflow-hidden">
      {/* Hero Background Section */}
      <div className="relative">
        {/* Background image for larger screens */}
        <div aria-hidden="true" className="absolute inset-0 hidden sm:flex sm:flex-col">
          <div className="relative w-full flex-1 bg-[#0F0F10]">
            <div className="absolute inset-0 overflow-hidden">
              <motion.img
                alt="Colección gótico-futurista"
                src="https://i.pinimg.com/1200x/9d/9e/e1/9d9ee1ef9722041a135d04713a2d016f.jpg"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-[#0F0F10]/90 to-black/80" />
          </div>
          <div className="h-32 w-full bg-[#0F0F10] md:h-40 lg:h-48" />
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto max-w-4xl px-6 pb-96 text-center sm:px-8 sm:pb-0 lg:px-12">
          {/* Background image for mobile */}
          <div aria-hidden="true" className="absolute inset-0 flex flex-col sm:hidden">
            <div className="relative w-full flex-1 bg-[#0F0F10]">
              <div className="absolute inset-0 overflow-hidden">
                <img
                  alt="Colección gótico-futurista móvil"
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
            </div>
            <div className="h-48 w-full bg-[#0F0F10]" />
          </div>

          {/* Hero Text */}
          <motion.div 
            className="relative py-32 sm:py-40 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.h1 
            className="text-5xl font-['Orbitron'] font-light tracking-widest text-white sm:text-7xl md:text-8xl mb-8 text-center w-full uppercase"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-row items-center justify-center gap-4">
            <span>fatal</span>
            <span className="font-bold bg-gradient-to-r from-[#E11D74] to-[#8B5CF6] bg-clip-text text-transparent">
            store
            </span>
            </div>
            </motion.h1>
            
            <motion.p 
              className="text-2xl sm:text-3xl text-[#CFCFCF] mb-12 max-w-2xl mx-auto font-light text-center leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Descubrí nuestra colección gótico-futurista donde la oscuridad se encuentra con la innovación. 
              Prendas sin género para expresar tu identidad más auténtica.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Collections Section */}
      <section aria-labelledby="collection-heading" className="relative -mt-96 sm:mt-0">
        <h2 id="collection-heading" className="sr-only">
          Nuestras Colecciones
        </h2>
        
        <motion.div 
          className="mx-auto grid max-w-md grid-cols-1 gap-8 px-6 sm:max-w-7xl sm:grid-cols-3 sm:gap-10 sm:px-8 lg:px-12"
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
              <MotionLink
                to={coleccion.href}
                className="block relative h-96 rounded-3xl bg-[#1A1A1A] shadow-2xl overflow-hidden sm:aspect-4/5 sm:h-auto border border-[#333333]"
                whileHover={{ y: -8, scale: 1.02 }}
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
                  
                  {/* Gradient Overlay Gótico-Futurista */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#0F0F10]/40 to-transparent" />
                  
                  {/* Hover Overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-[#E11D74]/10 via-transparent to-transparent group-hover:from-[#E11D74]/20 transition-colors duration-500"
                    initial={false}
                  />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-end rounded-3xl p-8">
                  <div className="w-full text-center flex flex-col items-center justify-end">
                    <motion.h3 
                      className="text-3xl font-['Orbitron'] font-bold text-white mb-6 group-hover:text-[#E11D74] transition-colors duration-300 w-full uppercase tracking-wider"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {coleccion.name}
                    </motion.h3>

                    {/* CTA Button */}
                    <motion.div 
                      className="flex items-center justify-center gap-4 w-full"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="text-white/90 font-medium text-lg group-hover:text-[#E11D74] transition-colors duration-300 tracking-wide">
                        Explorar colección
                      </span>
                      <motion.div
                        className="w-10 h-10 rounded-full bg-[#E11D74]/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#E11D74] transition-colors duration-300 border border-white/20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg 
                          className="w-5 h-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" 
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

                {/* Efecto de borde luminoso en hover */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#E11D74] to-[#8B5CF6] opacity-20 blur-sm"></div>
                </div>
              </MotionLink>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section - Botón de texto simple */}
        <motion.div 
          className="text-center mt-16 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <MotionLink
            to="/shop"
            className="inline-flex items-center justify-center gap-3 text-[#E11D74] no-underline font-orbitron text-xl font-bold hover:text-[#8B5CF6] transition-colors duration-300 tracking-wide cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Comenzar a Comprar
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MotionLink>
        </motion.div>
      </section>

      {/* Efectos de partículas futuristas */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#E11D74] rounded-full opacity-60 blur-sm animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-[#8B5CF6] rounded-full opacity-40 blur-sm animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-[#E11D74] rounded-full opacity-50 blur-sm animate-pulse delay-500"></div>
      </div>
    </div>
  )
}