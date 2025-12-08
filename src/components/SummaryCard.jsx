import "./SummaryCard.css";

function SummaryCard({ title, value, icon, color, subtitle }) {
  return (
    <div className="summary-card" style={{ borderTopColor: color }}>
      <div className="card-icon" style={{ color }}>
        {icon}
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p className="card-value">{value}</p>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default SummaryCard;
