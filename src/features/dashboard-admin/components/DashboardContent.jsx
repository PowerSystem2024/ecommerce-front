import React from 'react'
import AdminTabs from './AdminTabs'

function DashboardContent() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F0F10]">Panel de Administración</h1>
        <p className="text-sm text-[#2A2A2A]">Gestiona usuarios, productos y reseñas</p>
      </div>
      <AdminTabs />
    </div>
  )
}

export default DashboardContent
