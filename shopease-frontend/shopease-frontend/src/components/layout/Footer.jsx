import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube, Truck, RotateCcw, Wallet, Star } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand text-neutral-300 mt-16">
      <div className="container-page grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Truck size={22} className="text-accent" />
          <div>
            <p className="text-white text-sm font-medium">100% Original</p>
            <p className="text-xs">We sell original products</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw size={22} className="text-accent" />
          <div>
            <p className="text-white text-sm font-medium">14-Day Return</p>
            <p className="text-xs">14 day money back guarantee</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Wallet size={22} className="text-accent" />
          <div>
            <p className="text-white text-sm font-medium">Pay On Delivery</p>
            <p className="text-xs">Cash on delivery available</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Star size={22} className="text-accent" />
          <div>
            <p className="text-white text-sm font-medium">Best Prices</p>
            <p className="text-xs">We offer best prices</p>
          </div>
        </div>
      </div>

      <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
        <div>
          <Link to="/" className="flex items-center gap-1.5 font-extrabold text-lg text-white mb-3">
            <span className="w-6 h-6 rounded bg-accent text-brand grid place-items-center text-xs">S</span>
            ShopEase.
          </Link>
          <p className="text-sm">Your one-stop shop for fashion, electronics, home essentials and more.</p>
          <div className="flex gap-3 mt-4">
            <Facebook size={18} />
            <Instagram size={18} />
            <Twitter size={18} />
            <Youtube size={18} />
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-white">All Products</Link></li>
            <li><Link to="/shop?filter=deals" className="hover:text-white">Deals</Link></li>
            <li><Link to="/shop?sort=new" className="hover:text-white">New Arrivals</Link></li>
            <li><Link to="/shop?filter=best" className="hover:text-white">Best Sellers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/orders" className="hover:text-white">Track Order</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/register" className="hover:text-white">Register</Link></li>
            <li><Link to="/admin" className="hover:text-white">Admin Dashboard</Link></li>
          </ul>
        </div>
      </div>

      <div className="container-page py-4 text-xs text-center border-t border-white/10">
        © {new Date().getFullYear()} ShopEase. All rights reserved. Built for the Full Stack Capstone Project.
      </div>
    </footer>
  )
}
