import type { AttentionStatus, OperationsResponse } from '../types/operations'

export class OperationsApiError extends Error {}

const OPERATIONS_URL = import.meta.env.VITE_INVOICE_OPERATIONS_URL as string | undefined

export async function fetchOperations(status?: AttentionStatus): Promise<OperationsResponse> {
  if (!OPERATIONS_URL) {
    throw new OperationsApiError('Unable to reach Aurelia AI. Please try again.')
  }

  const url = status ? `${OPERATIONS_URL}?status=${status}` : OPERATIONS_URL

  let httpResponse: Response
  try {
    httpResponse = await fetch(url)
  } catch {
    throw new OperationsApiError('Unable to reach Aurelia AI. Please try again.')
  }

  if (!httpResponse.ok) {
    throw new OperationsApiError('Something went wrong while loading operational records. Please try again.')
  }

  let data: OperationsResponse
  try {
    data = (await httpResponse.json()) as OperationsResponse
  } catch {
    throw new OperationsApiError('Aurelia AI returned an unexpected response.')
  }

  if (!data || typeof data !== 'object' || !Array.isArray(data.records) || !data.summary) {
    throw new OperationsApiError('Aurelia AI returned an unexpected response.')
  }

  return data
}
