import { useState } from 'react'

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

const practices = ['Terço', 'Lectio Divina', 'Liturgia das Horas', 'Novenas', 'Adoração', 'Missa diária']

export default function UserProfile({ onClose }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(localStorage.getItem('verbum-user-name') || 'Peregrino')
  const [city, setCity] = useState(localStorage.getItem('verbum-user-city') || 'Fortaleza, CE')
  const [bio, setBio] = useState(localStorage.getItem('verbum-user-bio') || '')
  const [santo, setSanto] = useState(localStorage.getItem('verbum-user-santo') || 'São Rafael Arcanjo')

  const initials = getInitials(name)
  const avatarColor = hashColor(name)

  function save() {
    localStorage.setItem('verbum-user-name', name)
    localStorage.setItem('verbum-user-city', city)
    localStorage.setItem('verbum-user-bio', bio)
    localStorage.setItem('verbum-user-santo', santo)
    setEditing(false)
  }

  const stats = [
    { icon: 'local_fire_department', label: 'Streak', value: '7 dias' },
    { icon: 'radio_button_checked', label: 'Terços', value: '23' },
    { icon: 'menu_book', label: 'Leituras', value: '45' },
    { icon: 'group', label: 'Grupos', value: '2' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 300, overflowY: 'auto', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <button className="icon-btn" onClick={onClose} style={{ fontSize: 22 }}>arrow_back</button>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Perfil</span>
        <button className="icon-btn" onClick={() => editing ? save() : setEditing(true)} style={{ fontSize: 22 }}>
          {editing ? 'check' : 'edit'}
        </button>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '32px 20px 20px' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFF', fontSize: '1.5rem', fontWeight: 800, margin: '0 auto 12px'
        }}>
          {initials}
        </div>
        {editing ? (
          <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, textAlign: 'center', border: 'none', borderBottom: '2px solid var(--accent)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '80%', padding: '4px 0' }} />
        ) : (
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>{name}</div>
        )}
        {editing ? (
          <input type="text" value={city} onChange={e => setCity(e.target.value)} style={{ fontSize: '0.78rem', textAlign: 'center', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', color: 'var(--text-tertiary)', outline: 'none', width: '60%', marginTop: 6, padding: '2px 0' }} />
        ) : (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 4 }}>{city}</div>
        )}
        {editing ? (
          <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 140))} placeholder="Sua bio (140 caracteres)" maxLength={140} style={{ width: '90%', marginTop: 12, padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-primary)', resize: 'none', height: 60, outline: 'none' }} />
        ) : bio ? (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 8, fontStyle: 'italic' }}>{bio}</div>
        ) : null}
      </div>

      {/* Info card */}
      <div style={{ margin: '0 16px 16px', padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--accent)' }}>church</span>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Minha Paróquia</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Paróquia São José — Meireles</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--accent)' }}>person_celebrate</span>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Santo Padroeiro</div>
            {editing ? (
              <input type="text" value={santo} onChange={e => setSanto(e.target.value)} style={{ fontSize: '0.85rem', fontWeight: 600, border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', padding: '2px 0' }} />
            ) : (
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{santo}</div>
            )}
          </div>
        </div>
      </div>

      {/* Práticas */}
      <div style={{ margin: '0 16px 16px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Vida de oração</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {practices.map((p, i) => (
            <span key={i} style={{ padding: '5px 14px', background: 'var(--accent-soft)', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)' }}>{p}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ margin: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 24, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>{s.icon}</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 40 }} />
    </div>
  )
}
