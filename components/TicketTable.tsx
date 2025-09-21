'use client'

import { Ticket, TicketStatus, TicketPriority } from '@/lib/types'
import Link from 'next/link'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import clsx from 'clsx'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'

type TableColumn = {
  name: string
  label: string
  sortable?: boolean
}

const columns: TableColumn[] = [
  { name: 'ticket_number', label: 'Ticket #', sortable: true },
  { name: 'title', label: 'Title', sortable: true },
  { name: 'status', label: 'Status', sortable: true },
  { name: 'priority', label: 'Priority', sortable: true },
  { name: 'assignee', label: 'Assignee', sortable: true },
  { name: 'created_at', label: 'Created', sortable: true },
]

type TicketTableProps = {
  tickets: any[] // Using any because the tickets include joined data
  onSort?: (column: string) => void
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onStatusChange?: (ticketId: string, status: TicketStatus) => Promise<void>
}

export default function TicketTable({
  tickets,
  onSort,
  sortColumn,
  sortDirection,
  onStatusChange,
}: TicketTableProps) {
  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.name}
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort?.(column.name)}
                        className="group inline-flex"
                      >
                        {column.label}
                        <span
                          className={clsx(
                            'ml-2 flex-none rounded',
                            sortColumn === column.name
                              ? 'text-gray-900'
                              : 'invisible text-gray-400 group-hover:visible'
                          )}
                        >
                          {sortColumn === column.name && sortDirection === 'desc' ? '↓' : '↑'}
                        </span>
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-indigo-600">
                    <Link href={`/tickets/${ticket.id}`}>{ticket.ticket_number}</Link>
                  </td>
                  <td className="max-w-md truncate py-4 pl-4 pr-3 text-sm text-gray-900">
                    {ticket.title}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                    {onStatusChange ? (
                      <Menu as="div" className="relative inline-block text-left">
                        <div>
                          <Menu.Button className="inline-flex items-center gap-x-1.5">
                            <StatusBadge status={ticket.status} />
                            <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute left-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              {(['open', 'in_progress', 'resolved', 'closed'] as TicketStatus[]).map(
                                (status) => (
                                  <Menu.Item key={status}>
                                    {({ active }) => (
                                      <button
                                        onClick={() => onStatusChange(ticket.id, status)}
                                        className={clsx(
                                          active ? 'bg-gray-100' : '',
                                          'block w-full px-4 py-2 text-left text-sm text-gray-900'
                                        )}
                                      >
                                        <StatusBadge status={status} />
                                      </button>
                                    )}
                                  </Menu.Item>
                                )
                              )}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    ) : (
                      <StatusBadge status={ticket.status} />
                    )}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                    {ticket.assignee
                      ? `${ticket.assignee.first_name} ${ticket.assignee.last_name}`
                      : 'Unassigned'}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View<span className="sr-only">, {ticket.title}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}