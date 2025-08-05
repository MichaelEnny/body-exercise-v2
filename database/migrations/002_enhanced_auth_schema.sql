-- FitPlatform Database Migration 002: Enhanced Authentication Schema
-- This file adds enhanced authentication and user management tables
-- Run after 001_initial_schema.sql

-- ==============================================================================
-- ENHANCED AUTHENTICATION TABLES
-- ==============================================================================

-- User preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification preferences
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  workout_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  progress_reports BOOLEAN NOT NULL DEFAULT TRUE,
  social_updates BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_emails BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Privacy settings
  profile_visibility TEXT NOT NULL DEFAULT 'private' CHECK (profile_visibility IN ('public', 'friends', 'private')),
  workout_visibility TEXT NOT NULL DEFAULT 'private' CHECK (workout_visibility IN ('public', 'friends', 'private')),
  progress_visibility TEXT NOT NULL DEFAULT 'private' CHECK (progress_visibility IN ('public', 'friends', 'private')),
  
  -- App preferences
  measurement_units TEXT NOT NULL DEFAULT 'metric' CHECK (measurement_units IN ('metric', 'imperial')),
  timezone TEXT NOT NULL DEFAULT 'UTC',
  language TEXT NOT NULL DEFAULT 'en',
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  
  -- Fitness preferences
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  fitness_goals TEXT[] DEFAULT '{}',
  preferred_workout_types TEXT[] DEFAULT '{}',
  available_equipment TEXT[] DEFAULT '{}',
  workout_duration_preference INTEGER, -- minutes
  workouts_per_week_goal INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User session tracking (optional - for analytics and security)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  
  -- Session metadata
  ip_address INET,
  user_agent TEXT,
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  
  -- Session lifecycle
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Security flags
  is_suspicious BOOLEAN DEFAULT FALSE,
  login_method TEXT CHECK (login_method IN ('email', 'google', 'apple', 'magic_link')),
  
  UNIQUE(session_token)
);

-- Enhanced subscription management
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Subscription details
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  
  -- Subscription metadata
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete')),
  
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
  amount_cents INTEGER, -- subscription amount in cents
  currency TEXT DEFAULT 'usd',
  interval_type TEXT CHECK (interval_type IN ('month', 'year')),
  
  -- Feature limits
  workout_limit INTEGER,
  device_sync_limit INTEGER,
  client_limit INTEGER, -- for trainers
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Email verification and password reset tokens
CREATE TABLE IF NOT EXISTS auth_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Token details
  token_hash TEXT NOT NULL UNIQUE,
  token_type TEXT NOT NULL CHECK (token_type IN ('email_verification', 'password_reset', 'magic_link', 'email_change')),
  
  -- Token metadata
  email TEXT, -- for email verification/change
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  is_used BOOLEAN DEFAULT FALSE,
  
  -- Security
  ip_address INET,
  user_agent TEXT,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profile extensions
