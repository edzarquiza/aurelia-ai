import type { InvoiceControlResponse } from '../types/invoice'

export class InvoiceApiError extends Error {}

const INVOICE_CONTROL_URL = import.meta.env.VITE_INVOICE_CONTROL_URL as string | undefined

export async function submitInvoice(file: File): Promise<InvoiceControlResponse> {
  if (!INVOICE_CONTROL_URL) {
    throw new InvoiceApiError('Unable to reach Aurelia AI. Please try again.')
  }

  const formData = new FormData()
  formData.append('data', file)

  let httpResponse: Response
  try {
    httpResponse = await fetch(INVOICE_CONTROL_URL, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new InvoiceApiError('Unable to reach Aurelia AI. Please try again.')
  }

  if (!httpResponse.ok) {
    throw new InvoiceApiError('Something went wrong while processing your invoice. Please try again.')
  }

  let data: InvoiceControlResponse
  try {
    data = (await httpResponse.json()) as InvoiceControlResponse
  } catch {
    throw new InvoiceApiError('Aurelia AI returned an unexpected response.')
  }

  if (!data || typeof data !== 'object' || !('processing_status' in data)) {
    throw new InvoiceApiError('Aurelia AI returned an unexpected response.')
  }

  return data
}
