# SILPAM Desa Nembol

## Sistem Informasi Layanan Pengaduan Desa Nembol

A modern web application for managing community complaints in Nembol Village, built with Next.js, TypeScript, and Supabase.

## Overview

SILPAM (Sistem Informasi Layanan Pengaduan) is a comprehensive complaint management system designed to facilitate communication between villagers and village administration. The system allows residents to submit complaints regarding village issues, track their status, and receive responses from administrators.

## Features

### User Features
- **Complaint Submission**: Users can create new complaints with title, description, location, and optional image attachments
- **Dashboard**: Personal dashboard to view and track submitted complaints
- **Complaint Details**: View detailed information, status updates, and communication timeline

### Admin Features
- **Complaint Management**: View all submitted complaints from the community
- **Status Management**: Process, reject, or resolve complaints with remarks
- **Administrative Dashboard**: Comprehensive overview of complaint statistics and recent activities
- **Response System**: Ability to reply to complaints and update statuses

### Technical Features
- **Authentication**: Secure user authentication via Supabase Auth
- **File Uploads**: Support for image attachments in complaints
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS and ShadCN UI
- **Real-time Data**: Server-side rendering with React Query for efficient data fetching
- **Type Safety**: Full TypeScript implementation with Zod schema validation

## Tech Stack

- **Frontend**: Next.js 15.5.2, React 19.1.0, TypeScript
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Styling**: Tailwind CSS, ShadCN UI components
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form with Zod validation
- **Utilities**: Date-fns, Radash, TS-Belt
- **Development Tools**: Biome (Linting & Formatting), pnpm

## Prerequisites

- Node.js 18+
- pnpm package manager
- Supabase account and project

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:rimzzlabs/silpam-nembol.git
   cd silpam-nembol
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials and other required variables.

4. Initialize Supabase:
   ```bash
   pnpm supabase:login
   pnpm supabase:init
   pnpm supabase:link [your project id]
   pnpm supabase:generate [your project id]
   ```

## Usage

### Development
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
pnpm start
```

### Code Quality
```bash
pnpm lint
pnpm format
```

### UI Components
Add new ShadCN components:
```bash
pnpm ui:add [component-name]
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── auth/              # Authentication pages
│   └── api/               # API routes (if any)
├── components/            # Reusable UI components
│   ├── ui/               # ShadCN UI components
│   └── complaint/        # Complaint-specific components
├── modules/               # Feature-based modules
│   ├── auth/             # Authentication logic
│   ├── complaint/        # Complaint management
│   ├── reply/            # Reply system
│   └── supabase/         # Supabase integration
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## Database Schema

The application uses Supabase with the following main tables:
- `pengaduan` (complaints): Stores complaint data with user references
- `tanggapan` (replies): Stores admin responses and status updates
- User authentication handled by Supabase Auth

## Contributing

This project was developed as a final year submission for academic purposes. For contributions or modifications:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is developed for educational purposes as part of a final year academic submission.

## Acknowledgments

- Built with Next.js and Supabase
- UI components from ShadCN
- Icons from Lucide React
- Charts from Recharts

---

**Note**: This application is specifically designed for the administrative needs of Nembol Village and may require customization for use in other contexts.