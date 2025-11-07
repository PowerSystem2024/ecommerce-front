import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onAddToCart, onViewDetails, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse h-full">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl overflow-hidden h-full flex flex-col border border-white/20">
              <div className="aspect-square bg-white/10 flex-shrink-0" />
              <div className="p-6 space-y-4 flex-grow flex flex-col">
                <div className="h-4 bg-white/20 rounded" />
                <div className="h-3 bg-white/20 rounded w-3/4" />
                <div className="flex-grow" />
                <div className="h-6 bg-white/20 rounded w-1/2 flex-shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div 
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-12 h-12 text-[#CFCFCF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#E11D74] mb-2 font-['Quantico',_sans-serif] uppercase tracking-wide">
            No se encontraron productos
          </h3>
          <p className="text-[#CFCFCF] font-['Rajdhani',_sans-serif]">
            Intenta ajustar los filtros o buscar con otros términos
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <ProductCard 
            product={product} 
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
