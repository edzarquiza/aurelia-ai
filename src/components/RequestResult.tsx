import type { OpsFlowResponse } from '../types/opsflow'
import './RequestResult.css'

const PROCESSING_MODE_LABELS: Record<string, string> = {
  Automatic: 'Automatically Processed',
  'Human Review': 'Human Review Required',
  Investigation: 'Investigation Required',
}

function formatProcessingMode(mode: string): string {
  return PROCESSING_MODE_LABELS[mode] ?? mode
}

interface RequestResultProps {
  result: OpsFlowResponse
}

function RequestResult({ result }: RequestResultProps) {
  return (
    <section className="result" aria-live="polite">
      <h2 className="result-heading">{formatProcessingMode(result.processing_mode)}</h2>

      <dl className="result-grid">
        <div className="result-item">
          <dt>Category</dt>
          <dd>{result.category}</dd>
        </div>
        <div className="result-item">
          <dt>Affected Department</dt>
          <dd>{result.affected_department}</dd>
        </div>
        <div className="result-item">
          <dt>Routing Department</dt>
          <dd>{result.routing_department}</dd>
        </div>
        <div className="result-item">
          <dt>Confidence</dt>
          <dd>{Math.round(result.confidence * 100)}%</dd>
        </div>
        <div className="result-item">
          <dt>Priority</dt>
          <dd>{result.priority}</dd>
        </div>
        <div className="result-item">
          <dt>SLA</dt>
          <dd>{result.sla_hours} hours</dd>
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
          <h3>Knowledge Guidance</h3>
          <p className="knowledge-title">{result.knowledge_article}</p>
          {result.response_status === 'Generated' && (
            <p className="knowledge-response">{result.response}</p>
          )}
        </div>
      ) : (
        <div className="result-knowledge result-knowledge--empty">
          <h3>No Knowledge Article Available</h3>
          <p>
            There is currently no matching organizational knowledge article for this request.
            Further handling is required.
          </p>
        </div>
      )}
    </section>
  )
}

export default RequestResult
