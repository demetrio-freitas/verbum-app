import { useState } from 'react'
import { toast } from '../shared/Toast.jsx'

export default function ReadingCard({ label, reference, children, isGospel }) {
  const [expanded, setExpanded] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  function handleBookmark() {
    setBookmarked(!bookmarked)
    toast(bookmarked ? 'Removido dos salvos' : 'Leitura salva!')
  }

  return (
    <div className={isGospel ? 'gospel-highlight' : 'reading-card'}>
      <div className="reading-label">{label}</div>
      <div className="reading-reference">{reference}</div>
      <div className={`reading-text ${expanded ? 'expanded' : ''}`}>
        {children}
      </div>
      <button className={`expand-btn ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <span className="material-symbols-rounded">expand_more</span>
        {expanded ? 'Recolher' : 'Ler completo'}
      </button>
      <div className="card-actions">
        <button className={`card-action-btn ${bookmarked ? 'bookmarked' : ''}`} onClick={handleBookmark}>
          <span className="material-symbols-rounded">bookmark</span> {bookmarked ? 'Salvo' : 'Salvar'}
        </button>
        <button className="card-action-btn" onClick={() => toast('Compartilhar disponível no app')}>
          <span className="material-symbols-rounded">share</span> Compartilhar
        </button>
      </div>
    </div>
  )
}
