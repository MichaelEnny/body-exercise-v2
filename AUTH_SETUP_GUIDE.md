# FitPlatform Authentication Setup Guide

This guide will help you set up the complete authentication system for FitPlatform, including database schema, Row Level Security policies, and social login configuration.

## Prerequisites

- Supabase project created and configured
- Environment variables set in `.env`
- Next.js application running

## Step 1: Apply Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the content from `/database/migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the migration

### Option B: Using Supabase CLI

If you have Supabase CLI installed and configured:

```bash
# Link your project (replace with your project reference)
supabase link --project-ref mpviattxcnjfnpyyakyw

# Apply the migration
supabase db push
```

## Step 2: Configure OAuth Providers

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google Fit API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
6. Copy Client ID and Client Secret

### Apple OAuth Setup

1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a new **App ID** and **Service ID**
4. Configure **Sign in with Apple**
5. Add redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`
6. Generate and download the key file

### Configure in Supabase

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **Google** provider:
   - Client ID: Your Google OAuth Client ID
   - Client Secret: Your Google OAuth Client Secret
   - Additional Scopes: `https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read`

3. Enable **Apple** provider:
   - Client ID: Your Apple Service ID
   - Client Secret: Generated JWT from Apple key
   - Additional Scopes: (leave default)

## Step 3: Update Environment Variables

Make sure your `.env` file contains all necessary variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OAuth Configuration
GOOGLE_FIT_CLIENT_ID=your-google-client-id
GOOGLE_FIT_CLIENT_SECRET=your-google-client-secret

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates** in Supabase
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link
   - Email change confirmation

## Step 5: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click **Sign In** or **Start Free Trial**
4. Test the following flows:
   - Email/password registration
   - Email/password login
   - Google OAuth login
   - Apple OAuth login (if on macOS/iOS)

## Step 6: Verify Database Structure

After setting up authentication, verify the database structure:

1. Go to **Table Editor** in Supabase dashboard
2. Confirm all tables are created:
   - `users`
   - `trainer_profiles`
   - `workouts`
   - `workout_sessions`
   - `health_metrics`
   - `device_syncs`
   - `trainer_client_relationships`
   - `workout_plans`
   - `subscriptions`

3. Test user registration creates a profile in the `users` table
4. Verify Row Level Security policies are working

## Step 7: Configure User Roles

### For Regular Users (Default)
- `is_trainer`: false
- `subscription_tier`: 'free'
- Access to personal workouts and health data

### For Trainers
- `is_trainer`: true
- Can create `trainer_profiles`
- Can manage client relationships
- Can create public workout templates

## Security Features Implemented

✅ **Row Level Security (RLS)**: All tables have RLS enabled
✅ **Multi-tenant Architecture**: Users can only access their own data
✅ **Trainer-Client Isolation**: Proper data separation between trainers and clients
✅ **OAuth Integration**: Secure social login with Google and Apple
✅ **JWT Token Management**: Automatic token refresh and session management
✅ **PKCE Flow**: Enhanced security for OAuth flows

## API Endpoints Available

- `/auth/callback` - OAuth callback handler
- `/dashboard` - Protected dashboard page
- `/api/setup-database` - Development-only database setup (optional)

## Troubleshooting

### Common Issues

1. **OAuth Redirect Mismatch**: Ensure redirect URLs match exactly in provider settings
2. **RLS Policy Errors**: Check that policies are properly created and user is authenticated
3. **Missing User Profile**: Ensure profile creation happens after successful OAuth
4. **Token Refresh Issues**: Verify Supabase client configuration includes `autoRefreshToken: true`

### Debug Authentication

```typescript
// In any component
import { useAuthStore } from '@/stores/authStore'

const { user, userProfile, loading, initialized } = useAuthStore()
console.log('Auth State:', { user, userProfile, loading, initialized })
```

## Next Steps

Once authentication is working:

1. Implement workout management features
2. Add health data sync with third-party APIs
3. Set up Stripe subscriptions
4. Add trainer-client management
5. Implement real-time features with Supabase Realtime

## Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Verify environment variables
3. Ensure database schema is applied correctly
4. Test authentication flows step by step