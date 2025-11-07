import React from 'react'
import { motion as Motion } from 'framer-motion'
import Navbar from '../home/Navbar'

export default function AboutHero() {
  return (
    <Motion.div 
      className="bg-[#0F0F10] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className="absolute inset-x-0 top-0 z-50">
        <Navbar/>
      </header>
      
      <main>
        <div className="relative isolate">
          {/* Background Pattern */}
          <svg
            aria-hidden="true"
            className="hidden"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" width="100%" height="100%" strokeWidth={0} />
          </svg>
          
          {/* Gradient Background */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 left-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          >
            <div
              style={{
                clipPath:
                  'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
              }}
              className="aspect-801/1036 w-200.25 bg-gradient-to-tr from-rose-400 to-pink-400 opacity-30"
            />
          </div>
          
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pt-36 pb-32 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                {/* Content */}
                <Motion.div 
                  className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Motion.h1 
                    className="text-5xl font-light tracking-tight text-white sm:text-7xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Estamos cambiando la forma
                    <span className="block font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      de conectar con la moda
                    </span>
                  </Motion.h1>
                  
                  <Motion.p 
                    className="mt-8 text-lg font-medium text-gray-400 sm:max-w-md sm:text-xl/8 lg:max-w-none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    En Ropa Moderna, creemos que la moda es una forma de expresión personal. 
                    Nuestra misión es democratizar el estilo, ofreciendo prendas de calidad 
                    que te permitan expresar tu personalidad única.
                  </Motion.p>
                  
                  <Motion.div 
                    className="mt-10 flex items-center gap-x-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <Motion.a
                      href="/catalogo"
                      className="rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Explorar Colección
                    </Motion.a>
                    <Motion.a 
                      href="/contact" 
                      className="text-sm/6 font-semibold text-gray-200 hover:text-rose-400 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      Conocer más <span aria-hidden="true">→</span>
                    </Motion.a>
                  </Motion.div>
                </Motion.div>

                {/* Image Gallery */}
                <Motion.div 
                  className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {/* Right Column */}
                  <Motion.div 
                    className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-0 xl:pt-80"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Motion.div 
                      className="relative"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <img
                        alt="Moda elegante y sofisticada"
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80"
                        className="aspect-2/3 w-full rounded-2xl bg-gray-900/5 object-cover shadow-xl"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
                    </Motion.div>
                  </Motion.div>

                  {/* Middle Column */}
                  <Motion.div 
                    className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <Motion.div 
                      className="relative"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <img
                        alt="Estilo urbano moderno"
                        src="https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=400&q=80"
                        className="aspect-2/3 w-full rounded-2xl bg-gray-900/5 object-cover shadow-xl"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
                    </Motion.div>
                    
                    <Motion.div 
                      className="relative"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <img
                        alt="Tendencias actuales"
                        src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&q=80"
                        className="aspect-2/3 w-full rounded-2xl bg-gray-900/5 object-cover shadow-xl"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
                    </Motion.div>
                  </Motion.div>

                  {/* Left Column */}
                  <Motion.div 
                    className="w-44 flex-none space-y-8 pt-32 sm:pt-0"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  >
                    <Motion.div 
                      className="relative"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <img
                        alt="Accesorios de moda"
                        src="https://images.unsplash.com/photo-1670272504528-790c24957dda?auto=format&fit=crop&w=400&q=80"
                        className="aspect-2/3 w-full rounded-2xl bg-gray-900/5 object-cover shadow-xl"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
                    </Motion.div>
                    
                    <Motion.div 
                      className="relative"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <img
                        alt="Colección premium"
                        src="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?auto=format&fit=crop&w=400&q=80"
                        className="aspect-2/3 w-full rounded-2xl bg-gray-900/5 object-cover shadow-xl"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
                    </Motion.div>
                  </Motion.div>
                </Motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Motion.div>
  )
}