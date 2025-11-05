import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService } from '../services/orderService';
import productService from '../../shop/services/productService';
import RatingStars from '../../shop/components/RatingStars';
import { useAuth } from '../../auth/context/AuthContext';

export default function OrderReviewContent() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState({});
  const [error, setError] = React.useState('');
  const [order, setOrder] = React.useState(null);
  const [formByProduct, setFormByProduct] = React.useState({});
  const [existingReviews, setExistingReviews] = React.useState({}); // productId -> review
  const [editingReview, setEditingReview] = React.useState({}); // productId -> boolean

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await orderService.getOrderById(orderId);
        const data = res?.data || res;
        
        console.log('📦 Datos del pedido recibidos en OrderReviewContent:', {
          orderId,
          data: data,
          products: data?.products,
          items: data?.items,
          productsCount: data?.products?.length || 0,
          itemsCount: data?.items?.length || 0
        });
        
        setOrder(data || null);
        
        // Normalizar productos/items - el backend usa 'products'
        const orderProducts = Array.isArray(data?.products) 
          ? data.products 
          : (Array.isArray(data?.items) ? data.items : []);
        
        // Inicializar formularios por producto y cargar reseñas existentes
        const next = {};
        const reviewsMap = {};
        
        // Cargar reseñas existentes del usuario para cada producto
        for (const it of orderProducts) {
          // El backend usa: products[].product._id
          const pid = it?.product?._id || it?.product?.id || it?.productId || it?._id || it?.id;
          if (!pid) {
            console.warn('⚠️ Producto sin ID:', it);
            continue;
          }
          
          // Inicializar formulario vacío
          next[pid] = { rating: 0, comment: '' };
          
          // Cargar reseña existente del usuario para este producto
          try {
            const reviewsResponse = await productService.getReviews(pid, { page: 1, limit: 10 });
            const reviews = reviewsResponse?.data?.reviews || reviewsResponse?.reviews || reviewsResponse?.data || [];
            
            // Buscar reseña del usuario actual
            const userReview = reviews.find(r => {
              const reviewUserId = r.user?._id || r.user?.id || r.userId;
              const currentUserId = user?._id || user?.id;
              return reviewUserId === currentUserId;
            });
            
            if (userReview) {
              reviewsMap[pid] = userReview;
              // Inicializar formulario con datos de la reseña existente
              next[pid] = {
                rating: userReview.rating || 0,
                comment: userReview.comment || '',
                reviewId: userReview._id || userReview.id,
                submitted: true
              };
            }
          } catch (err) {
            console.warn(`⚠️ No se pudo cargar reseñas para producto ${pid}:`, err);
          }
        }
        
        console.log('📝 Formularios inicializados:', next);
        console.log('📝 Reseñas existentes:', reviewsMap);
        setFormByProduct(next);
        setExistingReviews(reviewsMap);
      } catch (e) {
        console.error('❌ Error cargando pedido:', e);
        setError(e?.message || 'Error al cargar el pedido');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  const handleChange = (productId, key, value) => {
    setFormByProduct((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (productId) => {
    try {
      const form = formByProduct[productId];
      if (!form || !form.rating || form.rating === 0) {
        alert('Por favor, seleccioná una calificación con estrellas');
        return;
      }
      
      // Verificar que el productId es válido
      const validProductId = String(productId || '').trim();
      if (!validProductId || validProductId === 'undefined' || validProductId === 'null' || validProductId === '') {
        console.error('❌ ProductId inválido:', {
          productId,
          validProductId,
          type: typeof productId,
          form: form
        });
        alert('Error: No se pudo identificar el producto. Por favor, recargá la página.');
        return;
      }
      
      setSaving(prev => ({ ...prev, [validProductId]: true }));
      
      console.log('📝 Enviando reseña:', {
        productId: validProductId,
        rating: form.rating,
        comment: form.comment,
        orderId,
        reviewId: form.reviewId,
        payload: {
          productId: validProductId,
          rating: Number(form.rating),
          comment: (form.comment || '').trim(),
          orderId: orderId
        }
      });
      
      let response;
      
      // Si ya existe una reseña, actualizarla; si no, crearla
      if (form.reviewId) {
        // Actualizar reseña existente
        response = await productService.updateReview(form.reviewId, {
          rating: form.rating,
          comment: form.comment || '',
        });
        console.log('✅ Reseña actualizada exitosamente:', response);
        alert('¡Reseña actualizada exitosamente!');
      } else {
        // Crear nueva reseña
        console.log('📤 Llamando a productService.createReview con:', {
          productId: validProductId,
          rating: form.rating,
          comment: form.comment || '',
          orderId: orderId
        });
        
        response = await productService.createReview(validProductId, {
          rating: form.rating,
          comment: form.comment || '',
          orderId,
        });
        
        console.log('✅ Respuesta del servidor:', response);
        console.log('✅ Reseña guardada exitosamente:', response);
        alert('¡Gracias por tu reseña! Tu opinión ayudará a otros clientes.');
      }
      
      // Actualizar estado con la reseña guardada
      const updatedReview = response?.data || response;
      setExistingReviews(prev => ({
        ...prev,
        [validProductId]: updatedReview
      }));
      
      // Marcar como enviado
      setFormByProduct((prev) => ({
        ...prev,
        [validProductId]: { 
          ...prev[validProductId], 
          rating: form.rating, 
          comment: form.comment || '',
          reviewId: updatedReview._id || updatedReview.id || form.reviewId,
          submitted: true 
        },
      }));
      
      // Salir del modo edición si estaba editando
      setEditingReview(prev => ({ ...prev, [validProductId]: false }));
      
    } catch (e) {
      console.error('❌ Error completo al enviar reseña:', {
        error: e,
        message: e?.message,
        stack: e?.stack,
        productId: validProductId,
        orderId: orderId,
        form: form
      });
      const errorMessage = e?.message || 'No se pudo enviar la reseña. Por favor, intentá de nuevo.';
      alert(errorMessage);
    } finally {
      setSaving(prev => ({ ...prev, [validProductId]: false }));
    }
  };

  const handleEdit = (productId) => {
    setEditingReview(prev => ({ ...prev, [productId]: true }));
    // Mantener los valores actuales del formulario
  };

  const handleCancelEdit = (productId) => {
    const existingReview = existingReviews[productId];
    if (existingReview) {
      // Restaurar valores de la reseña existente
      setFormByProduct(prev => ({
        ...prev,
        [productId]: {
          rating: existingReview.rating || 0,
          comment: existingReview.comment || '',
          reviewId: existingReview._id || existingReview.id,
          submitted: true
        }
      }));
    }
    setEditingReview(prev => ({ ...prev, [productId]: false }));
  };

  const handleDelete = async (productId) => {
    const form = formByProduct[productId];
    const reviewId = form.reviewId || existingReviews[productId]?._id || existingReviews[productId]?.id;
    
    if (!reviewId) {
      alert('No se encontró la reseña para eliminar.');
      return;
    }
    
    if (!confirm('¿Estás seguro de que querés eliminar tu reseña? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      setSaving(prev => ({ ...prev, [productId]: true }));
      
      await productService.deleteReview(reviewId);
      console.log('✅ Reseña eliminada exitosamente');
      alert('Reseña eliminada exitosamente.');
      
      // Limpiar estado
      setExistingReviews(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      
      setFormByProduct(prev => ({
        ...prev,
        [productId]: { rating: 0, comment: '', submitted: false }
      }));
      
      setEditingReview(prev => ({ ...prev, [productId]: false }));
      
    } catch (e) {
      console.error('❌ Error al eliminar reseña:', e);
      alert(e?.message || 'No se pudo eliminar la reseña. Por favor, intentá de nuevo.');
    } finally {
      setSaving(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-[#E11D74] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-red-200 p-10 text-center shadow-sm">
          <p className="text-red-600 font-semibold mb-4">{error || 'No se encontró el pedido'}</p>
          <button onClick={() => navigate('/order-history')} className="px-5 py-2 rounded-lg bg-[#0F0F10] text-white hover:bg-[#E11D74] transition">Volver a Mis Pedidos</button>
        </div>
      </div>
    );
  }

  // Normalizar productos/items - el backend usa 'products'
  const orderProducts = Array.isArray(order.products) 
    ? order.products 
    : (Array.isArray(order.items) ? order.items : []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold font-['Orbitron',_sans-serif] text-[#0F0F10]">Escribir reseñas</h1>
        <p className="text-[#2A2A2A] font-['Rajdhani',_sans-serif]">Pedido #{order.id || order._id}</p>
      </motion.div>

      <div className="space-y-4">
        {orderProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-600 mb-2">No hay productos en este pedido.</p>
            <p className="text-sm text-gray-400">
              {order.products === undefined && order.items === undefined 
                ? 'Los productos no están disponibles en la respuesta del servidor'
                : 'Este pedido no contiene productos para reseñar'}
            </p>
          </div>
        ) : (
          orderProducts.map((it, idx) => {
            // El backend usa: products[].product._id, products[].product.name, etc.
            const product = it.product || {};
            const productId = product._id || product.id || it.productId || it._id || it.id;
            const productName = product.name || it.name || 'Producto';
            const productDescription = product.description || it.description || '';
            // Manejar images como array o string
            const productImage = Array.isArray(product.images) && product.images.length > 0
              ? product.images[0]
              : (product.image || it.image || null);
            
            const form = formByProduct[productId] || { rating: 0, comment: '' };
            const isSubmitted = form.submitted === true;
            const isEditing = editingReview[productId] === true;
            const isSaving = saving[productId] === true;
            const hasExistingReview = !!existingReviews[productId] || !!form.reviewId;
            
            return (
              <motion.div 
                key={productId || idx} 
                initial={{ opacity: 0, y: 8 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow ${
                  isSubmitted ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-6">
                  {/* Imagen del producto */}
                  {productImage && (
                    <div className="flex-shrink-0">
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-[#0F0F10] font-['Quantico',_sans-serif]">
                        {productName}
                      </h3>
                      {isSubmitted && (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Enviada</span>
                        </span>
                      )}
                    </div>
                    
                    {productDescription && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 font-['Rajdhani',_sans-serif]">
                        {productDescription}
                      </p>
                    )}
                    
                    {!isSubmitted || isEditing ? (
                      <>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Rajdhani',_sans-serif]">
                            Calificación: <span className="text-red-500">*</span>
                          </label>
                          <RatingStars
                            rating={form.rating}
                            editable
                            size="lg"
                            onChange={(value) => handleChange(productId, 'rating', value)}
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Rajdhani',_sans-serif]">
                            Comentario (opcional):
                          </label>
                          <textarea
                            value={form.comment}
                            onChange={(e) => handleChange(productId, 'comment', e.target.value)}
                            rows={3}
                            placeholder="Escribí tu experiencia con el producto..."
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] font-['Rajdhani',_sans-serif] resize-none"
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          {isEditing && (
                            <button
                              onClick={() => handleCancelEdit(productId)}
                              disabled={isSaving}
                              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-['Quantico',_sans-serif] disabled:opacity-50"
                            >
                              Cancelar
                            </button>
                          )}
                          <button
                            disabled={isSaving || !form.rating || form.rating === 0}
                            onClick={() => handleSubmit(productId)}
                            className={`px-6 py-2 rounded-lg text-white font-['Quantico',_sans-serif] transition ${
                              isSaving || !form.rating || form.rating === 0
                                ? 'bg-[#2A2A2A] cursor-not-allowed opacity-50'
                                : 'bg-[#0F0F10] hover:bg-[#E11D74] hover:shadow-md'
                            }`}
                          >
                            {isSaving ? 'Enviando...' : (isEditing ? 'Guardar cambios' : 'Enviar reseña')}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <RatingStars rating={form.rating} editable={false} size="md" />
                              <span className="text-sm text-gray-600 font-['Rajdhani',_sans-serif]">
                                Tu calificación
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(productId)}
                                disabled={isSaving}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                                title="Editar reseña"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(productId)}
                                disabled={isSaving}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                title="Eliminar reseña"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {form.comment && (
                            <p className="text-gray-700 text-sm font-['Rajdhani',_sans-serif] mt-2">
                              {form.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-6">
        <button onClick={() => navigate('/order-history')} className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-['Rajdhani',_sans-serif]">Volver a Mis Pedidos</button>
      </div>
    </div>
  );
}


