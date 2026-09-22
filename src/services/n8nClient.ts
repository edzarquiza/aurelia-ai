import type { OpsFlowRequest, OpsFlowResponse } from '../types/opsflow'

export class N8nClientError extends Error {}

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined

export async function submitRequest(requestText: string): Promise<OpsFlowResponse> {
  if (!WEBHOOK_URL) {
    throw new N8nClientError('Unable to reach OpsFlow AI. Please try again.')
  }

  const payload: OpsFlowRequest = { request_text: requestText }

  let httpResponse: Response
  try {
    httpResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new N8nClientError('Unable to reach OpsFlow AI. Please try again.')
  }

  if (!httpResponse.ok) {
    throw new N8nClientError('Something went wrong while processing your request. Please try again.')
  }

  let data: OpsFlowResponse
  try {
    data = (await httpResponse.json()) as OpsFlowResponse
  } catch {
    throw new N8nClientError('OpsFlow AI returned an unexpected response.')
  }

  if (!data || typeof data !== 'object' || !('request_id' in data)) {
    throw new N8nClientError('OpsFlow AI returned an unexpected response.')
  }

  return data
}
