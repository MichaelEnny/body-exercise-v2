# FitPlatform Enhanced Authentication Database Setup Guide

This guide walks you through setting up the enhanced authentication database schema for FitPlatform with Supabase.

## Overview

The enhanced authentication system includes:

- **Core Authentication**: Extended user profiles, preferences, and settings
- **Subscription Management**: Multi-tier subscription system with feature limits
- **Session Tracking**: User session management and security monitoring
- **Trainer Features**: Business profiles, client management, and invitations
- **Social Features**: User connections and activity logging
- **Security**: Token management, activity logging, and audit trails

## Prerequisites

1. **Supabase Project**: You need an active Supabase project
2. **Environment Variables**: Proper environment configuration
3. **Database Access**: Service role key for migrations
4. **Node.js**: For running migration scripts

## Environment Setup

Ensure your `.env.local` file contains:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Configuration (for subscriptions)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Migration Steps

### Step 1: Run Initial Schema Migration

This creates the basic workout and fitness tracking tables:

```bash
# Connect to your Supabase project
supabase link --project-ref your-project-ref

# Apply the initial schema
supabase db push --file database/migrations/001_initial_schema.sql
```

### Step 2: Apply Enhanced Authentication Schema

This adds the advanced authentication tables and features:

```bash
# Apply enhanced authentication tables
supabase db push --file database/migrations/002_enhanced_auth_schema.sql
```

### Step 3: Set Up Subscription Limits

This configures subscription tiers and business logic:

```bash
# Apply subscription management setup
supabase db push --file database/migrations/003_subscription_limits_setup.sql
```

### Step 4: Verify Database Setup

Check that all tables and functions were created:

```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

### Step 5: Seed Development Data (Optional)

Run the seeding script to populate with sample data:

```bash
# Install dependencies
npm install

# Run authentication seeding
npx ts-node scripts/seed-auth.ts
```

## Database Schema Overview

### Core Tables

#### Enhanced User Management
- **`users`**: Basic user information (extends Supabase auth.users)
- **`user_preferences`**: App preferences and notification settings
- **`user_profiles_extended`**: Detailed profile information
- **`user_subscriptions`**: Subscription management with feature limits
- **`user_sessions`**: Session tracking for security and analytics
- **`user_connections`**: Social connections between users

#### Authentication & Security
- **`auth_tokens`**: Email verification, password reset tokens
- **`user_activity_log`**: Security and analytics logging

#### Trainer Features
- **`trainer_profiles`**: Basic trainer information
- **`trainer_business_profiles`**: Extended business information
- **`client_invitations`**: Trainer-to-client invitation system
- **`trainer_client_relationships`**: Trainer-client connections

#### Core Fitness Features (from initial schema)
- **`workouts`**: Workout templates and user workouts
- **`workout_sessions`**: Completed workout tracking
- **`workout_plans`**: Trainer-created workout programs
- **`health_metrics`**: Health and fitness data
- **`device_syncs`**: Third-party device integrations

### Key Database Functions

#### User Management
- `handle_new_user()`: Automatically creates profile on signup
- `create_trainer_profile()`: Sets up trainer account
- `get_user_subscription_limits()`: Returns subscription capabilities

#### Subscription Management
- `upgrade_user_subscription()`: Handles subscription upgrades
- `cancel_user_subscription()`: Manages subscription cancellation
- `check_subscription_limit()`: Enforces feature limits
- `handle_subscription_renewal()`: Processes renewals
- `handle_subscription_expiry()`: Handles expired subscriptions

#### Maintenance
- `cleanup_expired_tokens()`: Removes old auth tokens
- `cleanup_expired_sessions()`: Cleans up expired sessions

## Subscription Tiers

### Free Tier
- **Workouts**: 3 custom workouts
- **Device Syncs**: 1 device connection
- **Clients**: 0 (not a trainer feature)
- **Price**: Free

### Pro Tier ($9.99/month)
- **Workouts**: Unlimited
- **Device Syncs**: Unlimited  
- **Clients**: 5 (for trainers)
- **Advanced analytics and features**

### Enterprise Tier ($29.99/month)
- **Workouts**: Unlimited
- **Device Syncs**: Unlimited
- **Clients**: Unlimited
- **Custom branding, API access, priority support**

## Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:

- **Users** can only access their own data
- **Trainers** can manage their clients and business data
- **Clients** can view data shared by their trainers
- **System functions** can operate with service role permissions

## Security Features

### Authentication Tokens
- Email verification tokens
- Password reset tokens  
- Magic link authentication
- Email change verification

### Session Management
- Active session tracking
- Device and location logging
- Suspicious activity detection
- Automatic session cleanup

### Activity Logging
- All user actions logged
- IP address and device tracking
- Resource-specific activity tracking
- Audit trail for compliance

## API Integration

### Authentication Helpers

```typescript
import { 
  getCompleteUserProfile,
  updateUserPreferences,
  getUserSubscription,
  checkFeatureLimit
} from '@/lib/auth-helpers'

