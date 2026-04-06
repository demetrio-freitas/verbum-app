export default function Paroquia() {
  const horarios = [
    { dia: 'Domingo', horarios: ['7h', '9h', '11h', '17h', '19h'] },
    { dia: 'Segunda a Sexta', horarios: ['7h', '12h', '19h'] },
    { dia: 'Sábado', horarios: ['7h', '17h', '19h30'] },
  ]

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ background: 'var(--gospel-gradient)', borderRadius: 'var(--radius-lg)', padding: '24px 20px', color: '#FFF', textAlign: 'center', marginBottom: 16 }}>
        <span className="material-symbols-rounded" style={{ fontSize: 36, marginBottom: 6, display: 'block' }}>church</span>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600 }}>Paróquia São José</div>
        <div style={{ fontSize: '0.72rem', opacity: 0.8, marginTop: 4 }}>Meireles — Fortaleza, CE</div>
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, marginBottom: 10 }}>Horários das Missas</div>

      {horarios.map((h, i) => (
        <div key={i} className="reading-card" style={{ marginBottom: 8, padding: '14px 16px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{h.dia}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {h.horarios.map((t, j) => (
              <span key={j} style={{ padding: '4px 12px', background: 'var(--accent-soft)', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>{t}</span>
            ))}
          </div>
        </div>
      ))}

      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, marginBottom: 10, marginTop: 20 }}>Confissões</div>
      <div className="reading-card" style={{ padding: '14px 16px', marginBottom: 8 }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Sábados das 15h às 17h</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: 2 }}>Ou em horário combinado com o padre</div>
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, marginBottom: 10, marginTop: 20 }}>Contato</div>
      <div className="reading-card" style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: '0.82rem', marginBottom: 4 }}><strong>Telefone:</strong> (85) 3242-1234</div>
        <div style={{ fontSize: '0.82rem', marginBottom: 4 }}><strong>Pároco:</strong> Pe. João Silva</div>
        <div style={{ fontSize: '0.82rem' }}><strong>Endereço:</strong> Rua São José, 123 — Meireles</div>
      </div>

      <div style={{ height: 100 }} />
    </div>
  )
}
