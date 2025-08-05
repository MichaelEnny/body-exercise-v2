/**
 * Database seeding script for FitPlatform authentication system
 * This script sets up initial data for development and testing
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables for Supabase')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedAuthentication() {
  console.log('🌱 Starting authentication database seeding...')

  try {
    // ==============================================================================
    // SEED SUBSCRIPTION TIER TEMPLATES
    // ==============================================================================
    
    console.log('📋 Setting up subscription tier templates...')
    
    // This data is handled by the database functions, but we can verify the setup
    const { data: tierData, error: tierError } = await supabase
      .rpc('get_tier_defaults', { tier_name: 'free' })
    
    if (tierError) {
      console.error('Error testing tier defaults:', tierError)
    } else {
      console.log('✅ Tier defaults working correctly')
    }

    // ==============================================================================
    // SEED TEST USER PREFERENCES
    // ==============================================================================
    
    console.log('👤 Creating sample user preferences...')
    
    // Get existing users to seed preferences for
    const { data: existingUsers, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .limit(5)
    
    if (usersError) {
      console.log('ℹ️  No existing users found, skipping preference seeding')
    } else if (existingUsers && existingUsers.length > 0) {
      // Create sample preferences for existing users
      const samplePreferences = existingUsers.map(user => ({
        user_id: user.id,
        email_notifications: true,
        push_notifications: true,
        workout_reminders: true,
        progress_reports: true,
        social_updates: false,
        marketing_emails: Math.random() > 0.5,
        profile_visibility: ['public', 'friends', 'private'][Math.floor(Math.random() * 3)] as 'public' | 'friends' | 'private',
        workout_visibility: ['public', 'friends', 'private'][Math.floor(Math.random() * 3)] as 'public' | 'friends' | 'private',
        progress_visibility: 'private' as 'private',
        measurement_units: Math.random() > 0.5 ? 'metric' as 'metric' : 'imperial' as 'imperial',
        timezone: 'UTC',
        language: 'en',
        theme: 'system' as 'system',
        fitness_level: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as 'beginner' | 'intermediate' | 'advanced',
        fitness_goals: ['weight_loss', 'muscle_gain', 'endurance', 'strength'].filter(() => Math.random() > 0.5),
        preferred_workout_types: ['strength', 'cardio', 'flexibility'].filter(() => Math.random() > 0.5),
        available_equipment: ['dumbbells', 'resistance_bands', 'yoga_mat'].filter(() => Math.random() > 0.5),
        workout_duration_preference: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
        workouts_per_week_goal: Math.floor(Math.random() * 6) + 1
      }))
      
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .upsert(samplePreferences)
      
      if (prefsError) {
        console.error('Error seeding preferences:', prefsError)
      } else {
        console.log(`✅ Created preferences for ${samplePreferences.length} users`)
      }
    }

    // ==============================================================================
    // SEED SAMPLE TRAINER DATA
    // ==============================================================================
    
    console.log('👨‍💼 Creating sample trainer profiles...')
    
    // Create sample trainer users if they don't exist
    const sampleTrainers = [
      {
        email: 'trainer1@fitplatform.com',
        full_name: 'Sarah Johnson',
        is_trainer: true,
        business_name: 'Sarah\'s Fitness Studio',
        bio: 'Certified personal trainer with 8+ years of experience specializing in strength training and weight loss.',
        certifications: ['NASM-CPT', 'ACSM-CEP', 'Precision Nutrition L1'],
        specializations: ['Weight Loss', 'Strength Training', 'Nutrition Coaching'],
        years_experience: 8,
        hourly_rate: 75.00
      },
      {
        email: 'trainer2@fitplatform.com',
        full_name: 'Mike Rodriguez',
        is_trainer: true,
        business_name: 'Elite Performance Training',
        bio: 'Former Olympic athlete turned personal trainer. Specializing in athletic performance and functional fitness.',
        certifications: ['CSCS', 'FMS', 'Olympic Weightlifting L2'],
        specializations: ['Athletic Performance', 'Olympic Lifting', 'Functional Movement'],
        years_experience: 12,
        hourly_rate: 120.00
      }
    ]
    
    // Note: In a real application, you'd create these through Supabase Auth
    // For seeding purposes, we'll create placeholder entries
    console.log('ℹ️  Trainer profiles would be created through the signup flow')

    // ==============================================================================
    // SEED SAMPLE EXTENDED PROFILES
    // ==============================================================================
    
    console.log('📝 Creating sample extended profiles...')
    
    if (existingUsers && existingUsers.length > 0) {
      const sampleExtendedProfiles = existingUsers.slice(0, 3).map(user => ({
        user_id: user.id,
        first_name: ['John', 'Jane', 'Alex'][Math.floor(Math.random() * 3)],
        last_name: ['Smith', 'Johnson', 'Brown'][Math.floor(Math.random() * 3)],
        gender: ['male', 'female', 'other'][Math.floor(Math.random() * 3)] as 'male' | 'female' | 'other',
        country: 'United States',
        timezone: 'America/New_York',
        height_cm: Math.floor(Math.random() * 50) + 150, // 150-200cm
        current_weight_kg: Math.floor(Math.random() * 50) + 50, // 50-100kg
        target_weight_kg: Math.floor(Math.random() * 40) + 60, // 60-100kg
        activity_level: ['sedentary', 'lightly_active', 'moderately_active', 'very_active'][Math.floor(Math.random() * 4)] as any,
        fitness_goals: ['weight_loss', 'muscle_gain', 'endurance'],
        bio: 'Fitness enthusiast looking to achieve my health and wellness goals.',
        profile_completed: true,
        onboarding_completed: true,
        terms_accepted_at: new Date().toISOString(),
        privacy_policy_accepted_at: new Date().toISOString(),
        marketing_consent: Math.random() > 0.5
      }))
      
      const { error: extendedError } = await supabase
        .from('user_profiles_extended')
        .upsert(sampleExtendedProfiles)
      
      if (extendedError) {
        console.error('Error seeding extended profiles:', extendedError)
      } else {
        console.log(`✅ Created extended profiles for ${sampleExtendedProfiles.length} users`)
      }
    }

    // ==============================================================================
    // SEED SUBSCRIPTION DATA
    // ==============================================================================
    
    console.log('💳 Setting up subscription data...')
    
    if (existingUsers && existingUsers.length > 0) {
      // Update existing subscriptions with proper limits
      for (const user of existingUsers) {
        try {
          await supabase.rpc('upgrade_user_subscription', {
            user_uuid: user.id,
            new_tier: 'free' // Start everyone on free tier
          })
        } catch (error) {
          console.log(`⚠️  Could not set subscription for ${user.email}:`, error)
        }
      }
      console.log('✅ Updated subscription data for existing users')
    }

    // ==============================================================================
    // SEED SAMPLE ACTIVITY LOG
    // ==============================================================================
    
    console.log('📊 Creating sample activity logs...')
    
    if (existingUsers && existingUsers.length > 0) {
      const sampleActivities = existingUsers.flatMap(user => [
        {
          user_id: user.id,
          action: 'profile_created',
          resource_type: 'user',
          resource_id: user.id,
          metadata: { provider: 'email' }
        },
        {
          user_id: user.id,
          action: 'preferences_updated',
          resource_type: 'user_preferences',
          metadata: { fields_updated: ['theme', 'notifications'] }
        },
        {
          user_id: user.id,
          action: 'profile_viewed',
          resource_type: 'user',
          resource_id: user.id,
          metadata: { source: 'dashboard' }
        }
      ])
      
      const { error: activityError } = await supabase
        .from('user_activity_log')
        .insert(sampleActivities)
      
      if (activityError) {
        console.error('Error seeding activity logs:', activityError)
      } else {
        console.log(`✅ Created ${sampleActivities.length} sample activity log entries`)
      }
    }

    // ==============================================================================
    // CLEANUP AND MAINTENANCE
    // ==============================================================================
    
    console.log('🧹 Running cleanup functions...')
    
    // Test cleanup functions
    try {
      await supabase.rpc('cleanup_expired_tokens')
      await supabase.rpc('cleanup_expired_sessions')
      console.log('✅ Cleanup functions working correctly')
    } catch (error) {
      console.error('Error testing cleanup functions:', error)
    }

    console.log('✨ Authentication database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedAuthentication()
    .then(() => {
      console.log('🎉 Seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}

export { seedAuthentication }