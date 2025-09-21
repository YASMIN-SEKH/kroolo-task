import { useState } from 'react'
import { updateTicketStatus } from '@/lib/ticket-lifecycle'
import type { Ticket } from '@/lib/types'

interface ResolutionFormProps {
  ticket: Ticket
  onResolved: (updatedTicket: Ticket) => void
}

export default function ResolutionForm({ ticket, onResolved }: ResolutionFormProps) {
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const updatedTicket = await updateTicketStatus(ticket.id, 'resolved', note)
      onResolved(updatedTicket)
    } catch (err: any) {
      setError(err.message || 'Error resolving ticket')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
      <div>
        <label htmlFor="resolution-note" className="block text-sm font-medium text-gray-700">
          Resolution Details
        </label>
        <div className="mt-1">
          <textarea
            id="resolution-note"
            name="resolution-note"
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe how the issue was resolved..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !note.trim()}
          className={`inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
            ${(isSubmitting || !note.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Resolving...' : 'Mark as Resolved'}
        </button>
      </div>
    </form>
  )
}