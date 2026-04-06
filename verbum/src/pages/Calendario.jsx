export default function Calendario() {
  return (
    <div style={{ padding: '16px' }}>
      <div style={{
        background: 'var(--gospel-gradient)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 20px',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 16
      }}>
        <span className="material-symbols-rounded" style={{ fontSize: 40, marginBottom: 8, display: 'block' }}>calendar_month</span>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>Calendário Litúrgico</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: 4 }}>Em migração — conteúdo completo em breve</div>
      </div>
    </div>
  )
}
