import React, { useEffect, useMemo, useState } from 'react';
import productService from '../../../shop/services/productService';
import ProductEdit from './ProductEdit';
import ProductCreate from './ProductCreate';

function Icon({ name, className = '' }) {
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

function Badge({ children, variant = 'gray' }) {
  const variants = {
    gray: 'bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    red: 'bg-rose-50 text-rose-700 border border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  };
  return <span className={`px-3 py-1.5 rounded-lg text-xs font-medium font-['Rajdhani',_sans-serif] ${variants[variant]}`}>{children}</span>;
}

function StarRating({ value = 0 }) {
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

function SortHeader({ label, sortKey, currentKey, order, onSort }) {
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

export default function ProductAdminTable({ openCreate = false, onCloseCreate }) {
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sizes: [],
    colors: [],
    tags: [],
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);

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
        const res = await productService.getCategories();
        const listFromData = Array.isArray(res?.data) ? res.data : null;
        const listFromRoot = Array.isArray(res?.categories) ? res.categories : null;
        const list = listFromData || listFromRoot || [];
        setCategories(list);
      } catch (_e) {}
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
        const params = new URLSearchParams();
        if (filters.name) params.append('name', filters.name);
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
        if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
        if (filters.inStock) params.append('inStock', 'true');
        if (filters.sizes.length) params.append('sizes', filters.sizes.join(','));
        if (filters.colors.length) params.append('colors', filters.colors.join(','));
        if (filters.tags.length) params.append('tags', filters.tags.join(','));
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        params.append('page', String(filters.page));
        params.append('limit', String(filters.limit));

        const endpoint = `/products?${params.toString()}`;
        const res = await productService.makeRequest(endpoint, { method: 'GET', signal: controller.signal });

        const itemsFromStd = Array.isArray(res?.data?.products) ? res.data.products : null;
        const totalFromStd = typeof res?.data?.pagination?.totalProducts === 'number' ? res.data.pagination.totalProducts : null;

        const itemsFromDataItems = Array.isArray(res?.data?.items) ? res.data.items : null;
        const itemsFromData = Array.isArray(res?.data) ? res.data : null;
        const itemsFromProducts = Array.isArray(res?.products) ? res.products : null;
        const itemsFromItems = Array.isArray(res?.items) ? res.items : null;
        const items = itemsFromStd || itemsFromDataItems || itemsFromData || itemsFromProducts || itemsFromItems || [];
        const count = totalFromStd != null ? totalFromStd : (typeof res?.data?.total === 'number' ? res.data.total : (typeof res?.total === 'number' ? res.total : items.length));

        setProducts(items);
        setTotal(count);
      } catch (e) {
        const msg = String(e?.message || '');
        if (e?.name === 'AbortError' || msg.toLowerCase().includes('abort')) {
          return;
        }
        setError(msg || 'Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchProducts, 150);
    return () => { clearTimeout(t); controller.abort(); };
  }, [filters.name, filters.category, filters.minPrice, filters.maxPrice, filters.inStock, filters.sizes, filters.colors, filters.tags, filters.sortBy, filters.sortOrder, filters.page, filters.limit, refreshTrigger]);

  const onSort = (key) => {
    setLoading(true);
    setFilters((f) => ({
      ...f,
      sortBy: key,
      sortOrder: f.sortBy === key && f.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  };

  const setFilterField = (key, value) => {
    setLoading(true);
    setFilters((f) => {
      if (key === 'page') return { ...f, page: value };
      if (key === 'limit') return { ...f, limit: value, page: 1 };
      return { ...f, [key]: value, page: 1 };
    });
  };

  const clearFilters = () => {
    setLoading(true);
    setFilters((f) => ({ ...f, name: '', category: '', minPrice: '', maxPrice: '', inStock: false, sizes: [], colors: [], tags: [], page: 1 }));
  };

  const formatDateTime = (iso) => {
    try { return new Date(iso).toLocaleString(); } catch { return '-'; }
  };

  const resolveCategoryName = (catIdOrObj) => {
    if (!catIdOrObj) return '-';
    if (typeof catIdOrObj === 'object') return catIdOrObj.name || catIdOrObj.title || '-';
    const found = categories.find(c => c._id === catIdOrObj);
    return found?.name || found?.title || '-';
  };

  const exportCSV = () => {
    const headers = ['Nombre','SKU','Categoría','Precio','Stock','Activo','Rating','Reseñas','Vendidos','Actualizado'];
    const rows = products.map(p => [
      p.name,
      p.sku || '',
      resolveCategoryName(p.category),
      String(p.price ?? ''),
      String(p.stock ?? ''),
      p.isActive ? 'Sí' : 'No',
      String(p.averageRating ?? 0),
      String(p.reviewsCount ?? 0),
      String(p.soldCount ?? 0),
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
              <input value={filters.name} onChange={(e) => setFilterField('name', e.target.value)} placeholder="Buscar productos..." className="w-full border border-[#E5E7EB] rounded-xl pl-11 pr-4 py-3 text-sm bg-white hover:border-[#D1D5DB] focus:border-[#E11D74] focus:ring-2 focus:ring-[#E11D74]/20 transition-all font-['Rajdhani',_sans-serif]" />
            </div>
            <select value={filters.category} onChange={(e) => setFilterField('category', e.target.value)} className="border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm bg-white hover:border-[#D1D5DB] focus:border-[#E11D74] focus:ring-2 focus:ring-[#E11D74]/20 transition-all font-['Rajdhani',_sans-serif]">
              <option value="">Todas categorías</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name || c.title}</option>
              ))}
            </select>
            <input type="number" min="0" value={filters.minPrice} onChange={(e) => setFilterField('minPrice', e.target.value)} placeholder="Precio mín" className="border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm bg-white hover:border-[#D1D5DB] focus:border-[#E11D74] focus:ring-2 focus:ring-[#E11D74]/20 transition-all font-['Rajdhani',_sans-serif]" />
            <input type="number" min="0" value={filters.maxPrice} onChange={(e) => setFilterField('maxPrice', e.target.value)} placeholder="Precio máx" className="border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm bg-white hover:border-[#D1D5DB] focus:border-[#E11D74] focus:ring-2 focus:ring-[#E11D74]/20 transition-all font-['Rajdhani',_sans-serif]" />
            <label className="flex items-center gap-3 px-4 py-3 border border-[#E5E7EB] rounded-xl hover:border-[#D1D5DB] transition-all cursor-pointer bg-white">
              <input type="checkbox" className="accent-[#E11D74] w-5 h-5 cursor-pointer" checked={filters.inStock} onChange={(e) => setFilterField('inStock', e.target.checked)} />
              <span className="text-sm font-['Rajdhani',_sans-serif] text-[#0F0F10]">En stock</span>
            </label>
            <input value={filters.sizes.join(',')} onChange={(e) => setFilterField('sizes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Talles: 38,39" className="border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm bg-white hover:border-[#D1D5DB] focus:border-[#E11D74] focus:ring-2 focus:ring-[#E11D74]/20 transition-all lg:col-span-2 font-['Rajdhani',_sans-serif]" />
            <input value={filters.colors.join(',')} onChange={(e) => setFilterField('colors', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Colores: negro,azul" className="border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm bg-white hover:border-[#D1D5DB] focus:border-[#E11D74] focus:ring-2 focus:ring-[#E11D74]/20 transition-all lg:col-span-2 font-['Rajdhani',_sans-serif]" />
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
            <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F0F10] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors font-['Quantico',_sans-serif]">
              <Icon name="download" className="w-4 h-4" /> CSV
            </button>
            <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F0F10] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors font-['Quantico',_sans-serif]">
              <Icon name="edit" className="w-4 h-4" /> Crear producto
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
                const image = Array.isArray(p.images) && p.images.length ? p.images[0] : '';
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
                    <td className="px-6 py-4 text-[#0F0F10]">{resolveCategoryName(p.category)}</td>
                    <td className="px-6 py-4 font-semibold text-[#0F0F10]">${p.price != null ? (typeof p.price === 'number' ? p.price.toFixed(2) : p.price) : '—'}</td>
                    <td className="px-6 py-4 w-32">
                      <div className="flex flex-col gap-1">
                        <Badge variant={inStock ? 'green' : 'red'}>{inStock ? '✓ En stock' : '⚠ Agotado'}</Badge>
                        <div className="text-xs text-[#6B7280] font-medium font-['Rajdhani',_sans-serif]">({p.stock ?? 0} unidades)</div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Badge variant={p.isActive ? 'green' : 'gray'}>{p.isActive ? 'Activo' : 'Inactivo'}</Badge></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-[#EAB308]' : 'text-[#E5E7EB]'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10.95 13.9a1 1 0 0 0-1.175 0l-2.985 2.082c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L3.154 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-[#6B7280] ml-1">({reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#0F0F10] font-medium">{p.soldCount ?? 0}</td>
                    <td className="px-6 py-4 text-[#6B7280] text-xs">{formatDateTime(p.updatedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditId(p._id); setEditOpen(true); }} className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E5E7EB] text-[#0F0F10] rounded-lg text-xs font-medium hover:bg-[#F3F4F6] hover:border-[#D1D5DB] transition-all font-['Quantico',_sans-serif]">
                          <Icon name="edit" className="w-4 h-4" /> Editar
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-rose-200 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-50 hover:border-rose-300 transition-all font-['Quantico',_sans-serif]">
                          <Icon name="trash" className="w-4 h-4" /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && !error && products.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-6 py-12">
                    <div className="text-center">
                      <div className="text-5xl mb-3">📦</div>
                      <h3 className="text-lg font-semibold text-[#0F0F10] mb-1 font-['Orbitron',_sans-serif]">No hay productos</h3>
                      <p className="text-[#6B7280] mb-4 font-['Rajdhani',_sans-serif]">No se encontraron productos con esos filtros</p>
                      <button onClick={clearFilters} className="px-4 py-2 bg-[#0F0F10] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors font-['Quantico',_sans-serif]">Limpiar filtros</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer paginación */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#E5E7EB] bg-gradient-to-r from-white via-[#F9FAFB] to-white">
          <div className="text-sm text-[#6B7280] font-['Rajdhani',_sans-serif]">
            <span className="font-semibold">Mostrando</span> {total ? startIndex : 0}–{endIndex} <span className="font-semibold">de</span> {total}
          </div>
          <div className="flex items-center gap-3">
            <button disabled={filters.page <= 1} onClick={() => setFilterField('page', Math.max(1, filters.page - 1))} className="px-3 py-2 border border-[#E5E7EB] text-[#0F0F10] rounded-lg text-sm hover:bg-[#F3F4F6] hover:border-[#D1D5DB] disabled:opacity-40 transition-all font-['Quantico',_sans-serif]">← Anterior</button>
            <span className="px-3 py-2 text-sm font-medium text-[#0F0F10] bg-[#F3F4F6] rounded-lg font-['Rajdhani',_sans-serif]">Pág {filters.page}</span>
            <button disabled={endIndex >= total} onClick={() => setFilterField('page', filters.page + 1)} className="px-3 py-2 border border-[#E5E7EB] text-[#0F0F10] rounded-lg text-sm hover:bg-[#F3F4F6] hover:border-[#D1D5DB] disabled:opacity-40 transition-all font-['Quantico',_sans-serif]">Siguiente →</button>
            <select value={filters.limit} onChange={(e) => setFilterField('limit', Number(e.target.value))} className="border border-[#E5E7EB] text-[#0F0F10] rounded-lg px-3 py-2 text-sm hover:border-[#D1D5DB] focus:border-[#E11D74] transition-all font-['Rajdhani',_sans-serif]">
              {[10,20,50,100].map(n => <option key={n} value={n}>{n} por página</option>)}
            </select>
          </div>
        </div>
      </div>

      <ProductEdit open={editOpen} onClose={() => { setEditOpen(false); setEditId(''); }} productId={editId} onSaved={onEditSaved} />
      <ProductCreate open={createOpen} onClose={() => setCreateOpen(false)} onSaved={() => { setCreateOpen(false); onEditSaved(); }} />
    </div>
  );
}


