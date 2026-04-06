export default function SaintCard({ monogram, name, description }) {
  return (
    <div className="saint-card">
      <div className="saint-image-circle">
        <div className="saint-monogram">{monogram}</div>
      </div>
      <div className="saint-info">
        <div className="saint-name">{name}</div>
        <div className="saint-desc">{description}</div>
      </div>
    </div>
  )
}
