# UIP Africa ERP Frontend

A modern, responsive Next.js 14 application for the UIP Africa ERP system.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom theme (burgundy/brown color scheme)
- **Radix UI** components for accessibility
- **Dark/Light mode** support
- **Role-based authentication** (Employee, Supervisor, Admin)
- **Responsive design** (mobile-first approach)
- **Modern UI/UX** with smooth animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Context + Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: JWT with refresh tokens
- **Theme**: next-themes
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

Use these credentials to test different user roles:

- **Employee**: `employee@uip.com` / `password`
- **Supervisor**: `supervisor@uip.com` / `password`
- **Admin**: `admin@uip.com` / `password`

## Project Structure

```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Dashboard (role-based)
│   ├── login/             # Authentication
│   ├── employees/         # Employee management
│   ├── contacts/          # Contact management
│   ├── time-off/          # Leave management
│   ├── documents/         # Document management
│   └── fleet/             # Vehicle management
├── components/            # Reusable components
│   ├── ui/               # Base UI components (Shadcn)
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── context/              # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utilities
├── types/                # TypeScript definitions
└── public/               # Static assets
```

## Key Features

### Authentication & Authorization

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Protected routes with middleware
- Persistent sessions

### Dashboard Views

- **Employee Dashboard**: Personal stats, leave balance, quick actions
- **Supervisor Dashboard**: Team management, approval queues
- **Admin Dashboard**: System-wide analytics, user management

### Modules

- **Employee Management**: Directory, profiles, role management
- **Contact Management**: Business contacts with categories
- **Time Off Management**: Leave requests, approvals, balances
- **Document Management**: File uploads, versioning, expiry tracking
- **Fleet Management**: Vehicle tracking, maintenance, assignments

### UI/UX

- Custom burgundy/brown theme
- Dark/light mode toggle
- Responsive sidebar navigation
- Mobile-optimized design
- Loading states and error boundaries
- Toast notifications

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=UIP Africa ERP
```

## Deployment

The app is ready for deployment on Vercel, Netlify, or any platform supporting Next.js.

For Vercel:

```bash
npm run build
vercel --prod
```

## Contributing

1. Follow the established code patterns
2. Use TypeScript for all new code
3. Follow the component structure conventions
4. Test on multiple screen sizes
5. Ensure accessibility compliance

## License

© 2024 UIP Africa. All rights reserved.
