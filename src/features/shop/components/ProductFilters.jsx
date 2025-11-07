import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ProductFilters({ filters, onFiltersChange, onSearch }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Negro", value: "negro" },
    { name: "Blanco", value: "blanco" },
    { name: "Gris", value: "gris" },
    { name: "Azul", value: "azul" },
    { name: "Rojo", value: "rojo" },
    { name: "Verde", value: "verde" },
    { name: "Rosa", value: "rosa" },
    { name: "Morado", value: "morado" },
    { name: "Violeta", value: "violeta" },
    { name: "Beige", value: "beige" },
    { name: "Naranja", value: "naranja" },
    { name: "Amarillo", value: "amarillo" }
  ];

  const getColorHex = (colorName) => {
    const colorMap = {
      'negro': '#000000',
      'blanco': '#FFFFFF',
      'gris': '#6B7280',
      'azul': '#3B82F6',
      'rojo': '#EF4444',
      'verde': '#10B981',
      'rosa': '#EC4899',
      'morado': '#8B5CF6',
      'violeta': '#8B5CF6',
      'beige': '#D4A574',
      'naranja': '#F97316',
      'amarillo': '#FBBF24'
    };
    return colorMap[colorName.toLowerCase()] || '#6B7280';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Búsqueda en tiempo real
    onSearch(value);
  };

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      size: "",
      color: "",
      minPrice: "",
      maxPrice: ""
    });
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="backdrop-blur-sm rounded-2xl shadow-sm border border-white/10 p-6 mb-8"
      style={{
        background: "linear-gradient(135deg, rgba(26, 26, 27, 0.9) 0%, rgba(15, 15, 16, 0.95) 50%, rgba(30, 10, 25, 0.9) 100%)"
      }}
    >
      {/* Título */}
      <h2 className="text-2xl lg:text-3xl font-bold text-[#E11D74] mb-6 font-['Orbitron',sans-serif] uppercase tracking-wider">
        Buscar y Filtrar
      </h2>
      
      {/* Header con búsqueda */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar productos..."
              className="w-full px-4 py-3 pl-12 pr-4 bg-[#0F0F10]/80 border border-white/20 rounded-full focus:ring-2 focus:ring-[#E11D74] focus:border-[#E11D74] transition-all duration-200 font-['Rajdhani',sans-serif] text-[#CFCFCF] placeholder:text-[#CFCFCF]/50"
            />
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#CFCFCF]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  onSearch("");
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#CFCFCF] hover:text-[#E11D74] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white rounded-full hover:from-[#6D28D9] hover:to-[#8B5CF6] transition-all duration-300 font-['Quantico',sans-serif] text-sm shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
            <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-white/20 text-[#CFCFCF] rounded-full hover:border-[#E11D74] hover:text-[#E11D74] hover:bg-[#E11D74]/10 transition-all duration-300 font-['Quantico',sans-serif] text-sm bg-[#0F0F10]/50"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Filtros expandibles */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
          {/* Filtro por talle */}
          <div>
            <label className="block text-sm font-semibold text-[#E11D74] mb-3 font-['Quantico',sans-serif] uppercase tracking-wide">
              Talle
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleFilterChange("size", filters.size === size ? "" : size)}
                  className={`px-3 py-2 text-sm rounded-full border transition-all duration-200 font-['Rajdhani',sans-serif] ${
                    filters.size === size
                      ? 'bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white border-transparent'
                      : 'bg-[#0F0F10]/80 text-[#CFCFCF] border-white/20 hover:border-[#E11D74] hover:text-[#E11D74]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por color */}
          <div>
            <label className="block text-sm font-semibold text-[#E11D74] mb-3 font-['Quantico',sans-serif] uppercase tracking-wide">
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleFilterChange("color", filters.color === color.value ? "" : color.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    filters.color === color.value
                      ? 'border-[#E11D74] scale-110 ring-2 ring-[#E11D74] ring-offset-2'
                      : 'border-white/40 hover:scale-110 hover:border-[#E11D74]'
                  }`}
                  style={{ backgroundColor: getColorHex(color.value) }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Filtro por precio */}
          <div>
            <label className="block text-sm font-semibold text-[#E11D74] mb-3 font-['Quantico',sans-serif] uppercase tracking-wide">
              Precio
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="w-full px-3 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#E11D74] focus:border-[#E11D74] text-sm font-['Rajdhani',sans-serif] bg-[#0F0F10]/80 text-[#CFCFCF] placeholder:text-[#CFCFCF]/50"
                />
                <span className="text-[#CFCFCF] font-['Rajdhani',sans-serif]">-</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="w-full px-3 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#E11D74] focus:border-[#E11D74] text-sm font-['Rajdhani',sans-serif] bg-[#0F0F10]/80 text-[#CFCFCF] placeholder:text-[#CFCFCF]/50"
                />
              </div>
              <div className="text-xs text-[#CFCFCF]/70 font-['Rajdhani',sans-serif]">
                Rango: $0 - $100.000
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
