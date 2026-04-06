import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'

const themes = [
  { key: '', name: 'Clássico', desc: 'Pergaminho & marrom' },
  { key: 'serenidade', name: 'Serenidade', desc: 'Azul suave & calmo' },
  { key: 'jovem', name: 'Jovem', desc: 'Roxo vibrante' },
  { key: 'minimalista', name: 'Minimalista', desc: 'Preto & branco' },
  { key: 'natureza', name: 'Natureza', desc: 'Verde oliva & terra' },
]

export default function Settings() {
  const { darkMode, toggleDarkMode, visualTheme, setVisualTheme, fontScale, setFontScale } = useTheme()
  const navigate = useNavigate()

  return (
    <div style={{ padding: '0 16px' }}>
      <div className="section-subtitle">Configurações</div>

      <div className="section-subtitle" style={{ marginTop: 4 }}>Tema visual</div>
      <div className="theme-chooser">
        {themes.map(t => (
          <button key={t.key} className={`theme-option ${visualTheme === t.key ? 'active' : ''}`} onClick={() => setVisualTheme(t.key)}>
            <div className={`theme-preview theme-prev-${t.key || 'classico'}`}>
              <div className="tp-bar" /><div className="tp-line" /><div className="tp-line short" />
            </div>
            <span className="theme-name">{t.name}</span>
            <span className="theme-desc">{t.desc}</span>
          </button>
        ))}
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-label">
            <span className="material-symbols-rounded">dark_mode</span>
            <div>Modo escuro<small>Leitura confortável à noite</small></div>
          </div>
          <div className={`toggle ${darkMode ? 'active' : ''}`} onClick={toggleDarkMode} />
        </div>
        <div className="setting-item">
          <div className="setting-label">
            <span className="material-symbols-rounded">text_increase</span>
            <div>Tamanho da fonte</div>
          </div>
          <div className="font-slider-container">
            <span>A</span>
            <input type="range" min="0.85" max="1.4" step="0.05" value={fontScale} onChange={e => setFontScale(parseFloat(e.target.value))} />
            <span style={{ fontSize: '1.2em' }}>A</span>
          </div>
        </div>
        <div className="setting-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/notificacoes')}>
          <div className="setting-label">
            <span className="material-symbols-rounded">notifications</span>
            <div>Notificações Litúrgicas<small>Novenas, preceitos, tempos, santos</small></div>
          </div>
          <span className="material-symbols-rounded" style={{ color: 'var(--text-tertiary)', fontSize: 18 }}>chevron_right</span>
        </div>
      </div>

      <div className="setting-group">
        <div className="setting-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/paroquia')}>
          <div className="setting-label">
            <span className="material-symbols-rounded">church</span>
            <div>Minha Paróquia<small>Paróquia São José — Meireles</small></div>
          </div>
          <span className="material-symbols-rounded" style={{ color: 'var(--text-tertiary)', fontSize: 18 }}>chevron_right</span>
        </div>
        <div className="setting-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/calendario')}>
          <div className="setting-label">
            <span className="material-symbols-rounded">calendar_month</span>
            <div>Calendário Litúrgico<small>Festas, preceitos e santos</small></div>
          </div>
          <span className="material-symbols-rounded" style={{ color: 'var(--text-tertiary)', fontSize: 18 }}>chevron_right</span>
        </div>
      </div>

      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-label">
            <span className="material-symbols-rounded">info</span>
            <div>Sobre o Verbum<small>Versão 2.0.0 — React PWA</small></div>
          </div>
          <span className="material-symbols-rounded" style={{ color: 'var(--text-tertiary)', fontSize: 18 }}>chevron_right</span>
        </div>
      </div>

      <div style={{ height: 100 }} />
    </div>
  )
}
