import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { reviews as initialReviews } from '../../data/customers.js'
import StarRating from '../../components/common/StarRating.jsx'

export default function AdminReviews() {
  const [reviews, setReviews] = useState(initialReviews)

  const handleDelete = (id) => {
    if (confirm('Delete this review?')) {
      setReviews((prev) => prev.filter((r) => r.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="card p-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-sm">{r.product}</p>
            <div className="flex items-center gap-2 my-1">
              <StarRating rating={r.rating} />
              <span className="text-xs text-neutral-400">by {r.customer} · {r.date}</span>
            </div>
            <p className="text-sm text-neutral-600">{r.comment}</p>
          </div>
          <button onClick={() => handleDelete(r.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-md shrink-0" aria-label="Delete review">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      {reviews.length === 0 && <p className="text-center text-neutral-400 py-10">No reviews yet.</p>}
    </div>
  )
}
