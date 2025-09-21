'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { Profile, Service, SlaPolicy, Department } from '@/lib/types'

type TicketFormValues = {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  type: 'request' | 'incident'
  service_id?: string
  assignee_id?: string
  sla_policy_id?: string
}

type TicketFormProps = {
  open: boolean
  onClose: () => void
  onSubmit: (values: TicketFormValues) => Promise<void>
  initialValues?: Partial<TicketFormValues>
  services: Service[]
  slaPolicies: SlaPolicy[]
  users: Profile[]
  departments: Department[]
}

export default function TicketForm({
  open,
  onClose,
  onSubmit,
  initialValues,
  services,
  slaPolicies,
  users,
  departments,
}: TicketFormProps) {
  const [values, setValues] = useState<TicketFormValues>({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    priority: initialValues?.priority || 'medium',
    type: initialValues?.type || 'request',
    service_id: initialValues?.service_id,
    assignee_id: initialValues?.assignee_id,
    sla_policy_id: initialValues?.sla_policy_id,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(values)
      onClose()
    } catch (error) {
      console.error('Error submitting ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      {initialValues ? 'Edit Ticket' : 'Create New Ticket'}
                    </Dialog.Title>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={values.title}
                            onChange={(e) => setValues({ ...values, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows={4}
                            value={values.description}
                            onChange={(e) => setValues({ ...values, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                              Type
                            </label>
                            <select
                              name="type"
                              id="type"
                              value={values.type}
                              onChange={(e) => setValues({ ...values, type: e.target.value as 'request' | 'incident' })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value="request">Request</option>
                              <option value="incident">Incident</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                              Priority
                            </label>
                            <select
                              name="priority"
                              id="priority"
                              value={values.priority}
                              onChange={(e) => setValues({ ...values, priority: e.target.value as 'low' | 'medium' | 'high' })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                            Service
                          </label>
                          <select
                            name="service"
                            id="service"
                            value={values.service_id || ''}
                            onChange={(e) => setValues({ ...values, service_id: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="">Select a service</option>
                            {services.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
                            Assignee
                          </label>
                          <select
                            name="assignee"
                            id="assignee"
                            value={values.assignee_id || ''}
                            onChange={(e) => setValues({ ...values, assignee_id: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="">Unassigned</option>
                            {departments.map((dept) => (
                              <optgroup key={dept.id} label={dept.name}>
                                {users
                                  .filter((user) => user.department_id === dept.id)
                                  .map((user) => (
                                    <option key={user.id} value={user.id}>
                                      {user.first_name} {user.last_name}
                                    </option>
                                  ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="sla" className="block text-sm font-medium text-gray-700">
                            SLA Policy
                          </label>
                          <select
                            name="sla"
                            id="sla"
                            value={values.sla_policy_id || ''}
                            onChange={(e) => setValues({ ...values, sla_policy_id: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="">No SLA</option>
                            {slaPolicies.map((policy) => (
                              <option key={policy.id} value={policy.id}>
                                {policy.name} ({policy.priority})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                          >
                            {loading ? 'Saving...' : initialValues ? 'Save Changes' : 'Create Ticket'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={onClose}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}