import { useState } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import type { Ticket, TicketStatus } from '@/lib/types'

interface TicketLifecycleProps {
  ticket: Ticket
  onStatusChange: (status: TicketStatus) => Promise<void>
}

const statusFlow = {
  new: ['in_progress'],
  in_progress: ['under_review', 'on_hold'],
  on_hold: ['in_progress'],
  under_review: ['in_progress', 'resolved'],
  resolved: ['closed', 'in_progress'],
  closed: []
} as const

const statusLabels: Record<TicketStatus, string> = {
  new: 'New',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  under_review: 'Under Review',
  resolved: 'Resolved',
  closed: 'Closed'
}

const statusColors: Record<TicketStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  on_hold: 'bg-gray-100 text-gray-800',
  under_review: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
}

export default function TicketLifecycle({ ticket, onStatusChange }: TicketLifecycleProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (newStatus === 'closed') {
      setShowWarning(true)
      return
    }

    setIsTransitioning(true)
    try {
      await onStatusChange(newStatus)
    } catch (error) {
      console.error('Error updating ticket status:', error)
    } finally {
      setIsTransitioning(false)
    }
  }

  const confirmStatusChange = async () => {
    setShowWarning(false)
    setIsTransitioning(true)
    try {
      await onStatusChange('closed')
    } catch (error) {
      console.error('Error closing ticket:', error)
    } finally {
      setIsTransitioning(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Current Status:</span>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          statusColors[ticket.status]
        }`}>
          {statusLabels[ticket.status]}
        </span>
      </div>

      {/* Available Status Transitions */}
      <div className="flex flex-wrap gap-2">
        {statusFlow[ticket.status].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            disabled={isTransitioning}
            className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm 
              ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
              ${status === 'closed' 
                ? 'bg-red-600 text-white hover:bg-red-500' 
                : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              }`}
          >
            {status === 'closed' ? 'Close Ticket' : `Mark as ${statusLabels[status]}`}
          </button>
        ))}
      </div>

      {/* Warning Modal for Closing Ticket */}
      {showWarning && (
        <div className="relative z-10">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Close Ticket
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to close this ticket? This action cannot be undone, 
                        and the ticket will be marked as completed. SLA metrics will be finalized.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={confirmStatusChange}
                  >
                    Close Ticket
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setShowWarning(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}