import React from 'react'
import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, size = 14, showCount, count }) {
  const stars = [1, 2, 3, 4, 5]
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((s) => (
          <Star
            key={s}
            size={size}
            className={s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'}
          />
        ))}
      </div>
      {showCount && <span className="text-xs text-neutral-500">({count})</span>}
    </div>
  )
}
