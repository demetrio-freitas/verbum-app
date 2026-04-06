import { useNavigate } from 'react-router-dom'

const items = [
  { path: '/oficio', icon: 'schedule', label: 'Ofício' },
  { path: '/notas', icon: 'edit_note', label: 'Notas' },
  { path: '/salvos', icon: 'bookmark', label: 'Salvos' },
  { path: '/busca', icon: 'search', label: 'Busca' },
  { path: '/novenas', icon: 'hourglass_top', label: 'Novenas' },
  { path: '/paroquia', icon: 'church', label: 'Paróquia' },
  { path: '/calendario', icon: 'calendar_month', label: 'Calendário' },
  { path: '/exame', icon: 'psychology', label: 'Confissão', highlight: true, color: '#7C3AED' },
  { path: '/notificacoes', icon: 'notifications', label: 'Notificações' },
  { path: '/igrejas', icon: 'location_on', label: 'Santo do Ano' },
  { path: '/biblia', icon: 'auto_stories', label: 'Bíblia', highlight: true, color: '#78350F' },
  { path: '/settings', icon: 'settings', label: 'Configurações', highlight: true, color: '#78350F' },
]

export default function MoreMenu({ open, onClose }) {
  const navigate = useNavigate()

  if (!open) return null

  function handleItemClick(path) {
    onClose()
    navigate(path)
  }

  return (
    <div className="more-menu-overlay" onClick={onClose}>
      <div className="more-menu" onClick={e => e.stopPropagation()}>
        <div className="more-menu-header">
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Mais</span>
          <button className="icon-btn" onClick={onClose} style={{ width: 32, height: 32, fontSize: 18 }}>close</button>
        </div>
        <div className="more-menu-grid">
          {items.map(item => (
            <button
              key={item.label}
              className="more-menu-item"
              onClick={() => handleItemClick(item.path)}
              style={item.highlight ? { background: `${item.color}12` } : undefined}
            >
              <span
                className="material-symbols-rounded"
                style={item.highlight ? { color: item.color } : undefined}
              >
                {item.icon}
              </span>
              <span style={item.highlight ? { color: item.color, fontWeight: 700 } : undefined}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
