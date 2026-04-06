import { useState } from 'react'

const sections = [
  { part: 'Parte I', title: 'A Profissão de Fé', icon: 'menu_book', topics: [
    { num: '§26-49', name: 'O homem é capaz de Deus' },
    { num: '§50-141', name: 'Deus vem ao encontro do homem' },
    { num: '§142-184', name: 'A resposta do homem a Deus (a fé)' },
    { num: '§185-1065', name: 'Creio — Nós cremos (O Credo)' },
  ]},
  { part: 'Parte II', title: 'A Celebração do Mistério Cristão', icon: 'local_dining', topics: [
    { num: '§1066-1209', name: 'A economia sacramental' },
    { num: '§1210-1690', name: 'Os sete sacramentos da Igreja' },
  ]},
  { part: 'Parte III', title: 'A Vida em Cristo', icon: 'favorite', topics: [
    { num: '§1691-1876', name: 'A vocação do homem: a vida no Espírito' },
    { num: '§1877-2557', name: 'Os Dez Mandamentos' },
  ]},
  { part: 'Parte IV', title: 'A Oração Cristã', icon: 'folded_hands', topics: [
    { num: '§2558-2758', name: 'A oração na vida cristã' },
    { num: '§2759-2865', name: 'A oração do Senhor: Pai Nosso' },
  ]},
]

export default function Catecismo() {
  const [openSection, setOpenSection] = useState(null)

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ background: 'linear-gradient(145deg, #92400E 0%, #78350F 100%)', borderRadius: 'var(--radius-lg)', padding: '24px 20px', color: '#FFF', textAlign: 'center', marginBottom: 16 }}>
        <span className="material-symbols-rounded" style={{ fontSize: 36, marginBottom: 6, display: 'block' }}>school</span>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600 }}>Catecismo da Igreja Católica</div>
        <div style={{ fontSize: '0.72rem', opacity: 0.8, marginTop: 4 }}>Referência completa da doutrina católica</div>
      </div>

      {sections.map((sec, si) => (
        <div key={si} className={`exame-mandamento ${openSection === si ? 'open' : ''}`} style={{ marginBottom: 8 }}>
          <div className="exame-mandamento-header" onClick={() => setOpenSection(openSection === si ? null : si)}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--accent)' }}>{sec.icon}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{sec.part}</div>
              <div className="exame-mandamento-title">{sec.title}</div>
            </div>
            <div className="exame-mandamento-arrow">expand_more</div>
          </div>
          <div className="exame-mandamento-body">
            <div className="exame-mandamento-body-inner">
              {sec.topics.map((topic, ti) => (
                <div key={ti} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: ti < sec.topics.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>{topic.num}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{topic.name}</span>
                  <span className="material-symbols-rounded" style={{ fontSize: 16, color: 'var(--text-tertiary)', marginLeft: 'auto' }}>chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div style={{ height: 100 }} />
    </div>
  )
}
