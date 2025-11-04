import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService } from '../services/orderService';
import productService from '../../shop/services/productService';
import RatingStars from '../../shop/components/RatingStars';

export default function OrderReviewContent() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [order, setOrder] = React.useState(null);
  const [formByProduct, setFormByProduct] = React.useState({});

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await orderService.getOrderById(orderId);
        const data = res?.data || res;
        setOrder(data || null);
        // Inicializar formularios por producto
        const next = {};
        (data?.items || []).forEach((it) => {
          const pid = it?.productId || it?.product?._id || it?.id;
          if (!pid) return;
          next[pid] = { rating: 0, comment: '' };
        });
        setFormByProduct(next);
      } catch (e) {
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
      if (!form || !form.rating) {
        alert('Seleccioná una calificación');
        return;
      }
      setSaving(true);
      await productService.createReview(productId, {
        rating: form.rating,
        comment: form.comment || '',
        orderId,
      });
      // Feedback y limpiar
      alert('¡Gracias por tu reseña!');
      setFormByProduct((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], rating: 0, comment: '' },
      }));
    } catch (e) {
      alert(e?.message || 'No se pudo enviar la reseña');
    } finally {
      setSaving(false);
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

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold font-['Orbitron',_sans-serif] text-[#0F0F10]">Escribir reseñas</h1>
        <p className="text-[#2A2A2A] font-['Rajdhani',_sans-serif]">Pedido #{order.id || order._id}</p>
      </motion.div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">No hay productos en este pedido.</div>
        ) : (
          items.map((it, idx) => {
            const productId = it?.productId || it?.product?._id || it?.id;
            const productName = it?.name || it?.product?.name || 'Producto';
            const form = formByProduct[productId] || { rating: 0, comment: '' };
            return (
              <motion.div key={productId || idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#0F0F10] font-['Quantico',_sans-serif] mb-1">{productName}</h3>
                    <div className="mb-3">
                      <RatingStars
                        rating={form.rating}
                        editable
                        size="lg"
                        onChange={(value) => handleChange(productId, 'rating', value)}
                      />
                    </div>
                    <textarea
                      value={form.comment}
                      onChange={(e) => handleChange(productId, 'comment', e.target.value)}
                      rows={3}
                      placeholder="Escribí tu experiencia con el producto..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#E11D74]/30 focus:border-[#E11D74] font-['Rajdhani',_sans-serif]"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      disabled={saving}
                      onClick={() => handleSubmit(productId)}
                      className={`px-5 py-2 rounded-lg text-white font-['Quantico',_sans-serif] transition ${saving ? 'bg-[#2A2A2A] cursor-not-allowed' : 'bg-[#0F0F10] hover:bg-[#E11D74]'}`}
                    >
                      {saving ? 'Enviando...' : 'Enviar reseña'}
                    </button>
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


