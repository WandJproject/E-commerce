import React, { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { categories as initialCategories } from '../../data/categories.js'
import { products } from '../../data/products.js'

export default function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')

  const productCount = (categoryId) => products.filter((p) => p.category === categoryId).length

  const openAdd = () => {
    setEditingId(null)
    setName('')
    setModalOpen(true)
  }

  const openEdit = (cat) => {
    setEditingId(cat.id)
    setName(cat.name)
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    if (editingId) {
      setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, name } : c)))
    } else {
      const id = name.toLowerCase().replace(/\s+/g, '-')
      setCategories((prev) => [...prev, { id, name, icon: 'Tag' }])
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="card p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-xs text-neutral-500">{productCount(c.id)} products</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-neutral-100 rounded-md" aria-label="Edit">
                <Pencil size={15} />
              </button>
              <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-md" aria-label="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4" onClick={() => setModalOpen(false)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Category Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
            </div>
            <button type="submit" className="btn-primary w-full">{editingId ? 'Save Changes' : 'Add Category'}</button>
          </form>
        </div>
      )}
    </div>
  )
}
