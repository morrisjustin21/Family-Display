import { useEffect, useState } from 'react'

export default function App() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="h-full flex flex-col items-center justify-center bg-neutral-900 text-white">
      <div className="text-8xl font-light">
        {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
      </div>
      <div className="text-2xl text-neutral-400 mt-4">
        {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  )
}
