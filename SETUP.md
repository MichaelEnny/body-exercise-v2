# FitPlatform - Setup Guide

This document provides step-by-step instructions for setting up the FitPlatform development environment.

## Project Overview

FitPlatform is a comprehensive fitness web application built with:
- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Payments**: Stripe
- **Integrations**: Apple HealthKit, Google Fit, Strava

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

The `.env` file is already configured with development credentials. For production, update:

```env
# Supabase - Update with your production values
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Stripe - Update with your live keys
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Production URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### 3. Database Setup

1. **Create Supabase Project**: If you haven't already, create a new project at [supabase.com](https://supabase.com)

2. **Run Database Schema**: Execute the SQL in `database/schema.sql` in your Supabase SQL editor

3. **Enable Row Level Security**: The schema includes RLS policies for data security

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── workouts/          # Workout management
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── common/           # Shared components
│   ├── sections/         # Landing page sections
│   └── ui/               # Base UI components
├── lib/                  # Utilities and configurations
│   └── supabase.ts       # Supabase client
├── stores/               # Zustand state stores
│   ├── authStore.ts      # Authentication state
│   └── workoutStore.ts   # Workout management
└── types/                # TypeScript definitions
    └── index.ts          # Core type definitions
```

## Key Features Implemented

### ✅ Completed
- Landing page with conversion optimization
- User authentication system
- Workout creation and management
- Progress tracking foundation
- Trainer-client relationship structure
- Subscription tier management
- Responsive design system
- Type-safe API routes

### 🔄 Next Implementation Steps
1. **Database Migration**: Apply the schema to your Supabase instance
2. **Workout Builder UI**: Complete the workout creation interface
3. **Progress Analytics**: Implement charts and progress tracking
4. **Device Integrations**: Apple HealthKit, Google Fit, Strava APIs
5. **Payment Integration**: Stripe subscription flows
6. **Trainer Dashboard**: Client management interface

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database (when implemented)
npm run db:seed      # Seed database with sample data
```

## API Routes

- `GET/POST /api/workouts` - Workout management
- `GET/POST /api/health` - Health metrics
- `/api/auth/*` - Authentication endpoints
- `/api/integrations/*` - Third-party API integrations
- `/api/payments/*` - Stripe payment handling

## Authentication Flow

1. Users sign up/in via `/auth` page
2. Supabase handles authentication and JWT tokens
3. User profiles stored in `users` table
4. Trainers have additional `trainer_profiles` record
5. Protected routes use `ProtectedRoute` component

## State Management

- **Auth Store**: User authentication and profile data
- **Workout Store**: Workout creation, sessions, and templates
- Stores use Zustand for simple, type-safe state management

## Database Schema

The application uses PostgreSQL with the following key tables:
- `users` - User profiles and subscription info
- `workouts` - Workout templates and routines
- `workout_sessions` - Individual workout tracking
- `health_metrics` - Health and fitness data
- `trainer_client_relationships` - Trainer-client connections

## Security

- Row Level Security (RLS) enabled on all tables
- User data isolated by authenticated user ID
- Trainer data separated from client data
- Public workout templates available to all users

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform

## Support

For development questions or issues:
1. Check the Next.js documentation
2. Review Supabase guides
3. Consult the TypeScript handbook
4. Refer to Tailwind CSS documentation

## Next Steps

1. **Complete Database Setup**: Run the schema in your Supabase instance
2. **Test Authentication**: Create a user account and verify the flow
3. **Build Core Features**: Start with workout creation and basic tracking
4. **Add Integrations**: Implement Apple Health and Google Fit connections
5. **Deploy MVP**: Get the basic version live for user testing

The foundation is solid and ready for rapid feature development!