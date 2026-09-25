export interface KpiData {
  total_invoices: number
  exception_invoices: number
  exception_rate_percent: number
  extracted_invoices: number
  validated_invoices: number
  vendor_po_validated_invoices: number
  total_automation_runs: number
  completed_automation_runs: number
  failed_automation_runs: number
  started_automation_runs: number
  automation_failure_rate_percent: number
}

export interface KpiResponse {
  status: string
  kpis: KpiData
}
