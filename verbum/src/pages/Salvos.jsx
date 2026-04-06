export default function Salvos() {
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 20px',
        textAlign: 'center',
        marginTop: 8
      }}>
        <span className="material-symbols-rounded" style={{ fontSize: 48, color: 'var(--accent)', display: 'block', marginBottom: 12 }}>bookmark</span>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, marginBottom: 6 }}>Leituras Salvas</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>Esta seção estará disponível em breve na próxima atualização.</div>
      </div>
      <div style={{ height: 100 }} />
    </div>
  )
}
