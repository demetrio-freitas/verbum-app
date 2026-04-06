import { useState } from 'react'

const igrejas = [
  { nome: 'Paróquia São José', bairro: 'Meireles', dist: '0.8 km', missas: ['7h', '9h', '11h', '19h'], confissao: 'Sáb 15h-17h' },
  { nome: 'Catedral Metropolitana', bairro: 'Centro', dist: '2.1 km', missas: ['6h', '8h', '10h', '12h', '17h', '19h'], confissao: 'Diário 8h-11h' },
  { nome: 'Igreja de Fátima', bairro: 'Fátima', dist: '3.2 km', missas: ['7h', '9h', '19h'], confissao: 'Sáb 16h' },
  { nome: 'Paróquia Cristo Rei', bairro: 'Aldeota', dist: '1.5 km', missas: ['7h', '12h', '19h'], confissao: 'Sáb 15h' },
  { nome: 'Paróquia N. Sra. de Lourdes', bairro: 'Varjota', dist: '2.8 km', missas: ['7h', '18h30'], confissao: 'Sáb 14h-16h' },
  { nome: 'Igreja do Carmo', bairro: 'Centro', dist: '2.3 km', missas: ['7h', '12h', '17h'], confissao: 'Sex 16h' },
]

export default function Igrejas() {
  const [search, setSearch] = useState('')
  const q = search.toLowerCase()
  const filtered = igrejas.filter(ig => !q || ig.nome.toLowerCase().includes(q) || ig.bairro.toLowerCase().includes(q))

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ background: 'linear-gradient(145deg, #3B6FA0 0%, #1B3A5C 100%)', borderRadius: 'var(--radius-lg)', padding: '24px 20px', color: '#FFF', textAlign: 'center', marginBottom: 16 }}>
        <span className="material-symbols-rounded" style={{ fontSize: 36, marginBottom: 6, display: 'block' }}>location_on</span>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600 }}>Igrejas Perto de Mim</div>
        <div style={{ fontSize: '0.72rem', opacity: 0.8, marginTop: 4 }}>Fortaleza, CE — {igrejas.length} igrejas</div>
      </div>

      <div className="search-wrapper" style={{ marginBottom: 16 }}>
        <span className="search-icon">search</span>
        <input type="text" className="search-input" placeholder="Buscar igreja ou bairro..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.map((ig, i) => (
        <div key={i} className="reading-card" style={{ marginBottom: 10, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{ig.nome}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{ig.bairro} — {ig.dist}</div>
            </div>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: '#3B6FA0' }}>directions</span>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
            {ig.missas.map((m, j) => (
              <span key={j} style={{ padding: '3px 10px', background: 'var(--accent-soft)', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, color: 'var(--accent)' }}>{m}</span>
            ))}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Confissão: {ig.confissao}</div>
        </div>
      ))}
      <div style={{ height: 100 }} />
    </div>
  )
}
