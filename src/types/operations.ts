export type AttentionStatus = 'FAILED' | 'INCOMPLETE' | 'ORPHANED'

export interface OperationsRecord {
  automation_run_id: string
  n8n_execution_id: string | null
  invoice_id: string | null
  invoice_number: string | null
  vendor_name: string | null
  automation_status: string | null
  processing_status: string | null
  started_at: string | null
  completed_at: string | null
  error_message: string | null
  attention_status: AttentionStatus | string
}

export interface OperationsSummary {
  total_attention_items: number
  failed: number
  incomplete: number
  orphaned: number
}

export interface OperationsResponse {
  status: string
  filter: string | null
  summary: OperationsSummary
  records: OperationsRecord[]
}
