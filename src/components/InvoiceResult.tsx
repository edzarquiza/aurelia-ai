import type { InvoiceControlResponse } from '../types/invoice'
import './InvoiceResult.css'

function formatCurrency(amount: number, currency?: string): string {
  if (!currency) return amount.toLocaleString()

  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
  }
}

interface DetailField {
  label: string
  value?: string | number | null
}

function DetailGrid({ fields }: { fields: DetailField[] }) {
  const visible = fields.filter((field) => field.value !== undefined && field.value !== null && field.value !== '')

  if (visible.length === 0) return null

  return (
    <dl className="invoice-detail-grid">
      {visible.map((field) => (
        <div className="invoice-detail-item" key={field.label}>
          <dt>{field.label}</dt>
          <dd>{field.value}</dd>
        </div>
      ))}
    </dl>
  )
}

interface InvoiceResultProps {
  result: InvoiceControlResponse
}

function InvoiceResult({ result }: InvoiceResultProps) {
  const amountDisplay =
    typeof result.amount === 'number' ? formatCurrency(result.amount, result.currency) : undefined

  const commonFields: DetailField[] = [
    { label: 'Vendor', value: result.vendor },
    { label: 'Invoice Number', value: result.invoice_number },
    { label: 'Invoice Date', value: result.invoice_date },
    { label: 'Due Date', value: result.due_date },
    { label: 'PO Number', value: result.po_number },
    { label: 'Amount', value: amountDisplay },
    { label: 'Currency', value: result.currency },
    { label: 'Processing Status', value: result.processing_status },
    { label: 'Processing Mode', value: result.processing_mode },
  ]

  if (result.processing_status === 'VENDOR_PO_VALIDATED') {
    return (
      <section className="invoice-result" aria-live="polite">
        <div className="invoice-status invoice-status--success">
          <h2 className="invoice-status-heading">Vendor + PO Validated</h2>
          <ul className="invoice-checklist">
            <li>✓ Vendor validated</li>
            <li>✓ Purchase order validated</li>
            <li>✓ Invoice amount within approved PO</li>
            <li>✓ Currency validated</li>
          </ul>
        </div>
        <DetailGrid fields={commonFields} />
      </section>
    )
  }

  if (result.processing_status === 'EXCEPTION') {
    return (
      <section className="invoice-result" aria-live="polite">
        <div className="invoice-status invoice-status--exception">
          <h2 className="invoice-status-heading">⚠ Invoice Requires Attention</h2>
          {result.exception_reason && <p className="invoice-status-reason">{result.exception_reason}</p>}
        </div>
        <DetailGrid fields={commonFields} />
      </section>
    )
  }

  if (result.processing_status === 'DUPLICATE') {
    return (
      <section className="invoice-result" aria-live="polite">
        <div className="invoice-status invoice-status--duplicate">
          <h2 className="invoice-status-heading">⚠ Duplicate Invoice Detected</h2>
          {result.exception_reason && <p className="invoice-status-reason">{result.exception_reason}</p>}
        </div>
        <DetailGrid
          fields={[
            { label: 'Invoice Number', value: result.invoice_number },
            { label: 'Vendor ID', value: result.vendor_id },
            { label: 'Processing Status', value: result.processing_status },
            { label: 'Processing Mode', value: result.processing_mode },
          ]}
        />
      </section>
    )
  }

  return (
    <section className="invoice-result" aria-live="polite">
      <div className="invoice-status invoice-status--neutral">
        <h2 className="invoice-status-heading">{result.processing_status}</h2>
      </div>
      <DetailGrid fields={commonFields} />
    </section>
  )
}

export default InvoiceResult
