import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";

// Datos simulados de productos
const mockProducts = [
  {
    id: 1,
    name: "Vestido Elegante Negro",
    description: "Perfecto para ocasiones especiales con un diseño moderno y sofisticado",
    price: 45000,
    originalPrice: 55000,
    category: "Mujer",
    size: "M",
    color: "#000000",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    stock: 12,
    discount: 18
  },
  {
    id: 2,
    name: "Camisa Casual Blanca",
    description: "Comodidad y estilo para el día a día con materiales premium",
    price: 25000,
    category: "Hombre",
    size: "L",
    color: "#FFFFFF",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    stock: 8
  },
  {
    id: 3,
    name: "Pantalón Moderno Gris",
    description: "Corte perfecto y materiales premium para un look profesional",
    price: 35000,
    originalPrice: 42000,
    category: "Hombre",
    size: "L",
    color: "#6B7280",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    stock: 15,
    discount: 17
  },
  {
    id: 4,
    name: "Blusa Rosa Elegante",
    description: "Detalles únicos que marcan la diferencia en tu guardarropa",
    price: 28000,
    category: "Mujer",
    size: "S",
    color: "#EC4899",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    stock: 6
  },
  {
    id: 5,
    name: "Chaqueta Azul Deportiva",
    description: "Estilo deportivo con tecnología de última generación",
    price: 52000,
    category: "Hombre",
    size: "XL",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80",
    rating: 4.5,
    stock: 10
  },
  {
    id: 6,
    name: "Falda Verde Vintage",
    description: "Estilo retro con un toque moderno para ocasiones especiales",
    price: 32000,
    originalPrice: 40000,
    category: "Mujer",
    size: "M",
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    stock: 7,
    discount: 20
  },
  {
    id: 7,
    name: "Reloj Púrpura Premium",
    description: "Accesorio elegante que complementa cualquier outfit",
    price: 18000,
    category: "Accesorios",
    size: "Único",
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    stock: 25
  },
  {
    id: 8,
    name: "Zapatos Rojos Clásicos",
    description: "Calzado de calidad superior para el hombre moderno",
    price: 65000,
    originalPrice: 80000,
    category: "Hombre",
    size: "42",
    color: "#EF4444",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    stock: 5,
    discount: 19
  }
];

export default function ProductsSection({ initialSearch = "" }) {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [filters, setFilters] = useState({
    category: "Todos",
    size: "",
    color: "",
    minPrice: "",
    maxPrice: ""
  });

  // Función para filtrar productos
  const filterProducts = (productsToFilter, currentFilters, searchTerm = "") => {
    return productsToFilter.filter(product => {
      // Filtro por búsqueda
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro por categoría
      if (currentFilters.category !== "Todos" && product.category !== currentFilters.category) {
        return false;
      }

      // Filtro por talle
      if (currentFilters.size && product.size !== currentFilters.size) {
        return false;
      }

      // Filtro por color
      if (currentFilters.color && product.color !== currentFilters.color) {
        return false;
      }

      // Filtro por precio
      if (currentFilters.minPrice && product.price < parseInt(currentFilters.minPrice)) {
        return false;
      }
      if (currentFilters.maxPrice && product.price > parseInt(currentFilters.maxPrice)) {
        return false;
      }

      return true;
    });
  };

  // Manejar cambios en filtros
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    const filtered = filterProducts(products, newFilters);
    setFilteredProducts(filtered);
  };

  // Manejar búsqueda
  const handleSearch = (searchTerm) => {
    const filtered = filterProducts(products, filters, searchTerm);
    setFilteredProducts(filtered);
  };

  // Agregar al carrito
  const handleAddToCart = (product) => {
    setCartCount(prev => prev + 1);
    // Aquí podrías integrar con un contexto global o estado de carrito
    console.log(`Agregado al carrito: ${product.name}`);
  };

  // Simular carga inicial
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Manejar búsqueda inicial del Hero
  useEffect(() => {
    if (initialSearch) {
      const filtered = filterProducts(products, filters, initialSearch);
      setFilteredProducts(filtered);
    }
  }, [initialSearch, products, filters]);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header de la sección */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-light text-[#0F0F10] mb-4 font-['Orbitron',_sans-serif]">
            Todos los
            <span className="block font-bold bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] bg-clip-text text-transparent">
              Productos
            </span>
          </h2>
          <p className="text-xl text-[#2A2A2A] max-w-2xl mx-auto font-['Rajdhani',_sans-serif]">
            Descubrí nuestra colección completa de prendas y accesorios
          </p>
        </motion.div>

        {/* Filtros */}
        <ProductFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
        />

        {/* Información de resultados */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-[#2A2A2A] font-['Rajdhani',_sans-serif]">
              Mostrando {filteredProducts.length} de {products.length} productos
            </span>
            {cartCount > 0 && (
              <span className="bg-[#6D28D9] text-white px-3 py-1 rounded-full text-sm font-semibold font-['Quantico',_sans-serif]">
                {cartCount} en carrito
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[#2A2A2A] font-['Rajdhani',_sans-serif] text-sm">Ordenar por:</span>
            <select className="px-3 py-2 border border-[#2A2A2A]/20 rounded-lg focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent text-sm font-['Rajdhani',_sans-serif]">
              <option value="relevance">Relevancia</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Valorados</option>
              <option value="newest">Más Recientes</option>
            </select>
          </div>
        </div>

        {/* Grid de productos */}
        <ProductGrid 
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          loading={loading}
        />

        {/* Paginación (opcional) */}
        {filteredProducts.length > 0 && (
          <motion.div 
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-[#2A2A2A]/20 text-[#2A2A2A] rounded-lg hover:bg-[#6D28D9] hover:text-white transition-all duration-300 font-['Rajdhani',_sans-serif]">
                Anterior
              </button>
              <span className="px-4 py-2 bg-[#6D28D9] text-white rounded-lg font-semibold font-['Quantico',_sans-serif]">
                1
              </span>
              <button className="px-4 py-2 border border-[#2A2A2A]/20 text-[#2A2A2A] rounded-lg hover:bg-[#6D28D9] hover:text-white transition-all duration-300 font-['Rajdhani',_sans-serif]">
                Siguiente
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
