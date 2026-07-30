import React, { useState } from 'react'
import { Search, AlertTriangle } from 'lucide-react'
import { products } from '../../data/products.js'

export default function AdminInventory() {
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  const lowStockCount = products.filter((p) => p.stock < 20).length

  const getStockLevel = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', style: 'bg-red-100 text-red-700' }
    if (stock < 20) return { label: 'Low Stock', style: 'bg-amber-100 text-amber-700' }
    return { label: 'In Stock', style: 'bg-green-100 text-green-700' }
  }

  return (
    <div className="space-y-4">
      {lowStockCount > 0 && (
        <div className="card p-4 flex items-center gap-3 bg-amber-50 border-amber-200">
          <AlertTriangle size={18} className="text-amber-600" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{lowStockCount} product(s)</span> are running low on stock.
          </p>
        </div>
      )}

      <div className="relative sm:w-80">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search inventory..."
          className="input-field pl-9"
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Units In Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const level = getStockLevel(p.stock)
              return (
                <tr key={p.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-neutral-50" />
                      <span className="font-medium max-w-xs truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{p.category}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${level.style}`}>{level.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
