import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const steps = [
  { icon: 'menu_book', title: 'Evangelho do Dia', desc: 'Leia as leituras da Missa de hoje com reflexão e versículo inspirador.' },
  { icon: 'auto_stories', title: 'Folheto da Missa', desc: 'Acompanhe a Santa Missa no celular — todas as respostas na ponta dos dedos.' },
  { icon: 'radio_button_checked', title: 'Santo Terço', desc: 'Reze o terço com guia interativo, mistérios e progresso visual.' },
  { icon: 'notifications', title: 'Lembretes', desc: 'Receba avisos de dias de preceito, novenas e tempos litúrgicos.' },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  function finish() {
    localStorage.setItem('verbum-onboarded', 'true')
    navigate('/')
  }

  const current = steps[step]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span className="material-symbols-rounded" style={{ fontSize: 64, color: 'var(--accent)', marginBottom: 24, display: 'block' }}>{current.icon}</span>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 600, marginBottom: 12, lineHeight: 1.2 }}>{current.title}</div>
        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 300, margin: '0 auto' }}>{current.desc}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 32 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? 'var(--accent)' : 'var(--border)', transition: 'all 0.3s' }} />
        ))}
      </div>

      <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : finish()} style={{ width: '100%', padding: '16px', background: 'var(--accent)', color: '#FFF', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }}>
        {step < steps.length - 1 ? 'Próximo' : 'Começar'}
      </button>

      {step < steps.length - 1 && (
        <button onClick={finish} style={{ marginTop: 12, background: 'transparent', border: 'none', color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', cursor: 'pointer' }}>
          Pular
        </button>
      )}
    </div>
  )
}
