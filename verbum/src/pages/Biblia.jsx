import { useState } from 'react'

const books = {
  'Antigo Testamento': [
    { name: 'Gênesis', abbr: 'Gn', chapters: 50 }, { name: 'Êxodo', abbr: 'Ex', chapters: 40 },
    { name: 'Levítico', abbr: 'Lv', chapters: 27 }, { name: 'Números', abbr: 'Nm', chapters: 36 },
    { name: 'Deuteronômio', abbr: 'Dt', chapters: 34 }, { name: 'Josué', abbr: 'Js', chapters: 24 },
    { name: 'Juízes', abbr: 'Jz', chapters: 21 }, { name: 'Rute', abbr: 'Rt', chapters: 4 },
    { name: '1 Samuel', abbr: '1Sm', chapters: 31 }, { name: '2 Samuel', abbr: '2Sm', chapters: 24 },
    { name: '1 Reis', abbr: '1Rs', chapters: 22 }, { name: '2 Reis', abbr: '2Rs', chapters: 25 },
    { name: 'Salmos', abbr: 'Sl', chapters: 150 }, { name: 'Provérbios', abbr: 'Pr', chapters: 31 },
    { name: 'Eclesiastes', abbr: 'Ecl', chapters: 12 }, { name: 'Isaías', abbr: 'Is', chapters: 66 },
    { name: 'Jeremias', abbr: 'Jr', chapters: 52 }, { name: 'Daniel', abbr: 'Dn', chapters: 14 },
  ],
  'Novo Testamento': [
    { name: 'Mateus', abbr: 'Mt', chapters: 28 }, { name: 'Marcos', abbr: 'Mc', chapters: 16 },
    { name: 'Lucas', abbr: 'Lc', chapters: 24 }, { name: 'João', abbr: 'Jo', chapters: 21 },
    { name: 'Atos', abbr: 'At', chapters: 28 }, { name: 'Romanos', abbr: 'Rm', chapters: 16 },
    { name: '1 Coríntios', abbr: '1Cor', chapters: 16 }, { name: '2 Coríntios', abbr: '2Cor', chapters: 13 },
    { name: 'Gálatas', abbr: 'Gl', chapters: 6 }, { name: 'Efésios', abbr: 'Ef', chapters: 6 },
    { name: 'Filipenses', abbr: 'Fl', chapters: 4 }, { name: 'Colossenses', abbr: 'Cl', chapters: 4 },
    { name: 'Hebreus', abbr: 'Hb', chapters: 13 }, { name: 'Tiago', abbr: 'Tg', chapters: 5 },
    { name: 'Apocalipse', abbr: 'Ap', chapters: 22 },
  ]
}

export default function Biblia() {
  const [search, setSearch] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)

  const q = search.toLowerCase()

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ background: 'var(--gospel-gradient)', borderRadius: 'var(--radius-lg)', padding: '24px 20px', color: '#FFF', textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>Bíblia Sagrada</div>
        <div style={{ fontSize: '0.72rem', opacity: 0.8, marginTop: 4 }}>Edição Ave Maria — 73 livros</div>
      </div>

      <div className="search-wrapper" style={{ marginBottom: 16 }}>
        <span className="search-icon">search</span>
        <input type="text" className="search-input" placeholder="Buscar livro (ex: João, Salmos)..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {selectedBook ? (
        <>
          <button className="nav-tab active" onClick={() => setSelectedBook(null)} style={{ marginBottom: 12 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 16 }}>arrow_back</span> Voltar
          </button>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, marginBottom: 12 }}>{selectedBook.name}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
            {Array.from({ length: selectedBook.chapters }, (_, i) => (
              <button key={i} className="reading-card" style={{ padding: '10px 0', textAlign: 'center', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        Object.entries(books).map(([testament, bookList]) => (
          <div key={testament} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent)', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>{testament}</div>
            {bookList.filter(b => !q || b.name.toLowerCase().includes(q) || b.abbr.toLowerCase().includes(q)).map((book, i) => (
              <div key={i} className="reading-card" style={{ marginBottom: 6, padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setSelectedBook(book)}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{book.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{book.chapters} capítulos</div>
                </div>
                <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--text-tertiary)' }}>chevron_right</span>
              </div>
            ))}
          </div>
        ))
      )}
      <div style={{ height: 100 }} />
    </div>
  )
}
