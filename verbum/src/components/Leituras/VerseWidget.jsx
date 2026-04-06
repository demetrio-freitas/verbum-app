import { toast } from '../shared/Toast.jsx'

export default function VerseWidget({ text, reference }) {
  return (
    <div className="verse-widget-wrapper">
      <div className="verse-widget">
        <div className="verse-widget-glow" />
        <div className="verse-widget-label">Versículo do dia</div>
        <div className="verse-widget-text">{text}</div>
        <div className="verse-widget-ref">{reference}</div>
        <div className="verse-widget-brand">Verbum</div>
      </div>
      <div className="verse-widget-actions">
        <button className="verse-action-btn" onClick={() => toast('Disponível no app nativo')}>
          <span className="material-symbols-rounded">download</span>
          Salvar imagem
        </button>
        <button className="verse-action-btn" onClick={() => toast('Compartilhar disponível no app')}>
          <span className="material-symbols-rounded">share</span>
          Compartilhar
        </button>
      </div>
    </div>
  )
}
