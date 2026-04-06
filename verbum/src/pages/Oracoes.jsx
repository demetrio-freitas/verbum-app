import { useState } from 'react'
import { oracoesCatalog } from '../data/oracoes.js'

export default function Oracoes() {
  const [search, setSearch] = useState('')
  const [openPrayer, setOpenPrayer] = useState(null)

  const q = search.toLowerCase()
  const filtered = oracoesCatalog.map(cat => ({
    ...cat,
    prayers: cat.prayers.filter(p => !q || p.name.toLowerCase().includes(q) || p.text.toLowerCase().includes(q))
  })).filter(cat => cat.prayers.length > 0)

  return (
    <div style={{ padding: '0 16px' }}>
      <div className="search-wrapper" style={{ marginBottom: 16 }}>
        <span className="search-icon">search</span>
        <input type="text" className="search-input" placeholder="Buscar oração..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--accent)' }}>{cat.icon}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600 }}>{cat.cat}</span>
          </div>
          {cat.prayers.map((prayer, pi) => {
            const key = `${ci}-${pi}`
            const isOpen = openPrayer === key
            return (
              <div key={pi} className="reading-card" style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => setOpenPrayer(isOpen ? null : key)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="reading-label" style={{ marginBottom: 0 }}>{prayer.name}</div>
                  <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--text-tertiary)', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                </div>
                {isOpen && (
                  <div className="reading-text expanded" style={{ marginTop: 12, whiteSpace: 'pre-line' }}>{prayer.text}</div>
                )}
              </div>
            )
          })}
        </div>
      ))}
      <div style={{ height: 100 }} />
    </div>
  )
}
