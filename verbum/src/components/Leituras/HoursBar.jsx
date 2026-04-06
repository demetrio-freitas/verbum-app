const hours = [
  { key: 'laudes', name: 'Laudes', time: '6h', status: 'done' },
  { key: 'vesperas', name: 'Vésperas', time: '18h', status: 'active' },
  { key: 'completas', name: 'Completas', time: '21h', status: 'future' },
]

export default function HoursBar() {
  return (
    <div style={{ padding: '0 20px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {hours.map((h, i) => (
          <div key={h.key} style={{ display: 'contents' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '0.58rem', fontWeight: 600, color: h.status === 'active' ? 'var(--accent)' : 'var(--text-tertiary)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {h.name} · {h.time}
              </div>
              <div style={{
                height: 6, borderRadius: 3,
                background: h.status === 'done' ? 'var(--accent)' : h.status === 'active' ? 'var(--accent)' : 'var(--bg-elevated)',
                opacity: h.status === 'done' ? 0.4 : 1,
                boxShadow: h.status === 'active' ? '0 0 8px var(--accent-glow)' : 'none',
                transition: 'all 0.3s'
              }} />
            </div>
            {i < hours.length - 1 && (
              <div style={{ width: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                {h.status === 'done' && hours[i + 1].status === 'active' && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent-glow)' }} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
