import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import productService from '../../../shop/services/productService';
import authService from '../../../auth/services/authService';
import { uploadProductImages } from '../../../../modules/uploadImages';

function Field({ label, children, required, error }) {
  return (
    <fieldset>
      <label className="block text-xs font-medium text-[#0F0F10] mb-2 font-['Orbitron',_sans-serif]">{label} {required && <span className="text-[#E11D74]">*</span>}</label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </fieldset>
  );
}

export default function ProductCreate({ open, onClose, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    category: '',
    stock: 0,
    images: [],
    sizes: [],
    colors: [],
    tags: [],
  });
  const [sizesText, setSizesText] = useState('');
  const [colorsText, setColorsText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [newFiles, setNewFiles] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    if (open) {
      const loadCategories = async () => {
        try {
          const res = await productService.getCategories();
          const listFromData = Array.isArray(res?.data) ? res.data : null;
          const listFromRoot = Array.isArray(res?.categories) ? res.categories : null;
          const list = listFromData || listFromRoot || [];
          setCategories(list);
        } catch (_e) {}
      };
      // reset de textos a partir del estado
      setSizesText(Array.isArray(data.sizes) ? data.sizes.join(', ') : '');
      setColorsText(Array.isArray(data.colors) ? data.colors.join(', ') : '');
      setTagsText(Array.isArray(data.tags) ? data.tags.join(', ') : '');
      loadCategories();
    }
  }, [open]);

  const setField = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const allImages = React.useMemo(() => {
    const existing = Array.isArray(data?.images) ? data.images : [];
    const previews = newFiles.map(f => URL.createObjectURL(f));
    return [...existing, ...previews];
  }, [data, newFiles]);

  const currentImage = React.useMemo(() => allImages[imageIndex] || '', [allImages, imageIndex]);

  const prevImage = () => {
    setImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const validateField = (key, value) => {
    if (key === 'name') {
      if (!value?.trim()) return 'El nombre es requerido';
      if (value.trim().length < 2) return 'Mínimo 2 caracteres';
      if (value.trim().length > 100) return 'Máximo 100 caracteres';
    }
    if (key === 'description') {
      if (!value?.trim()) return 'La descripción es requerida';
      if (value.trim().length < 10) return 'Mínimo 10 caracteres';
    }
    if (key === 'price') {
      const n = Number(value);
      if (!value && value !== 0) return 'El precio es requerido';
      if (Number.isNaN(n) || n <= 0) return 'El precio debe ser mayor a 0';
    }
    if (key === 'category') {
      if (!value) return 'Seleccioná una categoría';
    }
    if (key === 'stock') {
      const n = Number(value);
      if (Number.isNaN(n) || n < 0) return 'Stock inválido';
    }
    return '';
  };

  const validateAll = () => {
    const nextErrors = {
      name: validateField('name', data.name),
      description: validateField('description', data.description),
      price: validateField('price', data.price),
      category: validateField('category', data.category),
      stock: validateField('stock', data.stock),
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every(v => !v);
  };

  const onSave = async () => {
    setError('');
    if (!validateAll()) return;
    setSaving(true);
    try {
      if (!newFiles.length && !data.images.length) throw new Error('Debes subir al menos una imagen');

      const token = authService.getToken?.() || localStorage.getItem('authToken') || localStorage.getItem('token') || '';
      let images = [];

      if (newFiles && newFiles.length) {
        const invalid = newFiles.find(f => !f.type.startsWith('image/') || f.size > 5 * 1024 * 1024);
        if (invalid) throw new Error('Solo imágenes (≤5MB) están permitidas');
        console.debug('[ProductCreate] Subiendo imágenes', { count: newFiles.length, names: newFiles.map(f => f.name) });
        const { urls } = await uploadProductImages(newFiles, token, undefined, 'images');
        images = urls;
      }

      // Asegurar arrays desde los textos si el usuario no salió del campo
      const sizesArr = (Array.isArray(data.sizes) && data.sizes.length ? data.sizes : sizesText.split(',').map(s => s.trim())).filter(Boolean);
      const colorsArr = (Array.isArray(data.colors) && data.colors.length ? data.colors : colorsText.split(',').map(s => s.trim())).filter(Boolean);
      const tagsArr = (Array.isArray(data.tags) && data.tags.length ? data.tags : tagsText.split(',').map(s => s.trim())).filter(Boolean);

      const payload = {
        name: data.name.trim(),
        description: data.description.trim(),
        price: Number(data.price),
        category: data.category,
        stock: Number(data.stock ?? 0),
        images,
        sizes: sizesArr,
        colors: colorsArr,
        tags: tagsArr,
      };

      const skuTrim = (data.sku || '').trim();
      if (skuTrim) payload.sku = skuTrim;

      console.debug('[ProductCreate] Creando producto', { payload });
      await productService.makeRequest('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.debug('[ProductCreate] Producto creado OK');
      setData({ name: '', sku: '', description: '', price: '', category: '', stock: 0, images: [], sizes: [], colors: [], tags: [] });
      setSizesText('');
      setColorsText('');
      setTagsText('');
      setNewFiles([]);
      setImageIndex(0);
      onClose();
      if (onSaved) onSaved();
    } catch (e) {
      console.error('[ProductCreate] Error al crear', e);
      setError(e?.message || 'Error al crear producto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center md:items-center md:px-2 lg:px-4">
          <span aria-hidden="true" className="hidden md:inline-block md:h-screen md:align-middle">&#8203;</span>
          <DialogPanel
            transition
            className="flex w-full transform text-left transition data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:my-8 md:max-w-4xl md:px-4 data-closed:md:translate-y-0 data-closed:md:scale-95 lg:max-w-5xl"
          >
            <div className="relative flex w-full items-center overflow-hidden bg-white rounded-2xl shadow-2xl md:p-6 lg:p-8">
              <button type="button" onClick={onClose} className="absolute top-4 right-4 text-[#6B7280] hover:text-[#0F0F10] z-10">
                <XMarkIcon className="w-6 h-6" />
              </button>

              {error && <div className="w-full p-4 text-sm text-rose-600 bg-rose-50 rounded-lg">{error}</div>}

              {!error && (
                <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8">
                  <div className="md:col-span-2">
                    <div className="relative">
                      {currentImage ? (
                        <img src={currentImage} alt="preview" className="w-full aspect-square rounded-xl object-cover shadow-lg" />
                      ) : (
                        <div className="w-full aspect-square bg-gradient-to-br from-[#F5F5F7] to-[#EBEBF0] rounded-xl flex items-center justify-center text-[#6B7280]">Sin imagen</div>
                      )}
                      {allImages.length > 1 && (
                        <>
                          <button type="button" onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition">
                            <svg className="w-5 h-5 text-[#0F0F10]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button type="button" onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition">
                            <svg className="w-5 h-5 text-[#0F0F10]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                            {imageIndex + 1} / {allImages.length}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {Array.isArray(data.images) && data.images.map((img, i) => (
                        <div key={i} className="relative group cursor-pointer" onClick={() => setImageIndex(i)}>
                          <img src={img} alt="thumb" className={`w-full aspect-square object-cover rounded-lg shadow-sm transition ${imageIndex === i ? 'ring-2 ring-[#E11D74]' : ''}`} />
                        </div>
                      ))}
                      <label className="flex items-center justify-center aspect-square border-2 border-dashed border-[#E5E7EB] rounded-lg cursor-pointer text-xs text-[#6B7280] hover:bg-[#F9FAFB] transition">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const images = files.filter(f => f.type && f.type.startsWith('image/'));
                            if (images.length !== files.length) {
                              setError('Solo se permiten archivos de imagen (PNG, JPG, WebP, etc.)');
                            } else {
                              setError('');
                            }
                            // Evitar duplicados por nombre+size
                            setNewFiles(prev => {
                              const merged = [...prev, ...images];
                              const seen = new Set();
                              return merged.filter(f => {
                                const key = `${f.name}-${f.size}`;
                                if (seen.has(key)) return false;
                                seen.add(key);
                                return true;
                              });
                            });
                            if (images.length) setImageIndex(0);
                            // permitir volver a seleccionar los mismos archivos
                            e.target.value = '';
                          }}
                        />
                        <span className="text-center text-xs">+ Agregar</span>
                      </label>
                    </div>
                    {!!newFiles.length && (
                      <div className="mt-4 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                        <div className="text-xs font-medium text-[#6B7280] mb-2">Por subir:</div>
                        <div className="grid grid-cols-4 gap-2">
                          {newFiles.map((f, i) => (
                            <div key={`${f.name}-${f.size}-${i}`} className="relative group cursor-pointer" onClick={() => setImageIndex(Array.isArray(data.images) ? data.images.length + i : i)}>
                              <img src={URL.createObjectURL(f)} alt={String(f.name)} className="w-full aspect-square object-cover rounded-lg" />
                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNewFiles(prev => {
                                    const arr = [...prev];
                                    arr.splice(i, 1);
                                    return arr;
                                  });
                                  setImageIndex(prev => {
                                    const base = Array.isArray(data.images) ? data.images.length : 0;
                                    const current = prev - base; // index en newFiles
                                    if (current === i) return 0;
                                    if (current > i) return prev - 1;
                                    return prev;
                                  });
                                }}
                                aria-label="Quitar imagen"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-3 space-y-6 pt-0 md:pt-2">
                    <div>
                      <h2 className="text-2xl font-bold text-[#0F0F10] mb-2 font-['Orbitron',_sans-serif] leading-tight">Crear producto</h2>
                      <p className="text-sm text-[#6B7280] font-['Rajdhani',_sans-serif]">Completa todos los campos obligatorios</p>
                    </div>

                    <div className="space-y-3 bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                      <Field label="Nombre" required error={errors.name}>
                        <input
                          value={data.name}
                          onChange={(e) => { const v = e.target.value; setField('name', v); setErrors(prev => ({ ...prev, name: validateField('name', v) })); }}
                          placeholder="Nombre del producto"
                          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74]/20 focus:border-[#E11D74]"
                        />
                      </Field>
                      <Field label="SKU">
                        <input value={data.sku} onChange={(e) => setField('sku', e.target.value)} placeholder="ej: PROD-001" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74]/20 focus:border-[#E11D74]" />
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Precio" required error={errors.price}>
                          <input type="number" min="0" step="0.01" value={data.price} onChange={(e) => { const v = e.target.value; setField('price', v); setErrors(prev => ({ ...prev, price: validateField('price', v) })); }} placeholder="0.00" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74]/20 focus:border-[#E11D74]" />
                          </Field>
                        <Field label="Stock" required error={errors.stock}>
                          <input type="number" min="0" value={data.stock} onChange={(e) => { const v = e.target.value; setField('stock', v); setErrors(prev => ({ ...prev, stock: validateField('stock', v) })); }} placeholder="0" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74]/20 focus:border-[#E11D74]" />
                         </Field>
                       </div>
                      <Field label="Categoría" required error={errors.category}>
                        <select value={data.category} onChange={(e) => { const v = e.target.value; setField('category', v); setErrors(prev => ({ ...prev, category: validateField('category', v) })); }} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74]/20 focus:border-[#E11D74]">
                          <option value="">Selecciona una categoría</option>
                          {categories.map(c => (
                            <option key={c._id} value={c._id}>{c.name || c.title}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Descripción" required error={errors.description}>
                        <textarea value={data.description} onChange={(e) => { const v = e.target.value; setField('description', v); setErrors(prev => ({ ...prev, description: validateField('description', v) })); }} placeholder="Describe el producto..." className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm min-h-20 focus:ring-2 focus:ring-[#E11D74]/20 focus:border-[#E11D74]" />
                      </Field>
                      <div className="grid grid-cols-1 gap-3">
                        <Field label="Talles (separados por coma)">
                          <input value={sizesText} onChange={(e) => setSizesText(e.target.value)} onBlur={() => setField('sizes', sizesText.split(',').map(s => s.trim()).filter(Boolean))} placeholder="ej: S, M, L, XL" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74]/20 focus:border-[#E11D74]" />
                        </Field>
                        <Field label="Colores (separados por coma)">
                          <input value={colorsText} onChange={(e) => setColorsText(e.target.value)} onBlur={() => setField('colors', colorsText.split(',').map(s => s.trim()).filter(Boolean))} placeholder="ej: Negro, Azul, Rojo" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74]/20 focus:border-[#E11D74]" />
                        </Field>
                        <Field label="Tags (separados por coma)">
                          <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} onBlur={() => setField('tags', tagsText.split(',').map(s => s.trim()).filter(Boolean))} placeholder="ej: running, hombre, deportivo" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E11D74]/20 focus:border-[#E11D74]" />
                        </Field>
                      </div>
                    </div>

                    <div className="border-t border-[#E5E7EB] pt-4">
                      <div className="flex items-center justify-between gap-2">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-[#E5E7EB] text-[#0F0F10] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition">Cancelar</button>
                        <button disabled={saving} onClick={onSave} className="flex-1 px-4 py-2.5 bg-[#E11D74] text-white rounded-lg text-sm font-medium hover:bg-[#C4165F] transition disabled:opacity-60 font-['Quantico',_sans-serif]">{saving ? 'Creando...' : 'Crear producto'}</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
