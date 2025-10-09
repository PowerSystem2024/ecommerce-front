import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrdersContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // Mock data - luego conectar con API
  const orders = [
    {
      id: 'ORD-001',
      date: '2025-01-15',
      status: 'En camino',
      total: 125.99,
      items: 3,
      tracking: 'TRK123456789',
      estimatedDelivery: '2025-01-18'
    },
    {
      id: 'ORD-002', 
      date: '2025-01-10',
      status: 'Entregado',
      total: 89.50,
      items: 2,
      tracking: 'TRK987654321',
      estimatedDelivery: '2025-01-13'
    },
    {
      id: 'ORD-003',
      date: '2025-01-05',
      status: 'Procesando',
      total: 256.00,
      items: 5,
      tracking: null,
      estimatedDelivery: '2025-01-12'
    },
    {
      id: 'ORD-004',
      date: '2024-12-28',
      status: 'Cancelado',
      total: 67.25,
      items: 1,
      tracking: null,
      estimatedDelivery: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'En camino':
        return 'bg-blue-100 text-blue-800';
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      case 'Procesando':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    if (activeTab === 'all') return true;
    return order.status.toLowerCase().replace(' ', '') === activeTab;
  });

  const tabs = [
    { id: 'all', label: 'Todos', count: orders.length },
    { id: 'procesando', label: 'Procesando', count: orders.filter(o => o.status === 'Procesando').length },
    { id: 'encamino', label: 'En camino', count: orders.filter(o => o.status === 'En camino').length },
    { id: 'entregado', label: 'Entregado', count: orders.filter(o => o.status === 'Entregado').length },
    { id: 'cancelado', label: 'Cancelado', count: orders.filter(o => o.status === 'Cancelado').length }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mis Pedidos
        </h1>
        <p className="text-gray-600">
          Gestiona y rastrea tus pedidos
        </p>
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
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay pedidos
            </h3>
            <p className="text-gray-500 mb-4">
              Aún no tienes pedidos en esta categoría
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pedido #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Realizado el {new Date(order.date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Productos:</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {order.items} {order.items === 1 ? 'artículo' : 'artículos'}
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

                  {order.estimatedDelivery && (
                    <div className="mt-3 text-sm">
                      <span className="text-gray-500">
                        Entrega estimada: {new Date(order.estimatedDelivery).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  )}
                </div>

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
                    <button
                      onClick={() => navigate(`/orders/${order.id}/review`)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Evaluar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersContent;