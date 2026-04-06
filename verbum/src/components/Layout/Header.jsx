import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function Header() {
  const navigate = useNavigate()
  const { toggleDarkMode, darkMode } = useTheme()

  return (
    <header className="app-header">
      <div className="app-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        Verbum<span>beta</span>
      </div>
      <div className="header-actions">
        <button className={`icon-btn ${darkMode ? 'active' : ''}`} onClick={toggleDarkMode}>
          {darkMode ? 'light_mode' : 'dark_mode'}
        </button>
        <button className="icon-btn" onClick={() => navigate('/settings')}>
          settings
        </button>
      </div>
    </header>
  )
}
