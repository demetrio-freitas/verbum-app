import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', icon: 'menu_book', label: 'Leituras' },
  { path: '/missa', icon: 'auto_stories', label: 'Missa' },
  { path: '/terco', icon: 'radio_button_checked', label: 'Terço' },
  { path: '/oracoes', icon: 'folded_hands', label: 'Orações' },
]

export default function BottomNav({ onMoreClick }) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.path}
          className={`nav-item ${location.pathname === tab.path ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          <span className="material-symbols-rounded">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
      <button className="nav-item" onClick={onMoreClick}>
        <span className="material-symbols-rounded">more_horiz</span>
        <span>Mais</span>
      </button>
    </nav>
  )
}
