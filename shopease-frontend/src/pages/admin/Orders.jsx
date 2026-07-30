import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { orders as initialOrders, statusStyles } from '../../data/orders.js'

const statusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="input-field pl-9"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field sm:w-48">
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium">{o.id}</td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="px-4 py-3 text-neutral-500">{o.date}</td>
                <td className="px-4 py-3">{o.items}</td>
                <td className="px-4 py-3">${o.amount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${statusStyles[o.status]}`}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-neutral-400">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
