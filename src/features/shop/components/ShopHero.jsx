import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import productService from "../services/productService";

// Mapeo de iconos para categorías
const categoryIcons = {
  'Accesorios': '👜',
  'Buzos': '🧥',
  'Camperas': '🧥',
  'Conjuntos': '👗',
  'Pantalones': '👖',
  'Remeras': '👕',
  'Vestidos': '👗',
  'default': '🛍️'
};

export default function ShopHero({ onCategoryClick, selectedCategory = "" }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        const categoriesFromData = Array.isArray(response?.data) ? response.data : null;
        const categoriesFromRoot = Array.isArray(response?.categories) ? response.categories : null;
        const categoriesList = categoriesFromData || categoriesFromRoot || [];
        
        // Normalizar categorías
        const normalizedCategories = categoriesList.map(cat => ({
          _id: cat._id,
          name: cat.name || cat.title || '',
        })).filter(cat => cat.name); // Filtrar categorías sin nombre
        
        setCategories(normalizedCategories);
      } catch (err) {
        console.error('❌ Error al cargar categorías:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    if (onCategoryClick) {
      onCategoryClick(categoryName);
      // Hacer scroll hacia abajo donde están los productos
      setTimeout(() => {
        const productsSection = document.querySelector('[data-products-section]');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || categoryIcons.default;
  };

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
          <h1 className="text-3xl lg:text-4xl font-bold text-[#E11D74] mb-4 font-['Orbitron',sans-serif] uppercase tracking-wider">
            Tienda Online
          </h1>
          
         

          <p className="text-[#CFCFCF] font-['Rajdhani',sans-serif]">
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
          {/* Botón "Todos" para limpiar filtro */}
          <motion.button
            onClick={() => handleCategoryClick("")}
            className={`group rounded-2xl p-6 text-center shadow-sm border border-white/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer backdrop-blur-sm ${
              selectedCategory === "" 
                ? "bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] text-white border-[#8B5CF6]/50" 
                : "text-[#CFCFCF]"
            }`}
            style={selectedCategory === "" ? {} : {
              background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
            }}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
              🛍️
            </div>
            <h3 className={`font-semibold transition-colors font-['Quantico',sans-serif] ${
              selectedCategory === "" 
                ? "text-white group-hover:text-[#E11D74]" 
                : "text-[#CFCFCF] group-hover:text-[#E11D74]"
            }`}>
              Todos
            </h3>
          </motion.button>

          {loading ? (
            // Skeletons mientras carga (3 más para completar 4 arriba)
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="backdrop-blur-sm rounded-2xl p-6 text-center shadow-sm border border-white/10 animate-pulse"
                style={{
                  background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
                }}
              >
                <div className="text-4xl mb-3 bg-[#2A2A2A] rounded-full w-16 h-16 mx-auto"></div>
                <div className="h-4 bg-[#2A2A2A] rounded w-24 mx-auto"></div>
              </div>
            ))
          ) : categories.length > 0 ? (
            categories.slice(0, 7).map((category, index) => {
              const isSelected = selectedCategory === category.name;
              return (
                <motion.button
                  key={category._id || category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`group rounded-2xl p-6 text-center shadow-sm border border-white/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer backdrop-blur-sm ${
                    isSelected 
                      ? "bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] text-white border-[#8B5CF6]/50" 
                      : "text-[#CFCFCF]"
                  }`}
                  style={isSelected ? {} : {
                    background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
                  }}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (index + 1) * 0.1, duration: 0.5 }}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className={`font-semibold transition-colors font-['Quantico',sans-serif] ${
                    isSelected 
                      ? "text-white group-hover:text-[#E11D74]" 
                      : "text-[#CFCFCF] group-hover:text-[#E11D74]"
                  }`}>
                    {category.name}
                  </h3>
                </motion.button>
              );
            })
          ) : (
            // Si no hay categorías, mostrar mensaje
            <div className="col-span-full text-center text-[#CFCFCF] font-['Rajdhani',sans-serif]">
              No hay categorías disponibles
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
