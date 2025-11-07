import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const images = [
  "https://i.pinimg.com/1200x/2b/04/a8/2b04a8efe5de289053ccf87daed3e096.jpg",
  "https://i.pinimg.com/736x/e0/43/ae/e043ae1e7d167670afebce951a8e5277.jpg",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80",
];

export default function Carrousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const length = images.length;
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      if (!mounted.current) return;
      setCurrent((p) => (p + 1) % length);
    }, 4500);
    return () => clearInterval(id);
  }, [paused, length]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + length) % length);
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [length]);

  const prev = () => setCurrent((c) => (c - 1 + length) % length);
  const next = () => setCurrent((c) => (c + 1) % length);

  // Ajusta este valor si tu navbar tiene otra altura (h-16 = 4rem)
  const NAV_HEIGHT_REM = 4; // 4rem = 64px

  return (
    <motion.section
      className="relative overflow-hidden select-none w-full"
      style={{
        width: "100%",
        marginLeft: 0,
        height: `calc(100vh - ${NAV_HEIGHT_REM}rem)`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >






      <motion.div
        className="flex h-full"
        animate={{ x: `calc(-100vw * ${current})` }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.7
        }}
      >
        {images.map((src, i) => (
          <motion.div
            key={i}
            className="shrink-0 w-screen h-full relative bg-gray-900"
            style={{ width: "100vw" }}
            initial={{ scale: 1.1 }}
            animate={{ scale: i === current ? 1 : 1.05 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={src}
              alt={`Colección de moda ${i + 1}`}
              loading="lazy"
              draggable={false}
              className="block w-full h-full object-cover object-center"
            />
            {/* Overlay minimalista */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none" />
          </motion.div>
        ))}
      </motion.div>

      {/* Controles minimalistas */}
      <div className="absolute inset-0 pointer-events-none z-40">
        <motion.div 
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 pointer-events-auto"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
            onClick={prev}
            aria-label="Imagen anterior"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </motion.button>
        </motion.div>

        <motion.div 
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 pointer-events-auto"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
            onClick={next}
            aria-label="Siguiente imagen"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Contenido central */}
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <motion.div 
          className="text-center text-white pointer-events-auto px-6 sm:px-8 max-w-3xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Moda que
            <span className="block font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Inspira
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-white/90 font-light leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Descubrí nuestra nueva colección de prendas únicas,
            <br className="hidden sm:block" />
            diseñadas para expresar tu estilo personal.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <motion.a
              href="/catalogo"
              className="inline-flex items-center justify-center bg-white text-gray-900 px-8 py-4 rounded-full font-medium shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Explorar Colección
            </motion.a>

            <motion.a
              href="/ofertas"
              className="inline-flex items-center justify-center border-2 border-white/80 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Ver Ofertas
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicadores minimalistas */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        {images.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir a imagen ${i + 1}`}
            className={`h-1.5 transition-all duration-300 rounded-full backdrop-blur-sm ${
              i === current 
                ? "w-8 bg-white shadow-lg" 
                : "w-1.5 bg-white/50 hover:bg-white/70"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </motion.div>

      <div className="sr-only" aria-live="polite">
        {`Slide ${current + 1} de ${length}`}
      </div>
    </motion.section>
  );
}  