import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - Ticketing System',
  description: 'Sign in or create an account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Ticketing System
        </h2>
      </div>
      {children}
    </div>
  )
}