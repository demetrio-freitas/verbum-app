import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'

const themeOptions = [
  { key: '', name: 'Clássico', desc: 'Tons quentes, tipografia serifada', color: '#78350F' },
  { key: 'serenidade', name: 'Serenidade', desc: 'Azul calmo e contemplativo', color: '#3B6FA0' },
  { key: 'jovem', name: 'Jovem', desc: 'Moderno e vibrante', color: '#7C3AED' },
  { key: 'minimalista', name: 'Minimalista', desc: 'Limpo e essencial', color: '#111111' },
  { key: 'natureza', name: 'Natureza', desc: 'Verde e terra, orgânico', color: '#5B7A3D' },
]

const massFreqs = [
  { icon: 'event_repeat', label: 'Todo domingo', sub: 'E às vezes durante a semana' },
  { icon: 'calendar_month', label: 'Quase todo domingo', sub: 'Quando consigo ir' },
  { icon: 'event', label: 'Algumas vezes por mês', sub: 'Vou quando posso' },
  { icon: 'event_busy', label: 'Raramente ou nunca', sub: 'Quero voltar a frequentar' },
]

const practices = [
  { icon: 'radio_button_checked', label: 'Terço / Rosário', sub: 'Rezo com alguma frequência' },
  { icon: 'auto_stories', label: 'Lectio Divina', sub: 'Leio e medito a Palavra' },
  { icon: 'schedule', label: 'Liturgia das Horas', sub: 'Rezo Laudes, Vésperas ou Completas' },
  { icon: 'hourglass_top', label: 'Novenas', sub: 'Costumo rezar novenas' },
  { icon: 'self_improvement', label: 'Adoração ao Santíssimo', sub: 'Faço adoração quando posso' },
  { icon: 'wb_twilight', label: 'Estou começando agora', sub: 'Quero aprender a rezar' },
]

const notifTimes = [
  { icon: 'wb_twilight', label: '6h' },
  { icon: 'wb_sunny', label: '8h' },
  { icon: 'lunch_dining', label: '12h' },
  { icon: 'nightlight', label: '21h' },
  { icon: 'notifications_off', label: 'Não' },
]

const padres = [
  { initials: 'PR', name: 'Pe. Paulo Ricardo', tag: 'Formação', tagColor: '#DC2626', desc: 'Doutrinário · Direto', color: '#78350F' },
  { initials: 'FM', name: 'Pe. Fábio de Melo', tag: 'Reflexão', tagColor: '#D97706', desc: 'Poético · Emocional', color: '#1E3A5F' },
  { initials: 'RM', name: 'Pe. Reginaldo Manzotti', tag: 'Devoção', tagColor: '#DC2626', desc: 'Popular · Carismático', color: '#57534E' },
  { initials: 'CS', name: 'Pe. Chrystian Shankar', tag: 'Jovem', tagColor: '#7C3AED', desc: 'Dinâmico · Digital', color: '#4C1D95' },
  { initials: 'RL', name: 'Pe. Roger Luis', tag: 'Liturgia', tagColor: '#16A34A', desc: 'Equilibrado · Pastoral', color: '#78350F' },
]

