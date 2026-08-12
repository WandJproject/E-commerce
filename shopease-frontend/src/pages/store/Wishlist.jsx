import React from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Star } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { reviews } from "../../data/customers.js";

export default function Wishlist() {
  const { items, removeFromWishlist, loading, error } = useWishlist();
  const { addToCart } = useCart();
  const featuredReviews = reviews.slice(0, 3);

  if (loading && items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-lg font-medium mb-2">Loading your wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <Heart size={48} className="mx-auto text-neutral-300 mb-4" />
        <h1 className="text-xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-neutral-500 mb-6">
          Save items you love so you can find them later.
        </p>
        <Link to="/shop" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ({items.length})</h1>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-100 p-4 text-red-700">
          {error}
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="card p-4 flex gap-4 items-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 rounded-lg object-cover bg-neutral-50"
            />
            <div className="flex-1 min-w-0">
              <Link
                to={`/product/${item.id}`}
                className="font-medium text-sm hover:text-accent line-clamp-2"
              >
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

      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Customer Reviews</h2>
          <Link
            to="/shop"
            className="text-sm font-medium text-accent hover:underline"
          >
            Browse more
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {featuredReviews.map((review) => (
            <div key={review.id} className="card p-4">
              <div className="flex items-center gap-1 text-amber-500 mb-2">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={index} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-neutral-700 mb-2">
                “{review.comment}”
              </p>
              <div className="text-xs text-neutral-500">
                <p className="font-semibold text-neutral-800">
                  {review.customer}
                </p>
                <p>{review.product}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
