import type { KpiResponse } from '../types/kpi'

export class KpiApiError extends Error {}

const KPI_URL = import.meta.env.VITE_INVOICE_KPI_URL as string | undefined

export async function fetchKpis(): Promise<KpiResponse> {
  if (!KPI_URL) {
    throw new KpiApiError('Unable to reach Aurelia AI. Please try again.')
  }

  let httpResponse: Response
  try {
    httpResponse = await fetch(KPI_URL)
  } catch {
    throw new KpiApiError('Unable to reach Aurelia AI. Please try again.')
  }

  if (!httpResponse.ok) {
    throw new KpiApiError('Something went wrong while loading KPI data. Please try again.')
  }

  let data: KpiResponse
  try {
    data = (await httpResponse.json()) as KpiResponse
  } catch {
    throw new KpiApiError('Aurelia AI returned an unexpected response.')
  }

  if (!data || typeof data !== 'object' || !data.kpis) {
    throw new KpiApiError('Aurelia AI returned an unexpected response.')
  }

  return data
}
