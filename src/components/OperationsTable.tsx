import type { OperationsRecord } from '../types/operations'
import './OperationsTable.css'

const ATTENTION_BADGE_CLASSES: Record<string, string> = {
  FAILED: 'ops-badge--failed',
  INCOMPLETE: 'ops-badge--incomplete',
  ORPHANED: 'ops-badge--orphaned',
}

const ATTENTION_LABELS: Record<string, string> = {
  FAILED: '✕ Failed',
  INCOMPLETE: '◐ Incomplete',
  ORPHANED: '○ Orphaned',
}

function formatTimestamp(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

interface OperationsTableProps {
  records: OperationsRecord[]
  /** Hides lower-priority columns (Completed, Execution ID) for embedded/space-constrained use. */
  compact?: boolean
}

function OperationsTable({ records, compact = false }: OperationsTableProps) {
  return (
    <div className="ops-table-wrapper">
      <table className="ops-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Invoice</th>
            <th>Vendor</th>
            <th>Processing Status</th>
            <th>Started</th>
            {!compact && <th>Completed</th>}
            {!compact && <th>Execution ID</th>}
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const badgeClass = ATTENTION_BADGE_CLASSES[record.attention_status] ?? 'ops-badge--default'
            const label = ATTENTION_LABELS[record.attention_status] ?? record.attention_status

            return (
              <tr key={record.automation_run_id}>
                <td>
                  <span className={`ops-badge ${badgeClass}`}>{label}</span>
                </td>
                <td>{record.invoice_number ?? '—'}</td>
                <td>{record.vendor_name ?? '—'}</td>
                <td>{record.processing_status ?? '—'}</td>
                <td>{formatTimestamp(record.started_at)}</td>
                {!compact && <td>{formatTimestamp(record.completed_at)}</td>}
                {!compact && <td>{record.n8n_execution_id ?? '—'}</td>}
                <td className="ops-table-error">{record.error_message ?? '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default OperationsTable
