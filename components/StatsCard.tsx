type StatsCardProps = {
  title: string
  value: number | string
  description?: string
  trend?: {
    value: number
    label: string
    type: 'increase' | 'decrease'
  }
}

export default function StatsCard({ title, value, description, trend }: StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
      <dt>
        <p className="truncate text-sm font-medium text-gray-500">{title}</p>
      </dt>
      <dd className="flex items-baseline pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <p
            className={`ml-2 flex items-baseline text-sm font-semibold ${
              trend.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.type === 'increase' ? '↑' : '↓'} {trend.value}%
            <span className="text-gray-500"> {trend.label}</span>
          </p>
        )}
        {description && (
          <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <span className="font-medium text-gray-500">{description}</span>
            </div>
          </div>
        )}
      </dd>
    </div>
  )
}