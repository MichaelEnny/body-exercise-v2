-- FitPlatform Database Migration 001: Initial Schema
-- This file creates the initial database structure for FitPlatform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security on all tables
-- This will be configured after table creation

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  subscription_end_date TIMESTAMPTZ,
  is_trainer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trainer profiles
CREATE TABLE IF NOT EXISTS trainer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT,
  bio TEXT,
  certifications TEXT[] DEFAULT '{}',
  specializations TEXT[] DEFAULT '{}',
  years_experience INTEGER,
  hourly_rate DECIMAL(10, 2),
  custom_branding JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Workouts
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  exercises JSONB NOT NULL DEFAULT '[]',
  duration_minutes INTEGER,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  workout_type TEXT NOT NULL CHECK (workout_type IN ('strength', 'cardio', 'flexibility', 'sports', 'mixed')),
  tags TEXT[] DEFAULT '{}',
  is_template BOOLEAN NOT NULL DEFAULT FALSE,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_by_trainer UUID REFERENCES users(id),
  assigned_to_client UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout sessions
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  exercises_completed JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 5),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 5),
  perceived_exertion INTEGER CHECK (perceived_exertion >= 1 AND perceived_exertion <= 10),
  synced_from TEXT CHECK (synced_from IN ('apple_health', 'google_fit', 'strava', 'manual')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health metrics
CREATE TABLE IF NOT EXISTS health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight_kg DECIMAL(5, 2),
  body_fat_percentage DECIMAL(5, 2),
  muscle_mass_kg DECIMAL(5, 2),
  resting_heart_rate INTEGER,
  sleep_hours DECIMAL(4, 2),
  steps INTEGER,
  calories_consumed INTEGER,
  water_intake_ml INTEGER,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'apple_health', 'google_fit', 'strava')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Device syncs
CREATE TABLE IF NOT EXISTS device_syncs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('apple_health', 'google_fit', 'strava')),
  provider_user_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  last_sync_at TIMESTAMPTZ,
  sync_status TEXT NOT NULL DEFAULT 'active' CHECK (sync_status IN ('active', 'error', 'disconnected')),
  sync_settings JSONB NOT NULL DEFAULT '{"workouts": true, "heart_rate": true, "steps": true, "sleep": true, "nutrition": true}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Trainer-client relationships
CREATE TABLE IF NOT EXISTS trainer_client_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'ended')),
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_rate DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trainer_id, client_id)
);

-- Workout plans
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER NOT NULL,
  workouts_per_week INTEGER NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  goals TEXT[] DEFAULT '{}',
  workout_templates UUID[] DEFAULT '{}',
  is_template BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_type ON workouts(workout_type);
CREATE INDEX IF NOT EXISTS idx_workouts_difficulty ON workouts(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_workouts_public_templates ON workouts(is_public, is_template) WHERE is_public = TRUE AND is_template = TRUE;

CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_started_at ON workout_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_completed ON workout_sessions(completed_at) WHERE completed_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_health_metrics_user_date ON health_metrics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_health_metrics_date ON health_metrics(date);

CREATE INDEX IF NOT EXISTS idx_device_syncs_user_provider ON device_syncs(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_trainer_relationships_trainer ON trainer_client_relationships(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_relationships_client ON trainer_client_relationships(client_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_syncs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_client_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users can only see their own data
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Trainer profiles
DROP POLICY IF EXISTS "Trainer profiles viewable by owner" ON trainer_profiles;
CREATE POLICY "Trainer profiles viewable by owner" ON trainer_profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Trainer profiles manageable by owner" ON trainer_profiles;
CREATE POLICY "Trainer profiles manageable by owner" ON trainer_profiles FOR ALL USING (auth.uid() = user_id);

-- Workouts
DROP POLICY IF EXISTS "Users can manage own workouts" ON workouts;
CREATE POLICY "Users can manage own workouts" ON workouts FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public workout templates viewable by all" ON workouts;
CREATE POLICY "Public workout templates viewable by all" ON workouts FOR SELECT USING (is_public = TRUE AND is_template = TRUE);

DROP POLICY IF EXISTS "Assigned workouts viewable by client" ON workouts;
CREATE POLICY "Assigned workouts viewable by client" ON workouts FOR SELECT USING (auth.uid() = assigned_to_client);

-- Workout sessions
DROP POLICY IF EXISTS "Users can manage own sessions" ON workout_sessions;
CREATE POLICY "Users can manage own sessions" ON workout_sessions FOR ALL USING (auth.uid() = user_id);

-- Health metrics
DROP POLICY IF EXISTS "Users can manage own health data" ON health_metrics;
CREATE POLICY "Users can manage own health data" ON health_metrics FOR ALL USING (auth.uid() = user_id);

-- Device syncs
DROP POLICY IF EXISTS "Users can manage own device syncs" ON device_syncs;
CREATE POLICY "Users can manage own device syncs" ON device_syncs FOR ALL USING (auth.uid() = user_id);

-- Trainer-client relationships
DROP POLICY IF EXISTS "Trainers can manage client relationships" ON trainer_client_relationships;
CREATE POLICY "Trainers can manage client relationships" ON trainer_client_relationships FOR ALL USING (auth.uid() = trainer_id);

DROP POLICY IF EXISTS "Clients can view their trainer relationships" ON trainer_client_relationships;
CREATE POLICY "Clients can view their trainer relationships" ON trainer_client_relationships FOR SELECT USING (auth.uid() = client_id);

-- Workout plans
DROP POLICY IF EXISTS "Trainers can manage workout plans" ON workout_plans;
CREATE POLICY "Trainers can manage workout plans" ON workout_plans FOR ALL USING (auth.uid() = trainer_id);

DROP POLICY IF EXISTS "Clients can view assigned plans" ON workout_plans;
CREATE POLICY "Clients can view assigned plans" ON workout_plans FOR SELECT USING (auth.uid() = client_id);

-- Subscriptions
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers (DROP IF EXISTS to avoid errors on re-run)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trainer_profiles_updated_at ON trainer_profiles;
CREATE TRIGGER update_trainer_profiles_updated_at BEFORE UPDATE ON trainer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workouts_updated_at ON workouts;
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_device_syncs_updated_at ON device_syncs;
CREATE TRIGGER update_device_syncs_updated_at BEFORE UPDATE ON device_syncs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trainer_client_relationships_updated_at ON trainer_client_relationships;
CREATE TRIGGER update_trainer_client_relationships_updated_at BEFORE UPDATE ON trainer_client_relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workout_plans_updated_at ON workout_plans;
CREATE TRIGGER update_workout_plans_updated_at BEFORE UPDATE ON workout_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();