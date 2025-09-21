import { Ticket, SlaPolicy, TicketComment } from '@/lib/types'

export type SlaStatus = 'on-track' | 'at-risk' | 'breached' | 'met' | 'no-sla'

export type SlaMetrics = {
  responseTime: number | null // in minutes
  resolutionTime: number | null // in minutes
  firstResponseAt: string | null
  responseStatus: SlaStatus
  resolutionStatus: SlaStatus
  breachedAt: string | null
  percentageElapsed: number
  timeRemaining: number | null // in minutes
}

function findFirstResponse(ticket: Ticket, comments: TicketComment[]): string | null {
  // First response is when either:
  // 1. Status changes to in_progress
  // 2. First staff comment (non-reporter)
  // 3. Assignment occurs

  // Check status change to in_progress
  if (ticket.status === 'in_progress') {
    return ticket.updated_at
  }

  // Check first staff comment
  const firstStaffComment = comments
    .filter(comment => comment.author_id !== ticket.reporter_id && !comment.is_internal)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]

  if (firstStaffComment) {
    return firstStaffComment.created_at
  }

  // Check assignment
  if (ticket.assignee_id) {
    return ticket.updated_at
  }

  return null
}

export function calculateSlaMetrics(
  ticket: Ticket & { sla_policy?: SlaPolicy | null, comments?: TicketComment[] }
): SlaMetrics {
  // If no SLA policy, return base metrics
  if (!ticket.sla_policy) {
    return {
      responseTime: null,
      resolutionTime: null,
      firstResponseAt: null,
      responseStatus: 'no-sla',
      resolutionStatus: 'no-sla',
      breachedAt: null,
      percentageElapsed: 0,
      timeRemaining: null,
    }
  }

  const now = new Date()
  const createdAt = new Date(ticket.created_at)
  const resolvedAt = ticket.resolved_at ? new Date(ticket.resolved_at) : null
  const comments = ticket.comments || []

  // Find first response time
  const firstResponseAt = findFirstResponse(ticket, comments)
  const firstResponseTime = firstResponseAt
    ? new Date(firstResponseAt)
    : null

  // Calculate response time
  const responseTime = firstResponseTime
    ? Math.floor((firstResponseTime.getTime() - createdAt.getTime()) / 60000)
    : null

  // Calculate resolution time
  const resolutionTime = resolvedAt
    ? Math.floor((resolvedAt.getTime() - createdAt.getTime()) / 60000)
    : null

  // Get SLA thresholds
  const responseThreshold = ticket.sla_policy.response_time_minutes
  const resolutionThreshold = ticket.sla_policy.resolution_time_minutes

  // Calculate time elapsed and remaining
  const timeElapsed = Math.floor((now.getTime() - createdAt.getTime()) / 60000)
  const timeRemaining = resolutionThreshold - timeElapsed

  // Calculate percentage elapsed
  const percentageElapsed = (timeElapsed / resolutionThreshold) * 100

  // Determine SLA status
  let responseStatus: SlaStatus = 'on-track'
  let resolutionStatus: SlaStatus = 'on-track'
  let breachedAt: string | null = null

  // Response SLA status
  if (responseTime !== null) {
    responseStatus = responseTime <= responseThreshold ? 'met' : 'breached'
    if (responseStatus === 'breached' && !breachedAt) {
      breachedAt = new Date(createdAt.getTime() + responseThreshold * 60000).toISOString()
    }
  } else if (timeElapsed >= responseThreshold) {
    responseStatus = 'breached'
    breachedAt = new Date(createdAt.getTime() + responseThreshold * 60000).toISOString()
  } else if (timeElapsed >= responseThreshold * 0.8) {
    responseStatus = 'at-risk'
  }

  // Resolution SLA status
  if (resolutionTime !== null) {
    resolutionStatus = resolutionTime <= resolutionThreshold ? 'met' : 'breached'
    if (resolutionStatus === 'breached' && !breachedAt) {
      breachedAt = new Date(createdAt.getTime() + resolutionThreshold * 60000).toISOString()
    }
  } else if (timeElapsed >= resolutionThreshold) {
    resolutionStatus = 'breached'
    breachedAt = new Date(createdAt.getTime() + resolutionThreshold * 60000).toISOString()
  } else if (timeElapsed >= resolutionThreshold * 0.8) {
    resolutionStatus = 'at-risk'
  }

  return {
    responseTime,
    resolutionTime,
    firstResponseAt,
    responseStatus,
    resolutionStatus,
    breachedAt,
    percentageElapsed,
    timeRemaining,
  }
}