CREATE TABLE IF NOT EXISTS user_profiles_extended (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Personal information
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  phone_number TEXT,
  
  -- Location
  country TEXT,
  state_province TEXT,
  city TEXT,
  timezone TEXT DEFAULT 'UTC',
  
  -- Fitness profile
  height_cm INTEGER,
  starting_weight_kg DECIMAL(5, 2),
  current_weight_kg DECIMAL(5, 2),
  target_weight_kg DECIMAL(5, 2),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  
  -- Medical considerations
  medical_conditions TEXT[],
  medications TEXT[],
  injuries_limitations TEXT[],
  allergies TEXT[],
  
  -- Social features
  bio TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  
  -- Privacy flags
  profile_completed BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  terms_accepted_at TIMESTAMPTZ,
  privacy_policy_accepted_at TIMESTAMPTZ,
  marketing_consent BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Social connections and friendships
CREATE TABLE IF NOT EXISTS user_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  connection_type TEXT NOT NULL DEFAULT 'friend' CHECK (connection_type IN ('friend', 'trainer', 'client', 'blocked')),
  
  -- Connection metadata
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

-- User activity log for security and analytics
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Activity details
  action TEXT NOT NULL,
  resource_type TEXT, -- 'workout', 'profile', 'subscription', etc.
  resource_id TEXT,
  
  -- Request metadata
  ip_address INET,
  user_agent TEXT,
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  
  -- Additional context
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TRAINER-SPECIFIC ENHANCEMENTS
-- ==============================================================================

-- Extended trainer profiles with business information
CREATE TABLE IF NOT EXISTS trainer_business_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_profile_id UUID NOT NULL REFERENCES trainer_profiles(id) ON DELETE CASCADE,
  
  -- Business details
  business_license_number TEXT,
  tax_id TEXT,
  business_address JSONB, -- {street, city, state, country, postal_code}
  
  -- Professional credentials
  certifications_verified BOOLEAN DEFAULT FALSE,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  insurance_expiry DATE,
  
  -- Business settings
  time_zone TEXT DEFAULT 'UTC',
  business_hours JSONB, -- {monday: {open: '09:00', close: '17:00'}, ...}
  booking_settings JSONB DEFAULT '{}',
  
  -- Payment settings
  stripe_connect_account_id TEXT,
  payment_methods_enabled TEXT[] DEFAULT '{}',
  default_session_rate DECIMAL(10, 2),
  currency TEXT DEFAULT 'usd',
  
  -- Business metrics
  total_clients INTEGER DEFAULT 0,
  total_sessions_completed INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2),
  total_reviews INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trainer_profile_id)
);

-- Client invitations and onboarding
CREATE TABLE IF NOT EXISTS client_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Invitation details
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  message TEXT,
  
  -- Invitation status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Onboarding data
  client_id UUID REFERENCES users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ,
  
  -- Metadata
  invited_from TEXT, -- 'dashboard', 'mobile_app', 'api'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================

-- User preferences indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- User sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(user_id, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity);

-- User subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier ON user_subscriptions(tier);

-- Auth tokens indexes
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_id ON auth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_hash ON auth_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_type_expires ON auth_tokens(token_type, expires_at);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_unused ON auth_tokens(is_used, expires_at) WHERE is_used = FALSE;

