import React from 'react'
import { motion } from 'framer-motion'

const equipo = [
  {
    name: 'Jorge Mathez',
    role: 'Desarrollador Full Stack',
    imageUrl: '/CardsPic/jorge.jpeg',
    githubUrl: 'https://github.com/Colifaa',
    linkedinUrl: 'https://www.linkedin.com/in/jorge-mathez/',
    description: 'Especialista en desarrollo backend y frontend'
  },
  {
    name: 'Lilith Chacon',
    role: 'Diseñadora UX/UI',
    imageUrl: '/CardsPic/lilieth.jpeg',
    githubUrl: 'https://github.com/lilieth10',
    linkedinUrl: 'https://www.linkedin.com/in/lilieth-chac%C3%B3n/',
    description: 'Experta en diseño centrado en el usuario'
  },
  {
    name: 'Nicolás Cruzate',
    role: 'Desarrollador Backend',
    imageUrl: '/CardsPic/nicolas.jpeg',
    githubUrl: 'https://github.com/NicooCruzate',
    linkedinUrl: 'https://www.linkedin.com/in/nicol%C3%A1s-cruzate-12a6a0355/',
    description: 'Especialista en arquitectura de servidores'
  },
  {
    name: 'Matías Fuentes',
    role: 'Desarrollador Frontend',
    imageUrl: '/CardsPic/matias.jpeg',
    githubUrl: 'https://github.com/MatiFuentess',
    linkedinUrl: 'https://www.linkedin.com/in/matias-fuentes-490420209/',
    description: 'Experto en tecnologías web modernas'
  },
  {
    name: 'Luca Perez',
    role: 'Desarrollador Full Stack',
    imageUrl: '/CardsPic/luca.png',
    githubUrl: 'https://github.com/lucaperez123',
    linkedinUrl: 'https://www.linkedin.com/in/luca-mariano-perez-189a53248/',
    description: 'Especialista en soluciones integrales'
  },
  {
    name: 'Morena Ruiz',
    role: 'Diseñadora UI',
    imageUrl: '/CardsPic/morena.jpeg',
    githubUrl: 'https://github.com/moreetf',
    linkedinUrl: 'https://www.linkedin.com/in/zoemorenaruiz/',
    description: 'Especialista en interfaces modernas y accesibles'
  },
  {
    name: 'Andrés Domínguez',
    role: 'Desarrollador Backend',
    imageUrl: '/CardsPic/andres.jpeg',
    githubUrl: 'https://github.com/AndyDmz',
    linkedinUrl: 'https://www.linkedin.com/in/andr%C3%A9snicol%C3%A1sdom%C3%ADnguezredondo/',
    description: 'Experto en APIs y bases de datos'
  },
  {
    name: 'Camila Álvarez',
    role: 'Desarrolladora Frontend',
    imageUrl: '/CardsPic/camila.jpeg',
    githubUrl: 'https://github.com/CamiAnz',
    linkedinUrl: 'https://linkedin.com',
    description: 'Especialista en React y experiencia de usuario'
  },
  {
    name: 'Guillermo Kondratiuk',
    role: 'Desarrollador Full Stack',
    imageUrl: '/CardsPic/guillermo.jpeg',
    githubUrl: 'https://github.com/GKondratiuk',
    linkedinUrl: 'https://www.linkedin.com/in/gkotiuk/',
    description: 'Experto en desarrollo de aplicaciones web'
  },
  {
    name: 'Santiago Navarrete',
    role: 'Desarrollador Backend',
    imageUrl: '/CardsPic/santiago.png',
    githubUrl: 'https://github.com/SantiagoNavarrete',
    linkedinUrl: 'https://www.linkedin.com/in/santiago-navarrete-romero-648610302/',
    description: 'Especialista en optimización y performance'
  },
  {
    name: 'Francisco Valdez',
    role: 'Desarrollador Frontend',
    imageUrl: '/CardsPic/francisco.png',
    githubUrl: 'https://github.com/archiiPOWA',
    linkedinUrl: 'https://linkedin.com',
    description: 'Experto en interfaces interactivas y responsivas'
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
    <section className="bg-[#0F0F10] py-20 sm:py-32 text-white">
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
            className="text-4xl font-light tracking-tight text-white sm:text-5xl mb-6"
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
            className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Somos estudiantes de la carrera de Programación de la UTN dedicados a crear soluciones digitales completas, abarcando tanto el desarrollo backend como frontend. Nos enfocamos en ofrecer productos modernos, accesibles y centrados en el usuario, aplicando buenas prácticas y un enfoque profesional para garantizar resultados de calidad en cada proyecto.
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
                className="relative bg-[#1a1a1b] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800"
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
                  <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-rose-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <motion.h3 
                    className="text-xl font-semibold text-white mb-2 group-hover:text-rose-400 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {person.name}
                  </motion.h3>
                  <motion.p 
                    className="text-rose-400 font-medium mb-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {person.role}
                  </motion.p>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">
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
                        href={person.githubUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-rose-400 transition-colors duration-300 p-2 rounded-full hover:bg-rose-500/10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="sr-only">GitHub</span>
                        <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </motion.a>
                    </li>
                    <li>
                      <motion.a 
                        href={person.linkedinUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-rose-400 transition-colors duration-300 p-2 rounded-full hover:bg-rose-500/10"
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
                  className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
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
            className="text-gray-400 mb-6 text-lg"
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