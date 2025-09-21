import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { updateTicketStatus } from '@/lib/ticket-lifecycle'
import type { TicketStatus } from '@/lib/types'

export async function PUT(request: Request) {
  try {
    const { ticketId, status, resolutionNote } = await request.json()
    
    // Validate input
    if (!ticketId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current ticket state
    const { data: ticket } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single()

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Verify user has permission to update the ticket
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const canUpdate = 
      profile?.role === 'admin' ||
      ticket.assignee_id === session.user.id ||
      ticket.reporter_id === session.user.id

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Update ticket status
    const updatedTicket = await updateTicketStatus(
      ticketId,
      status as TicketStatus,
      resolutionNote
    )

    return NextResponse.json(updatedTicket)
  } catch (error: any) {
    console.error('Error updating ticket status:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}