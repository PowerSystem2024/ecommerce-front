import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

const beneficios = [
  {
    name: 'Estilo Auténtico',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    description: 'Creamos prendas que rompen con lo común. Diseños únicos que expresan quién sos sin decir una palabra.',
    color: 'from-[#E11D74] to-[#6D28D9]'
  },
  {
    name: 'Inspirados en la calle',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description: 'La moda urbana es nuestra esencia. Cada prenda nace del movimiento, la música y la cultura real.',
    color: 'from-[#8B5CF6] to-[#E11D74]'
  },
  {
    name: 'Creado Localmente',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description: 'Apostamos al diseño argentino. Producción ética y de calidad.',
    color: 'from-[#6D28D9] to-[#8B5CF6]'
  },
  {
    name: 'Compromiso Sustentable',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
      </svg>
    ),
    description: 'Comprometidos con el medio ambiente. Usamos materiales sustentables y packaging eco-friendly.',
    color: 'from-[#E11D74] to-[#6D28D9]'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Incentives() {
  return (
    <section className="bg-[#0F0F10] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl font-orbitron uppercase tracking-wider mb-4 text-white">
            ¿Por qué 
            <span className="block font-orbitron font-bold bg-gradient-to-r from-[#E11D74] to-[#6D28D9] bg-clip-text text-transparent">
              somos diferentes?
            </span>
          </h2>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {beneficios.map((beneficio) => (
            <motion.div
              key={beneficio.name}
              variants={itemVariants}
              className="group relative"
            >
              <div className="flex items-start space-x-4">
                {/* Icon Container */}
                <motion.div
                  className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${beneficio.color} flex items-center justify-center text-white shadow-[0_0_20px_rgba(225,29,116,0.5)]`}
                  whileHover={{ scale: 1.1, rotate: 5, boxShadow: "0 0 30px rgba(225,29,116,0.8)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {beneficio.icon}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <motion.h3
                    className="text-xl font-orbitron uppercase text-white mb-3 group-hover:text-[#E11D74] transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {beneficio.name}
                  </motion.h3>
                  <p className="text-rajdhani text-[#CFCFCF] leading-relaxed">
                    {beneficio.description}
                  </p>
                </div>
              </div>

              {/* Decorative Glow */}
              <motion.div
                className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 -z-10"
                style={{ background: "linear-gradient(135deg, #E11D74, #6D28D9, #8B5CF6)" }}
                initial={false}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.div>
          ))}
        </motion.div>


      </div>
    </section>
  );
}