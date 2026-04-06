import { useTheme } from '../../context/ThemeContext.jsx'
import { toast } from '../shared/Toast.jsx'

export default function ReadingToolbar() {
  const { fontScale, setFontScale } = useTheme()

  function adjustFont(delta) {
    const newScale = Math.max(0.85, Math.min(1.4, fontScale + delta * 0.05))
    setFontScale(newScale)
  }

  function handleListen() {
    if ('speechSynthesis' in window) {
      toast('Reproduzindo leitura...')
    } else {
      toast('TTS não suportado neste navegador')
    }
  }

  return (
    <div className="content-toolbar">
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={() => adjustFont(-1)} title="Diminuir fonte">
          <span style={{ fontWeight: 700, fontSize: 13 }}>A</span><span style={{ fontSize: 9 }}>−</span>
        </button>
        <button className="toolbar-btn" onClick={() => adjustFont(1)} title="Aumentar fonte">
          <span style={{ fontWeight: 700, fontSize: 13 }}>A</span><span style={{ fontSize: 9 }}>+</span>
        </button>
      </div>
      <button className="toolbar-icon-btn" onClick={handleListen} title="Escutar o texto">
        <span className="material-symbols-rounded">play_arrow</span>
      </button>
      <button className="toolbar-focus-btn" onClick={() => toast('Modo foco disponível no app nativo')} title="Modo foco">
        <span className="material-symbols-rounded" style={{ fontSize: 20 }}>fullscreen</span>
        foco
      </button>
      <button className="toolbar-icon-btn" onClick={() => toast('Texto copiado!')} title="Copiar tudo">
        <span className="material-symbols-rounded">content_copy</span>
      </button>
      <button className="toolbar-icon-btn" onClick={() => toast('Compartilhar disponível no app')} title="Compartilhar">
        <span className="material-symbols-rounded">share</span>
      </button>
      <button className="toolbar-wpp-btn" onClick={() => toast('Abrindo WhatsApp...')} title="Enviar para WhatsApp">
        <span className="material-symbols-rounded" style={{ fontSize: 18 }}>chat</span>
      </button>
    </div>
  )
}
