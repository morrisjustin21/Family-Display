import { useRef, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { signOut } from 'firebase/auth'
import { auth, db, storage } from './firebase'
import { resizeImage } from './imageUtils'

export default function Photos({ photos, onBack }) {
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)

  async function handleFiles(e) {
    const input = e.target
    const files = Array.from(input.files || [])
    if (!files.length) return
    setBusy(true)
    let done = 0
    let failed = 0
    for (const file of files) {
      try {
        setStatus(`Uploading ${done + failed + 1} of ${files.length}...`)
        const blob = await resizeImage(file)
        const path = `photos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
        const fileRef = ref(storage, path)
        await uploadBytes(fileRef, blob, { contentType: 'image/jpeg' })
        const url = await getDownloadURL(fileRef)
        await addDoc(collection(db, 'photos'), {
          path,
          url,
          addedBy: auth.currentUser.email,
          createdAt: serverTimestamp(),
        })
        done++
      } catch (err) {
        console.error(err)
        failed++
      }
    }
    setBusy(false)
    setStatus(`Added ${done} photo${done === 1 ? '' : 's'}${failed ? `, ${failed} failed` : ''}.`)
    input.value = ''
  }

  async function remove(p) {
    if (!window.confirm('Delete this photo?')) return
    try {
      await deleteObject(ref(storage, p.path))
    } catch (err) {
      console.error(err)
    }
    await deleteDoc(doc(db, 'photos', p.id))
  }

  return (
    <div className="h-full overflow-y-auto bg-neutral-900 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-neutral-300 underline">
          Back to display
        </button>
        <div className="text-xl">Photos ({photos.length})</div>
        <button onClick={() => signOut(auth)} className="text-sm text-neutral-500 underline">
          Sign out
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
      <button
        disabled={busy}
        onClick={() => inputRef.current.click()}
        className="rounded-lg bg-white text-black px-5 py-3 font-medium disabled:opacity-50"
      >
        Add photos
      </button>
      {status && <span className="ml-4 text-neutral-400">{status}</span>}

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((p) => (
          <div key={p.id} className="relative aspect-square">
            <img src={p.url} alt="" className="w-full h-full object-cover rounded-lg" />
            <button
              onClick={() => remove(p)}
              className="absolute top-2 right-2 rounded bg-black/60 px-2 py-1 text-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
