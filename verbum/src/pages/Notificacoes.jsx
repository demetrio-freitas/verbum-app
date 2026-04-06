import { useState } from 'react'
import { toast } from '../components/shared/Toast.jsx'

const notifTypes = [
  { key: 'novena', icon: 'hourglass_top', name: 'Novenas', desc: 'Lembrete diário durante novenas ativas', freq: '1/dia x 9 dias', defaultOn: true },
  { key: 'preceito', icon: 'priority_high', name: 'Dias de Preceito', desc: 'Aviso na véspera de dias de Missa obrigatória', freq: '~12/ano', defaultOn: true },
  { key: 'tempo', icon: 'park', name: 'Tempos Litúrgicos', desc: 'Início do Advento, Quaresma, Páscoa...', freq: '~8/ano', defaultOn: true },
  { key: 'santo', icon: 'person_celebrate', name: 'Santos do Dia', desc: 'Solenidades e festas maiores', freq: '~30/ano', defaultOn: false },
  { key: 'paroquia', icon: 'church', name: 'Minha Paróquia', desc: 'Avisos do padre: Missa extra, eventos', freq: 'máx 3/sem', defaultOn: false },
]

const upcoming = [
  { day: '13', month: 'Abr', title: 'Domingo de Ramos', type: 'Início da Semana Santa', badge: 'tempo' },
  { day: '17', month: 'Abr', title: 'Quinta-feira Santa', type: 'Instituição da Eucaristia', badge: 'preceito' },
  { day: '18', month: 'Abr', title: 'Sexta-feira Santa', type: 'Paixão do Senhor', badge: 'preceito' },
  { day: '20', month: 'Abr', title: 'Domingo de Páscoa', type: 'Ressurreição do Senhor', badge: 'tempo' },
  { day: '29', month: 'Abr', title: 'Santa Catarina de Sena', type: 'Padroeira da Europa', badge: 'santo' },
  { day: '01', month: 'Mai', title: 'São José Operário', type: 'Padroeiro dos trabalhadores', badge: 'santo' },
]

export default function Notificacoes() {
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(notifTypes.map(t => [t.key, t.defaultOn]))
  )
  const [horario, setHorario] = useState('manha')
  const [maxPerDay, setMaxPerDay] = useState(1)

  const activeCount = Object.values(toggles).filter(Boolean).length

  function handleToggle(key) {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      <div className="notif-header-card">
        <div className="notif-title">Notificações Litúrgicas</div>
        <div className="notif-subtitle">Receba lembretes sobre a vida da Igreja no seu dia a dia</div>
      </div>

      <div className={`notif-status-bar ${activeCount > 0 ? 'on' : 'off'}`}>
        <span className="material-symbols-rounded">{activeCount > 0 ? 'notifications_active' : 'notifications_off'}</span>
        {activeCount > 0 ? `Notificações ativadas — ${activeCount} tipo${activeCount > 1 ? 's' : ''} ativo${activeCount > 1 ? 's' : ''}` : 'Notificações desativadas'}
      </div>

      <div className="notif-preview">
        <div className="notif-preview-label">Exemplo de como aparece no celular</div>
        <div className="notif-preview-card">
          <div className="notif-preview-icon">auto_stories</div>
          <div className="notif-preview-content">
            <div className="notif-preview-app">Verbum</div>
            <div className="notif-preview-title">Amanhã é Corpus Christi</div>
            <div className="notif-preview-body">Dia de preceito — não esqueça da Santa Missa. Toque para ver os horários.</div>
          </div>
          <div className="notif-preview-time">6h</div>
        </div>
      </div>

      <div className="notif-group">
        <div className="notif-group-label">Tipos de notificação</div>
        {notifTypes.map(t => (
          <div className="notif-card" key={t.key}>
            <div className="notif-card-row">
              <div className={`notif-card-icon ${t.key}`}>{t.icon}</div>
              <div className="notif-card-info">
                <div className="notif-card-name">{t.name}</div>
                <div className="notif-card-desc">{t.desc}</div>
              </div>
              <div className="notif-card-freq">{t.freq}</div>
              <div className={`notif-toggle ${toggles[t.key] ? 'on' : ''}`} onClick={() => handleToggle(t.key)} />
            </div>
          </div>
        ))}
      </div>

      <div className="notif-horario-section">
        <div className="notif-horario-label">Quando quer receber?</div>
        <div className="notif-horario-options">
          {[{ key: 'manha', time: '6h', label: 'Manhã' }, { key: 'premissa', time: '30min', label: 'Pré-Missa' }, { key: 'noite', time: '20h', label: 'Noite' }].map(h => (
            <button key={h.key} className={`notif-horario-btn ${horario === h.key ? 'active' : ''}`} onClick={() => { setHorario(h.key); toast(`Horário: ${h.label} (${h.time})`); }}>
              <span className="horario-time">{h.time}</span>
              <span className="horario-label">{h.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="notif-freq-section">
        <div className="notif-freq-row">
          <div className="notif-freq-label">Máximo por dia</div>
          <div className="notif-freq-stepper">
            <button onClick={() => setMaxPerDay(Math.max(1, maxPerDay - 1))}>remove</button>
            <span className="notif-freq-value">{maxPerDay}</span>
            <button onClick={() => setMaxPerDay(Math.min(3, maxPerDay + 1))}>add</button>
          </div>
        </div>
      </div>

      <div className="notif-upcoming">
        <div className="notif-group-label">Próximas notificações</div>
        {upcoming.map((item, i) => (
          <div className="notif-upcoming-item" key={i}>
            <div className="notif-upcoming-date">
              <div className="day">{item.day}</div>
              <div className="month">{item.month}</div>
            </div>
            <div className="notif-upcoming-info">
              <div className="notif-upcoming-title">{item.title}</div>
              <div className="notif-upcoming-type">{item.type}</div>
            </div>
            <div className={`notif-upcoming-badge ${item.badge}`}>{item.badge === 'preceito' ? 'Preceito' : item.badge === 'tempo' ? 'Tempo' : 'Santo'}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 100 }} />
    </>
  )
}
