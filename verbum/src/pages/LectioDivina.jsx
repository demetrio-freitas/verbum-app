import { useState, useEffect, useRef } from 'react'

const stages = [
  { name: 'LECTIO', subtitle: 'Leitura', icon: 'menu_book', instruction: 'Leia lentamente o Evangelho do dia. Pare no que tocar seu coração.', duration: 300 },
  { name: 'MEDITATIO', subtitle: 'Meditação', icon: 'psychology', instruction: 'O que Deus quer dizer a você através deste texto? Reflita em silêncio.', duration: 300 },
  { name: 'ORATIO', subtitle: 'Oração', icon: 'folded_hands', instruction: 'Fale com Deus sobre o que meditou. Abra seu coração.', duration: 300 },
  { name: 'CONTEMPLATIO', subtitle: 'Contemplação', icon: 'self_improvement', instruction: 'Descanse na presença de Deus. Apenas esteja.', duration: 300 },
]

export default function LectioDivina() {
  const [currentStage, setCurrentStage] = useState(-1)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef(null)

  const isActive = currentStage >= 0 && currentStage < stages.length

  useEffect(() => {
    if (!isActive) return
    setTimeLeft(stages[currentStage].duration)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [currentStage, isActive])

  function start() { setCurrentStage(0) }
  function next() {
    if (currentStage < stages.length - 1) setCurrentStage(currentStage + 1)
    else setCurrentStage(-1)
  }

  const min = Math.floor(timeLeft / 60)
  const sec = timeLeft % 60

  if (currentStage === -1) {
    return (
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: 'linear-gradient(145deg, #5B7A3D 0%, #2E3E1F 100%)', borderRadius: 'var(--radius-lg)', padding: '32px 20px', color: '#FFF', textAlign: 'center', marginBottom: 16 }}>
          <span className="material-symbols-rounded" style={{ fontSize: 40, marginBottom: 8, display: 'block' }}>self_improvement</span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>Lectio Divina</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: 4 }}>Oração contemplativa em 4 etapas</div>
        </div>
        {stages.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(91,122,61,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5B7A3D', fontWeight: 800, fontSize: '0.78rem' }}>{i + 1}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600 }}>{s.name} <span style={{ fontWeight: 400, color: 'var(--text-tertiary)' }}>— {s.subtitle}</span></div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>5 minutos</div>
            </div>
          </div>
        ))}
        <button onClick={start} style={{ width: '100%', marginTop: 16, padding: '16px', background: '#5B7A3D', color: '#FFF', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>Iniciar Lectio Divina</button>
        <div style={{ height: 100 }} />
      </div>
    )
  }

  const stage = stages[currentStage]
  return (
    <div style={{ padding: '40px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: 8 }}>Etapa {currentStage + 1} de 4</div>
      <span className="material-symbols-rounded" style={{ fontSize: 48, color: '#5B7A3D', display: 'block', marginBottom: 12 }}>{stage.icon}</span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 600 }}>{stage.name}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 24 }}>{stage.subtitle}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 32 }}>{stage.instruction}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 300, marginBottom: 24 }}>{min}:{sec.toString().padStart(2, '0')}</div>
      <button onClick={next} style={{ padding: '14px 32px', background: '#5B7A3D', color: '#FFF', border: 'none', borderRadius: 100, fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
        {currentStage < 3 ? 'Próxima etapa' : 'Finalizar'}
      </button>
    </div>
  )
}
