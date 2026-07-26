import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { products } from '../../data/products.js'
import { categories } from '../../data/categories.js'
import ProductCard from '../../components/common/ProductCard.jsx'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const filter = searchParams.get('filter') || ''
  const sort = searchParams.get('sort') || ''
  const maxPrice = Number(searchParams.get('maxPrice') || 1200)

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const filtered = useMemo(() => {
    let list = [...products]

    if (search) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    }
    if (category) {
      list = list.filter((p) => p.category === category)
    }
    if (filter === 'deals') {
      list = list.filter((p) => p.discount >= 20)
    }
    if (filter === 'best') {
      list = list.filter((p) => p.rating >= 4.6)
    }
    list = list.filter((p) => p.price <= maxPrice)

    if (sort === 'new') {
      list = [...list].reverse()
    } else if (sort === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating)
    }

    return list
  }, [search, category, filter, sort, maxPrice])

  const clearFilters = () => setSearchParams({})

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Category</h3>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="category" checked={!category} onChange={() => updateParam('category', '')} />
            All Categories
          </label>
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={category === c.id}
                onChange={() => updateParam('category', c.id)}
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Max Price: ${maxPrice}</h3>
        <input
          type="range"
          min="10"
          max="1200"
          step="10"
          value={maxPrice}
          onChange={(e) => updateParam('maxPrice', e.target.value)}
          className="w-full accent-accent"
        />
      </div>

      <button onClick={clearFilters} className="text-sm text-accent font-medium hover:underline">
        Clear all filters
      </button>
    </div>
  )

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">
          {category ? categories.find((c) => c.id === category)?.name : 'All Products'}
        </h1>
        <button
          onClick={() => setFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 text-sm border border-neutral-300 rounded-md px-3 py-1.5"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>
      <p className="text-sm text-neutral-500 mb-6">{filtered.length} products found{search && ` for "${search}"`}</p>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden lg:block">{FilterPanel}</aside>

        {filtersOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setFiltersOpen(false)}>
            <div className="bg-white w-72 h-full p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Filters</h3>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={20} /></button>
              </div>
              {FilterPanel}
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-end mb-4">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Sort: Featured</option>
              <option value="new">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-medium mb-2">No products match your filters.</p>
              <button onClick={clearFilters} className="text-accent font-medium hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
