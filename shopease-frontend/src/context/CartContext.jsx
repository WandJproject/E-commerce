import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'shopease_cart'

export function CartProvider({ children }) {
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

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, quantity }]
    })
  }

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return
    setItems((prev) => prev.map((i) => (i.id === productId ? { ...i, quantity } : i)))
  }

  const clearCart = () => setItems([])

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const value = { items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
