import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useState } from 'react'
import UserProfile from '../shared/UserProfile.jsx'

function getInitials(name) {
  if (!name) return 'VP'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0].substring(0, 2).toUpperCase()
}

function hashColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  const colors = ['#78350F', '#3B6FA0', '#7C3AED', '#5B7A3D', '#B45309', '#DC2626', '#0F766E', '#6D28D9']
  return colors[Math.abs(hash) % colors.length]
}

export default function Header() {
  const navigate = useNavigate()
  const { toggleDarkMode, darkMode } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)
  const userName = localStorage.getItem('verbum-user-name') || ''
  const initials = getInitials(userName)
  const avatarColor = hashColor(userName || 'Verbum')

  return (
    <>
      <header className="app-header">
        <div className="app-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Verbum<span>beta</span>
        </div>
        <div className="header-actions">
          <button className={`icon-btn ${darkMode ? 'active' : ''}`} onClick={toggleDarkMode}>
            {darkMode ? 'light_mode' : 'dark_mode'}
          </button>
          <div
            onClick={() => setProfileOpen(true)}
            style={{
              width: 32, height: 32, borderRadius: '50%', background: avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFF', fontSize: '0.62rem', fontWeight: 800, cursor: 'pointer',
              letterSpacing: '0.02em', flexShrink: 0
            }}
          >
            {initials}
          </div>
        </div>
      </header>
      {profileOpen && <UserProfile onClose={() => setProfileOpen(false)} />}
    </>
  )
}
