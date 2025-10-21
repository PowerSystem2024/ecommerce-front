import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ProductFilters({ filters, onFiltersChange, onSearch }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Todos", "Mujer", "Hombre", "Accesorios", "Ofertas"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Negro", value: "#000000" },
    { name: "Blanco", value: "#FFFFFF" },
    { name: "Gris", value: "#6B7280" },
    { name: "Azul", value: "#3B82F6" },
    { name: "Rojo", value: "#EF4444" },
    { name: "Verde", value: "#10B981" },
    { name: "Rosa", value: "#EC4899" },
    { name: "Púrpura", value: "#8B5CF6" }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: "Todos",
      size: "",
      color: "",
      minPrice: "",
      maxPrice: ""
    });
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#2A2A2A]/10 p-6 mb-8">
      {/* Header con búsqueda */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full px-4 py-3 pl-12 pr-4 bg-[#2A2A2A]/5 border border-[#2A2A2A]/20 rounded-full focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent transition-all duration-200 font-['Rajdhani',_sans-serif]"
            />
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2A2A2A]" 
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#2A2A2A] hover:text-[#E11D74] transition-colors"
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
            className="flex items-center gap-2 px-4 py-2 bg-[#0F0F10] text-white rounded-full hover:bg-[#E11D74] transition-all duration-300 font-['Quantico',_sans-serif] text-sm"
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
            className="px-4 py-2 border border-[#2A2A2A] text-[#2A2A2A] rounded-full hover:border-[#E11D74] hover:text-[#E11D74] transition-all duration-300 font-['Quantico',_sans-serif] text-sm"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-[#2A2A2A]/10">
          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-semibold text-[#0F0F10] mb-3 font-['Quantico',_sans-serif]">
              Categoría
            </label>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="w-4 h-4 text-[#6D28D9] border-[#2A2A2A] focus:ring-[#6D28D9]"
                  />
                  <span className="text-sm text-[#2A2A2A] font-['Rajdhani',_sans-serif]">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filtro por talle */}
          <div>
            <label className="block text-sm font-semibold text-[#0F0F10] mb-3 font-['Quantico',_sans-serif]">
              Talle
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleFilterChange("size", filters.size === size ? "" : size)}
                  className={`px-3 py-2 text-sm rounded-full border transition-all duration-200 font-['Rajdhani',_sans-serif] ${
                    filters.size === size
                      ? 'bg-[#6D28D9] text-white border-[#6D28D9]'
                      : 'bg-white text-[#2A2A2A] border-[#2A2A2A] hover:border-[#E11D74] hover:text-[#E11D74]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por color */}
          <div>
            <label className="block text-sm font-semibold text-[#0F0F10] mb-3 font-['Quantico',_sans-serif]">
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleFilterChange("color", filters.color === color.value ? "" : color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    filters.color === color.value
                      ? 'border-[#6D28D9] scale-110'
                      : 'border-[#2A2A2A] hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Filtro por precio */}
          <div>
            <label className="block text-sm font-semibold text-[#0F0F10] mb-3 font-['Quantico',_sans-serif]">
              Precio
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="w-full px-3 py-2 border border-[#2A2A2A]/20 rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent text-sm font-['Rajdhani',_sans-serif]"
                />
                <span className="text-[#2A2A2A] font-['Rajdhani',_sans-serif]">-</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="w-full px-3 py-2 border border-[#2A2A2A]/20 rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent text-sm font-['Rajdhani',_sans-serif]"
                />
              </div>
              <div className="text-xs text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
                Rango: $0 - $100.000
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