-- User profiles extended indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_extended_user_id ON user_profiles_extended(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_extended_onboarding ON user_profiles_extended(onboarding_completed);

-- User connections indexes
CREATE INDEX IF NOT EXISTS idx_user_connections_requester ON user_connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_addressee ON user_connections(addressee_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_status ON user_connections(status);
CREATE INDEX IF NOT EXISTS idx_user_connections_type ON user_connections(connection_type);

-- User activity log indexes
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_action ON user_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_resource ON user_activity_log(resource_type, resource_id);

-- Trainer business profiles indexes
CREATE INDEX IF NOT EXISTS idx_trainer_business_profiles_trainer_id ON trainer_business_profiles(trainer_profile_id);
CREATE INDEX IF NOT EXISTS idx_trainer_business_profiles_stripe_account ON trainer_business_profiles(stripe_connect_account_id);

-- Client invitations indexes
CREATE INDEX IF NOT EXISTS idx_client_invitations_trainer_id ON client_invitations(trainer_id);
CREATE INDEX IF NOT EXISTS idx_client_invitations_email ON client_invitations(email);
CREATE INDEX IF NOT EXISTS idx_client_invitations_token ON client_invitations(token_hash);
CREATE INDEX IF NOT EXISTS idx_client_invitations_status ON client_invitations(status);
CREATE INDEX IF NOT EXISTS idx_client_invitations_expires ON client_invitations(expires_at);

-- ==============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- Enable RLS on new tables
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles_extended ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_invitations ENABLE ROW LEVEL SECURITY;

-- User preferences policies
DROP POLICY IF EXISTS "Users can manage own preferences" ON user_preferences;
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- User sessions policies
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can manage sessions" ON user_sessions;
CREATE POLICY "System can manage sessions" ON user_sessions FOR ALL USING (
  -- Allow system operations through service role
  auth.jwt() ->> 'role' = 'service_role' OR auth.uid() = user_id
);

-- User subscriptions policies
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
CREATE POLICY "Users can view own subscription" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can manage subscriptions" ON user_subscriptions;
CREATE POLICY "System can manage subscriptions" ON user_subscriptions FOR ALL USING (
  auth.jwt() ->> 'role' = 'service_role' OR auth.uid() = user_id
);

-- Auth tokens policies (system only)
DROP POLICY IF EXISTS "System can manage auth tokens" ON auth_tokens;
CREATE POLICY "System can manage auth tokens" ON auth_tokens FOR ALL USING (
  auth.jwt() ->> 'role' = 'service_role'
);

-- User profiles extended policies
DROP POLICY IF EXISTS "Users can manage own extended profile" ON user_profiles_extended;
CREATE POLICY "Users can manage own extended profile" ON user_profiles_extended FOR ALL USING (auth.uid() = user_id);

-- User connections policies
DROP POLICY IF EXISTS "Users can manage their connections" ON user_connections;
CREATE POLICY "Users can manage their connections" ON user_connections FOR ALL USING (
  auth.uid() = requester_id OR auth.uid() = addressee_id
);

-- User activity log policies
DROP POLICY IF EXISTS "Users can view own activity" ON user_activity_log;
CREATE POLICY "Users can view own activity" ON user_activity_log FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can manage activity log" ON user_activity_log;
CREATE POLICY "System can manage activity log" ON user_activity_log FOR INSERT USING (
  auth.jwt() ->> 'role' = 'service_role' OR auth.uid() = user_id
);

-- Trainer business profiles policies
DROP POLICY IF EXISTS "Trainers can manage own business profile" ON trainer_business_profiles;
CREATE POLICY "Trainers can manage own business profile" ON trainer_business_profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM trainer_profiles tp 
    WHERE tp.id = trainer_business_profiles.trainer_profile_id 
    AND tp.user_id = auth.uid()
  )
);

-- Client invitations policies
DROP POLICY IF EXISTS "Trainers can manage own invitations" ON client_invitations;
CREATE POLICY "Trainers can manage own invitations" ON client_invitations FOR ALL USING (auth.uid() = trainer_id);

DROP POLICY IF EXISTS "Invited clients can view invitations" ON client_invitations;
CREATE POLICY "Invited clients can view invitations" ON client_invitations FOR SELECT USING (
  auth.uid() = client_id OR 
  (client_id IS NULL AND status = 'pending')
);

-- ==============================================================================
-- UPDATED_AT TRIGGERS
-- ==============================================================================

-- Add triggers for new tables
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON user_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON user_sessions;
CREATE TRIGGER update_user_sessions_updated_at 
  BEFORE UPDATE ON user_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at 
  BEFORE UPDATE ON user_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_extended_updated_at ON user_profiles_extended;
CREATE TRIGGER update_user_profiles_extended_updated_at 
  BEFORE UPDATE ON user_profiles_extended 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_connections_updated_at ON user_connections;
CREATE TRIGGER update_user_connections_updated_at 
  BEFORE UPDATE ON user_connections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trainer_business_profiles_updated_at ON trainer_business_profiles;
CREATE TRIGGER update_trainer_business_profiles_updated_at 
  BEFORE UPDATE ON trainer_business_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_client_invitations_updated_at ON client_invitations;
CREATE TRIGGER update_client_invitations_updated_at 
  BEFORE UPDATE ON client_invitations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- DATABASE FUNCTIONS FOR AUTHENTICATION
