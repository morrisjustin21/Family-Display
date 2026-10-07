import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './firebase'

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="text-center">
      <div className="text-8xl font-light">
        {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
      </div>
      <div className="text-2xl text-neutral-400 mt-4">
        {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
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

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), [])

  if (user === undefined) {
    return <div className="h-full bg-neutral-900" />
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-neutral-900 text-white">
      {user ? (
        <>
          <Clock />
          <div className="mt-10 text-sm text-neutral-500">Signed in as {user.email}</div>
          <button
            className="mt-3 text-sm text-neutral-400 underline"
            onClick={() => signOut(auth)}
          >
            Sign out
          </button>
        </>
      ) : (
        <Login />
      )}
    </div>
  )
}
