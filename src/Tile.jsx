import { useEffect, useRef, useState } from 'react'
import { getTileState, setTileState } from './db'

function Tile({ index, src }) {
  const [status, setStatus] = useState('neutral') // 'neutral' | 'green' | 'red'
  const [counter, setCounter] = useState(0)
  const isLoaded = useRef(false)

  // Load the persisted state for this tile once on mount.
  useEffect(() => {
    let cancelled = false
    getTileState(src).then((saved) => {
      if (cancelled) return
      if (saved) {
        setStatus(saved.status)
        setCounter(saved.counter)
      }
      isLoaded.current = true
    })
    return () => {
      cancelled = true
    }
  }, [src])

  // Persist state changes, skipping the initial render before load completes
  // so we don't overwrite saved data with the default values.
  useEffect(() => {
    if (!isLoaded.current) return
    setTileState(src, { status, counter })
  }, [src, status, counter])

  const handleClick = () => {
    if (status === 'red' && counter <= -1) {
      setCounter((prev) => prev +1)
    }
 
    if (counter == 0) {
      setStatus('green')
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    setStatus('red')
    setCounter((prev) => prev - 1)
  }

  return (
    <div
      className={`tile tile--${status}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <img src={src} alt={`tile-${index}`} className="tile-image" />

      {status === 'red' && <div className="counter-badge">{counter}</div>}
    </div>
  )
}

export default Tile