const TOTAL_STEPS = 8

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [selectedTheme, setSelectedTheme] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [name, setName] = useState('')
  const [ageGroup, setAgeGroup] = useState('')
  const [massFreq, setMassFreq] = useState(null)
  const [selectedPractices, setSelectedPractices] = useState([])
  const [notifTime, setNotifTime] = useState(null)
  const [selectedPadre, setSelectedPadre] = useState('RL')
  const navigate = useNavigate()
  const theme = useTheme()

  function next() {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1)
    } else {
      finish()
    }
  }

  function finish() {
    theme.setVisualTheme(selectedTheme)
    if (darkMode) theme.toggleDarkMode()
    localStorage.setItem('verbum-onboarded', 'true')
    localStorage.setItem('verbum-user-name', name)
    navigate('/')
  }

  function togglePractice(idx) {
    setSelectedPractices(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  function selectThemeOption(key) {
    setSelectedTheme(key)
  }

  const progress = ((step) / (TOTAL_STEPS - 1)) * 100

  const btnLabel = step === 0 ? 'Começar' : step === TOTAL_STEPS - 1 ? 'Começar a rezar' : 'Continuar'
  const btnIcon = step === TOTAL_STEPS - 1 ? 'menu_book' : 'arrow_forward'

  return (
    <div style={{ minHeight: '100vh', maxWidth: 480, margin: '0 auto', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Progress bar */}
      {step > 0 && (
        <div style={{ padding: '16px 24px 0' }}>
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', justifyContent: step === 0 || step === TOTAL_STEPS - 1 ? 'center' : 'flex-start', paddingTop: step > 0 && step < TOTAL_STEPS - 1 ? 32 : 0, overflowY: 'auto' }}>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>Verbum</h1>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>Sua caminhada diária<br />com a Palavra de Deus</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginTop: 32, lineHeight: 1.6 }}>Vamos personalizar o app para a sua jornada de fé. Leva menos de 1 minuto.</p>
          </div>
        )}

        {/* Step 1: Theme */}
        {step === 1 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>Qual é o seu estilo?</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: 20 }}>Escolha o tema visual do app. Você pode mudar depois.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {themeOptions.map(t => (
                <div key={t.key} onClick={() => selectThemeOption(t.key)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: 'var(--bg-card)', border: selectedTheme === t.key ? '2px solid var(--accent)' : '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{t.desc}</div>
                  </div>
                  {selectedTheme === t.key && <span className="material-symbols-rounded" style={{ color: 'var(--accent)', fontSize: 22 }}>check_circle</span>}
                </div>
              ))}
            </div>
            <div onClick={() => setDarkMode(!darkMode)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', marginTop: 12, borderTop: '1px solid var(--border)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--text-secondary)' }}>{darkMode ? 'dark_mode' : 'light_mode'}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Modo escuro</span>
              </div>
              <div style={{ width: 44, height: 24, borderRadius: 12, background: darkMode ? 'var(--accent)' : 'var(--bg-elevated)', border: '1.5px solid var(--border)', position: 'relative', transition: 'all 0.3s' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: darkMode ? '#FFF' : 'var(--text-tertiary)', position: 'absolute', top: 2, left: darkMode ? 22 : 2, transition: 'all 0.3s' }} />
              </div>
            </div>
          </>
        )}

        {/* Step 2: Name & Age */}
        {step === 2 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>Como posso te chamar?</h2>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" style={{ width: '100%', padding: '14px 18px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', textAlign: 'center', marginBottom: 24 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, textAlign: 'center', marginBottom: 12 }}>Qual sua faixa etária?</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Até 18', '19–30', '31–50', '51–70', '70+'].map(age => (
                <button key={age} onClick={() => setAgeGroup(age)} style={{ padding: '10px 20px', border: ageGroup === age ? '2px solid var(--accent)' : '1.5px solid var(--border)', borderRadius: 100, background: ageGroup === age ? 'var(--accent-soft)' : 'transparent', fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: ageGroup === age ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                  {age}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 3: Mass Frequency */}
        {step === 3 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>Com que frequência vai à Missa?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {massFreqs.map((f, i) => (
                <div key={i} onClick={() => setMassFreq(i)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: 'var(--bg-card)', border: massFreq === i ? '2px solid var(--accent)' : '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 22, color: massFreq === i ? 'var(--accent)' : 'var(--text-tertiary)' }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{f.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 4: Prayer Practices */}
        {step === 4 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, textAlign: 'center', marginBottom: 4 }}>O que já faz parte da sua vida de oração?</h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: 16 }}>Marque tudo que se aplica</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {practices.map((p, i) => (
                <div key={i} onClick={() => togglePractice(i)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: 'var(--bg-card)', border: selectedPractices.includes(i) ? '2px solid var(--accent)' : '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 22, color: selectedPractices.includes(i) ? 'var(--accent)' : 'var(--text-tertiary)' }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{p.sub}</div>
                  </div>
                  {selectedPractices.includes(i) && <span className="material-symbols-rounded" style={{ color: 'var(--accent)', fontSize: 20 }}>check_circle</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 5: Notification Time */}
        {step === 5 && (
          <>
            <div style={{ flex: 1 }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>Quando quer ser lembrado de ler o Evangelho?</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {notifTimes.map((t, i) => (
                <button key={i} onClick={() => setNotifTime(i)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 18px', border: notifTime === i ? '2px solid var(--accent)' : '1.5px solid var(--border)', borderRadius: 100, background: notifTime === i ? 'var(--accent-soft)' : 'transparent', fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: notifTime === i ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 18 }}>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
            <div style={{ flex: 1 }} />
          </>
        )}

        {/* Step 6: Choose Padre */}
        {step === 6 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, textAlign: 'center', marginBottom: 4 }}>Quem vai guiar sua reflexão?</h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: 16 }}>Escolha o padre cuja homilia quer receber todo dia. Pode trocar quando quiser.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {padres.map(p => (
                <div key={p.initials} onClick={() => setSelectedPadre(p.initials)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: 'var(--bg-card)', border: selectedPadre === p.initials ? '2px solid var(--accent)' : '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0 }}>{p.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: p.tagColor, background: `${p.tagColor}15`, padding: '1px 8px', borderRadius: 4 }}>{p.tag}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{p.desc}</span>
                    </div>
                  </div>
                  {selectedPadre === p.initials && <span className="material-symbols-rounded" style={{ color: 'var(--accent)', fontSize: 22 }}>check_circle</span>}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 12 }}>Não se preocupe, você pode ver todos os padres a qualquer momento.</p>
          </>
        )}

        {/* Step 7: Done */}
        {step === 7 && (
          <div style={{ textAlign: 'center' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 40, color: 'var(--accent)', marginBottom: 16, display: 'block' }}>check_circle</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, marginBottom: 8 }}>Bem-vindo{name ? `, ${name}` : ', Peregrino'}!</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>O app vai te guiar passo a passo. Comece pelo Evangelho do dia — é simples e transformador.</p>
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div style={{ padding: '16px 24px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <button onClick={next} style={{ width: '100%', padding: '16px', background: 'var(--accent)', color: '#FFF', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {btnLabel} <span className="material-symbols-rounded" style={{ fontSize: 20 }}>{btnIcon}</span>
        </button>
      </div>
    </div>
  )
}