// Get complete user profile
const profile = await getCompleteUserProfile(userId)

// Check subscription limits
const canCreateWorkout = await checkFeatureLimit(userId, 'workouts')
```

### Subscription Management

```typescript
import { 
  upgradeUserSubscription,
  cancelUserSubscription 
} from '@/lib/auth-helpers'

// Upgrade user to Pro tier
await upgradeUserSubscription(userId, 'pro', stripeSubscriptionId)

// Cancel subscription at period end
await cancelUserSubscription(userId, false)
```

## Maintenance Tasks

### Scheduled Cleanup (recommended daily)

```sql
-- Clean expired tokens
SELECT cleanup_expired_tokens();

-- Clean expired sessions  
SELECT cleanup_expired_sessions();
```

### Monitoring Queries

```sql
-- Active user sessions
SELECT COUNT(*) FROM user_sessions WHERE is_active = true;

-- Subscription distribution
SELECT tier, COUNT(*) FROM user_subscriptions GROUP BY tier;

-- Recent user activity
SELECT action, COUNT(*) FROM user_activity_log 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY action ORDER BY count DESC;
```

## Error Handling

Common issues and solutions:

### Migration Errors
- **RLS Policy Conflicts**: Drop existing policies before reapplying
- **Function Dependencies**: Apply migrations in order
- **Permission Issues**: Ensure service role key is correct

### Runtime Errors
- **Subscription Limits**: Check user tier and limits before operations
- **Token Expiry**: Implement proper token refresh logic
- **Session Issues**: Verify middleware configuration

## Performance Optimization

### Recommended Indexes
All necessary indexes are created by the migrations, including:

- User-specific data queries
- Subscription tier filtering
- Activity log searches
- Session management
- Token lookups

### Query Optimization
- Use specific selections rather than `SELECT *`
- Implement pagination for large datasets
- Cache subscription limits in application layer
- Use database functions for complex operations

## Testing

### Database Testing
```bash
# Test database functions
SELECT get_tier_defaults('pro');
SELECT get_user_subscription_limits('user-uuid-here');

# Test cleanup functions
SELECT cleanup_expired_tokens();
SELECT cleanup_expired_sessions();
```

### Integration Testing
- Test user signup flow
- Verify subscription upgrades/downgrades
- Test trainer-client relationships
- Validate feature limit enforcement

## Support and Documentation

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Database Schema**: See `database/schema.sql` for complete reference
- **Type Definitions**: See `src/types/index.ts` and `src/lib/database.types.ts`
- **Helper Functions**: See `src/lib/auth-helpers.ts`

## Next Steps

After database setup:

1. **Configure Stripe Webhooks** for subscription management
2. **Set up Email Templates** for authentication flows
3. **Implement Frontend Components** using the database types
4. **Configure Monitoring** for production deployment
5. **Set up Backup Strategy** for data protection

The enhanced authentication system provides a solid foundation for a scalable fitness platform with multi-tier subscriptions and comprehensive user management.