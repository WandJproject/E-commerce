import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { salesOverview } from '../../data/orders.js'
import { products } from '../../data/products.js'
import { categories } from '../../data/categories.js'

export default function AdminReports() {
  const revenueByCategory = categories.map((c) => ({
    name: c.name,
    revenue: products.filter((p) => p.category === c.id).reduce((sum, p) => sum + p.price * (p.reviewsCount || 1), 0),
  }))

  const totalRevenue = salesOverview.reduce((sum, m) => sum + m.sales, 0) * 100
  const avgOrderValue = 198.5

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-neutral-500 mb-1">Total Revenue (YTD est.)</p>
          <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-neutral-500 mb-1">Average Order Value</p>
          <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-neutral-500 mb-1">Products Listed</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-bold mb-4">Monthly Sales Trend</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={salesOverview}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="sales" fill="#F5A623" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-5">
        <h2 className="font-bold mb-4">Estimated Revenue by Category</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={revenueByCategory} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
            <Tooltip formatter={(v) => `$${v.toFixed(0)}`} />
            <Bar dataKey="revenue" fill="#111111" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
