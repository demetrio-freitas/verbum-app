export default function MissaDialog({ title, children, variableNote }) {
  return (
    <div className="missa-dialog">
      {title && <div className="missa-dialog-title">{title}</div>}
      {variableNote && (
        <div className="missa-variable-note">
          <span className="material-symbols-rounded">info</span>
          {variableNote}
        </div>
      )}
      {children}
    </div>
  )
}

export function MissaLine({ role, children, rubric }) {
  if (rubric) {
    return <div className="missa-rubric">{children}</div>
  }
  const isPovo = role === 'P'
  return (
    <div className={`missa-line ${isPovo ? 'povo' : ''}`}>
      {role && <span className={`tag-${role.toLowerCase()}`}>{role}</span>}
      {children}
    </div>
  )
}

export function MissaPrayer({ children }) {
  return <div className="missa-prayer-text">{children}</div>
}
