import { useState, useEffect, useCallback } from 'react'

let showToastFn = null

export function toast(message) {
  if (showToastFn) showToastFn(message)
}

export default function Toast() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  const show = useCallback((msg) => {
    setMessage(msg)
    setVisible(true)
    setTimeout(() => setVisible(false), 2500)
  }, [])

  useEffect(() => {
    showToastFn = show
    return () => { showToastFn = null }
  }, [show])

  if (!visible) return null

  return (
    <div className="toast active">{message}</div>
  )
}
