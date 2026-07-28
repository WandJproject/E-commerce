import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Search, ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?filter=deals', label: 'Deals' },
  { to: '/shop?sort=new', label: 'New Arrivals' },
  { to: '/shop?filter=best', label: 'Best Sellers' },
  { to: '/about', label: 'About Us' },
]

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { totalItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(query.trim() ? `/shop?search=${encodeURIComponent(query.trim())}` : '/shop')
    setMobileOpen(false)
  }

  const handleLogout = () => {
    logout()
    setAccountOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="bg-brand text-white text-xs">
        <div className="container-page flex items-center justify-between py-1.5">
          <span>Free delivery on orders over $100</span>
          <div className="hidden sm:flex items-center gap-4 text-neutral-300">
            <Link to="/orders" className="hover:text-white">Track Order</Link>
            <span>Help</span>
            <span>English</span>
            <span>USD</span>
          </div>
        </div>
      </div>

      <div className="container-page flex items-center gap-4 py-4">
        <button className="lg:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className="flex items-center gap-1.5 font-extrabold text-xl shrink-0">
          <span className="w-7 h-7 rounded bg-brand text-white grid place-items-center text-sm">S</span>
          ShopEase.
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands and more..."
            className="w-full border border-neutral-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button type="submit" className="bg-brand text-white px-4 rounded-r-md" aria-label="Search">
            <Search size={18} />
          </button>
        </form>

        <div className="flex items-center gap-4 ml-auto">
          <Link to="/wishlist" className="relative hidden sm:block" aria-label="Wishlist">
            <Heart size={22} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] rounded-full w-4 h-4 grid place-items-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative" aria-label="Cart">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] rounded-full w-4 h-4 grid place-items-center">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="relative">
            <button onClick={() => setAccountOpen((o) => !o)} className="flex items-center gap-1" aria-label="Account">
              <User size={22} />
            </button>
            {accountOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 text-sm">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-neutral-500 text-xs truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50"
                      >
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/wishlist" onClick={() => setAccountOpen(false)} className="block px-4 py-2 hover:bg-neutral-50">
                      My Wishlist
                    </Link>
                    <Link to="/cart" onClick={() => setAccountOpen(false)} className="block px-4 py-2 hover:bg-neutral-50">
                      My Cart
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 text-red-600"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setAccountOpen(false)} className="block px-4 py-2 hover:bg-neutral-50">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setAccountOpen(false)} className="block px-4 py-2 hover:bg-neutral-50">
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="md:hidden container-page pb-3 flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-neutral-300 rounded-l-md px-3 py-2 text-sm focus:outline-none"
        />
        <button type="submit" className="bg-brand text-white px-4 rounded-r-md">
          <Search size={18} />
        </button>
      </form>

      <nav className={`border-t border-neutral-100 ${mobileOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="container-page flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-6 py-2 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `py-1.5 lg:py-0 ${isActive ? 'text-accent font-semibold' : 'text-neutral-700 hover:text-brand'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
