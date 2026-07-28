import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminSettings() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', storeName: 'ShopEase' })
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-xl space-y-5">
      <form onSubmit={handleSubmit} className="card p-5 space-y-4">
        <h2 className="font-bold">Admin Profile</h2>
        {saved && <p className="bg-green-50 text-green-700 text-sm rounded-md px-3 py-2">Settings saved successfully.</p>}
        <div>
          <label className="text-sm font-medium block mb-1">Name</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Store Name</label>
          <input value={form.storeName} onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))} className="input-field" />
        </div>
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>

      <div className="card p-5">
        <h2 className="font-bold mb-2">About This Dashboard</h2>
        <p className="text-sm text-neutral-500">
          This admin panel is part of the ShopEase Capstone Project frontend. Data shown throughout the dashboard
          is mock data intended to demonstrate UI and interaction — connect it to the Django REST Framework API
          for live data.
        </p>
      </div>
    </div>
  )
}
