import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'
import { usePhotos } from './usePhotos'
import Slideshow from './Slideshow'
import Photos from './Photos'

function Display({ photos, onManage }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative h-full bg-black text-white overflow-hidden">
      <Slideshow photos={photos} />
      <button
        onClick={onManage}
        className="absolute top-4 left-4 z-10 rounded-lg bg-black/40 px-3 py-2 text-sm text-neutral-300"
      >
        Photos
      </button>
      <div className="absolute bottom-0 inset-x-0 z-10 bg-black/50 px-8 py-5">
        <div className="text-6xl font-light leading-none">
          {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </div>
        <div className="text-xl text-neutral-300 mt-2">
          {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError('Wrong email or password.')
    }
  }

  return (
    <form onSubmit={handleSignIn} className="w-80 flex flex-col gap-3">
      <div className="text-2xl text-center mb-2">Family Display</div>
      <input
        className="rounded-lg bg-neutral-800 px-4 py-3 outline-none"
        type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="rounded-lg bg-neutral-800 px-4 py-3 outline-none"
        type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="rounded-lg bg-white text-black py-3 font-medium" type="submit">
        Sign in
      </button>
      {error && <div className="text-red-400 text-sm text-center">{error}</div>}
    </form>
  )
}

export default function App() {
  const [user, setUser] = useState(undefined)
  const [view, setView] = useState('display')
  const photos = usePhotos(!!user)

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), [])

  if (user === undefined) {
    return <div className="h-full bg-neutral-900" />
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-900 text-white">
        <Login />
      </div>
    )
  }

  if (view === 'photos') {
    return <Photos photos={photos} onBack={() => setView('display')} />
  }

  return <Display photos={photos} onManage={() => setView('photos')} />
}
