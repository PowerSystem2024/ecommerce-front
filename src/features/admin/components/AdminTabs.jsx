import React, { useEffect, useMemo, useState } from 'react';
import { Tab } from '@headlessui/react';
import ProductAdminTable from './Products/ProductAdminTable';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminReviewsPage from '../pages/AdminReviewsPage';
import AdminOrdersPage from '../pages/AdminOrdersPage';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminTabs() {
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const tabs = [
    { key: 'users', title: 'Usuarios', content: <UsuariosTab /> },
    { key: 'products', title: 'Productos', content: <ProductosTab onCreate={() => setOpenCreateProduct(true)} openCreate={openCreateProduct} onCloseCreate={() => setOpenCreateProduct(false)} /> },
    { key: 'orders', title: 'Pedidos', content: <PedidosTab /> },
    { key: 'reviews', title: 'Reseñas', content: <ResenasTab /> },
  ];

  return (
    <div className="w-full">
      <Tab.Group>
        <Tab.List className="flex gap-2 border-b border-[#2A2A2A]/20 mb-6">
          {tabs.map((t) => (
            <Tab
              key={t.key}
              className={({ selected }) => classNames(
                "px-5 py-2 rounded-t-xl text-sm transition-all duration-200 outline-none font-['Quantico',_sans-serif]",
                selected
                  ? "bg-[#0F0F10] text-white border border-[#2A2A2A]/30 border-b-transparent shadow-sm"
                  : "bg-white text-[#2A2A2A] hover:bg-[#F5F5F7] border border-transparent"
              )}
            >
              {t.title}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="bg-white rounded-2xl shadow-sm border border-[#2A2A2A]/10 p-6">
          {tabs.map((t) => (
            <Tab.Panel key={t.key}>
              {t.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

function EmptyState({ title, description, cta }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2A2A2A]/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-[#2A2A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
        </svg>
      </div>
      <h3 className="text-lg text-[#0F0F10] mb-1 font-['Orbitron',_sans-serif]">{title}</h3>
      <p className="text-sm text-[#2A2A2A] mb-4 font-['Rajdhani',_sans-serif]">{description}</p>
      {cta}
    </div>
  );
}

function UsuariosTab() {
  return <AdminUsersPage />;
}

function ProductosTab({ onCreate, openCreate, onCloseCreate }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg text-[#0F0F10] font-['Orbitron',_sans-serif]">Gestión de productos</h4>
        <div className="flex items-center gap-2">
          <button onClick={onCreate} className="px-3 py-2 bg-[#0F0F10] text-white rounded-md text-sm hover:bg-[#E11D74] transition shadow-sm font-['Quantico',_sans-serif]">
            Crear producto
          </button>
        </div>
      </div>
      <ProductAdminTable openCreate={openCreate} onCloseCreate={onCloseCreate} />
    </div>
  );
}

function PedidosTab() {
  return <AdminOrdersPage />;
}

function ResenasTab() {
  return <AdminReviewsPage />;
}
