import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import StarRating from './StarRating.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useCart } from '../../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const wishlisted = isWishlisted(product.id)

  const handleWishlist = (e) => {
    e.preventDefault()
    toggleWishlist(product)
  }

  const handleQuickAdd = (e) => {
    e.preventDefault()
    addToCart(product, 1)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="card group overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="relative bg-neutral-50 aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 hover:bg-white"
        >
          <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-500'} />
        </button>
      </div>
      <div className="p-3 flex-1 flex flex-col gap-1">
        <p className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{product.name}</p>
        <StarRating rating={product.rating} showCount count={product.reviewsCount} />
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-brand">${product.price.toFixed(2)}</span>
          {product.oldPrice > product.price && (
            <span className="text-xs text-neutral-400 line-through">${product.oldPrice.toFixed(2)}</span>
          )}
        </div>
        <button
          onClick={handleQuickAdd}
          className="mt-2 text-xs font-medium border border-neutral-300 rounded-md py-1.5 hover:bg-brand hover:text-white hover:border-brand transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  )
}
