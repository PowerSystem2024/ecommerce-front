import { motion } from "framer-motion";

const beneficios = [
  {
    name: 'Estilo Auténtico',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    description:
      'Creamos prendas que rompen con lo común. Diseños únicos que expresan quién sos sin decir una palabra.',
    color: 'from-[#E11D74] to-[#6D28D9]', // fucsia → violeta
  },
  {
    name: 'Inspirados en la Calle',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    description:
      'La moda urbana es nuestra esencia. Cada prenda nace del movimiento, la música y la cultura real.',
    color: 'from-[#8B5CF6] to-[#E11D74]', // lavanda → fucsia
  },
  {
    name: 'Creado Localmente',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    description:
      'Apostamos al diseño argentino. Producción ética y de calidad.',
    color: 'from-[#6D28D9] to-[#8B5CF6]', // violeta → lavanda
  },
  {
    name: 'Compromiso Sustentable',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
      </svg>
    ),
    description:
      'Comprometidos con el medio ambiente. Usamos materiales sustentables y packaging eco-friendly.',
    color: 'from-[#2A2A2A] to-[#CFCFCF]', // gris grafito → gris claro
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
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
              Somos Diferentes?
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