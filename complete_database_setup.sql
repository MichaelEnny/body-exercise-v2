-- Complete FitPlatform Database Setup
-- Run this ENTIRE script in your Supabase SQL Editor

-- ==============================================================================
-- STEP 1: ENABLE REQUIRED EXTENSIONS
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- STEP 2: CREATE USERS TABLE
-- ==============================================================================

-- Drop existing table if it exists (be careful in production!)
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table that extends auth.users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' 
    CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status TEXT NOT NULL DEFAULT 'active' 
    CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  subscription_end_date TIMESTAMPTZ,
  is_trainer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- STEP 3: CREATE SUPPORTING TABLES
-- ==============================================================================

-- User preferences table
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Notification preferences
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  workout_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  progress_reports BOOLEAN NOT NULL DEFAULT TRUE,
  social_updates BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_emails BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Privacy settings
  profile_visibility TEXT NOT NULL DEFAULT 'private' 
    CHECK (profile_visibility IN ('public', 'friends', 'private')),
  workout_visibility TEXT NOT NULL DEFAULT 'private' 
    CHECK (workout_visibility IN ('public', 'friends', 'private')),
  progress_visibility TEXT NOT NULL DEFAULT 'private' 
    CHECK (progress_visibility IN ('public', 'friends', 'private')),
  
  -- App preferences
  measurement_units TEXT NOT NULL DEFAULT 'metric' 
    CHECK (measurement_units IN ('metric', 'imperial')),
  timezone TEXT NOT NULL DEFAULT 'UTC',
  language TEXT NOT NULL DEFAULT 'en',
  theme TEXT NOT NULL DEFAULT 'system' 
    CHECK (theme IN ('light', 'dark', 'system')),
  
  -- Fitness preferences
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  fitness_goals TEXT[] DEFAULT '{}',
  preferred_workout_types TEXT[] DEFAULT '{}',
  available_equipment TEXT[] DEFAULT '{}',
  workout_duration_preference INTEGER,
  workouts_per_week_goal INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- User subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Stripe integration
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  
  -- Subscription metadata
  tier TEXT NOT NULL DEFAULT 'free' 
    CHECK (tier IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'inactive', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete')),
  
  -- Billing periods
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  
  -- Subscription controls
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  
  -- Pricing
  amount_cents INTEGER,
  currency TEXT DEFAULT 'usd',
  interval_type TEXT CHECK (interval_type IN ('month', 'year')),
  
  -- Feature limits based on tier
  workout_limit INTEGER,
  device_sync_limit INTEGER,
  client_limit INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Auth tokens table (for password reset, email verification, etc.)
CREATE TABLE public.auth_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  token_type TEXT NOT NULL 
    CHECK (token_type IN ('email_verification', 'password_reset', 'magic_link', 'email_change')),
  email TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  is_used BOOLEAN DEFAULT FALSE,
  ip_address TEXT,
  user_agent TEXT,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- ==============================================================================

-- Users table indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX idx_users_is_trainer ON public.users(is_trainer);

-- User preferences indexes
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);

-- User subscriptions indexes
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe ON public.user_subscriptions(stripe_customer_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);

-- Auth tokens indexes
CREATE INDEX idx_auth_tokens_user_id ON public.auth_tokens(user_id);
CREATE INDEX idx_auth_tokens_token_hash ON public.auth_tokens(token_hash);
CREATE INDEX idx_auth_tokens_expires_at ON public.auth_tokens(expires_at);

-- ==============================================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_tokens ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- STEP 6: CREATE RLS POLICIES
-- ==============================================================================

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- User subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Auth tokens policies
CREATE POLICY "Users can manage own auth tokens" ON public.auth_tokens
  FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- STEP 7: CREATE TRIGGER FUNCTION FOR NEW USERS
-- ==============================================================================

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (id, email, full_name, avatar_url, is_trainer)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'is_trainer')::boolean, false)
  );
  
  -- Insert default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Insert default subscription (free tier)
  INSERT INTO public.user_subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If there's an error, log it but don't fail the user creation
    RAISE LOG 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- STEP 8: GRANTS AND PERMISSIONS
-- ==============================================================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant limited permissions to anonymous users (for public data)
GRANT SELECT ON public.users TO anon;

-- ==============================================================================
-- STEP 9: INSERT TEST DATA (OPTIONAL)
-- ==============================================================================

-- You can uncomment this to test the setup
-- INSERT INTO auth.users (id, email, raw_user_meta_data)
-- VALUES (
--   gen_random_uuid(),
--   'test@example.com',
--   '{"full_name": "Test User", "is_trainer": false}'::jsonb
-- );

-- ==============================================================================
-- SETUP COMPLETE!
-- ==============================================================================

-- Display success message
DO $$
BEGIN
  RAISE NOTICE 'FitPlatform database setup completed successfully!';
  RAISE NOTICE 'Tables created: users, user_preferences, user_subscriptions, auth_tokens';
  RAISE NOTICE 'RLS enabled with proper policies';
  RAISE NOTICE 'Trigger function created for automatic user profile creation';
  RAISE NOTICE 'You can now test user registration!';
END $$;