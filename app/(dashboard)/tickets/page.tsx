'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import TicketTable from '@/components/TicketTable'
import TicketForm from '@/components/TicketForm'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/components/AuthProvider'
import { Service, Department, Profile, SlaPolicy, TicketStatus } from '@/lib/types'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [slaPolicies, setSlaPolicies] = useState<SlaPolicy[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const supabase = createClientComponentClient()
  const { profile } = useAuth()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load tickets
        const { data: ticketData } = await supabase
          .from('tickets')
          .select(`
            *,
            reporter:profiles!tickets_reporter_id_fkey(*),
            assignee:profiles!tickets_assignee_id_fkey(*),
            service:services(*),
            sla_policy:sla_policies(*)
          `)
          .order(sortColumn, { ascending: sortDirection === 'asc' })

        if (ticketData) {
          setTickets(ticketData)
        }

        // Load services
        const { data: serviceData } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)

        if (serviceData) {
          setServices(serviceData)
        }

        // Load departments
        const { data: deptData } = await supabase
          .from('departments')
          .select('*')

        if (deptData) {
          setDepartments(deptData)
        }

        // Load users
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('status', 'active')

        if (userData) {
          setUsers(userData)
        }

        // Load SLA policies
        const { data: slaData } = await supabase
          .from('sla_policies')
          .select('*')
          .eq('is_active', true)

        if (slaData) {
          setSlaPolicies(slaData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleCreateTicket = async (values: any) => {
    if (!profile) return

    const ticketNumber = `TKT-${new Date().toISOString().slice(0, 10)}-${Math.floor(
      Math.random() * 10000
    ).toString().padStart(4, '0')}`

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        ...values,
        ticket_number: ticketNumber,
        reporter_id: profile.id,
        status: 'open',
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    setTickets((prev) => [data, ...prev])
  }

  const handleStatusChange = async (ticketId: string, status: TicketStatus) => {
    const { error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId)

    if (error) {
      console.error('Error updating ticket status:', error)
      return
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status } : ticket
      )
    )
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Tickets</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all tickets in the system including their status, priority, and assignee.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="inline-block h-5 w-5 mr-1" />
            Create Ticket
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <TicketTable
          tickets={tickets}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onStatusChange={handleStatusChange}
        />
      </div>

      <TicketForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTicket}
        services={services}
        slaPolicies={slaPolicies}
        users={users}
        departments={departments}
      />
    </div>
  )
}