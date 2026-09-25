import type { OpsFlowResponse } from '../types/opsflow'
import './RequestResult.css'

const PROCESSING_MODE_LABELS: Record<string, string> = {
  Automatic: 'Automatically Processed',
  'Human Review': 'Human Review Required',
  Investigation: 'Investigation Required',
}

const PROCESSING_MODE_CLASSES: Record<string, string> = {
  Automatic: 'badge--mode-automatic',
  'Human Review': 'badge--mode-human-review',
  Investigation: 'badge--mode-investigation',
}

const PRIORITY_CLASSES: Record<string, string> = {
  Critical: 'badge--priority-critical',
  High: 'badge--priority-high',
  Normal: 'badge--priority-normal',
}

function formatProcessingMode(mode: string): string {
  return PROCESSING_MODE_LABELS[mode] ?? mode
}

function formatSlaHours(hours: number): string {
  return hours === 1 ? '1 hour' : `${hours} hours`
}

interface RequestResultProps {
  result: OpsFlowResponse
}

function RequestResult({ result }: RequestResultProps) {
  const modeClass = PROCESSING_MODE_CLASSES[result.processing_mode] ?? 'badge--mode-default'
  const priorityClass = PRIORITY_CLASSES[result.priority] ?? 'badge--priority-default'

  return (
    <section className="result" aria-live="polite">
      <div className="result-summary">
        <div className="summary-item">
          <span className="summary-label">Processing Mode</span>
          <span className={`badge ${modeClass}`}>{formatProcessingMode(result.processing_mode)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Priority</span>
          <span className={`badge ${priorityClass}`}>{result.priority}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">SLA</span>
          <span className="summary-sla">{formatSlaHours(result.sla_hours)}</span>
        </div>
      </div>

      <dl className="result-grid">
        <div className="result-item">
          <dt>Category</dt>
          <dd>{result.category}</dd>
        </div>
        <div className="result-item">
          <dt>Routing Department</dt>
          <dd>{result.routing_department}</dd>
        </div>
        <div className="result-item">
          <dt>Affected Department</dt>
          <dd>{result.affected_department}</dd>
        </div>
        <div className="result-item">
          <dt>Confidence</dt>
          <dd>{Math.round(result.confidence * 100)}%</dd>
        </div>
        <div className="result-item">
          <dt>Review Status</dt>
          <dd>{result.review_status}</dd>
        </div>
        <div className="result-item">
          <dt>Business Impact</dt>
          <dd>{result.business_impact ? 'Yes' : 'No'}</dd>
        </div>
        <div className="result-item">
          <dt>Time Sensitive</dt>
          <dd>{result.time_sensitive ? 'Yes' : 'No'}</dd>
        </div>
      </dl>

      {result.knowledge_status === 'Knowledge Article Found' ? (
        <div className="result-knowledge">
          <h3 className="knowledge-heading">Knowledge Guidance</h3>
          <p className="knowledge-title">{result.knowledge_article}</p>
          {result.response_status === 'Generated' && (
            <p className="knowledge-response">{result.response}</p>
          )}
        </div>
      ) : (
        <div className="result-knowledge result-knowledge--empty">
          <h3 className="knowledge-heading">No Knowledge Article Available</h3>
          <p>
            There is currently no matching organizational knowledge article for this request.
            Further handling is required.
          </p>
        </div>
      )}

      <p className="result-trace">Request ID: {result.request_id}</p>
    </section>
  )
}

export default RequestResult
