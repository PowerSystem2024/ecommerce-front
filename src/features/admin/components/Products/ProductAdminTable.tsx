import React, { useEffect, useMemo, useState } from 'react';
import { dashboardService } from '../../services';
import { Product, Category, ProductsResponse } from '../../types/product.types';
import ProductEdit from './ProductEdit';
import ProductCreate from './ProductCreate';
import { successToast, errorToast, loadingToast } from '../../../../utils/customToast';
import { confirmDialog } from '../../../../utils/confirmDialog.jsx';

// Define prop types
interface ProductAdminTableProps {
  openCreate?: boolean;
  onCloseCreate?: () => void;
}

// Define filter types
interface ProductFilters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  sizes: string[];
  colors: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

// Define icon props
interface IconProps {
  name: string;
  className?: string;
}

// Define badge props
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gray' | 'green' | 'red' | 'amber';
}

// Define star rating props
interface StarRatingProps {
  value?: number;
}

// Define sort header props
interface SortHeaderProps {
  label: string;
  sortKey: string;
  currentKey: string;
  order: 'asc' | 'desc';
  onSort: (key: string) => void;
}

const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
  if (name === 'search') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    );
  }
  if (name === 'chevron-up') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    );
  }
  if (name === 'chevron-down') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    );
  }
  if (name === 'download') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
    );
  }
  if (name === 'edit') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    );
  }
  if (name === 'trash') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    );
  }
  return null;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray' }) => {
  const variants = {
    gray: 'bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    red: 'bg-rose-50 text-rose-700 border border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  } as const;
  
  const variantClass = variants[variant] || variants.gray;
  return <span className={`px-3 py-1.5 rounded-lg text-xs font-medium font-['Rajdhani',_sans-serif] ${variantClass}`}>{children}</span>;
}

