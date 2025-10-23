import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';

const OrderHistoryContent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock data más completo - luego conectar con API
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      date: '2025-01-15',
      status: 'En camino',
      total: 125.99,
      items: [
        { id: 1, name: 'Laptop Gaming Pro', quantity: 1, price: 89.99, image: '/api/placeholder/80/80' },
        { id: 2, name: 'Mouse Inalámbrico', quantity: 2, price: 18.00, image: '/api/placeholder/80/80' }
      ],
      tracking: 'TRK123456789',
      estimatedDelivery: '2025-01-18',
      shippingAddress: {
        street: 'Av. Reforma 123',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '01000'
      },
      paymentMethod: 'Tarjeta terminada en 1234'
    },
    {
      id: 'ORD-002', 
      date: '2025-01-10',
      status: 'Entregado',
      total: 89.50,
      items: [
        { id: 3, name: 'Teclado Mecánico', quantity: 1, price: 65.50, image: '/api/placeholder/80/80' },
        { id: 4, name: 'Auriculares Bluetooth', quantity: 1, price: 24.00, image: '/api/placeholder/80/80' }
      ],
      tracking: 'TRK987654321',
      estimatedDelivery: '2025-01-13',
      deliveredDate: '2025-01-12',
      shippingAddress: {
        street: 'Calle Principal 456',
        city: 'Guadalajara',
        state: 'Jalisco',
        zipCode: '44100'
      },
      paymentMethod: 'PayPal'
    },
    {
      id: 'ORD-003',
      date: '2025-01-05',
      status: 'Procesando',
      total: 256.00,
      items: [
        { id: 5, name: 'Monitor 4K', quantity: 1, price: 199.99, image: '/api/placeholder/80/80' },
        { id: 6, name: 'Cable HDMI', quantity: 2, price: 15.00, image: '/api/placeholder/80/80' },
        { id: 7, name: 'Soporte Monitor', quantity: 1, price: 26.01, image: '/api/placeholder/80/80' }
      ],
      tracking: null,
      estimatedDelivery: '2025-01-12',
      shippingAddress: {
        street: 'Plaza Central 789',
        city: 'Monterrey',
        state: 'Nuevo León',
        zipCode: '64000'
      },
      paymentMethod: 'Transferencia bancaria'
    },
    {
      id: 'ORD-004',
      date: '2024-12-28',
      status: 'Cancelado',
      total: 67.25,
      items: [
        { id: 8, name: 'Webcam HD', quantity: 1, price: 67.25, image: '/api/placeholder/80/80' }
      ],
      tracking: null,
      estimatedDelivery: null,
      cancelledDate: '2024-12-29',
      cancellationReason: 'Producto agotado',
      shippingAddress: {
        street: 'Av. Insurgentes 321',
        city: 'Puebla',
        state: 'Puebla',
        zipCode: '72000'
      },
      paymentMethod: 'Tarjeta terminada en 5678'
    },
    {
      id: 'ORD-005',
      date: '2024-12-20',
      status: 'Entregado',
      total: 145.75,
      items: [
        { id: 9, name: 'Tablet Pro', quantity: 1, price: 129.99, image: '/api/placeholder/80/80' },
        { id: 10, name: 'Funda Protectora', quantity: 1, price: 15.76, image: '/api/placeholder/80/80' }
      ],
      tracking: 'TRK555666777',
      estimatedDelivery: '2024-12-23',
      deliveredDate: '2024-12-22',
      shippingAddress: {
        street: 'Calle del Sol 654',
        city: 'Tijuana',
        state: 'Baja California',
        zipCode: '22000'
      },
      paymentMethod: 'Efectivo contra entrega'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'En camino':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Entregado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Procesando':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'En camino':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'Entregado':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'Procesando':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Cancelado':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    // Filtro por tab activo
    if (activeTab !== 'all') {
      const statusMatch = order.status.toLowerCase().replace(' ', '') === activeTab;
      if (!statusMatch) return false;
    }

    // Filtro por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower)) ||
        order.shippingAddress.city.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Ordenar órdenes
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'total':
        aValue = a.total;
        bValue = b.total;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = new Date(a.date);
        bValue = new Date(b.date);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const tabs = [
    { id: 'all', label: 'Todos', count: orders.length },
    { id: 'procesando', label: 'Procesando', count: orders.filter(o => o.status === 'Procesando').length },
    { id: 'encamino', label: 'En camino', count: orders.filter(o => o.status === 'En camino').length },
    { id: 'entregado', label: 'Entregado', count: orders.filter(o => o.status === 'Entregado').length },
    { id: 'cancelado', label: 'Cancelado', count: orders.filter(o => o.status === 'Cancelado').length }
  ];

  const handleReorder = (order) => {
    // Simular reordenar productos
    console.log('Reordenando:', order);
    navigate('/cart', { state: { reorderItems: order.items } });
  };

  const handleDownloadInvoice = (orderId) => {
    // Simular descarga de factura
    console.log('Descargando factura para:', orderId);
    // Aquí iría la lógica para generar y descargar la factura
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Acceso requerido
          </h3>
          <p className="text-gray-500 mb-4">
            Debes iniciar sesión para ver tu historial de pedidos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Historial de Pedidos
        </h1>
        <p className="text-gray-600">
          Revisa y gestiona todos tus pedidos anteriores
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por ID de pedido, producto o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Ordenar */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Fecha</option>
              <option value="total">Total</option>
              <option value="status">Estado</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Ordenar ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
            >
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron pedidos' : 'No hay pedidos'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Aún no tienes pedidos en esta categoría'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/shop')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explorar Productos
              </button>
            )}
          </div>
        ) : (
          sortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pedido #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Realizado el {new Date(order.date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </span>
                  </div>

                  {/* Información del pedido */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Productos:</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
                      </span>
                    </div>
                    {order.tracking && (
                      <div>
                        <span className="text-gray-500">Tracking:</span>
                        <span className="ml-2 font-mono text-sm text-blue-600">
                          {order.tracking}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Fechas importantes */}
                  <div className="text-sm text-gray-500 space-y-1">
                    {order.estimatedDelivery && (
                      <div>
                        Entrega estimada: {new Date(order.estimatedDelivery).toLocaleDateString('es-ES')}
                      </div>
                    )}
                    {order.deliveredDate && (
                      <div>
                        Entregado el: {new Date(order.deliveredDate).toLocaleDateString('es-ES')}
                      </div>
                    )}
                    {order.cancelledDate && (
                      <div>
                        Cancelado el: {new Date(order.cancelledDate).toLocaleDateString('es-ES')}
                        {order.cancellationReason && (
                          <span className="ml-2">({order.cancellationReason})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col space-y-2 ml-6">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Ver Detalles
                  </button>
                  {order.tracking && (
                    <button
                      onClick={() => window.open(`https://tracking.example.com/${order.tracking}`, '_blank')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Rastrear
                    </button>
                  )}
                  {order.status === 'Entregado' && (
                    <>
                      <button
                        onClick={() => navigate(`/orders/${order.id}/review`)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Evaluar
                      </button>
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        Volver a Pedir
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDownloadInvoice(order.id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    Descargar Factura
                  </button>
                </div>
              </div>

              {/* Lista de productos */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Productos:</h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 text-sm">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-gray-500">
                          Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información de envío */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Dirección de envío:</h4>
                    <p className="text-gray-600">
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Método de pago:</h4>
                    <p className="text-gray-600">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryContent;
