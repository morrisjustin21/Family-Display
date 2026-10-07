import { useEffect, useState } from 'react'

export default function Slideshow({ photos, seconds = 30 }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (photos.length < 2) return
    const t = setInterval(() => setI((n) => n + 1), seconds * 1000)
    return () => clearInterval(t)
  }, [photos.length, seconds])

  if (!photos.length) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-neutral-600 text-xl">
        No photos yet
      </div>
    )
  }

  const current = photos[i % photos.length]
  const next = photos[(i + 1) % photos.length]

  return (
    <>
      <img
        key={current.id}
        src={current.url}
        alt=""
        className="absolute inset-0 w-full h-full object-contain bg-black fade-in"
      />
      <img src={next.url} alt="" className="hidden" />
    </>
  )
}
