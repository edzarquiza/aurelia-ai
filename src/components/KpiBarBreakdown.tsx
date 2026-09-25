import './KpiBarBreakdown.css'

interface BreakdownItem {
  label: string
  value: number
}

interface KpiBarBreakdownProps {
  items: BreakdownItem[]
}

function KpiBarBreakdown({ items }: KpiBarBreakdownProps) {
  const max = Math.max(1, ...items.map((item) => item.value))

  return (
    <div className="kpi-breakdown">
      {items.map((item) => (
        <div className="kpi-breakdown-row" key={item.label}>
          <span className="kpi-breakdown-label">{item.label}</span>
          <div className="kpi-breakdown-track">
            <div
              className="kpi-breakdown-fill"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
          <span className="kpi-breakdown-value">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export default KpiBarBreakdown
