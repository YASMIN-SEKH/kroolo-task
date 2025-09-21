import { SlaStatus } from '@/lib/sla'

type SlaStatusBadgeProps = {
  status: SlaStatus
}

const statusConfig = {
  'on-track': {
    color: 'bg-green-100 text-green-800',
    label: 'On Track'
  },
  'at-risk': {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'At Risk'
  },
  'breached': {
    color: 'bg-red-100 text-red-800',
    label: 'Breached'
  },
  'met': {
    color: 'bg-green-100 text-green-800',
    label: 'Met'
  },
  'no-sla': {
    color: 'bg-gray-100 text-gray-800',
    label: 'No SLA'
  }
}

export default function SlaBadge({ status }: SlaStatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}