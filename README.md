# Next.js Ticketing System with SLA Tracking

A modern, full-featured ticketing system built with Next.js 13+, TypeScript, Tailwind CSS, and Supabase. Features include real-time SLA tracking, advanced ticket lifecycle management, and role-based access control.

## Features

### 🎫 Ticket Management
- Complete ticket lifecycle management
- Status flow: New → In Progress → Under Review → Resolved → Closed
- Optional "On Hold" status with duration tracking
- Rich ticket details including priority, service category, and assignments
- Full audit trail of all status changes

### ⏱️ SLA Tracking
- Real-time SLA monitoring
- Response time tracking
- Resolution time tracking
- Automatic breach detection
- Post-resolution compliance reporting
- On-hold time adjustments

### 👥 User Management
- Role-based access control
- User profiles with departments
- Assignee management
- Reporter tracking

### 📊 Dashboard & Analytics
- Real-time ticket statistics
- SLA compliance metrics
- Department-wise analytics
- Priority distribution
- Response time analytics

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **State Management**: React Hooks
- **UI Components**: HeadlessUI
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/ticketing-system.git
cd ticketing-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Set up environment variables:
   Create a \`.env.local\` file in the root directory with the following variables:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   └── tickets/
│   └── api/
├── components/
│   ├── AppShell.tsx
│   ├── AuthProvider.tsx
│   ├── TicketLifecycle.tsx
│   ├── ResolutionForm.tsx
│   ├── SlaTracker.tsx
│   └── ...
├── lib/
│   ├── db.ts
│   ├── sla.ts
│   ├── types.ts
│   └── supabase-client.ts
└── public/
\`\`\`

## Database Schema

### Tables
1. **tickets**
   - id: uuid
   - ticket_number: string
   - title: string
   - description: text
   - status: enum
   - priority: enum
   - created_at: timestamp
   - updated_at: timestamp
   - reporter_id: uuid (ref: profiles)
   - assignee_id: uuid (ref: profiles)
   - service_id: uuid (ref: services)
   - sla_policy_id: uuid (ref: sla_policies)

2. **profiles**
   - id: uuid
   - first_name: string
   - last_name: string
   - department_id: uuid (ref: departments)
   - role: enum

3. **sla_policies**
   - id: uuid
   - name: string
   - response_time: integer
   - resolution_time: integer
   - is_active: boolean

## API Routes

### Tickets
- GET /api/tickets - List tickets
- POST /api/tickets - Create ticket
- GET /api/tickets/[id] - Get ticket details
- PUT /api/tickets/[id]/status - Update ticket status
- POST /api/tickets/[id]/comments - Add comment

### Users
- GET /api/users - List users
- GET /api/users/[id] - Get user profile
- PUT /api/users/[id] - Update user profile

## Ticket Lifecycle

1. **New**
   - Ticket created
   - SLA timer starts
   - Awaiting assignment

2. **In Progress**
   - Work started
   - Response time recorded
   - SLA tracking active

3. **Under Review**
   - Solution implemented
   - Awaiting verification

4. **Resolved**
   - Work completed
   - Resolution time recorded
   - SLA compliance checked

5. **Closed**
   - Ticket finalized
   - Final SLA metrics calculated
   - Added to historical data

## Contributing

1. Fork the repository
2. Create your feature branch: \`git checkout -b feature/amazing-feature\`
3. Commit your changes: \`git commit -m 'Add amazing feature'\`
4. Push to the branch: \`git push origin feature/amazing-feature\`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HeadlessUI Components](https://headlessui.dev)