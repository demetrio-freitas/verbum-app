export default function DateBar({ liturgicalTitle, dateDisplay, liturgicalColor, colorName }) {
  return (
    <div className="date-bar">
      <div className="date-info">
        <div className="date-liturgical">{liturgicalTitle}</div>
        <div className="date-calendar">{dateDisplay}</div>
      </div>
      <div className="liturgical-badge">
        <div className="liturgical-dot" style={{ background: liturgicalColor }} />
        {colorName}
      </div>
    </div>
  )
}
