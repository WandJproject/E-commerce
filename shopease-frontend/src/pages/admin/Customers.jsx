import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { customers } from '../../data/customers.js'

const statusStyles = {
  Active: 'bg-green-100 text-green-700',
  VIP: 'bg-purple-100 text-purple-700',
  Inactive: 'bg-neutral-100 text-neutral-500',
}

export default function AdminCustomers() {
  const [search, setSearch] = useState('')

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative sm:w-80">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="input-field pl-9"
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Total Spent</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-neutral-500">{c.email}</td>
                <td className="px-4 py-3">{c.orders}</td>
                <td className="px-4 py-3">${c.spent.toFixed(2)}</td>
                <td className="px-4 py-3 text-neutral-500">{c.joined}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[c.status]}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-neutral-400">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
