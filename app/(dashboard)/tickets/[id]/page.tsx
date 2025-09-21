'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import StatusBadge from '@/components/StatusBadge'
import PriorityBadge from '@/components/PriorityBadge'
import { Ticket, Profile, Service, SlaPolicy, TicketComment, TicketStatus } from '@/lib/types'
import { useAuth } from '@/components/AuthProvider'
import {
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  PaperClipIcon,
} from '@heroicons/react/20/solid'
import clsx from 'clsx'
import Link from 'next/link'

type TicketWithRelations = Ticket & {
  reporter: Profile
  assignee?: Profile
  service?: Service
  sla_policy?: SlaPolicy
  comments: (TicketComment & { author: Profile })[]
}

export default function TicketDetail({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<TicketWithRelations | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const { profile } = useAuth()

  useEffect(() => {
    const loadTicket = async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          reporter:profiles!tickets_reporter_id_fkey(*),
          assignee:profiles!tickets_assignee_id_fkey(*),
          service:services(*),
          sla_policy:sla_policies(*),
          comments:ticket_comments(*, author:profiles(*))
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error loading ticket:', error)
      } else {
        setTicket(data)
      }
      setLoading(false)
    }

    loadTicket()
  }, [supabase, params.id])

  const handleStatusChange = async (status: TicketStatus) => {
    if (!ticket) return

    const updates: any = { status }
    if (status === 'resolved') {
      updates.resolved_at = new Date().toISOString()
    } else if (status === 'closed') {
      updates.closed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', ticket.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating ticket status:', error)
      return
    }

    setTicket((prev) => (prev ? { ...prev, ...data } : null))
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticket || !profile || !newComment.trim()) return

    const { data, error } = await supabase
      .from('ticket_comments')
      .insert({
        ticket_id: ticket.id,
        author_id: profile.id,
        content: newComment,
        is_internal: isInternal,
      })
      .select('*, author:profiles(*)')
      .single()

    if (error) {
      console.error('Error adding comment:', error)
      return
    }

    setTicket((prev) =>
      prev
        ? { ...prev, comments: [...prev.comments, data] }
        : null
    )
    setNewComment('')
    setIsInternal(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!ticket) {
    return <div>Ticket not found</div>
  }

  const statusOptions: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-x-3">
              <h1 className="text-lg font-semibold leading-6 text-gray-900">
                {ticket.ticket_number}
              </h1>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <p className="mt-2 text-sm text-gray-500">{ticket.title}</p>
          </div>
          <div className="mt-4 flex gap-x-3 sm:mt-0">
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ticket details */}
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Reporter</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {ticket.reporter.first_name} {ticket.reporter.last_name}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Assignee</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {ticket.assignee
                ? `${ticket.assignee.first_name} ${ticket.assignee.last_name}`
                : 'Unassigned'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Service</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {ticket.service?.name || 'None'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(ticket.created_at).toLocaleDateString()}
            </dd>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <div className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
            {ticket.description}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold leading-6 text-gray-900">Comments</h2>

          <div className="mt-6 space-y-6">
            <div className="space-y-6">
              {ticket.comments.map((comment) => (
                <div key={comment.id} className="relative flex gap-x-4">
                  <div className="flex h-6 w-6 flex-none items-center justify-center bg-gray-100 rounded-full">
                    <span className="text-xs font-medium text-gray-600">
                      {comment.author.first_name[0]}
                    </span>
                  </div>
                  <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                    <div className="flex justify-between gap-x-4">
                      <div className="py-0.5 text-xs leading-5 text-gray-500">
                        <span className="font-medium text-gray-900">
                          {comment.author.first_name} {comment.author.last_name}
                        </span>{' '}
                        commented at {new Date(comment.created_at).toLocaleString()}
                      </div>
                      {comment.is_internal && (
                        <span className="flex-none py-0.5 text-xs leading-5 text-red-500">
                          Internal Note
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-6 text-gray-500">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <form onSubmit={handleAddComment}>
                <div>
                  <label htmlFor="comment" className="sr-only">
                    Add your comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Add your comment..."
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="internal"
                      name="internal"
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="internal"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Internal note
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                  >
                    Add Comment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}