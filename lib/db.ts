import { supabase } from './supabase-client'
import type { Database } from './database.types'
import type { 
  Ticket, 
  TicketComment, 
  TicketAttachment, 
  Profile,
  Department,
  Service,
  ServiceCategory,
  SlaPolicy 
} from './types'

export type Tables = Database['public']['Tables']

// Tickets
export async function getTickets(filters: Partial<Ticket> = {}) {
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      reporter:profiles!tickets_reporter_id_fkey(*),
      assignee:profiles!tickets_assignee_id_fkey(*),
      service:services(*),
      sla_policy:sla_policies(*)
    `)
    .match(filters)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getTicketById(id: string) {
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      reporter:profiles!tickets_reporter_id_fkey(*),
      assignee:profiles!tickets_assignee_id_fkey(*),
      service:services(*),
      sla_policy:sla_policies(*),
      comments:ticket_comments(*, author:profiles(*)),
      attachments:ticket_attachments(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createTicket(ticket: Tables['tickets']['Insert']) {
  const { data, error } = await supabase
    .from('tickets')
    .insert(ticket)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTicket(id: string, updates: Tables['tickets']['Update']) {
  const { data, error } = await supabase
    .from('tickets')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Comments
export async function addComment(comment: Tables['ticket_comments']['Insert']) {
  const { data, error } = await supabase
    .from('ticket_comments')
    .insert(comment)
    .select('*, author:profiles(*)')
    .single()

  if (error) throw error
  return data
}

// Attachments
export async function addAttachment(attachment: Tables['ticket_attachments']['Insert']) {
  const { data, error } = await supabase
    .from('ticket_attachments')
    .insert(attachment)
    .select()
    .single()

  if (error) throw error
  return data
}

// Profiles
export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, department:departments(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(id: string, updates: Tables['profiles']['Update']) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select('*, department:departments(*)')
    .single()

  if (error) throw error
  return data
}

// SLA
export function calculateSlaStatus(ticket: Ticket & { sla_policy?: SlaPolicy }) {
  if (!ticket.sla_policy) return 'no-sla'

  const now = new Date()
  const createdAt = new Date(ticket.created_at)
  const resolvedAt = ticket.resolved_at ? new Date(ticket.resolved_at) : null

  // Calculate elapsed time in minutes
  const elapsedMinutes = resolvedAt 
    ? Math.floor((resolvedAt.getTime() - createdAt.getTime()) / 60000)
    : Math.floor((now.getTime() - createdAt.getTime()) / 60000)

  const resolutionTimeMinutes = ticket.sla_policy.resolution_time_minutes

  if (resolvedAt) {
    return elapsedMinutes <= resolutionTimeMinutes ? 'met' : 'breached'
  }

  // Calculate percentage of time elapsed
  const percentageElapsed = (elapsedMinutes / resolutionTimeMinutes) * 100

  if (percentageElapsed >= 100) return 'breached'
  if (percentageElapsed >= 80) return 'at-risk'
  return 'on-track'
}

// Services & Categories
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*, category:service_categories(*)')
    .eq('is_active', true)

  if (error) throw error
  return data
}

export async function getServiceCategories() {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*, department:departments(*)')
    .eq('is_active', true)

  if (error) throw error
  return data
}

// Departments
export async function getDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('*')

  if (error) throw error
  return data
}

// SLA Policies
export async function getSlaPolicies() {
  const { data, error } = await supabase
    .from('sla_policies')
    .select('*')
    .eq('is_active', true)

  if (error) throw error
  return data
}