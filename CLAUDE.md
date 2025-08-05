# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FitPlatform is a comprehensive fitness web application built with Next.js 14+ that serves both fitness enthusiasts (B2C) and personal trainers (B2B). The platform enables workout planning, progress tracking, device synchronization, and trainer-client management through a multi-tier subscription model.

## Development Commands

### Core Development
```bash
# Development server
npm run dev

# Production build
npm run build

# Production server
npm run start

# Linting
npm run lint
```

### Database Operations
```bash
# Install Supabase CLI (global)
npm install -g supabase

# Link to Supabase project
supabase link --project-ref your-project-ref

# Run database migrations
supabase db push

# Seed database
npm run db:seed
```

### Testing (when implemented)
```bash
# Unit tests
npm run test

# Integration tests  
npm run test:integration

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

## Architecture Overview

### Tech Stack Foundation
- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Payments**: Stripe with webhook handling
- **Hosting**: Vercel with edge optimization
- **State Management**: Zustand (planned)
- **Forms**: React Hook Form + Zod validation (planned)

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Design system styles
│   ├── layout.tsx         # Root layout with SEO
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── common/           # Shared components
│   ├── sections/         # Landing page sections
│   └── ui/               # Base UI components
├── lib/                  # Utilities and configurations
├── types/                # TypeScript definitions
└── stores/               # Zustand stores (planned)
```

### Key Architecture Patterns

**Component Architecture**:
- Section-based components for landing page
- Reusable UI components with TypeScript interfaces
- Custom hooks for state management (planned)

**Design System**:
- Custom Tailwind configuration with brand colors
- Typography scale with clamp() for responsive text
- Consistent spacing and animation patterns
- Primary blue (#0ea5e9), accent orange (#f97316), success green (#22c55e)

**Data Flow (Planned)**:
- Supabase for user authentication and data persistence
- Real-time subscriptions for live data updates
- Third-party API integrations (Apple HealthKit, Google Fit, Strava)
- Event-driven architecture for data synchronization

## Business Logic Context

### User Types & Subscription Tiers
- **Free Tier**: 3 custom workouts, 30-day history, 1 device sync
- **Pro Tier ($9.99/mo)**: Unlimited workouts, full history, unlimited devices, advanced analytics
- **Enterprise Tier ($29.99/mo)**: All Pro features + client management, custom branding, API access

### Core Features (Implementation Roadmap)
1. **MVP Phase**: User auth, basic workout creation, Apple HealthKit integration
2. **Enhanced Phase**: Google Fit/Strava, advanced analytics, Pro tier
3. **Professional Phase**: Trainer-client management, Enterprise features
4. **Scale Phase**: AI recommendations, social features, international expansion

### Third-Party Integrations
- **Apple HealthKit**: iOS health data sync (workouts, heart rate, steps)
- **Google Fit**: Android fitness data (activities, nutrition, sleep)
- **Strava**: Activity import and social features
- **Stripe**: Subscription management and payment processing

## Development Guidelines

### Code Patterns
- Use TypeScript interfaces for all data structures
- Implement responsive design with mobile-first approach
- Follow Next.js 14+ App Router conventions
- Use Tailwind CSS classes with consistent naming

### SEO & Performance
- Comprehensive metadata in layout.tsx with structured data
- Image optimization with Next.js Image component
- Font optimization with next/font
- Edge-optimized deployment on Vercel

### Security Considerations
- Supabase Row Level Security (RLS) for data protection
- JWT authentication with refresh tokens
- API rate limiting and input validation
- GDPR/CCPA compliance for health data

## Environment Configuration

Required environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Third-party APIs
GOOGLE_FIT_CLIENT_ID=
STRAVA_CLIENT_ID=
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Current Implementation Status

**Completed**:
- ✅ Landing page with conversion-optimized design
- ✅ Component architecture with TypeScript
- ✅ Responsive design system with Tailwind CSS
- ✅ SEO optimization and structured data
- ✅ Design specifications and system architecture documentation

**Next Steps**:
- 🔄 Supabase integration and database schema
- 🔄 User authentication system
- 🔄 Workout management features
- 🔄 Third-party API integrations
- 🔄 Subscription and payment handling

## Key Files to Understand

- `PRD.md`: Complete product requirements and business context
- `SYSTEM_ARCHITECTURE.md`: Detailed technical architecture
- `UX_RESEARCH_DOCUMENT.md`: User experience research and guidelines
- `src/app/layout.tsx`: SEO configuration and font loading
- `tailwind.config.ts`: Design system configuration
- `src/types/index.ts`: Core TypeScript interfaces

## Target Metrics
- 10,000 active users within 6 months
- 70% monthly user retention
- $50,000 MRR by end of year 1
- Support for 5+ fitness platform integrations