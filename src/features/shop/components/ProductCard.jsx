import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdding(true);
    // Simular delay de agregado al carrito
    await new Promise(resolve => setTimeout(resolve, 500));
    onAddToCart(product);
    setIsAdding(false);
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <motion.div
      className="group backdrop-blur-sm rounded-2xl shadow-sm border border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative cursor-pointer flex flex-col h-full"
      style={{
        background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Imagen del producto */}
      <div className="aspect-square relative overflow-hidden flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #0F0F10 0%, #1A0A15 100%)"
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Overlay con efecto de brillo */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Badge de categoría */}
        <div className="absolute top-4 left-4">
          <span className="bg-[#0F0F10]/90 text-white px-3 py-1 rounded-full text-xs font-semibold font-['Quantico',_sans-serif] backdrop-blur-sm">
            {product.category}
          </span>
        </div>

        {/* Badge de oferta si aplica */}
        {product.discount && (
          <div className="absolute top-4 right-4">
            <span className="bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] text-white px-3 py-1 rounded-full text-xs font-semibold font-['Quantico',_sans-serif]">
              -{product.discount}%
            </span>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6 flex flex-col flex-grow">
       
        <div className="mb-3 flex-grow">
          <h3 className="font-semibold text-[#E11D74] mb-1 group-hover:text-[#6D28D9] transition-colors font-['Quantico',_sans-serif] text-lg line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
          <p className="text-[#CFCFCF] text-sm font-['Rajdhani',_sans-serif] line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
        </div>

        {/* Información adicional */}
        <div className="flex items-center justify-between mb-4 text-xs text-[#CFCFCF] font-['Rajdhani',_sans-serif] flex-shrink-0">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold">
              {product.reviewsCount > 0 && product.averageRating ? product.averageRating.toFixed(1) : '0'}
            </span>
            {product.reviewsCount !== undefined && product.reviewsCount > 0 && (
              <span className="text-[#CFCFCF]/70">({product.reviewsCount})</span>
            )}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {product.stock} disponibles
          </span>
        </div>

        {/* Precio y botón */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#E11D74] font-['Orbitron',_sans-serif]">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-[#CFCFCF]/60 line-through font-['Rajdhani',_sans-serif]">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          
        </div>
      </div>
    </motion.div>
  );
}
