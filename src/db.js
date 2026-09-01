// Minimal IndexedDB wrapper used to persist each tile's status/counter
// between page reloads, so the grid keeps its state across restarts.

const DB_NAME = 'dbd-bodyguard-challenge'
const DB_VERSION = 1
const STORE_NAME = 'tileStates'

let dbPromise = null

function openDatabase() {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

  return dbPromise
}

// Reads the saved { status, counter } for a tile, or null if none exists yet.
export async function getTileState(id) {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const request = tx.objectStore(STORE_NAME).get(id)
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  })
}

// Persists the { status, counter } state for a tile.
export async function setTileState(id, state) {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(state, id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
