const events = [
  { date: '05 Abr', name: 'Domingo de Páscoa', type: 'solenidade', color: '#FFFFFF', desc: 'Ressurreição do Senhor' },
  { date: '13 Abr', name: 'Domingo de Ramos', type: 'tempo', color: '#DC2626', desc: 'Início da Semana Santa' },
  { date: '17 Abr', name: 'Quinta-feira Santa', type: 'preceito', color: '#FFFFFF', desc: 'Última Ceia — Instituição da Eucaristia' },
  { date: '18 Abr', name: 'Sexta-feira Santa', type: 'preceito', color: '#DC2626', desc: 'Paixão do Senhor — Jejum e Abstinência' },
  { date: '29 Abr', name: 'Santa Catarina de Sena', type: 'santo', color: '#FFFFFF', desc: 'Padroeira da Europa, Doutora da Igreja' },
  { date: '01 Mai', name: 'São José Operário', type: 'santo', color: '#FFFFFF', desc: 'Padroeiro dos trabalhadores' },
  { date: '13 Mai', name: 'Nossa Senhora de Fátima', type: 'maria', color: '#FFFFFF', desc: 'Aparição em Portugal (1917)' },
  { date: '24 Mai', name: 'Ascensão do Senhor', type: 'solenidade', color: '#FFFFFF', desc: 'Jesus sobe aos céus — 40 dias após Páscoa' },
  { date: '04 Jun', name: 'Pentecostes', type: 'solenidade', color: '#DC2626', desc: 'Vinda do Espírito Santo' },
  { date: '15 Jun', name: 'Santíssima Trindade', type: 'solenidade', color: '#FFFFFF', desc: 'Mistério central da fé cristã' },
  { date: '19 Jun', name: 'Corpus Christi', type: 'preceito', color: '#FFFFFF', desc: 'Corpo e Sangue de Cristo — dia de preceito' },
  { date: '15 Ago', name: 'Assunção de Maria', type: 'preceito', color: '#FFFFFF', desc: 'Maria é elevada aos céus' },
  { date: '01 Nov', name: 'Todos os Santos', type: 'preceito', color: '#FFFFFF', desc: 'Dia de preceito' },
  { date: '02 Nov', name: 'Finados', type: 'preceito', color: '#6B21A8', desc: 'Oração pelos falecidos' },
  { date: '08 Dez', name: 'Imaculada Conceição', type: 'preceito', color: '#3B82F6', desc: 'Padroeira de Portugal e do Brasil' },
  { date: '25 Dez', name: 'Natal do Senhor', type: 'solenidade', color: '#FFFFFF', desc: 'Nascimento de Jesus Cristo' },
]

const badgeColors = { solenidade: 'tempo', preceito: 'preceito', santo: 'santo', maria: 'santo', tempo: 'tempo' }
const badgeLabels = { solenidade: 'Solenidade', preceito: 'Preceito', santo: 'Santo', maria: 'Maria', tempo: 'Tempo' }

export default function Calendario() {
  return (
    <div style={{ padding: '0 16px' }}>
      <div className="section-subtitle">Calendário Litúrgico 2026</div>

      <div style={{ background: 'var(--accent-soft)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="material-symbols-rounded" style={{ fontSize: 32, color: 'var(--accent)' }}>calendar_month</span>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Datas importantes da Igreja</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Solenidades, preceitos, santos e festas de Maria</div>
        </div>
      </div>

      {events.map((ev, i) => (
        <div key={i} className="notif-upcoming-item">
          <div className="notif-upcoming-date">
            <div className="day">{ev.date.split(' ')[0]}</div>
            <div className="month">{ev.date.split(' ')[1]}</div>
          </div>
          <div className="notif-upcoming-info">
            <div className="notif-upcoming-title">{ev.name}</div>
            <div className="notif-upcoming-type">{ev.desc}</div>
          </div>
          <div className={`notif-upcoming-badge ${badgeColors[ev.type]}`}>{badgeLabels[ev.type]}</div>
        </div>
      ))}

      <div style={{ height: 100 }} />
    </div>
  )
}
