import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

export default function OrderSuccess() {
  const orderId = `#${Math.floor(1000 + Math.random() * 9000)}`

  return (
    <div className="container-page py-24 text-center max-w-md mx-auto">
      <CheckCircle2 size={56} className="mx-auto text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-neutral-500 mb-2">
        Thank you for your purchase. Your order <span className="font-semibold text-brand">{orderId}</span> has been received.
      </p>
      <p className="text-neutral-500 mb-8">You'll receive an email confirmation with your order details shortly.</p>
      <div className="flex gap-3 justify-center">
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        <Link to="/orders" className="btn-outline">View Orders</Link>
      </div>
    </div>
  )
}
