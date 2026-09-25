import { useCallback, useEffect, useState } from 'react'
import AureliaBrand from '../components/AureliaBrand'
import InvoiceUpload from '../components/InvoiceUpload'
import InvoiceResult from '../components/InvoiceResult'
import OperationsTable from '../components/OperationsTable'
import KpiBarBreakdown from '../components/KpiBarBreakdown'
import { InvoiceApiError, submitInvoice } from '../services/invoiceApi'
import { OperationsApiError, fetchOperations } from '../services/operationsApi'
import { KpiApiError, fetchKpis } from '../services/kpiApi'
import type { InvoiceControlResponse } from '../types/invoice'
import type { OperationsResponse } from '../types/operations'
import type { KpiData } from '../types/kpi'
import './InvoiceControlCenterPage.css'

const ATTENTION_PREVIEW_COUNT = 5

function InvoiceControlCenterPage() {
  // Invoice processing (Phase B, unchanged behavior)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [invoiceError, setInvoiceError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [invoiceResult, setInvoiceResult] = useState<InvoiceControlResponse | null>(null)

  // KPI data (Phase D, unchanged API/logic)
  const [kpis, setKpis] = useState<KpiData | null>(null)
  const [kpisLoading, setKpisLoading] = useState(false)
  const [kpisError, setKpisError] = useState<string | null>(null)

  // Attention Center (Phase C, unchanged API/logic — unfiltered, all records)
  const [opsData, setOpsData] = useState<OperationsResponse | null>(null)
  const [opsLoading, setOpsLoading] = useState(false)
  const [opsError, setOpsError] = useState<string | null>(null)
  const [attentionExpanded, setAttentionExpanded] = useState(false)

  const loadKpis = useCallback(async () => {
    setKpisLoading(true)
    setKpisError(null)

    try {
      const response = await fetchKpis()
      setKpis(response.kpis)
    } catch (err) {
      if (err instanceof KpiApiError) {
        setKpisError(err.message)
      } else {
        setKpisError('Something went wrong while loading KPI data. Please try again.')
      }
    } finally {
      setKpisLoading(false)
    }
  }, [])

  const loadOperations = useCallback(async () => {
    setOpsLoading(true)
    setOpsError(null)

    try {
      const response = await fetchOperations()
      setOpsData(response)
    } catch (err) {
      if (err instanceof OperationsApiError) {
        setOpsError(err.message)
      } else {
        setOpsError('Something went wrong while loading operational records. Please try again.')
      }
    } finally {
      setOpsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadKpis()
    loadOperations()
  }, [loadKpis, loadOperations])

  const handleFileSelected = (file: File) => {
    setSelectedFile(file)
    setInvoiceError(null)
    setInvoiceResult(null)
  }

  const handleClear = () => {
    setSelectedFile(null)
    setInvoiceResult(null)
  }

  const handleValidationError = (message: string) => {
    setInvoiceError(message)
  }

  const handleProcess = async () => {
    if (!selectedFile) {
      setInvoiceError('Please select a PDF invoice before processing.')
      return
    }

    setInvoiceError(null)
    setInvoiceResult(null)
    setIsProcessing(true)

    try {
      const response = await submitInvoice(selectedFile)
      setInvoiceResult(response)
      // A newly processed invoice may itself become an attention record —
      // refresh operations/KPIs so the page reflects the latest backend state.
      loadOperations()
      loadKpis()
    } catch (err) {
      if (err instanceof InvoiceApiError) {
        setInvoiceError(err.message)
      } else {
        setInvoiceError('Something went wrong while processing your invoice. Please try again.')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const visibleAttentionRecords =
    opsData && !attentionExpanded ? opsData.records.slice(0, ATTENTION_PREVIEW_COUNT) : opsData?.records ?? []

  return (
    <div className="aicc-page">
      <header className="header aicc-header">
        <div className="aicc-brand-row">
          <AureliaBrand size={40} />
          <h1>Aurelia AI</h1>
        </div>
        <p className="subtitle">Intelligent Invoice Control Center</p>
        <p className="description">
          Process invoices, monitor automation, and measure control performance.
        </p>
      </header>

      <main className="content aicc-content">
        <section className="aicc-kpi-strip" aria-label="Key performance indicators">
          {kpisLoading && <p className="ops-status-message">Loading KPI data...</p>}

          {kpisError && !kpisLoading && (
            <div className="ops-error">
              <p role="alert">{kpisError}</p>
              <button type="button" className="ops-refresh-button" onClick={loadKpis}>
                Retry
              </button>
            </div>
          )}

          {kpis && !kpisLoading && !kpisError && (
            <div className="aicc-kpi-grid">
              <div className="aicc-kpi-card">
                <span className="aicc-kpi-label">Total Invoices</span>
                <span className="aicc-kpi-value">{kpis.total_invoices}</span>
              </div>
              <div className="aicc-kpi-card">
                <span className="aicc-kpi-label">Exceptions</span>
                <span className="aicc-kpi-value">{kpis.exception_invoices}</span>
              </div>
              <div className="aicc-kpi-card">
                <span className="aicc-kpi-label">Exception Rate</span>
                <span className="aicc-kpi-value">{kpis.exception_rate_percent}%</span>
              </div>
              <div className="aicc-kpi-card">
                <span className="aicc-kpi-label">Automation Failure</span>
                <span className="aicc-kpi-value">{kpis.automation_failure_rate_percent}%</span>
              </div>
            </div>
          )}
        </section>

        <div className="aicc-main-stack">
          <section className="aicc-panel aicc-process-panel">
            <h2 className="aicc-panel-heading">Process Invoice</h2>

            <InvoiceUpload
              selectedFile={selectedFile}
              onFileSelected={handleFileSelected}
              onClear={handleClear}
              onValidationError={handleValidationError}
              disabled={isProcessing}
            />

            {invoiceError && (
              <p className="form-error" role="alert">
                {invoiceError}
              </p>
            )}

            <button
              type="button"
              className={`submit-button${isProcessing ? ' submit-button--loading' : ''}`}
              onClick={handleProcess}
              disabled={isProcessing || !selectedFile}
            >
              {isProcessing ? (
                <>
                  <span className="submit-indicator" aria-hidden="true" />
                  Processing invoice...
                </>
              ) : (
                'Process Invoice'
              )}
            </button>

            {invoiceResult && <InvoiceResult result={invoiceResult} />}
          </section>

          <section className="aicc-panel aicc-attention-panel">
            <h2 className="aicc-panel-heading">Attention Center</h2>

            {opsLoading && <p className="ops-status-message">Loading operational records...</p>}

            {opsError && !opsLoading && (
              <div className="ops-error">
                <p role="alert">{opsError}</p>
                <button type="button" className="ops-refresh-button" onClick={loadOperations}>
                  Retry
                </button>
              </div>
            )}

            {opsData && !opsLoading && !opsError && (
              <>
                <div className="aicc-attention-stats">
                  <div className="aicc-attention-stat">
                    <span className="aicc-attention-stat-label">Failed</span>
                    <span className="aicc-attention-stat-value">{opsData.summary.failed}</span>
                  </div>
                  <div className="aicc-attention-stat">
                    <span className="aicc-attention-stat-label">Incomplete</span>
                    <span className="aicc-attention-stat-value">{opsData.summary.incomplete}</span>
                  </div>
                  <div className="aicc-attention-stat">
                    <span className="aicc-attention-stat-label">Orphaned</span>
                    <span className="aicc-attention-stat-value">{opsData.summary.orphaned}</span>
                  </div>
                </div>

                {opsData.records.length === 0 ? (
                  <div className="ops-empty">
                    <p className="ops-empty-title">No automation issues found.</p>
                    <p className="ops-empty-subtitle">All monitored invoice runs are currently normal.</p>
                  </div>
                ) : (
                  <>
                    <OperationsTable records={visibleAttentionRecords} />
                    {opsData.records.length > ATTENTION_PREVIEW_COUNT && (
                      <button
                        type="button"
                        className="ops-refresh-button aicc-attention-toggle"
                        aria-expanded={attentionExpanded}
                        onClick={() => setAttentionExpanded((expanded) => !expanded)}
                      >
                        {attentionExpanded
                          ? 'Show fewer'
                          : `View all ${opsData.records.length} attention items`}
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </section>
        </div>

        {kpis && !kpisLoading && !kpisError && (
          <>
            <section className="aicc-panel aicc-breakdown-panel">
              <h2 className="aicc-panel-heading">Processing Breakdown</h2>
              <KpiBarBreakdown
                items={[
                  { label: 'Extracted', value: kpis.extracted_invoices },
                  { label: 'Validated', value: kpis.validated_invoices },
                  { label: 'Vendor + PO Validated', value: kpis.vendor_po_validated_invoices },
                  { label: 'Exceptions', value: kpis.exception_invoices },
                ]}
              />
            </section>

            <section className="aicc-panel aicc-breakdown-panel">
              <h2 className="aicc-panel-heading">Automation Runs</h2>
              <KpiBarBreakdown
                items={[
                  { label: 'Total', value: kpis.total_automation_runs },
                  { label: 'Completed', value: kpis.completed_automation_runs },
                  { label: 'Failed', value: kpis.failed_automation_runs },
                  { label: 'Started', value: kpis.started_automation_runs },
                ]}
              />
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default InvoiceControlCenterPage
