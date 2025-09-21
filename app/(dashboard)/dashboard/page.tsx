import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { TicketStatus, Ticket } from '@/lib/types'
import StatsCard from '@/components/StatsCard'
import ActivityFeed from '@/components/ActivityFeed'
import StatusBadge from '@/components/StatusBadge'

async function getTicketStats() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get tickets
  const { data: tickets } = await supabase
    .from('tickets')
    .select(`
      *,
      reporter:profiles!tickets_reporter_id_fkey(first_name, last_name),
      assignee:profiles!tickets_assignee_id_fkey(first_name, last_name)
    `)
    .order('created_at', { ascending: false })

  if (!tickets) return null

  // Calculate statistics
  const stats = {
    total: tickets.length,
    byStatus: tickets.reduce((acc: Record<TicketStatus, number>, ticket) => {
      acc[ticket.status as TicketStatus] = (acc[ticket.status as TicketStatus] || 0) + 1
      return acc
    }, {} as Record<TicketStatus, number>),
  }

  // Format recent activity
  const recentActivity = tickets.slice(0, 5).map((ticket) => ({
    time: new Date(ticket.created_at).toLocaleDateString(),
    activity: `created ticket ${ticket.ticket_number}: ${ticket.title}`,
    person: {
      name: `${ticket.reporter.first_name} ${ticket.reporter.last_name}`,
    },
  }))

  return {
    stats,
    recentActivity,
    tickets: tickets.slice(0, 5), // Recent tickets
  }
}

export default async function DashboardPage() {
  const data = await getTicketStats()

  if (!data) {
    return <div>Loading...</div>
  }

  const { stats, recentActivity, tickets } = data

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tickets"
          value={stats.total}
          trend={{
            value: 12,
            label: 'from last month',
            type: 'increase',
          }}
        />
        <StatsCard
          title="Open Tickets"
          value={stats.byStatus.open || 0}
        />
        <StatsCard
          title="In Progress"
          value={stats.byStatus.in_progress || 0}
        />
        <StatsCard
          title="Resolved"
          value={stats.byStatus.resolved || 0}
          trend={{
            value: 5,
            label: 'from last week',
            type: 'increase',
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Activity</h3>
            <div className="mt-6">
              <ActivityFeed items={recentActivity} />
            </div>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Tickets</h3>
            <div className="mt-6">
              <div className="overflow-hidden">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                            Ticket
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Assignee
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                          <tr key={ticket.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                              <div className="flex flex-col">
                                <div className="font-medium text-gray-900">{ticket.ticket_number}</div>
                                <div className="text-gray-500">{ticket.title}</div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <StatusBadge status={ticket.status as TicketStatus} />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {ticket.assignee ? (
                                `${ticket.assignee.first_name} ${ticket.assignee.last_name}`
                              ) : (
                                'Unassigned'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}