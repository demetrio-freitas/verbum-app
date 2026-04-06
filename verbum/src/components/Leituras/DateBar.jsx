import { useState } from 'react'

const tempos = [
  { key: 'advento', name: 'Advento', color: '#6D28D9', left: 0, width: 7.7, dates: '29 Nov – 24 Dez', desc: 'Preparação para o Natal. Tempo de espera e esperança.', symbol: 'Coroa do Advento' },
  { key: 'natal', name: 'Natal', color: '#FFFFFF', left: 7.7, width: 5.5, dates: '25 Dez – 12 Jan', desc: 'Celebração do nascimento de Jesus Cristo.', symbol: 'Presépio' },
  { key: 'comum1', name: 'Tempo Comum I', color: '#16A34A', left: 13.2, width: 12.3, dates: '13 Jan – 17 Fev', desc: 'Tempo de crescimento na fé, entre Natal e Quaresma.', symbol: 'Verde' },
  { key: 'quaresma', name: 'Quaresma', color: '#6D28D9', left: 25.5, width: 11, dates: '18 Fev – 1 Abr', desc: '40 dias de preparação para a Páscoa. Jejum, oração e caridade.', symbol: 'Cruz de cinzas' },
  { key: 'triduo', name: 'Tríduo Pascal', color: '#DC2626', left: 36.5, width: 0.8, dates: '2 – 4 Abr', desc: 'Os três dias mais sagrados: Quinta, Sexta e Sábado Santos.', symbol: 'Cruz' },
  { key: 'pascoa', name: 'Tempo Pascal', color: '#FFFFFF', left: 37.3, width: 13.7, dates: '5 Abr – 24 Mai', desc: 'Celebração da Ressurreição. 50 dias de alegria até Pentecostes.', symbol: 'Círio Pascal', current: true },
  { key: 'comum2', name: 'Tempo Comum II', color: '#16A34A', left: 51, width: 49, dates: '25 Mai – 28 Nov', desc: 'O tempo mais longo do ano. Crescimento ordinário na fé.', symbol: 'Verde' },
]

export default function DateBar({ liturgicalTitle, dateDisplay, liturgicalColor, colorName }) {
  const [expanded, setExpanded] = useState(false)
  const [activeTempo, setActiveTempo] = useState(null)

  function handleTempoClick(tempo) {
    setActiveTempo(activeTempo?.key === tempo.key ? null : tempo)
  }

  return (
    <>
      <div className="date-bar">
        <div className="date-info">
          <div className="date-liturgical">{liturgicalTitle}</div>
          <div className="date-calendar">{dateDisplay}</div>
        </div>
        <div className="liturgical-badge" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
          <div className="liturgical-dot" style={{ background: liturgicalColor }} />
          {colorName}
          <span className="material-symbols-rounded" style={{ fontSize: 16, transition: 'transform 0.3s', transform: expanded ? 'rotate(180deg)' : 'none' }}>expand_more</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 20px 12px' }}>
          {/* Timeline bar */}
          <div style={{ position: 'relative', height: 12, borderRadius: 6, overflow: 'hidden', background: 'var(--bg-elevated)', marginBottom: activeTempo ? 0 : 4 }}>
            {tempos.map(t => (
              <div
                key={t.key}
                onClick={() => handleTempoClick(t)}
                style={{
                  position: 'absolute', top: 0, bottom: 0,
                  left: `${t.left}%`, width: `${t.width}%`,
                  background: t.color, cursor: 'pointer',
                  opacity: t.current ? 1 : 0.6,
                  border: t.color === '#FFFFFF' ? '1px solid var(--border)' : 'none',
                  boxSizing: 'border-box'
                }}
              />
            ))}
            {/* Today marker */}
            <div style={{ position: 'absolute', top: -2, bottom: -2, left: '38%', width: 3, background: 'var(--accent)', borderRadius: 2, zIndex: 2 }} />
          </div>

          {/* Tempo card */}
          {activeTempo && (
            <div style={{ marginTop: 10, padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: activeTempo.color, border: activeTempo.color === '#FFFFFF' ? '1px solid var(--border)' : 'none', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, flex: 1 }}>{activeTempo.name}</span>
                {activeTempo.current && <span style={{ fontSize: '0.58rem', fontWeight: 700, background: 'var(--green-soft)', color: 'var(--green)', padding: '2px 8px', borderRadius: 100 }}>Agora</span>}
                <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{activeTempo.dates}</span>
                <button className="icon-btn" onClick={() => setActiveTempo(null)} style={{ width: 24, height: 24, fontSize: 16 }}>close</button>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>{activeTempo.desc}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Símbolo: {activeTempo.symbol}</div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
