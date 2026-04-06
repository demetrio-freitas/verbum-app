export default function ReflectionCard({ text, author }) {
  return (
    <div className="reflection-card">
      <div className="reading-label" style={{ marginBottom: 12 }}>Reflexão do dia</div>
      <div className="reflection-quote">{text}</div>
      <div className="reflection-author">{author}</div>
    </div>
  )
}
