import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ShopHero() {
 
  const quickCategories = [
    { name: "Mujer", href: "/categoria/mujer", icon: "👗" },
    { name: "Hombre", href: "/categoria/hombre", icon: "👔" },
    { name: "Accesorios", href: "/categoria/accesorios", icon: "👜" },
    { name: "Ofertas", href: "/ofertas", icon: "🏷️" }
  ];

  return (
    <section className="relative py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Búsqueda principal */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-[#0F0F10] mb-4 font-['Orbitron',_sans-serif]">
            Tienda Online
          </h1>
          
         

          <p className="text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
            Encontrá lo que necesitás con nuestra amplia selección de productos
          </p>
        </motion.div>

        {/* Categorías rápidas */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {quickCategories.map((category, index) => (
            <motion.a
              key={category.name}
              href={category.href}
              className="group bg-white rounded-2xl p-6 text-center shadow-sm border border-[#2A2A2A]/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="font-semibold text-[#0F0F10] group-hover:text-[#E11D74] transition-colors font-['Quantico',_sans-serif]">
                {category.name}
              </h3>
            </motion.a>
          ))}
        </motion.div>

        {/* Información rápida */}
        <motion.div 
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
            <div className="w-10 h-10 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-[#0F0F10]">Envío Gratis</div>
              <div className="text-sm">En compras +$50.000</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
            <div className="w-10 h-10 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-[#0F0F10]">Calidad Garantizada</div>
              <div className="text-sm">Productos seleccionados</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
            <div className="w-10 h-10 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-[#0F0F10]">Atención 24/7</div>
              <div className="text-sm">Soporte personalizado</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
