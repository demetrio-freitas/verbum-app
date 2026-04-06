export default function ReadingTabs({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'all', label: 'Todas as Leituras' },
    { key: 'homilia', label: 'Homilia' },
    { key: '1leitura', label: '1ª Leitura' },
    { key: 'salmo', label: 'Salmo' },
    { key: '2leitura', label: '2ª Leitura' },
    { key: 'evangelho', label: 'Evangelho' },
    { key: 'santo', label: 'Santo do Dia' },
  ]

  return (
    <div className="nav-tabs" id="reading-tabs">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`nav-tab ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
