import { useState, useCallback } from 'react'

const mysteries = {
  gozosos: { name: 'Mistérios Gozosos', day: 'Segunda e Sábado', items: ['Anunciação do Anjo a Maria', 'Visitação de Maria a Isabel', 'Nascimento de Jesus', 'Apresentação no Templo', 'Jesus perdido e encontrado no Templo'] },
  dolorosos: { name: 'Mistérios Dolorosos', day: 'Terça e Sexta', items: ['Agonia no Getsêmani', 'Flagelação', 'Coroação de espinhos', 'Jesus carrega a Cruz', 'Crucificação e Morte'] },
  gloriosos: { name: 'Mistérios Gloriosos', day: 'Quarta e Domingo', items: ['Ressurreição', 'Ascensão', 'Vinda do Espírito Santo', 'Assunção de Maria', 'Coroação de Maria'] },
  luminosos: { name: 'Mistérios Luminosos', day: 'Quinta', items: ['Batismo no Jordão', 'Bodas de Caná', 'Anúncio do Reino', 'Transfiguração', 'Instituição da Eucaristia'] },
}

const prayers = {
  sinal: 'Pelo sinal da Santa Cruz, livrai-nos, Deus, Nosso Senhor, dos nossos inimigos. Em nome do Pai e do Filho e do Espírito Santo. Amém.',
  creio: 'Creio em Deus Pai todo-poderoso, Criador do céu e da terra...',
  painosso: 'Pai nosso, que estais no céu, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.',
  avemaria: 'Ave Maria, cheia de graça, o Senhor é convosco. Bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.',
  gloria: 'Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.',
  salve: 'Salve, Rainha, mãe de misericórdia, vida, doçura, esperança nossa, salve!',
}

export default function Terco() {
  const [mysteryKey, setMysteryKey] = useState('gloriosos')
  const [decade, setDecade] = useState(0)
  const [bead, setBead] = useState(0)
  const [phase, setPhase] = useState('intro') // intro, decade, final

  const mystery = mysteries[mysteryKey]
  const totalBeads = 10
  const progress = phase === 'intro' ? 0 : phase === 'final' ? 100 : ((decade * 10 + bead) / 50) * 100

  const advance = useCallback(() => {
    if (phase === 'intro') {
      setPhase('decade')
      setDecade(0)
      setBead(0)
      return
    }
    if (phase === 'final') return
    if (bead < totalBeads - 1) {
      setBead(bead + 1)
    } else if (decade < 4) {
      setDecade(decade + 1)
      setBead(0)
    } else {
      setPhase('final')
    }
  }, [phase, decade, bead])

  function reset() {
    setPhase('intro')
    setDecade(0)
    setBead(0)
  }

  function getCurrentLabel() {
    if (phase === 'intro') return 'Sinal da Cruz'
    if (phase === 'final') return 'Salve Rainha'
    if (bead === 0) return 'Pai Nosso'
    return 'Ave Maria'
  }

  function getCurrentPrayer() {
    if (phase === 'intro') return prayers.sinal
    if (phase === 'final') return prayers.salve
    if (bead === 0) return prayers.painosso
    return prayers.avemaria
  }

  const circumference = 2 * Math.PI * 105
  const offset = circumference - (progress / 100) * circumference

  return (
    <>
      <div className="terco-container">
        <div className="terco-mystery-info">
          <div className="terco-mystery-badge">{phase === 'intro' ? 'Preparação' : phase === 'final' ? 'Conclusão' : `${decade + 1}º Mistério`}</div>
          {phase === 'decade' && <div className="terco-mystery-name">{mystery.items[decade]}</div>}
        </div>

        <div className="terco-breath-container" onClick={advance} style={{ cursor: 'pointer' }}>
          <svg className="terco-breath-progress" viewBox="0 0 220 220">
            <circle className="terco-breath-bg" cx="110" cy="110" r="105" strokeWidth="3" />
            <circle className="terco-breath-fill" cx="110" cy="110" r="105"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="terco-breath-inner">
            <div className="terco-breath-label">{getCurrentLabel()}</div>
            <div className="terco-breath-count">
              {phase === 'intro' ? 'Início' : phase === 'final' ? 'Amém' : `${bead + 1}/10`}
            </div>
          </div>
        </div>

        <div className="terco-prayer-area">
          <div className="terco-prayer-text">{getCurrentPrayer()}</div>
        </div>

        <div className="terco-bottom">
          <div className="terco-decades">
            {[0, 1, 2, 3, 4].map(d => (
              <div key={d} className={`terco-decade-dot ${d < decade ? 'completed' : ''} ${d === decade && phase === 'decade' ? 'active' : ''}`} />
            ))}
          </div>
          <div className="terco-tap-hint">Toque no círculo para avançar</div>
          <div className="terco-bottom-controls">
            <button className="terco-icon-btn" onClick={reset}>
              <span className="material-symbols-rounded">restart_alt</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px', marginTop: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Mistérios</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {Object.entries(mysteries).map(([key, m]) => (
            <button key={key} className={`nav-tab ${mysteryKey === key ? 'active' : ''}`} onClick={() => { setMysteryKey(key); reset(); }}>
              {m.name.replace('Mistérios ', '')}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: 8 }}>
          {mystery.day} — {mystery.items.map((item, i) => `${i + 1}. ${item}`).join(' • ')}
        </div>
      </div>

      <div style={{ height: 100 }} />
    </>
  )
}
