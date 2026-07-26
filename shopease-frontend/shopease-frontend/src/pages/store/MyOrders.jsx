import React from 'react'
import { orders, statusStyles } from '../../data/orders.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function MyOrders() {
  const { user } = useAuth()
  // Demo: show a subset of mock orders as "this customer's" order history
  const myOrders = orders.slice(0, 4)

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold mb-1">My Orders</h1>
      <p className="text-neutral-500 text-sm mb-6">Order history for {user?.name}</p>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.map((o) => (
              <tr key={o.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium">{o.id}</td>
                <td className="px-4 py-3">{o.date}</td>
                <td className="px-4 py-3">{o.items}</td>
                <td className="px-4 py-3">${o.amount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[o.status]}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
