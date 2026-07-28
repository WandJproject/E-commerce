import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar.jsx'
import AdminHeader from './AdminHeader.jsx'

const titleMap = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/inventory': 'Inventory',
  '/admin/reviews': 'Reviews',
  '/admin/coupons': 'Coupons',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = titleMap[location.pathname] || 'Admin'

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0">
        <AdminHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