const StarRating: React.FC<StarRatingProps> = ({ value = 0 }) => {
  const v = Math.round(value);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < v ? 'text-amber-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10.95 13.9a1 1 0 0 0-1.175 0l-2.985 2.082c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L3.154 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const SortHeader: React.FC<SortHeaderProps> = ({ label, sortKey, currentKey, order, onSort }) => {
  const active = currentKey === sortKey;
  return (
    <button type="button" onClick={() => onSort(sortKey)} className={`group inline-flex items-center gap-1.5 select-none font-['Orbitron',_sans-serif] transition-colors ${active ? 'text-[#0F0F10]' : 'text-[#6B7280]'} hover:text-[#0F0F10]`}>
      <span className="font-semibold">{label}</span>
      <span className={`transition-all ${active ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}>
        {active && order === 'asc' && <Icon name="chevron-up" className="w-4 h-4" />}
        {active && order === 'desc' && <Icon name="chevron-down" className="w-4 h-4" />}
        {!active && <Icon name="chevron-down" className="w-3.5 h-3.5" />}
      </span>
    </button>
  );
}

// Clave para el almacenamiento local
const FILTERS_STORAGE_KEY = 'admin_product_filters';

const ProductAdminTable: React.FC<ProductAdminTableProps> = ({ openCreate = false, onCloseCreate }) => {
  // Valores por defecto para los filtros
  const defaultFilters: ProductFilters = {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sizes: [],
    colors: [],
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  };

  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  
  // Limpiar filtros al desmontar el componente
  useEffect(() => {
    return () => {
      // No guardar los filtros al desmontar
      // Esto hará que se reinicien cuando se vuelva a cargar la página
    };
  }, []);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog(
      '¿Estás seguro de que deseas eliminar este producto?',
      {
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: '#EF4444'
      }
    );
    
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const toastId = loadingToast('Eliminando producto...');
      // Intentar eliminar el producto
      const response = await dashboardService.deleteProduct(id);
      
      // Si llegamos aquí, la eliminación fue exitosa
      if (response && response.success) {
        // Actualizar la lista de productos
        setRefreshTrigger(prev => prev + 1);
        // Mostrar mensaje de éxito
        successToast('Producto eliminado correctamente');
      } else {
        throw new Error('La eliminación no fue exitosa');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      
      // Mostrar mensaje de error más detallado
      let errorMessage = 'Error al eliminar el producto';
      if (error instanceof Error) {
        // Si el mensaje de error es HTML, mostramos un mensaje genérico
        if (error.message.includes('<!DOCTYPE html>')) {
          errorMessage = 'Error de conexión con el servidor. Por favor, intente nuevamente.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      errorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openCreate) {
      setCreateOpen(true);
      if (onCloseCreate) {
        // Informar al padre que ya procesamos la señal para evitar reabrir
        setTimeout(() => onCloseCreate(), 0);
      }
    }
  }, [openCreate, onCloseCreate]);

  const startIndex = useMemo(() => ((filters.page - 1) * filters.limit) + 1, [filters.page, filters.limit]);
  const endIndex = useMemo(() => Math.min(filters.page * filters.limit, total), [filters.page, filters.limit, total]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await dashboardService.getCategories();
        setCategories(categories);
      } catch (err) {
        setError('Error al cargar las categorías');
      }
    };
    loadCategories();
  }, []);

  const onEditSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      setError('');
      try {
        setLoading(true);
        
        // Preparar parámetros de filtro
        const filterParams: any = {};
        
        // Búsqueda
        if (filters.search) filterParams.search = filters.search;
        
        // Ordenamiento
        if (filters.sortBy) filterParams.sortBy = filters.sortBy;
        if (filters.sortOrder) filterParams.sortOrder = filters.sortOrder;
        
        // Filtros de categoría y disponibilidad
        if (filters.category) filterParams.category = filters.category;
        if (filters.inStock) filterParams.inStock = true;

        // Filtros de precio
        if (filters.minPrice && filters.minPrice !== '') {
          const minPrice = parseFloat(filters.minPrice);
          if (!isNaN(minPrice) && minPrice > 0) {
            filterParams.minPrice = minPrice;
          }
        }

        if (filters.maxPrice && filters.maxPrice !== '') {
          const maxPrice = parseFloat(filters.maxPrice);
          if (!isNaN(maxPrice) && maxPrice > 0) {
            filterParams.maxPrice = maxPrice;
          }
        }

        // Filtros de tallas y colores
        if (filters.sizes && filters.sizes.length > 0) {
          const uniqueSizes = [...new Set(filters.sizes.map((s: string) => s.toUpperCase()))];
          filterParams.sizes = uniqueSizes;
        }

        if (filters.colors && filters.colors.length > 0) {
          const uniqueColors = [...new Set(filters.colors.map((c: string) => c.toLowerCase().trim()))];
          filterParams.colors = uniqueColors;
        }
        
        // Llamar al servicio con los parámetros correctos
        const response = await dashboardService.getProducts(
          filters.page,
          filters.limit,
          filterParams
        );
        
        // La respuesta debería ser un PaginatedResponse<Product>
        if (response && 'data' in response) {
          setProducts(response.data || []);
          setTotal(response.total || 0);
        } else {
          // Manejar el caso en que la respuesta no tenga la estructura esperada
          // La respuesta de la API no tiene la estructura esperada
          setProducts([]);
          setTotal(0);
        }
        
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        if (error instanceof Error && error.name === 'AbortError' || msg.toLowerCase().includes('abort')) {
          return;
        }
        console.error('Error al cargar productos:', error);
        setError(msg || 'Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters.page, filters.limit, filters.search, filters.category, filters.minPrice, filters.maxPrice, filters.inStock, filters.sortBy, filters.sortOrder, filters.sizes, filters.colors, refreshTrigger]);

  // Actualizar productos cuando cambian los filtros
  useEffect(() => {
    // Efecto para manejar cambios en productos y total
  }, [products, total]);

  const onSort = (key: string) => {
    setLoading(true);
    const handleSort = (key: string) => {
      setFilters(prev => ({
        ...prev,
        sortBy: key,
        sortOrder: prev.sortBy === key && prev.sortOrder === 'asc' ? 'desc' : 'asc',
        page: 1, // Reset to first page when sorting
        sizes: prev.sizes || [],
        colors: prev.colors || []
      }));
    };
    handleSort(key);
  };

  const setFilterField = (field: keyof ProductFilters, value: string | number | boolean | string[]) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1, // Reset to first page when filters change
      sizes: prev.sizes || [],
      colors: prev.colors || []
    }));
  };

  const clearFilters = () => {
    const handleClearFilters = () => {
      setFilters({
        ...defaultFilters,
        sizes: [],
        colors: []
      });
    };
    handleClearFilters();
  };

  const formatDateTime = (iso: string) => {
    try { return new Date(iso).toLocaleString(); } catch { return '-'; }
  };

  const resolveCategoryName = (catIdOrObj: string | { _id: string; name?: string; title?: string } | undefined): string => {
    if (!catIdOrObj) return '-';
    if (typeof catIdOrObj === 'object') return catIdOrObj.name || (catIdOrObj as any).title || '-';
    const found = categories.find(c => c._id === catIdOrObj);
    return found?.name || (found as any)?.title || '-';
  };

  const exportCSV = () => {
    const headers = ['Nombre', 'SKU', 'Categoría', 'Precio', 'Stock', 'Activo', 'Rating', 'Reseñas', 'Vendidos', 'Actualizado'];
    const rows = products.map(p => [
      p.name,
      p.sku || '',
      resolveCategoryName(p.category as any), // Type assertion needed due to union type
      String(p.price ?? ''),
      String(p.stock ?? ''),
      p.isActive ? 'Sí' : 'No',
      String(p.averageRating ?? 0),
      String((p as any).reviewsCount ?? 0), // Add type assertion for extended properties
      String((p as any).soldCount ?? 0),    // Add type assertion for extended properties
      formatDateTime(p.updatedAt),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize: number = parseInt(e.target.value, 10);
    const setFilterField = (field: keyof ProductFilters, value: any) => {
      setFilters(prev => ({
        ...prev,
        [field]: value,
        page: 1, // Reset to first page when filters change
        sizes: prev.sizes || [],
        colors: prev.colors || []
      }));
    };
    setFilterField('limit', newSize);
  };

  const totalPages = Math.ceil(total / filters.limit) || 1;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
        {/* Progress bar animada */}
        {loading && (
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#E11D74] to-transparent animate-pulse" />
        )}

        {/* Barra de filtros */}
        <div className="p-6 border-b border-[#E5E7EB] bg-gradient-to-r from-white via-[#F9FAFB] to-white">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2 relative group">
              <Icon name="search" className="w-5 h-5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#E11D74] transition-colors" />
              <input value={filters.search} onChange={(e) => setFilterField('search', e.target.value)} placeholder="Buscar productos..." className="w-full border border-[#E5E7EB] rounded-xl pl-11 pr-4 py-3 text-sm bg-white hover:border-[#D1D5DB] focus:border-[#E11D74] focus:ring-2 focus:ring-[#E11D74]/20 transition-all font-['Rajdhani',_sans-serif]" />
            </div>
            <select value={filters.category} onChange={(e) => setFilterField('category', e.target.value)} className="border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm bg-white hover:border-[#D1D5DB] focus:border-[#E11D74] focus:ring-2 focus:ring-[#E11D74]/20 transition-all font-['Rajdhani',_sans-serif]">
              <option value="">Todas categorías</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{(c as any).name || (c as any).title || c._id}</option>
              ))}
            </select>
            <div className="relative">
              <input 
                value={filters.sizes.join(', ')} 
                onChange={(e) => {
                  const value = e.target.value;
                  // Permitir letras, números, comas y espacios
                  const filteredValue = value.replace(/[^a-zA-Z0-9,\s]/g, '');
                  const sizes = filteredValue.split(',')
                    .map((s: string) => s.trim().toUpperCase())
                    .filter(Boolean) as string[];
                  setFilters((prev: ProductFilters) => ({
                    ...prev,
                    sizes,
                    page: 1 // Resetear a la primera página al aplicar filtros
                  }));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const fetchProducts = async () => {
                      try {
                        setLoading(true);
                        const { page, limit, ...filterParams } = filters;
                        const response = await dashboardService.getProducts(
                          page,
                          limit,
                          { ...filterParams }
                        );
                        setProducts(response.data || []);
                        setTotal(response.total || 0);
                      } catch (error) {
                        console.error('Error al cargar productos:', error);
                        setError('Error al cargar los productos');
                      } finally {
                        setLoading(false);
                      }
                    };
                    fetchProducts();
                  }
                }}
                placeholder="Tallas (ej: S, M, L)" 
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm bg-white hover:border-[#D1D5DB] focus:border-[#E11D74] focus:ring-2 focus:ring-[#E11D74]/20 transition-all font-['Rajdhani',_sans-serif]"
                style={{ color: '#0F0F10' }}
              />
            </div>
            <div className="relative">
              <input 
                value={filters.colors.join(', ')} 
                onChange={(e) => {
                  const value = e.target.value;
                  // Permitir letras, comas y espacios
                  const filteredValue = value.replace(/[^a-zA-Z\s,]/g, '');
                  const colors = filteredValue.split(',')
                    .map((c: string) => c.trim().toLowerCase())
                    .filter(Boolean) as string[];
                  setFilters((prev: ProductFilters) => ({
                    ...prev,
                    colors,
                    page: 1 // Resetear a la primera página al aplicar filtros
                  }));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const fetchProducts = async () => {
                      try {
                        setLoading(true);
                        const { page, limit, ...filterParams } = filters;
                        const response = await dashboardService.getProducts(
                          page,
                          limit,
                          { ...filterParams }
                        );
                        setProducts(response.data || []);
                        setTotal(response.total || 0);
                      } catch (error) {
                        console.error('Error al cargar productos:', error);
                        setError('Error al cargar los productos');
                      } finally {
                        setLoading(false);
                      }
                    };
                    fetchProducts();
                  }
                }}
                placeholder="Colores (ej: rojo, azul, verde)" 
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm bg-white hover:border-[#D1D5DB] focus:border-[#E11D74] focus:ring-2 focus:ring-[#E11D74]/20 transition-all font-['Rajdhani',_sans-serif]"
                style={{ color: '#0F0F10' }}
              />
            </div>
            <div className="flex gap-2 lg:col-span-2">
              <select value={filters.sortBy} onChange={(e) => setFilterField('sortBy', e.target.value)} className="flex-1 border border-[#E5E7EB] rounded-xl px-3 py-3 text-sm bg-white hover:border-[#D1D5DB] focus:border-[#E11D74] focus:ring-2 focus:ring-[#E11D74]/20 transition-all font-['Rajdhani',_sans-serif]">
                <option value="name">Nombre</option>
                <option value="price">Precio</option>
                <option value="soldCount">Vendidos</option>
                <option value="updatedAt">Actualizado</option>
              </select>
              <select value={filters.sortOrder} onChange={(e) => setFilterField('sortOrder', e.target.value)} className="border border-[#E5E7EB] rounded-xl px-3 py-3 text-sm bg-white hover:border-[#D1D5DB] focus:border-[#E11D74] focus:ring-2 focus:ring-[#E11D74]/20 transition-all font-['Rajdhani',_sans-serif]">
                <option value="asc">↑ Asc</option>
                <option value="desc">↓ Desc</option>
              </select>
              <button onClick={clearFilters} className="px-4 py-3 bg-[#F3F4F6] text-[#0F0F10] border border-[#E5E7EB] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-all font-['Quantico',_sans-serif]">Limpiar</button>
            </div>
          </div>
        </div>

        {/* Contadores y exportar */}
        <div className="px-6 pt-4 pb-3 flex items-center justify-between text-sm border-b border-[#E5E7EB]">
          <div className="flex gap-3 flex-wrap">
            <Badge variant="green">✓ Activos: {products.filter(p => p.isActive).length}</Badge>
            <Badge variant="red">⚠ Sin stock: {products.filter(p => (p.stock ?? 0) <= 0).length}</Badge>
            <Badge variant="gray">📊 Página: {products.length}</Badge>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={exportCSV} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F0F10] text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors font-['Quantico',_sans-serif]"
            >
              <Icon name="download" className="w-4 h-4" /> CSV
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="relative overflow-x-auto">
          {loading && products.length > 0 && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm pointer-events-none rounded-2xl" />
          )}

          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-[#F9FAFB] to-white sticky top-0 z-10 border-b border-[#E5E7EB]">
              <tr className="text-left">
                <th className="px-6 py-4 text-[#6B7280] font-semibold font-['Orbitron',_sans-serif]">Imagen</th>
                <th className="px-6 py-4 text-[#6B7280] font-semibold"><SortHeader label="Nombre" sortKey="name" currentKey={filters.sortBy} order={filters.sortOrder} onSort={onSort} /></th>
                <th className="px-6 py-4 text-[#6B7280] font-semibold font-['Orbitron',_sans-serif]">SKU</th>
                <th className="px-6 py-4 text-[#6B7280] font-semibold font-['Orbitron',_sans-serif]">Categoría</th>
                <th className="px-6 py-4 text-[#6B7280] font-semibold"><SortHeader label="Precio" sortKey="price" currentKey={filters.sortBy} order={filters.sortOrder} onSort={onSort} /></th>
                <th className="px-6 py-4 text-[#6B7280] font-semibold font-['Orbitron',_sans-serif]">Stock</th>
                <th className="px-6 py-4 text-[#6B7280] font-semibold font-['Orbitron',_sans-serif]">Estado</th>
                <th className="px-6 py-4 text-[#6B7280] font-semibold font-['Orbitron',_sans-serif]">Rating</th>
                <th className="px-6 py-4 text-[#6B7280] font-semibold"><SortHeader label="Vendidos" sortKey="soldCount" currentKey={filters.sortBy} order={filters.sortOrder} onSort={onSort} /></th>
                <th className="px-6 py-4 text-[#6B7280] font-semibold"><SortHeader label="Actualizado" sortKey="updatedAt" currentKey={filters.sortBy} order={filters.sortOrder} onSort={onSort} /></th>
                <th className="px-6 py-4 text-[#6B7280] font-semibold font-['Orbitron',_sans-serif]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {loading && products.length === 0 && Array.from({ length: 6 }).map((_, i) => (
                <tr key={`s-${i}`} className="animate-pulse">
                  <td className="px-6 py-4"><div className="w-12 h-12 bg-[#E5E7EB] rounded-lg" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-40 bg-[#E5E7EB] rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-[#E5E7EB] rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-[#E5E7EB] rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-[#E5E7EB] rounded" /></td>
                  <td className="px-6 py-4"><div className="h-6 w-20 bg-[#E5E7EB] rounded-lg" /></td>
                  <td className="px-6 py-4"><div className="h-6 w-20 bg-[#E5E7EB] rounded-lg" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-[#E5E7EB] rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-[#E5E7EB] rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-[#E5E7EB] rounded" /></td>
                  <td className="px-6 py-4"><div className="h-8 w-32 bg-[#E5E7EB] rounded-lg" /></td>
                </tr>
              ))}

              {!loading && error && (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center">
                    <div className="text-rose-600 font-medium">{error}</div>
                  </td>
                </tr>
              )}

              {products.map((p, idx) => {
                const images = (p as any).images; // Type assertion for extended properties
                const image = Array.isArray(images) && images.length ? images[0] : '';
                const inStock = (p.stock ?? 0) > 0;
                const rating = p.averageRating ?? 0;
                const reviews = p.reviewsCount ?? 0;
                return (
                  <tr key={p._id} className="hover:bg-[#F9FAFB] transition-colors border-b-0">
                    <td className="px-6 py-4">
                      {image ? (
                        <img src={image} alt={p.name} className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 bg-[#F3F4F6] rounded-lg" />
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0F0F10] font-['Orbitron',_sans-serif]">{p.name}</td>
                    <td className="px-6 py-4 text-[#6B7280]">{p.sku || '—'}</td>
                    <td className="px-6 py-4 text-[#0F0F10]">{resolveCategoryName(p.category as any)} </td>
                    <td className="px-6 py-4 font-semibold text-[#0F0F10]">${typeof p.price === 'number' ? p.price.toFixed(2) : p.price}</td>
                    <td className="px-6 py-4 w-32">
                      <div className="flex flex-col gap-1">
                        <Badge variant={inStock ? 'green' : 'red'}>{inStock ? '✓ En stock' : '⚠ Agotado'}</Badge>
                        <div className="text-xs text-[#6B7280] font-medium font-['Rajdhani',_sans-serif]">({p.stock ?? 0} unidades)</div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Badge variant={p.isActive ? 'green' : 'gray'}>{p.isActive ? 'Activo' : 'Inactivo'}</Badge></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        <StarRating value={rating} />
                        <span className="text-xs text-[#6B7280] ml-1">({reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#0F0F10] font-medium">{p.soldCount ?? 0}</td>
                    <td className="px-6 py-4 text-[#6B7280] text-xs">{formatDateTime(p.updatedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditId(p._id);
                            setEditOpen(true);
                          }}
                          className="p-1.5 text-gray-500 hover:text-[#E11D74] rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Editar producto"
                        >
                          <Icon name="edit" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Paginación Simple */}
          <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {Math.min((filters.page - 1) * filters.limit + 1, total)}-{Math.min(filters.page * filters.limit, total)} de {total} productos
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filters.limit}
                onChange={handlePageSizeChange}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
              >
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
                <option value={100}>100 por página</option>
              </select>
              <button
                onClick={() => setFilters((prev: ProductFilters) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={filters.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {filters.page} de {totalPages}
              </span>
              <button
                onClick={() => setFilters((prev: ProductFilters) => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
                disabled={filters.page >= totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
      <ProductEdit
        open={editOpen}
        productId={editId}
        onClose={() => setEditOpen(false)}
        onSaved={() => {
          setEditOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />
      <ProductCreate
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={() => {
          setCreateOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </div>
  );
}

export default ProductAdminTable;
