export default function MissaPart({ id, number, label, icon, children }) {
  return (
    <div className="missa-part" id={id}>
      <div className="missa-part-number">{number}</div>
      <div className="missa-part-label">
        <span className="material-symbols-rounded">{icon}</span>
        {label}
      </div>
      {children}
    </div>
  )
}
