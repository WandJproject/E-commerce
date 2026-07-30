import React, { useState } from 'react'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'
import { products as initialProducts } from '../../data/products.js'
import { categories } from '../../data/categories.js'

const emptyForm = { name: '', category: categories[0].id, price: '', stock: '', image: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
    })
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price) return

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, name: form.name, category: form.category, price: Number(form.price), stock: Number(form.stock) || 0, image: form.image || p.image }
            : p
        )
      )
    } else {
      const newProduct = {
        id: Math.max(0, ...products.map((p) => p.id)) + 1,
        name: form.name,
        category: form.category,
        price: Number(form.price),
        oldPrice: Number(form.price),
        discount: 0,
        rating: 0,
        reviewsCount: 0,
        stock: Number(form.stock) || 0,
        image: form.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        gallery: [form.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
        description: '',
        highlights: [],
      }
      setProducts((prev) => [newProduct, ...prev])
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-9"
          />
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2 justify-center">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-neutral-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-neutral-50" />
                    <span className="font-medium max-w-xs truncate">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize">{p.category}</td>
                <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={p.stock < 15 ? 'text-red-500 font-medium' : ''}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">{p.rating || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEditModal(p)} className="p-1.5 hover:bg-neutral-100 rounded-md" aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-md" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-neutral-400">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4" onClick={() => setModalOpen(false)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Product Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="input-field"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Price ($)</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">{editingId ? 'Save Changes' : 'Add Product'}</button>
          </form>
        </div>
      )}
    </div>
  )
}
