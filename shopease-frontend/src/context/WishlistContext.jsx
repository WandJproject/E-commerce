import React, { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'shopease_wishlist'

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const isWishlisted = (productId) => items.some((i) => i.id === productId)

  const toggleWishlist = (product) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === product.id)
      if (exists) return prev.filter((i) => i.id !== product.id)
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image }]
    })
  }

  const removeFromWishlist = (productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }

  const value = { items, isWishlisted, toggleWishlist, removeFromWishlist }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}
