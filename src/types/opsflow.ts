export interface OpsFlowRequest {
  request_text: string
}

export interface OpsFlowResponse {
  request_id: string
  request_text: string
  category: string
  affected_department: string
  routing_department: string
  confidence: number
  business_impact: boolean
  time_sensitive: boolean
  priority: string
  sla_hours: number
  sla_deadline: string
  processing_mode: string
  review_status: string
  review_reason: string
  knowledge_status: string
  knowledge_article: string
  response_status: string
  response: string
}
