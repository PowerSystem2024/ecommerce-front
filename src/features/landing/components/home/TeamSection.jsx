import React from 'react'
import { motion } from 'framer-motion'

const equipo = [
  {
    name: 'María González',
    role: 'Diseñadora Senior',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80',
    xUrl: '#',
    linkedinUrl: '#',
    description: 'Especialista en diseño de moda y tendencias'
  },
  {
    name: 'Carlos Mendoza',
    role: 'Diseñador Principal',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    xUrl: '#',
    linkedinUrl: '#',
    description: 'Experto en estilo urbano y casual'
  },
  {
    name: 'Ana Rodríguez',
    role: 'VP, Experiencia de Usuario',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    xUrl: '#',
    linkedinUrl: '#',
    description: 'Líder en estrategia de marca y UX'
  },
  {
    name: 'Laura Martín',
    role: 'VP, Recursos Humanos',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    xUrl: '#',
    linkedinUrl: '#',
    description: 'Especialista en desarrollo de talento'
  },
  {
    name: 'Diego Fernández',
    role: 'Desarrollador Senior',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    xUrl: '#',
    linkedinUrl: '#',
    description: 'Experto en tecnologías web modernas'
  },
  {
    name: 'Sofía Bell',
    role: 'Copywriter Junior',
    imageUrl: 'https://images.unsplash.com/photo-1509783236416-c9ad59bae472?auto=format&fit=crop&w=400&q=80',
    xUrl: '#',
    linkedinUrl: '#',
    description: 'Especialista en contenido y comunicación'
  },
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

export default function TeamSection() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Conocé a nuestro
            <span className="block font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Equipo
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Somos un grupo dinámico de profesionales apasionados por la moda y comprometidos 
            con brindar la mejor experiencia a nuestros clientes.
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        <motion.ul
          role="list"
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {equipo.map((person, index) => (
            <motion.li 
              key={person.name} 
              variants={itemVariants}
              className="group"
            >
              <motion.div 
                className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Image Container */}
                <div className="relative mb-6">
                  <motion.img
                    alt={person.name}
                    src={person.imageUrl}
                    className="mx-auto w-32 h-32 rounded-full object-cover shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                  
                  {/* Decorative Ring */}
                  <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-rose-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <motion.h3 
                    className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {person.name}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-rose-600 font-medium mb-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {person.role}
                  </motion.p>
                  
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {person.description}
                  </p>

                  {/* Social Links */}
                  <motion.ul 
                    role="list" 
                    className="flex justify-center gap-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <li>
                      <motion.a 
                        href={person.xUrl} 
                        className="text-gray-400 hover:text-rose-500 transition-colors duration-300 p-2 rounded-full hover:bg-rose-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="sr-only">X (Twitter)</span>
                        <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" className="w-5 h-5">
                          <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
                        </svg>
                      </motion.a>
                    </li>
                    <li>
                      <motion.a 
                        href={person.linkedinUrl} 
                        className="text-gray-400 hover:text-rose-500 transition-colors duration-300 p-2 rounded-full hover:bg-rose-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="sr-only">LinkedIn</span>
                        <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" className="w-5 h-5">
                          <path
                            d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                            clipRule="evenodd"
                            fillRule="evenodd"
                          />
                        </svg>
                      </motion.a>
                    </li>
                  </motion.ul>
                </div>

                {/* Hover Effect Background */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  initial={false}
                />
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.p 
            className="text-gray-600 mb-6 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            ¿Querés formar parte de nuestro equipo?
          </motion.p>
          <motion.a
            href="/trabajos"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Ver Oportunidades
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}