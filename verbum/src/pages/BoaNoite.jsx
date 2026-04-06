const stories = [
  { cat: 'Salmos Contemplativos', icon: 'nights_stay', items: [
    { name: 'Salmo 23 — O Senhor é meu pastor', duration: '12 min' },
    { name: 'Salmo 91 — Abrigo do Altíssimo', duration: '10 min' },
    { name: 'Salmo 121 — O Senhor te guarda', duration: '8 min' },
    { name: 'Salmo 139 — Senhor, vós me sondais', duration: '14 min' },
  ]},
  { cat: 'Parábolas de Jesus', icon: 'auto_stories', items: [
    { name: 'O Bom Samaritano', duration: '15 min' },
    { name: 'O Filho Pródigo', duration: '18 min' },
    { name: 'O Semeador', duration: '12 min' },
    { name: 'A Ovelha Perdida', duration: '10 min' },
  ]},
  { cat: 'Santos Brasileiros', icon: 'person_celebrate', items: [
    { name: 'Irmã Dulce — O Anjo Bom da Bahia', duration: '20 min' },
    { name: 'Frei Galvão — Primeiro santo brasileiro', duration: '18 min' },
    { name: 'Padre Anchieta — Apóstolo do Brasil', duration: '22 min' },
  ]},
]

export default function BoaNoite() {
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ background: 'linear-gradient(145deg, #1E1B4B 0%, #0F0D2E 100%)', borderRadius: 'var(--radius-lg)', padding: '32px 20px', color: '#FFF', textAlign: 'center', marginBottom: 16 }}>
        <span className="material-symbols-rounded" style={{ fontSize: 40, marginBottom: 8, display: 'block' }}>bedtime</span>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>Boa Noite</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: 4 }}>Histórias bíblicas e vidas de santos para dormir</div>
      </div>

      <div style={{ background: 'rgba(124,58,237,0.06)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 16, fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="material-symbols-rounded" style={{ fontSize: 18, color: '#7C3AED' }}>headphones</span>
        Narração com sons ambiente — chuva suave, sinos, cantos gregorianos
      </div>

      {stories.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--accent)' }}>{cat.icon}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600 }}>{cat.cat}</span>
          </div>
          {cat.items.map((item, i) => (
            <div key={i} className="reading-card" style={{ marginBottom: 8, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'linear-gradient(145deg, #1E1B4B, #312E81)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-rounded" style={{ color: '#FFF', fontSize: 20 }}>play_arrow</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{item.duration}</div>
              </div>
              <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--text-tertiary)' }}>lock</span>
            </div>
          ))}
        </div>
      ))}

      <div style={{ textAlign: 'center', padding: '16px', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
        Conteúdo Premium — disponível em breve
      </div>
      <div style={{ height: 100 }} />
    </div>
  )
}
