# FitPlatform - Ultimate Workout & Wellness Platform

![FitPlatform Logo](./public/logo.png)

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

A comprehensive fitness web application that empowers individuals and personal trainers to create customized workout plans, track progress, and sync data from multiple fitness devices and platforms.

## 🌟 Features

### Core Features
- **🏋️ Custom Workout Plans**: Create and customize workout routines with exercises, sets, reps, and rest periods
- **📊 Progress Tracking**: Comprehensive analytics and visualizations of fitness progress
- **⌚ Device Synchronization**: Seamless integration with Apple HealthKit, Google Fit, and Strava
- **👥 Trainer-Client Management**: Professional tools for personal trainers to manage clients
- **💳 Subscription Management**: Flexible pricing tiers (Free, Pro, Enterprise)
- **📱 PWA Support**: Progressive Web App for mobile-first experience

### Advanced Features
- **📈 AI-Powered Insights**: Intelligent recommendations based on user data and goals
- **🎯 Goal Setting & Tracking**: SMART goals with milestone tracking
- **📅 Workout Scheduling**: Calendar integration with reminders and notifications
- **💬 In-App Messaging**: Communication tools for trainer-client interaction
- **📂 Exercise Library**: Comprehensive database of exercises with instructions and videos
- **🏆 Achievement System**: Gamification with badges and progress celebrations

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Maps**: [Mapbox GL JS](https://www.mapbox.com/)

### Backend & Database
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage + Realtime)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with social providers
- **File Storage**: Supabase Storage for exercise videos and user avatars
- **Real-time**: Supabase Realtime for live updates

### Payments & Subscriptions
- **Payment Processing**: [Stripe](https://stripe.com/)
- **Subscription Management**: Stripe Billing Portal
- **Webhooks**: Next.js API routes for Stripe webhook handling

### Integrations
- **Apple HealthKit**: iOS health and fitness data synchronization
- **Google Fit**: Android health and fitness data synchronization
- **Strava**: Activity import and social fitness features
- **Wearable Devices**: Support for major fitness trackers

### Development & Deployment
- **Hosting**: [Vercel](https://vercel.com/)
- **Monitoring**: [Sentry](https://sentry.io/) for error tracking
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Email**: [Resend](https://resend.com/) for transactional emails

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/fitplatform.git
cd fitplatform
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Apple HealthKit (iOS only)
NEXT_PUBLIC_APPLE_HEALTHKIT_ENABLED=true

# Google Fit API
GOOGLE_FIT_CLIENT_ID=your_google_fit_client_id
GOOGLE_FIT_CLIENT_SECRET=your_google_fit_client_secret

# Strava API
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret

# Mapbox (for workout routes)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Database Setup
Run the Supabase migrations and seed data:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your Supabase project
supabase link --project-ref your-project-ref

# your-project-ref is also the supabase database Project ID

# Run migrations
supabase db push

# Seed the database
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
fitplatform/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (dashboard)/              # Main application routes
│   ├── api/                      # API routes
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable UI components
│   ├── ui/                       # Shadcn/ui components
│   ├── forms/                    # Form components
│   ├── charts/                   # Chart components
│   └── layouts/                  # Layout components
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase client and utilities
│   ├── stripe/                   # Stripe utilities
│   ├── integrations/             # Third-party API integrations
│   ├── utils/                    # General utilities
│   ├── validations/              # Zod schemas
│   └── hooks/                    # Custom React hooks
├── stores/                       # Zustand stores
│   ├── auth.ts                   # Authentication store
│   ├── workouts.ts               # Workout management store
│   └── user.ts                   # User data store
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
├── supabase/                     # Supabase configuration
│   ├── migrations/               # Database migrations
│   └── seed.sql                  # Database seed data
├── docs/                         # Documentation
├── PRD.md                        # Product Requirements Document
└── README.md                     # This file
```

## 🔌 API Integrations

### Apple HealthKit Integration
```typescript
// lib/integrations/apple-healthkit.ts
import { HealthKit } from '@capacitor-community/health';

export async function syncHealthKitData() {
  const permissions = {
    read: [
      HealthKit.HealthDataType.WORKOUT_TYPE,
      HealthKit.HealthDataType.HEART_RATE,
      HealthKit.HealthDataType.STEP_COUNT,
    ],
  };
  
  await HealthKit.requestAuthorization(permissions);
  // Implementation details...
}
```

### Google Fit Integration
```typescript
// lib/integrations/google-fit.ts
export async function syncGoogleFitData(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataSources', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  // Implementation details...
}
```

### Strava Integration
```typescript
// lib/integrations/strava.ts
export async function syncStravaActivities(accessToken: string) {
  const response = await fetch('https://www.strava.com/api/v3/athlete/activities', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  // Implementation details...
}
```

## 💳 Subscription Tiers

| Feature | Free | Pro ($9.99/mo) | Enterprise ($29.99/mo) |
|---------|------|----------------|------------------------|
| Custom Workouts | 3 | Unlimited | Unlimited |
| Progress History | 30 days | Unlimited | Unlimited |
| Device Sync | 1 device | Unlimited | Unlimited |
| Client Management | ❌ | ❌ | ✅ |
| Advanced Analytics | ❌ | ✅ | ✅ |
| Custom Branding | ❌ | ❌ | ✅ |
| API Access | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ❌ | ✅ |

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📱 PWA Features

The application is configured as a Progressive Web App with:
- **Offline Support**: Service worker for caching and offline functionality
- **Install Prompt**: Native app-like installation on mobile devices
- **Push Notifications**: Real-time workout reminders and updates
- **Background Sync**: Sync workout data when connection is restored

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level security with Supabase
- **JWT Authentication**: Secure token-based authentication
- **API Rate Limiting**: Protection against abuse and spam
- **Data Encryption**: Sensitive data encrypted at rest and in transit
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Server-side validation with Zod schemas

## 📊 Analytics & Monitoring

- **User Analytics**: Track user engagement and feature usage
- **Performance Monitoring**: Real-time performance metrics with Vercel
- **Error Tracking**: Comprehensive error reporting with Sentry
- **Health Checks**: API endpoint monitoring and alerting

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.fitplatform.com](https://docs.fitplatform.com)
- **Discord Community**: [Join our Discord](https://discord.gg/fitplatform)
- **Email Support**: support@fitplatform.com
- **Bug Reports**: [GitHub Issues](https://github.com/yourusername/fitplatform/issues)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Stripe](https://stripe.com/) for payment processing
- [Vercel](https://vercel.com/) for seamless deployment

## 📈 Roadmap

### Q3 2025
- [ ] Mobile app launch (React Native)
- [ ] Advanced AI workout recommendations
- [ ] Social features and community challenges
- [ ] Integration with more wearable devices

### Q4 2025
- [ ] Nutrition tracking and meal planning
- [ ] Video call integration for virtual training
- [ ] Corporate wellness packages
- [ ] International expansion (EU market)

### 2026
- [ ] Mental wellness integration
- [ ] Smart home device connectivity
- [ ] Advanced biometric analysis
- [ ] Marketplace for trainers and nutritionists

---

**Built with ❤️ by the FitPlatform Team**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/fitplatform)