import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";
import ProductDetail from "./ProductDetail";
import productService from "../services/productService";

export default function ProductsSection({ initialSearch = "", initialCategory = "" }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: initialCategory || "Todos",
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
      if (currentFilters.size) {
        const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
        // Verificar si el producto tiene el talle seleccionado (puede ser string o objeto)
        const hasSize = productSizes.some(size => {
          if (typeof size === 'string') {
            return size.toUpperCase() === currentFilters.size.toUpperCase();
          }
          return size.name?.toUpperCase() === currentFilters.size.toUpperCase();
        });
        if (!hasSize) {
          return false;
        }
      }

      // Filtro por color
      if (currentFilters.color) {
        const productColors = Array.isArray(product.colors) ? product.colors : [];
        // Verificar si el producto tiene el color seleccionado
        const hasColor = productColors.some(color => {
          if (typeof color === 'string') {
            return color.toLowerCase() === currentFilters.color.toLowerCase();
          }
          return color.name?.toLowerCase() === currentFilters.color.toLowerCase() || 
                 color.toLowerCase() === currentFilters.color.toLowerCase();
        });
        if (!hasColor) {
          return false;
        }
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
    setCurrentPage(1); // Resetear a página 1 cuando cambian los filtros
    const filtered = filterProducts(products, newFilters);
    setFilteredProducts(filtered);
  };

  // Manejar búsqueda
  const handleSearch = (searchTerm) => {
    setCurrentPage(1); // Resetear a página 1 cuando se busca
    const filtered = filterProducts(products, filters, searchTerm);
    setFilteredProducts(filtered);
  };

  // Agregar al carrito
  const handleAddToCart = (product) => {
    setCartCount(prev => prev + 1);
    // Aquí podrías integrar con un contexto global o estado de carrito
    // Producto agregado al carrito
  };

  // Ver detalles del producto
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  // Cerrar modal de detalles
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  // Cargar categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        const categoriesFromData = Array.isArray(response?.data) ? response.data : null;
        const categoriesFromRoot = Array.isArray(response?.categories) ? response.categories : null;
        const categoriesList = categoriesFromData || categoriesFromRoot || [];
        
        // Crear un mapa de IDs de categoría a nombres
        const categoriesMap = {};
        categoriesList.forEach(cat => {
          if (cat._id) {
            categoriesMap[cat._id] = cat.name || cat.title || '';
          }
        });
        
        setCategories(categoriesMap);
      } catch (err) {
        console.error('❌ Error al cargar categorías:', err);
        setCategories({});
      }
    };
    
    fetchCategories();
  }, []);

  // Cargar productos desde la API
  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Traer todos los productos activos usando paginación
        // El límite máximo es 100, así que hacemos múltiples requests si es necesario
        let allProducts = [];
        let currentPage = 1;
        const limit = 100; // Máximo permitido por el backend
        let hasMore = true;
        
        while (hasMore && !controller.signal.aborted) {
          const params = new URLSearchParams();
          params.append('isActive', 'true');
          params.append('page', String(currentPage));
          params.append('limit', String(limit));
          
          const endpoint = `/products?${params.toString()}`;
          const response = await productService.makeRequest(endpoint, { 
            method: 'GET', 
            signal: controller.signal 
          });
          
          // Normalizar respuesta igual que en admin
          const itemsFromStd = Array.isArray(response?.data?.products) ? response.data.products : null;
          const itemsFromDataItems = Array.isArray(response?.data?.items) ? response.data.items : null;
          const itemsFromData = Array.isArray(response?.data) ? response.data : null;
          const itemsFromProducts = Array.isArray(response?.products) ? response.products : null;
          const itemsFromItems = Array.isArray(response?.items) ? response.items : null;
          const items = itemsFromStd || itemsFromDataItems || itemsFromData || itemsFromProducts || itemsFromItems || [];
          
          allProducts = [...allProducts, ...items];
          
          // Verificar si hay más páginas
          const totalFromStd = typeof response?.data?.pagination?.totalProducts === 'number' ? response.data.pagination.totalProducts : null;
          const totalFromData = typeof response?.data?.total === 'number' ? response.data.total : null;
          const totalFromRoot = typeof response?.total === 'number' ? response.total : null;
          const total = totalFromStd || totalFromData || totalFromRoot || allProducts.length;
          
          // Si obtenemos menos productos que el límite o alcanzamos el total, no hay más páginas
          hasMore = items.length === limit && allProducts.length < total;
          currentPage++;
        }
        
        // Normalizar los productos para que coincidan con el formato esperado
        const normalizedProducts = allProducts.map(product => {
          // Obtener el nombre de la categoría usando el mapa de categorías
          let categoryName = 'Sin categoría';
          if (product.category) {
            if (typeof product.category === 'object' && product.category._id) {
              // Si category es un objeto con _id, buscar en el mapa
              categoryName = categories[product.category._id] || product.category.name || product.category.title || 'Sin categoría';
            } else if (typeof product.category === 'object' && product.category.$oid) {
              // Si category es un objeto con $oid (formato MongoDB)
              categoryName = categories[product.category.$oid] || product.category.name || product.category.title || 'Sin categoría';
            } else if (typeof product.category === 'string') {
              // Si category es un string (ID), buscar en el mapa
              categoryName = categories[product.category] || 'Sin categoría';
            } else if (product.category.name) {
              // Si category tiene nombre directamente
              categoryName = product.category.name;
            }
          }
          
          return {
            id: product._id,
            _id: product._id,
            name: product.name || categoryName,
            description: product.description || `Producto de ${categoryName}`,
            price: product.price || 0,
            originalPrice: product.originalPrice,
            category: categoryName,
            image: product.images?.[0] || 'https://via.placeholder.com/400',
            images: product.images || [],
            rating: product.averageRating || 0,
            stock: product.stock || 0,
            colors: product.colors || [],
            sizes: product.sizes || [],
            discount: product.discount,
            sku: product.sku,
            tags: product.tags || []
          };
        });
        
        setProducts(normalizedProducts);
        setFilteredProducts(normalizedProducts);
      } catch (err) {
        if (err?.name === 'AbortError') {
          return; // Ignorar errores de abort
        }
        console.error('❌ Error al cargar productos:', err);
        setError(err.message || 'Error al cargar productos');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
    return () => controller.abort();
  }, [categories]);

  // Manejar búsqueda inicial del Hero
  useEffect(() => {
    if (initialSearch) {
      setCurrentPage(1); // Resetear a página 1 cuando hay búsqueda inicial
      const filtered = filterProducts(products, filters, initialSearch);
      setFilteredProducts(filtered);
    }
  }, [initialSearch, products, filters]);

  // Manejar cambio de categoría inicial
  useEffect(() => {
    // Si initialCategory está vacío, significa que se limpió el filtro
    setFilters(prev => ({ ...prev, category: initialCategory || "Todos" }));
    setCurrentPage(1); // Resetear a página 1 cuando cambia la categoría
  }, [initialCategory]);

  // Aplicar filtros cuando cambian los productos o filtros
  useEffect(() => {
    const filtered = filterProducts(products, filters, initialSearch);
    setFilteredProducts(filtered);
  }, [products, filters, initialSearch]);

  // Calcular productos paginados y total de páginas
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Funciones de navegación
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  return (
    <section className="py-16" data-products-section>
      <div className="max-w-7xl mx-auto px-6">

        {/* Mensaje de error si falla la carga */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-800 font-['Rajdhani',_sans-serif]">
              ⚠️ {error}
            </p>
          </motion.div>
        )}

        {/* Filtros */}
        <ProductFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
        />

        {/* Información de resultados */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-[#CFCFCF] font-['Rajdhani',_sans-serif]">
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} productos
            </span>
            {cartCount > 0 && (
              <span className="bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white px-3 py-1 rounded-full text-sm font-semibold font-['Quantico',_sans-serif] shadow-lg">
                {cartCount} en carrito
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[#CFCFCF] font-['Rajdhani',_sans-serif] text-sm">Ordenar por:</span>
            <select className="px-3 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#E11D74] focus:border-[#E11D74] text-sm font-['Rajdhani',_sans-serif] bg-[#0F0F10]/80 text-[#CFCFCF]">
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
          products={paginatedProducts}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
          loading={loading}
        />

        {/* Modal de detalle del producto */}
        <ProductDetail
          product={selectedProduct}
          open={isDetailOpen}
          onClose={handleCloseDetail}
        />

        {/* Paginación */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <motion.div 
            className="flex justify-center items-center gap-2 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button 
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 border border-white/20 text-[#CFCFCF] rounded-lg transition-all duration-300 font-['Rajdhani',_sans-serif] bg-[#0F0F10]/80 ${
                currentPage === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gradient-to-r hover:from-[#E11D74] hover:to-[#6D28D9] hover:text-white hover:border-transparent'
              }`}
            >
              Anterior
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Mostrar solo algunas páginas alrededor de la actual
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold font-['Quantico',_sans-serif] transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-[#E11D74] to-[#6D28D9] text-white shadow-lg'
                          : 'border border-white/20 text-[#CFCFCF] bg-[#0F0F10]/80 hover:bg-gradient-to-r hover:from-[#E11D74] hover:to-[#6D28D9] hover:text-white hover:border-transparent'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-2 text-[#CFCFCF] font-['Rajdhani',_sans-serif]">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            
            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border border-white/20 text-[#CFCFCF] rounded-lg transition-all duration-300 font-['Rajdhani',_sans-serif] bg-[#0F0F10]/80 ${
                currentPage === totalPages 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gradient-to-r hover:from-[#E11D74] hover:to-[#6D28D9] hover:text-white hover:border-transparent'
              }`}
            >
              Siguiente
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