-- ==============================================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create basic user profile
  INSERT INTO public.users (id, email, full_name, subscription_tier, is_trainer)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    'free',
    COALESCE((NEW.raw_user_meta_data->>'is_trainer')::boolean, false)
  );
  
  -- Create user preferences with defaults
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Create extended profile
  INSERT INTO public.user_profiles_extended (
    user_id,
    first_name,
    last_name
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Create subscription record
  INSERT INTO public.user_subscriptions (
    user_id,
    tier,
    status,
    current_period_start,
    current_period_end
  )
  VALUES (
    NEW.id,
    'free',
    'active',
    NOW(),
    NOW() + INTERVAL '1 year' -- Free tier doesn't expire
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to handle user deletion
CREATE OR REPLACE FUNCTION handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the deletion (optional)
  INSERT INTO public.user_activity_log (user_id, action, ip_address)
  VALUES (OLD.id, 'account_deleted', NULL);
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user deletion
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_delete();

-- Function to create trainer profile
CREATE OR REPLACE FUNCTION create_trainer_profile(
  user_uuid UUID,
  business_name_param TEXT DEFAULT NULL,
  bio_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  trainer_profile_id UUID;
BEGIN
  -- Update user to be a trainer
  UPDATE public.users 
  SET is_trainer = TRUE 
  WHERE id = user_uuid;
  
  -- Create trainer profile
  INSERT INTO public.trainer_profiles (user_id, business_name, bio)
  VALUES (user_uuid, business_name_param, bio_param)
  RETURNING id INTO trainer_profile_id;
  
  -- Create business profile
  INSERT INTO public.trainer_business_profiles (trainer_profile_id)
  VALUES (trainer_profile_id);
  
  -- Log the action
  INSERT INTO public.user_activity_log (user_id, action, resource_type, resource_id)
  VALUES (user_uuid, 'trainer_profile_created', 'trainer_profile', trainer_profile_id::text);
  
  RETURN trainer_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.auth_tokens 
  WHERE expires_at < NOW() OR (is_used = TRUE AND created_at < NOW() - INTERVAL '30 days');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE public.user_sessions 
  SET is_active = FALSE 
  WHERE expires_at < NOW() AND is_active = TRUE;
  
  DELETE FROM public.user_sessions 
  WHERE expires_at < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user subscription limits
CREATE OR REPLACE FUNCTION get_user_subscription_limits(user_uuid UUID)
RETURNS TABLE(
  tier TEXT,
  workout_limit INTEGER,
  device_sync_limit INTEGER,
  client_limit INTEGER,
  has_unlimited_workouts BOOLEAN,
  has_unlimited_devices BOOLEAN,
  has_unlimited_clients BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.tier,
    us.workout_limit,
    us.device_sync_limit,
    us.client_limit,
    (us.workout_limit IS NULL OR us.workout_limit = -1) as has_unlimited_workouts,
    (us.device_sync_limit IS NULL OR us.device_sync_limit = -1) as has_unlimited_devices,
    (us.client_limit IS NULL OR us.client_limit = -1) as has_unlimited_clients
  FROM public.user_subscriptions us
  WHERE us.user_id = user_uuid AND us.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- COMMENT DOCUMENTATION
-- ==============================================================================

COMMENT ON TABLE user_preferences IS 'User application preferences and settings';
COMMENT ON TABLE user_sessions IS 'Active user sessions for security and analytics';
COMMENT ON TABLE user_subscriptions IS 'Enhanced subscription management with feature limits';
COMMENT ON TABLE auth_tokens IS 'Email verification, password reset, and magic link tokens';
COMMENT ON TABLE user_profiles_extended IS 'Extended user profile information beyond basic auth';
COMMENT ON TABLE user_connections IS 'Social connections between users (friends, trainer-client relationships)';
COMMENT ON TABLE user_activity_log IS 'Security and analytics logging of user actions';
COMMENT ON TABLE trainer_business_profiles IS 'Extended business information for trainer accounts';
COMMENT ON TABLE client_invitations IS 'Trainer invitations to potential clients';

COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates user profile and related records on auth signup';
COMMENT ON FUNCTION create_trainer_profile(UUID, TEXT, TEXT) IS 'Creates trainer profile and business profile for a user';
COMMENT ON FUNCTION cleanup_expired_tokens() IS 'Maintenance function to remove expired auth tokens';
COMMENT ON FUNCTION cleanup_expired_sessions() IS 'Maintenance function to clean up expired user sessions';
COMMENT ON FUNCTION get_user_subscription_limits(UUID) IS 'Returns subscription limits and capabilities for a user';