import { supabase } from './supabase-client'
import { calculateSlaMetrics } from './sla'
import type { Ticket, TicketStatus } from './types'

export async function updateTicketStatus(
  ticketId: string, 
  status: TicketStatus,
  resolutionNote?: string
) {
  const now = new Date().toISOString()
  const updates: any = { status, updated_at: now }

  // Get the current ticket state
  const { data: currentTicket } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', ticketId)
    .single()

  if (!currentTicket) {
    throw new Error('Ticket not found')
  }

  // Update timestamp fields based on status transition
  if (status === 'in_progress' && currentTicket.status === 'new') {
    updates.response_time = Math.floor(
      (new Date(now).getTime() - new Date(currentTicket.created_at).getTime()) / 60000
    )
  }

  if (status === 'resolved') {
    updates.resolved_at = now
    updates.resolution_note = resolutionNote
    
    // Calculate total resolution time excluding any on-hold periods
    const totalTime = Math.floor(
      (new Date(now).getTime() - new Date(currentTicket.created_at).getTime()) / 60000
    )
    updates.resolution_time = totalTime - (currentTicket.on_hold_duration || 0)
  }

  if (status === 'on_hold' && currentTicket.status !== 'on_hold') {
    updates.on_hold_start = now
  }

  if (currentTicket.status === 'on_hold' && status !== 'on_hold') {
    const onHoldTime = Math.floor(
      (new Date(now).getTime() - new Date(currentTicket.on_hold_start).getTime()) / 60000
    )
    updates.on_hold_duration = (currentTicket.on_hold_duration || 0) + onHoldTime
    updates.on_hold_start = null
  }

  // Update ticket
  const { data, error } = await supabase
    .from('tickets')
    .update(updates)
    .eq('id', ticketId)
    .select(`
      *,
      reporter:profiles!tickets_reporter_id_fkey(*),
      assignee:profiles!tickets_assignee_id_fkey(*),
      service:services(*),
      sla_policy:sla_policies(*)
    `)
    .single()

  if (error) throw error

  // Check and update SLA breach status
  if (data.sla_policy_id) {
    const slaMetrics = calculateSlaMetrics(data)
    if (slaMetrics.resolutionStatus === 'breached' && !data.breached_at) {
      const { error: breachError } = await supabase
        .from('tickets')
        .update({ breached_at: now })
        .eq('id', ticketId)

      if (breachError) throw breachError
    }
  }

  // Create status change audit log
  const { error: logError } = await supabase
    .from('ticket_status_logs')
    .insert({
      ticket_id: ticketId,
      from_status: currentTicket.status,
      to_status: status,
      changed_at: now,
      note: resolutionNote
    })

  if (logError) throw logError

  return data
}