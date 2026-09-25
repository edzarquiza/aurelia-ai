export type InvoiceProcessingStatus = 'VENDOR_PO_VALIDATED' | 'EXCEPTION' | 'DUPLICATE'

export interface InvoiceControlResponse {
  status: string
  invoice_id?: string
  invoice_number?: string
  vendor?: string
  vendor_id?: string
  invoice_date?: string
  due_date?: string
  po_number?: string
  amount?: number
  currency?: string
  processing_status: InvoiceProcessingStatus | string
  processing_mode?: string
  exception_reason?: string | null
}
