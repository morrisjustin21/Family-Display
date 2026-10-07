import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

export function usePhotos(enabled) {
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    if (!enabled) {
      setPhotos([])
      return
    }
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'))
    return onSnapshot(
      q,
      (snap) => setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.error('Photos listener error:', err)
    )
  }, [enabled])

  return photos
}
