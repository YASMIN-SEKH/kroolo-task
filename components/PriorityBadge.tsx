import { TicketPriority } from '@/lib/types'

type PriorityBadgeProps = {
  priority: TicketPriority
}

const priorityStyles = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${priorityStyles[priority]}`}
    >
      {priority}
    </span>
  )
}