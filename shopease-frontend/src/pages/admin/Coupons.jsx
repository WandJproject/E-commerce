import React, { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { coupons as initialCoupons } from '../../data/customers.js'

const emptyForm = { code: '', discount: '', type: 'Percentage', expires: '' }

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(initialCoupons)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const handleDelete = (id) => {
    if (confirm('Delete this coupon?')) {
      setCoupons((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.code.trim() || !form.discount.trim() || !form.expires) return
    const newCoupon = {
      id: Math.max(0, ...coupons.map((c) => c.id)) + 1,
      code: form.code.toUpperCase(),
      discount: form.discount,
      type: form.type,
      expires: form.expires,
      status: 'Active',
      uses: 0,
    }
    setCoupons((prev) => [newCoupon, ...prev])
    setForm(emptyForm)
    setModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Expires</th>
              <th className="px-4 py-3 font-medium">Uses</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                <td className="px-4 py-3">{c.discount}</td>
                <td className="px-4 py-3">{c.type}</td>
                <td className="px-4 py-3 text-neutral-500">{c.expires}</td>
                <td className="px-4 py-3">{c.uses}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-md" aria-label="Delete coupon">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4" onClick={() => setModalOpen(false)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Add Coupon</h2>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Code</label>
              <input required value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} className="input-field" placeholder="SAVE20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Discount</label>
                <input required value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))} className="input-field" placeholder="20%" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="input-field">
                  <option>Percentage</option>
                  <option>Fixed</option>
                  <option>Shipping</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Expiry Date</label>
              <input required type="date" value={form.expires} onChange={(e) => setForm((f) => ({ ...f, expires: e.target.value }))} className="input-field" />
            </div>
            <button type="submit" className="btn-primary w-full">Add Coupon</button>
          </form>
        </div>
      )}
    </div>
  )
}
