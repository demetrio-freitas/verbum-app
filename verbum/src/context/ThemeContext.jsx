import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('verbum-dark') === 'true')
  const [visualTheme, setVisualTheme] = useState(() => localStorage.getItem('verbum-visual') || '')
  const [fontScale, setFontScale] = useState(() => parseFloat(localStorage.getItem('verbum-font-scale')) || 1)

  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute('data-theme', 'dark')
    } else {
      document.body.removeAttribute('data-theme')
    }
    localStorage.setItem('verbum-dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    if (visualTheme) {
      document.body.setAttribute('data-visual', visualTheme)
    } else {
      document.body.removeAttribute('data-visual')
    }
    localStorage.setItem('verbum-visual', visualTheme)
  }, [visualTheme])

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale)
    localStorage.setItem('verbum-font-scale', fontScale)
  }, [fontScale])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, visualTheme, setVisualTheme, fontScale, setFontScale }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
