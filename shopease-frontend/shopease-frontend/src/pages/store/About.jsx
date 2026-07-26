import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="container-page py-16 max-w-3xl">
      <h1 className="text-3xl font-extrabold mb-4">About ShopEase</h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        ShopEase is a modern online shopping destination offering a curated catalogue across electronics, fashion,
        shoes, home, beauty, sports and accessories. This storefront was built as a Full Stack Web Development
        Capstone Project, showcasing a complete customer shopping experience alongside a full admin management
        dashboard.
      </p>
      <p className="text-neutral-600 leading-relaxed mb-8">
        Our mission is to make online shopping simple, secure, and enjoyable — with fast checkout, transparent
        pricing, and reliable delivery.
      </p>
      <Link to="/shop" className="btn-primary">Start Shopping</Link>
    </div>
  )
}
