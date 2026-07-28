import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useCart } from '../../context/CartContext.jsx'

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <Heart size={48} className="mx-auto text-neutral-300 mb-4" />
        <h1 className="text-xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-neutral-500 mb-6">Save items you love so you can find them later.</p>
        <Link to="/shop" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ({items.length})</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="card p-4 flex gap-4 items-center">
            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-neutral-50" />
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.id}`} className="font-medium text-sm hover:text-accent line-clamp-2">
                {item.name}
              </Link>
              <p className="font-bold text-sm mt-1">${item.price.toFixed(2)}</p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => addToCart(item, 1)}
                  className="text-xs font-medium text-accent hover:underline"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-xs font-medium text-neutral-400 hover:text-red-500 flex items-center gap-1"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
