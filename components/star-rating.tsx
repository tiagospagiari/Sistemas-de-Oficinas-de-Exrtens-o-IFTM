"use client"

import { Star } from "lucide-react"
import { useState } from "react"

interface StarRatingProps {
  rating: number
  setRating: (rating: number) => void
}

export function StarRating({ rating, setRating }: StarRatingProps) {
  const [hover, setHover] = useState<number>(0)

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-8 w-8 cursor-pointer ${
            star <= (hover || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        />
      ))}
    </div>
  )
}

