import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import productService from '../../../shop/services/productService';
import authService from '../../../auth/services/authService';
import { uploadProductImages } from '../../../../modules/uploadImages';

function Field({ label, children, required }) {
  return (
    <fieldset>
      <label className="block text-xs font-medium text-[#0F0F10] mb-2 font-['Orbitron',_sans-serif]">{label} {required && <span className="text-[#E11D74]">*</span>}</label>
      {children}
    </fieldset>
  );
}

function StarRating({ value = 0 }) {
  const v = Math.round(value);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < v ? 'text-[#EAB308]' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10.95 13.9a1 1 0 0 0-1.175 0l-2.985 2.082c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L3.154 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductEdit({ open, onClose, productId, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [sizesText, setSizesText] = useState('');
  const [colorsText, setColorsText] = useState('');
  const [tagsText, setTagsText] = useState('');

  useEffect(() => {
    if (!open || !productId) return;
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      setError('');
      setImageIndex(0);
      try {
        const res = await productService.getProductById(productId);
        const prod = res?.data || res?.product || res;
        setData(prod);
      } catch (e) {
        if (e?.name === 'AbortError') return;
        setError(e?.message || 'Error al cargar producto');
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [open, productId]);

  // Inicializar textos cuando entramos en modo edición
  useEffect(() => {
    if (isEditing && data) {
      setSizesText(Array.isArray(data.sizes) ? data.sizes.join(', ') : '');
      setColorsText(Array.isArray(data.colors) ? data.colors.join(', ') : '');
      setTagsText(Array.isArray(data.tags) ? data.tags.join(', ') : '');
    }
  }, [isEditing, data]);

  const setField = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const allImages = useMemo(() => {
    const existing = Array.isArray(data?.images) ? data.images : [];
    const previews = newFiles.map(f => URL.createObjectURL(f));
    return [...existing, ...previews];
  }, [data, newFiles]);

  const currentImage = useMemo(() => allImages[imageIndex] || '', [allImages, imageIndex]);

  const displayRating = useMemo(() => data?.averageRating ?? 0, [data]);
  const displayReviews = useMemo(() => data?.reviewsCount ?? 0, [data]);

  const prevImage = () => {
    setImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const onSave = async () => {
    if (!data?._id) return;
    setSaving(true);
    setError('');
    try {
      const token = authService.getToken?.() || localStorage.getItem('authToken') || localStorage.getItem('token') || '';
      let images = Array.isArray(data.images) ? [...data.images] : [];
      if (newFiles && newFiles.length) {
        const invalid = newFiles.find(f => !f.type.startsWith('image/') || f.size > 5 * 1024 * 1024);
        if (invalid) throw new Error('Solo imágenes (≤5MB) están permitidas');
        console.debug('[ProductEdit] Subiendo imágenes', { count: newFiles.length, names: newFiles.map(f => f.name) });
        const { urls } = await uploadProductImages(newFiles, token, undefined, 'images');
        console.debug('[ProductEdit] URLs recibidas', urls);
        images = [...images, ...urls];
      }
      // Parsear listas desde textos si hace falta
      const sizesArr = (Array.isArray(data.sizes) && data.sizes.length ? data.sizes : sizesText.split(',').map(s => s.trim())).filter(Boolean);
      const colorsArr = (Array.isArray(data.colors) && data.colors.length ? data.colors : colorsText.split(',').map(s => s.trim())).filter(Boolean);
      const tagsArr = (Array.isArray(data.tags) && data.tags.length ? data.tags : tagsText.split(',').map(s => s.trim())).filter(Boolean);
      const payload = {
        name: data.name,
        sku: data.sku,
        description: data.description,
        price: Number(data.price),
        category: typeof data.category === 'object' ? data.category?._id : data.category,
        stock: Number(data.stock ?? 0),
        images,
        sizes: sizesArr,
        colors: colorsArr,
        tags: tagsArr,
      };
      console.debug('[ProductEdit] Guardando producto', { id: data._id, payload });
      await productService.makeRequest(`/products/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      console.debug('[ProductEdit] Guardado OK');
      setIsEditing(false);
      setNewFiles([]);
      if (onSaved) onSaved();
    } catch (e) {
      console.error('[ProductEdit] Error al guardar', e);
      setError(e?.message || 'Error al guardar');
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

              {loading && <div className="flex items-center justify-center w-full h-96 text-[#6B7280]">Cargando...</div>}
              {!loading && error && <div className="w-full p-4 text-sm text-rose-600 bg-rose-50 rounded-lg">{error}</div>}
              {!loading && !error && data && (
                <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8">
                  <div className="md:col-span-2">
                    <div className="relative">
                      {currentImage ? (
                        <img src={currentImage} alt={data.name} className="w-full aspect-square rounded-xl object-cover shadow-lg" />
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
                          <img src={img} alt={data.name} className={`w-full aspect-square object-cover rounded-lg shadow-sm transition ${imageIndex === i ? 'ring-2 ring-[#E11D74]' : ''}`} />
                          {isEditing && (
                            <button type="button" onClick={(e) => { e.stopPropagation(); setData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) })); }} className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition">Quitar</button>
                          )}
                      </div>
                      ))}
                      {isEditing && (
                        <label className="flex items-center justify-center aspect-square border-2 border-dashed border-[#E5E7EB] rounded-lg cursor-pointer text-xs text-[#6B7280] hover:bg-[#F9FAFB] transition">
                          <input type="file" multiple className="hidden" onChange={(e) => setNewFiles(Array.from(e.target.files || []))} />
                          <span className="text-center text-xs">+ Agregar</span>
                        </label>
                      )}
                    </div>
                    {!!newFiles.length && (
                      <div className="mt-4 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                        <div className="text-xs font-medium text-[#6B7280] mb-2">Por subir:</div>
                        <div className="grid grid-cols-4 gap-2">
                          {newFiles.map((f, i) => (
                            <div key={i} className="relative cursor-pointer" onClick={() => setImageIndex(Array.isArray(data.images) ? data.images.length + i : i)}>
                              <img src={URL.createObjectURL(f)} alt={String(f.name)} className="w-full aspect-square object-cover rounded-lg" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-3 space-y-6 pt-0 md:pt-2">
                    <div>
                      <h2 className="text-2xl font-bold text-[#0F0F10] mb-2 font-['Orbitron',_sans-serif] leading-tight">{data.name}</h2>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <StarRating value={displayRating} />
                          <span className="text-sm text-[#6B7280] ml-1">({displayReviews})</span>
                        </div>
                        <span className="text-2xl font-bold text-[#0F0F10]">${typeof data.price === 'number' ? data.price.toFixed(2) : data.price}</span>
                        </div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${(data.stock ?? 0) > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {(data.stock ?? 0) > 0 ? 'En stock' : 'Sin stock'} ({data.stock ?? 0})
                              </span>
                        </div>

                    {isEditing ? (
                      <div className="space-y-3 bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                        <Field label="Nombre">
                          <input disabled={!isEditing} value={data.name || ''} onChange={(e) => setField('name', e.target.value)} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm disabled:bg-white disabled:text-[#6B7280]" />
                        </Field>
                        <Field label="SKU">
                          <input disabled={!isEditing} value={data.sku || ''} onChange={(e) => setField('sku', e.target.value)} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm disabled:bg-white disabled:text-[#6B7280]" />
                        </Field>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Precio">
                            <input type="number" min="0" disabled={!isEditing} value={data.price ?? ''} onChange={(e) => setField('price', e.target.value)} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm disabled:bg-white disabled:text-[#6B7280]" />
                          </Field>
                          <Field label="Stock">
                            <input type="number" min="0" disabled={!isEditing} value={data.stock ?? 0} onChange={(e) => setField('stock', e.target.value)} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm disabled:bg-white disabled:text-[#6B7280]" />
                          </Field>
                        </div>
                        <Field label="Descripción">
                          <textarea disabled={!isEditing} value={data.description || ''} onChange={(e) => setField('description', e.target.value)} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm min-h-20 disabled:bg-white disabled:text-[#6B7280]" />
                        </Field>
                        <div className="grid grid-cols-1 gap-3">
                          <Field label="Talles (separados por coma)">
                            <input disabled={!isEditing} value={sizesText} onChange={(e) => setSizesText(e.target.value)} onBlur={() => setField('sizes', sizesText.split(',').map(s => s.trim()).filter(Boolean))} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm disabled:bg-white disabled:text-[#6B7280]" />
                          </Field>
                          <Field label="Colores (separados por coma)">
                            <input disabled={!isEditing} value={colorsText} onChange={(e) => setColorsText(e.target.value)} onBlur={() => setField('colors', colorsText.split(',').map(s => s.trim()).filter(Boolean))} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm disabled:bg-white disabled:text-[#6B7280]" />
                          </Field>
                          <Field label="Tags (separados por coma)">
                            <input disabled={!isEditing} value={tagsText} onChange={(e) => setTagsText(e.target.value)} onBlur={() => setField('tags', tagsText.split(',').map(s => s.trim()).filter(Boolean))} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm disabled:bg-white disabled:text-[#6B7280]" />
                          </Field>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {data.description && (
                          <div>
                            <h4 className="text-xs font-medium text-[#6B7280] mb-1">Descripción</h4>
                            <p className="text-[#0F0F10] leading-relaxed">{data.description}</p>
                          </div>
                        )}
                        {Array.isArray(data.sizes) && data.sizes.length > 0 && (
                          <div>
                            <h4 className="text-xs font-medium text-[#6B7280] mb-1">Talles</h4>
                            <div className="flex flex-wrap gap-1">{data.sizes.map((s, i) => <span key={i} className="px-2 py-0.5 bg-[#F5F5F7] text-[#0F0F10] rounded text-xs">{s}</span>)}</div>
                          </div>
                        )}
                        {Array.isArray(data.colors) && data.colors.length > 0 && (
                          <div>
                            <h4 className="text-xs font-medium text-[#6B7280] mb-1">Colores</h4>
                            <div className="flex flex-wrap gap-1">{data.colors.map((c, i) => <span key={i} className="px-2 py-0.5 bg-[#F5F5F7] text-[#0F0F10] rounded text-xs">{c}</span>)}</div>
                          </div>
                        )}
                        {Array.isArray(data.tags) && data.tags.length > 0 && (
                          <div>
                            <h4 className="text-xs font-medium text-[#6B7280] mb-1">Tags</h4>
                            <div className="flex flex-wrap gap-1">{data.tags.map((t, i) => <span key={i} className="px-2 py-0.5 bg-[#F5F5F7] text-[#0F0F10] rounded text-xs">{t}</span>)}</div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="border-t border-[#E5E7EB] pt-4">
                      <div className="flex items-center justify-between gap-2">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-[#E5E7EB] text-[#0F0F10] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition">Cerrar</button>
                        {!isEditing && (
                          <button onClick={() => setIsEditing(true)} className="flex-1 px-4 py-2.5 bg-[#0F0F10] text-white rounded-lg text-sm font-medium hover:bg-[#111827] transition font-['Quantico',_sans-serif]">Editar</button>
                        )}
                        {isEditing && (
                          <>
                            <button disabled={saving} onClick={() => setIsEditing(false)} className="flex-1 px-4 py-2.5 border border-[#E5E7EB] text-[#0F0F10] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition disabled:opacity-60 font-['Quantico',_sans-serif]">Cancelar</button>
                            <button disabled={saving} onClick={onSave} className="flex-1 px-4 py-2.5 bg-[#E11D74] text-white rounded-lg text-sm font-medium hover:bg-[#C4165F] transition disabled:opacity-60 font-['Quantico',_sans-serif]">{saving ? 'Guardando...' : 'Guardar'}</button>
                          </>
                        )}
                      </div>
                </div>
              </div>
                </div>
              )}

              {isEditing && !loading && !error && data && (
                <div className="absolute inset-0 pointer-events-none border-2 border-[#E11D74]/20 rounded-2xl" />
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

