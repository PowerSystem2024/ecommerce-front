import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Footer from '../components/home/Footer'
import AboutHero from '../components/about/AboutHero'
import AboutStats from '../components/about/AboutStats'
import ExponsorAbout from '../components/about/ExponsorAbout'
import TeamSection from '../components/home/TeamSection'

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
}

function AboutPage() {
  const location = useLocation();

  useEffect(() => {
    // Cuando se carga la página, siempre comenzar desde arriba
    window.scrollTo(0, 0);
    
    // Si hay un hash #about, después de un pequeño delay hacer scroll a la sección
    if (location.hash === '#about') {
      setTimeout(() => {
        const section = document.querySelector('#about');
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }, [location]);
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full overflow-x-hidden bg-[#0F0F10] text-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AboutHero/>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AboutStats/>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <ExponsorAbout/>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        id="about"
      >
        <TeamSection/>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Footer/>
      </motion.div>
    </motion.div>
  )
}

export default AboutPage