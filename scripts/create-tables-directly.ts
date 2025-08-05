import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTablesDirectly() {
  console.log('🚀 Creating FitPlatform Database Tables Directly...\n')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)

  try {
    // Step 1: Enable UUID extension
    console.log('1️⃣ Enabling UUID extension...')
    const { error: uuidError } = await supabase.rpc('exec', {
      sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    })
    
    if (uuidError) {
      console.log(`⚠️ UUID extension: ${uuidError.message}`)
    } else {
      console.log('✅ UUID extension enabled')
    }

    // Step 2: Create users table
    console.log('\n2️⃣ Creating users table...')
    const usersTableSQL = `
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
    `

    const { error: usersError } = await supabase.rpc('exec', { sql: usersTableSQL })
    
    if (usersError) {
      console.log(`❌ Users table error: ${usersError.message}`)
    } else {
      console.log('✅ Users table created')
    }

    // Step 3: Create trainer_profiles table
    console.log('\n3️⃣ Creating trainer_profiles table...')
    const trainerProfilesSQL = `
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
    `

    const { error: trainerError } = await supabase.rpc('exec', { sql: trainerProfilesSQL })
    
    if (trainerError) {
      console.log(`❌ Trainer profiles error: ${trainerError.message}`)
    } else {
      console.log('✅ Trainer profiles table created')
    }

    // Step 4: Create workouts table
    console.log('\n4️⃣ Creating workouts table...')
    const workoutsSQL = `
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
    `

    const { error: workoutsError } = await supabase.rpc('exec', { sql: workoutsSQL })
    
    if (workoutsError) {
      console.log(`❌ Workouts table error: ${workoutsError.message}`)
    } else {
      console.log('✅ Workouts table created')
    }

    // Step 5: Create workout_sessions table
    console.log('\n5️⃣ Creating workout_sessions table...')
    const workoutSessionsSQL = `
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
    `

    const { error: sessionsError } = await supabase.rpc('exec', { sql: workoutSessionsSQL })
    
    if (sessionsError) {
      console.log(`❌ Workout sessions error: ${sessionsError.message}`)
    } else {
      console.log('✅ Workout sessions table created')
    }

    // Step 6: Create remaining tables (health_metrics, device_syncs, etc.)
    console.log('\n6️⃣ Creating remaining tables...')
    
    const remainingTablesSQL = `
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

      CREATE TABLE IF NOT EXISTS device_syncs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        provider TEXT NOT NULL CHECK (provider IN ('apple_health', 'google_fit', 'strava')),
        provider_user_id TEXT NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        expires_at TIMESTAMPTZ,
        last_sync_at TIMESTAMPTZ,
        sync_status TEXT NOT NULL DEFAULT 'active' CHECK (sync_status IN ('active', 'paused', 'error', 'disconnected')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, provider)
      );

      CREATE TABLE IF NOT EXISTS trainer_client_relationships (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'terminated')),
        started_at TIMESTAMPTZ DEFAULT NOW(),
        ended_at TIMESTAMPTZ,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(trainer_id, client_id)
      );

      CREATE TABLE IF NOT EXISTS workout_plans (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        client_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        duration_weeks INTEGER NOT NULL,
        workouts_per_week INTEGER NOT NULL,
        workout_ids UUID[] NOT NULL DEFAULT '{}',
        start_date DATE,
        end_date DATE,
        status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        stripe_customer_id TEXT UNIQUE,
        stripe_subscription_id TEXT UNIQUE,
        tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'enterprise')),
        status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'unpaid')),
        current_period_start TIMESTAMPTZ,
        current_period_end TIMESTAMPTZ,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `

    const { error: remainingError } = await supabase.rpc('exec', { sql: remainingTablesSQL })
    
    if (remainingError) {
      console.log(`❌ Remaining tables error: ${remainingError.message}`)
    } else {
      console.log('✅ All remaining tables created')
    }

    // Step 7: Enable RLS on all tables
    console.log('\n7️⃣ Enabling Row Level Security...')
    const rlsSQL = `
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE trainer_profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
      ALTER TABLE device_syncs ENABLE ROW LEVEL SECURITY;
      ALTER TABLE trainer_client_relationships ENABLE ROW LEVEL SECURITY;
      ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
      ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
    `

    const { error: rlsError } = await supabase.rpc('exec', { sql: rlsSQL })
    
    if (rlsError) {
      console.log(`❌ RLS error: ${rlsError.message}`)
    } else {
      console.log('✅ Row Level Security enabled on all tables')
    }

    // Step 8: Verify tables exist
    console.log('\n8️⃣ Verifying table creation...')
    const expectedTables = [
      'users', 'trainer_profiles', 'workouts', 'workout_sessions',
      'health_metrics', 'device_syncs', 'trainer_client_relationships',
      'workout_plans', 'subscriptions'
    ]

    for (const tableName of expectedTables) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
          .limit(1)
        
        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`)
        } else {
          console.log(`✅ ${tableName}: verified (${count || 0} rows)`)
        }
      } catch (err: any) {
        console.log(`❌ ${tableName}: ${err.message}`)
      }
    }

    console.log('\n🎉 Database setup complete!')

  } catch (error: any) {
    console.error('💥 Table creation failed:', error.message)
  }
}

// Run table creation
createTablesDirectly().then(() => {
  console.log('\n🏁 Table creation process complete')
  process.exit(0)
}).catch((error) => {
  console.error('💥 Process failed:', error.message)
  process.exit(1)
})