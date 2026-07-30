import React from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { DollarSign, ShoppingBag, Users, Package, TrendingUp } from 'lucide-react'
import { orders, statusStyles, salesOverview, topCategoriesData } from '../../data/orders.js'
import { products } from '../../data/products.js'

const stats = [
  { label: 'Total Sales', value: '$24,780', change: '+12.5% from last month', icon: DollarSign, color: 'bg-green-50 text-green-600' },
  { label: 'Total Orders', value: '1,248', change: '+8.2% from last month', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
  { label: 'Total Customers', value: '2,547', change: '+18.3% from last month', icon: Users, color: 'bg-purple-50 text-purple-600' },
  { label: 'Total Products', value: '356', change: '+5.7% from last month', icon: Package, color: 'bg-amber-50 text-amber-600' },
]

const bestSelling = [...products].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 5)

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-neutral-500">{s.label}</span>
              <span className={`p-2 rounded-lg ${s.color}`}>
                <s.icon size={18} />
              </span>
            </div>
            <p className="text-2xl font-bold mb-1">{s.value}</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp size={12} /> {s.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Sales Overview</h2>
            <select className="text-sm border border-neutral-200 rounded-md px-2 py-1">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={salesOverview}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#F5A623" strokeWidth={3} dot={{ r: 4, fill: '#F5A623' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-bold mb-4">Top Categories</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={topCategoriesData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2}>
                {topCategoriesData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {topCategoriesData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="text-neutral-500">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-accent font-medium hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-neutral-500 text-left">
                <tr>
                  <th className="py-2 font-medium">Order ID</th>
                  <th className="py-2 font-medium">Customer</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Amount</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 3).map((o) => (
                  <tr key={o.id} className="border-t border-neutral-100">
                    <td className="py-2.5 font-medium">{o.id}</td>
                    <td className="py-2.5">{o.customer}</td>
                    <td className="py-2.5 text-neutral-500">{o.date}</td>
                    <td className="py-2.5">${o.amount.toFixed(2)}</td>
                    <td className="py-2.5">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyles[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold mb-4">Best Selling Products</h2>
          <div className="space-y-3">
            {bestSelling.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-neutral-50" />
                <p className="flex-1 text-sm truncate">{p.name}</p>
                <span className="text-sm font-semibold">{p.reviewsCount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
