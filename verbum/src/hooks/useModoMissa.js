import { useState, useCallback, useEffect } from 'react'

export default function useModoMissa() {
  const [active, setActive] = useState(false)
  const [wakeLock, setWakeLock] = useState(null)

  const toggle = useCallback(async () => {
    if (!active) {
      document.body.classList.add('modo-missa')
      try {
        if ('wakeLock' in navigator) {
          const lock = await navigator.wakeLock.request('screen')
          setWakeLock(lock)
        }
      } catch (e) { /* browser sem suporte */ }
      setActive(true)
    } else {
      document.body.classList.remove('modo-missa')
      document.body.classList.remove('brilho-reduzido')
      if (wakeLock) {
        wakeLock.release()
        setWakeLock(null)
      }
      setActive(false)
    }
  }, [active, wakeLock])

  useEffect(() => {
    return () => {
      document.body.classList.remove('modo-missa')
      document.body.classList.remove('brilho-reduzido')
      if (wakeLock) wakeLock.release()
    }
  }, [wakeLock])

  return { active, toggle }
}
