import { SlaMetrics } from '@/lib/sla'
import SlaBadge from './SlaBadge'
import TimeDisplay from './TimeDisplay'

type SlaTrackerProps = {
  metrics: SlaMetrics
  className?: string
}

export default function SlaTracker({ metrics, className = '' }: SlaTrackerProps) {
  if (metrics.responseStatus === 'no-sla') {
    return (
      <div className={`rounded-lg bg-gray-50 p-4 ${className}`}>
        <div className="text-sm text-gray-500">No SLA policy attached</div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg bg-white p-4 shadow ring-1 ring-gray-900/5 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900">SLA Status</h3>

      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Response Time */}
        <div className="rounded-lg bg-gray-50 p-4">
          <dt className="text-sm font-medium text-gray-500">Response Time</dt>
          <dd className="mt-2">
            <div className="flex items-center justify-between">
              <SlaBadge status={metrics.responseStatus} />
              {metrics.responseTime ? (
                <span className="text-sm text-gray-900">
                  <TimeDisplay minutes={metrics.responseTime} />
                </span>
              ) : (
                <span className="text-sm text-gray-500">Pending</span>
              )}
            </div>
          </dd>
        </div>

        {/* Resolution Time */}
        <div className="rounded-lg bg-gray-50 p-4">
          <dt className="text-sm font-medium text-gray-500">Resolution Time</dt>
          <dd className="mt-2">
            <div className="flex items-center justify-between">
              <SlaBadge status={metrics.resolutionStatus} />
              {metrics.resolutionTime ? (
                <span className="text-sm text-gray-900">
                  <TimeDisplay minutes={metrics.resolutionTime} />
                </span>
              ) : metrics.timeRemaining && metrics.timeRemaining > 0 ? (
                <span className="text-sm text-gray-900">
                  <TimeDisplay minutes={metrics.timeRemaining} /> remaining
                </span>
              ) : (
                <span className="text-sm text-gray-500">Overdue</span>
              )}
            </div>
          </dd>
        </div>
      </dl>

      {/* Progress Bar */}
      {!metrics.resolutionTime && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="text-gray-900">{Math.min(100, Math.round(metrics.percentageElapsed))}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full ${
                metrics.resolutionStatus === 'breached'
                  ? 'bg-red-600'
                  : metrics.resolutionStatus === 'at-risk'
                  ? 'bg-yellow-500'
                  : 'bg-green-600'
              }`}
              style={{ width: `${Math.min(100, metrics.percentageElapsed)}%` }}
            />
          </div>
        </div>
      )}

      {/* Breach Information */}
      {metrics.breachedAt && (
        <div className="mt-4">
          <p className="text-sm text-red-600">
            SLA breached on {new Date(metrics.breachedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}