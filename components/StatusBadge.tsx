import { TicketStatus } from '@/lib/types'

type TicketStatusBadgeProps = {
  status: TicketStatus
}

const statusStyles = {
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
}

export default function StatusBadge({ status }: TicketStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status.replace('_', ' ')}
    </span>
  )
}