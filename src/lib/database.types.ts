export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean
          push_notifications: boolean
          workout_reminders: boolean
          progress_reports: boolean
          social_updates: boolean
          marketing_emails: boolean
          profile_visibility: 'public' | 'friends' | 'private'
          workout_visibility: 'public' | 'friends' | 'private'
          progress_visibility: 'public' | 'friends' | 'private'
          measurement_units: 'metric' | 'imperial'
          timezone: string
          language: string
          theme: 'light' | 'dark' | 'system'
          fitness_level: 'beginner' | 'intermediate' | 'advanced' | null
          fitness_goals: string[]
          preferred_workout_types: string[]
          available_equipment: string[]
          workout_duration_preference: number | null
          workouts_per_week_goal: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean
          push_notifications?: boolean
          workout_reminders?: boolean
          progress_reports?: boolean
          social_updates?: boolean
          marketing_emails?: boolean
          profile_visibility?: 'public' | 'friends' | 'private'
          workout_visibility?: 'public' | 'friends' | 'private'
          progress_visibility?: 'public' | 'friends' | 'private'
          measurement_units?: 'metric' | 'imperial'
          timezone?: string
          language?: string
          theme?: 'light' | 'dark' | 'system'
          fitness_level?: 'beginner' | 'intermediate' | 'advanced' | null
          fitness_goals?: string[]
          preferred_workout_types?: string[]
          available_equipment?: string[]
          workout_duration_preference?: number | null
          workouts_per_week_goal?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean
          push_notifications?: boolean
          workout_reminders?: boolean
          progress_reports?: boolean
          social_updates?: boolean
          marketing_emails?: boolean
          profile_visibility?: 'public' | 'friends' | 'private'
          workout_visibility?: 'public' | 'friends' | 'private'
          progress_visibility?: 'public' | 'friends' | 'private'
          measurement_units?: 'metric' | 'imperial'
          timezone?: string
          language?: string
          theme?: 'light' | 'dark' | 'system'
          fitness_level?: 'beginner' | 'intermediate' | 'advanced' | null
          fitness_goals?: string[]
          preferred_workout_types?: string[]
          available_equipment?: string[]
          workout_duration_preference?: number | null
          workouts_per_week_goal?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          ip_address: string | null
          user_agent: string | null
          device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown' | null
          browser: string | null
          os: string | null
          country: string | null
          city: string | null
          created_at: string
          last_activity: string
          expires_at: string
          is_active: boolean
          is_suspicious: boolean | null
          login_method: 'email' | 'google' | 'apple' | 'magic_link' | null
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          ip_address?: string | null
          user_agent?: string | null
          device_type?: 'mobile' | 'tablet' | 'desktop' | 'unknown' | null
          browser?: string | null
          os?: string | null
          country?: string | null
          city?: string | null
          created_at?: string
          last_activity?: string
          expires_at: string
          is_active?: boolean
          is_suspicious?: boolean | null
          login_method?: 'email' | 'google' | 'apple' | 'magic_link' | null
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          ip_address?: string | null
          user_agent?: string | null
          device_type?: 'mobile' | 'tablet' | 'desktop' | 'unknown' | null
          browser?: string | null
          os?: string | null
          country?: string | null
          city?: string | null
          created_at?: string
          last_activity?: string
          expires_at?: string
          is_active?: boolean
          is_suspicious?: boolean | null
          login_method?: 'email' | 'google' | 'apple' | 'magic_link' | null
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          tier: 'free' | 'pro' | 'enterprise'
          status: 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete'
          trial_start: string | null
          trial_end: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          canceled_at: string | null
          ended_at: string | null
          amount_cents: number | null
          currency: string | null
          interval_type: 'month' | 'year' | null
          workout_limit: number | null
          device_sync_limit: number | null
          client_limit: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          tier?: 'free' | 'pro' | 'enterprise'
          status?: 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete'
          trial_start?: string | null
          trial_end?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          ended_at?: string | null
          amount_cents?: number | null
          currency?: string | null
          interval_type?: 'month' | 'year' | null
          workout_limit?: number | null
          device_sync_limit?: number | null
          client_limit?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          tier?: 'free' | 'pro' | 'enterprise'
          status?: 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete'
          trial_start?: string | null
          trial_end?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          ended_at?: string | null
          amount_cents?: number | null
          currency?: string | null
          interval_type?: 'month' | 'year' | null
          workout_limit?: number | null
          device_sync_limit?: number | null
          client_limit?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      auth_tokens: {
        Row: {
          id: string
          user_id: string
          token_hash: string
          token_type: 'email_verification' | 'password_reset' | 'magic_link' | 'email_change'
          email: string | null
          expires_at: string
          used_at: string | null
          is_used: boolean | null
          ip_address: string | null
          user_agent: string | null
          attempts: number | null
          max_attempts: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token_hash: string
          token_type: 'email_verification' | 'password_reset' | 'magic_link' | 'email_change'
          email?: string | null
          expires_at: string
          used_at?: string | null
          is_used?: boolean | null
          ip_address?: string | null
          user_agent?: string | null
          attempts?: number | null
          max_attempts?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token_hash?: string
          token_type?: 'email_verification' | 'password_reset' | 'magic_link' | 'email_change'
          email?: string | null
          expires_at?: string
          used_at?: string | null
          is_used?: boolean | null
          ip_address?: string | null
          user_agent?: string | null
          attempts?: number | null
          max_attempts?: number | null
          created_at?: string
        }
      }
      user_profiles_extended: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          phone_number: string | null
          country: string | null
          state_province: string | null
          city: string | null
          timezone: string | null
          height_cm: number | null
          starting_weight_kg: number | null
          current_weight_kg: number | null
          target_weight_kg: number | null
          activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null
          medical_conditions: string[] | null
          medications: string[] | null
          injuries_limitations: string[] | null
          allergies: string[] | null
          bio: string | null
          website_url: string | null
          social_links: Json | null
          profile_completed: boolean | null
          onboarding_completed: boolean | null
          terms_accepted_at: string | null
          privacy_policy_accepted_at: string | null
          marketing_consent: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name?: string | null
          last_name?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          phone_number?: string | null
          country?: string | null
          state_province?: string | null
          city?: string | null
          timezone?: string | null
          height_cm?: number | null
          starting_weight_kg?: number | null
          current_weight_kg?: number | null
          target_weight_kg?: number | null
          activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          injuries_limitations?: string[] | null
          allergies?: string[] | null
          bio?: string | null
          website_url?: string | null
          social_links?: Json | null
          profile_completed?: boolean | null
          onboarding_completed?: boolean | null
          terms_accepted_at?: string | null
          privacy_policy_accepted_at?: string | null
          marketing_consent?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          phone_number?: string | null
          country?: string | null
          state_province?: string | null
          city?: string | null
          timezone?: string | null
          height_cm?: number | null
          starting_weight_kg?: number | null
          current_weight_kg?: number | null
          target_weight_kg?: number | null
          activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          injuries_limitations?: string[] | null
          allergies?: string[] | null
          bio?: string | null
          website_url?: string | null
          social_links?: Json | null
          profile_completed?: boolean | null
          onboarding_completed?: boolean | null
          terms_accepted_at?: string | null
          privacy_policy_accepted_at?: string | null
          marketing_consent?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      user_connections: {
        Row: {
          id: string
          requester_id: string
          addressee_id: string
          status: 'pending' | 'accepted' | 'declined' | 'blocked'
          connection_type: 'friend' | 'trainer' | 'client' | 'blocked'
          requested_at: string
          responded_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          addressee_id: string
          status?: 'pending' | 'accepted' | 'declined' | 'blocked'
          connection_type?: 'friend' | 'trainer' | 'client' | 'blocked'
          requested_at?: string
          responded_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          addressee_id?: string
          status?: 'pending' | 'accepted' | 'declined' | 'blocked'
          connection_type?: 'friend' | 'trainer' | 'client' | 'blocked'
          requested_at?: string
          responded_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_activity_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string | null
          resource_id: string | null
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource_type?: string | null
          resource_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource_type?: string | null
          resource_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      trainer_business_profiles: {
        Row: {
          id: string
          trainer_profile_id: string
          business_license_number: string | null
          tax_id: string | null
          business_address: Json | null
          certifications_verified: boolean | null
          insurance_provider: string | null
          insurance_policy_number: string | null
          insurance_expiry: string | null
          time_zone: string | null
          business_hours: Json | null
          booking_settings: Json | null
          stripe_connect_account_id: string | null
          payment_methods_enabled: string[] | null
          default_session_rate: number | null
          currency: string | null
          total_clients: number | null
          total_sessions_completed: number | null
          average_rating: number | null
          total_reviews: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_profile_id: string
          business_license_number?: string | null
          tax_id?: string | null
          business_address?: Json | null
          certifications_verified?: boolean | null
          insurance_provider?: string | null
          insurance_policy_number?: string | null
          insurance_expiry?: string | null
          time_zone?: string | null
          business_hours?: Json | null
          booking_settings?: Json | null
          stripe_connect_account_id?: string | null
          payment_methods_enabled?: string[] | null
          default_session_rate?: number | null
          currency?: string | null
          total_clients?: number | null
          total_sessions_completed?: number | null
          average_rating?: number | null
          total_reviews?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_profile_id?: string
          business_license_number?: string | null
          tax_id?: string | null
          business_address?: Json | null
          certifications_verified?: boolean | null
          insurance_provider?: string | null
          insurance_policy_number?: string | null
          insurance_expiry?: string | null
          time_zone?: string | null
          business_hours?: Json | null
          booking_settings?: Json | null
          stripe_connect_account_id?: string | null
          payment_methods_enabled?: string[] | null
          default_session_rate?: number | null
          currency?: string | null
          total_clients?: number | null
          total_sessions_completed?: number | null
          average_rating?: number | null
          total_reviews?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      client_invitations: {
        Row: {
          id: string
          trainer_id: string
          email: string
          first_name: string | null
          last_name: string | null
          message: string | null
          status: 'pending' | 'accepted' | 'declined' | 'expired'
          token_hash: string
          expires_at: string
          client_id: string | null
          accepted_at: string | null
          invited_from: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          message?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'expired'
          token_hash: string
          expires_at: string
          client_id?: string | null
          accepted_at?: string | null
          invited_from?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          message?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'expired'
          token_hash?: string
          expires_at?: string
          client_id?: string | null
          accepted_at?: string | null
          invited_from?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'pro' | 'enterprise'
          subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing'
          subscription_end_date: string | null
          is_trainer: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          subscription_end_date?: string | null
          is_trainer?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          subscription_end_date?: string | null
          is_trainer?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      trainer_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string | null
          bio: string | null
          certifications: string[]
          specializations: string[]
          years_experience: number | null
          hourly_rate: number | null
          custom_branding: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name?: string | null
          bio?: string | null
          certifications?: string[]
          specializations?: string[]
          years_experience?: number | null
          hourly_rate?: number | null
          custom_branding?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string | null
          bio?: string | null
          certifications?: string[]
          specializations?: string[]
          years_experience?: number | null
          hourly_rate?: number | null
          custom_branding?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          exercises: Json[]
          duration_minutes: number | null
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          workout_type: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'mixed'
          tags: string[]
          is_template: boolean
          is_public: boolean
          created_by_trainer: string | null
          assigned_to_client: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          exercises?: Json[]
          duration_minutes?: number | null
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          workout_type: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'mixed'
          tags?: string[]
          is_template?: boolean
          is_public?: boolean
          created_by_trainer?: string | null
          assigned_to_client?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          exercises?: Json[]
          duration_minutes?: number | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          workout_type?: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'mixed'
          tags?: string[]
          is_template?: boolean
          is_public?: boolean
          created_by_trainer?: string | null
          assigned_to_client?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_sessions: {
        Row: {
          id: string
          user_id: string
          workout_id: string
          started_at: string
          completed_at: string | null
          duration_minutes: number | null
          calories_burned: number | null
          exercises_completed: Json[]
          notes: string | null
          mood_before: number | null
          mood_after: number | null
          perceived_exertion: number | null
          synced_from: 'apple_health' | 'google_fit' | 'strava' | 'manual' | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_id: string
          started_at?: string
          completed_at?: string | null
          duration_minutes?: number | null
          calories_burned?: number | null
          exercises_completed?: Json[]
          notes?: string | null
          mood_before?: number | null
          mood_after?: number | null
          perceived_exertion?: number | null
          synced_from?: 'apple_health' | 'google_fit' | 'strava' | 'manual' | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_id?: string
          started_at?: string
          completed_at?: string | null
          duration_minutes?: number | null
          calories_burned?: number | null
          exercises_completed?: Json[]
          notes?: string | null
          mood_before?: number | null
          mood_after?: number | null
          perceived_exertion?: number | null
          synced_from?: 'apple_health' | 'google_fit' | 'strava' | 'manual' | null
          created_at?: string
        }
      }
      health_metrics: {
        Row: {
          id: string
          user_id: string
          date: string
          weight_kg: number | null
          body_fat_percentage: number | null
          muscle_mass_kg: number | null
          resting_heart_rate: number | null
          sleep_hours: number | null
          steps: number | null
          calories_consumed: number | null
          water_intake_ml: number | null
          source: 'manual' | 'apple_health' | 'google_fit' | 'strava'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          weight_kg?: number | null
          body_fat_percentage?: number | null
          muscle_mass_kg?: number | null
          resting_heart_rate?: number | null
          sleep_hours?: number | null
          steps?: number | null
          calories_consumed?: number | null
          water_intake_ml?: number | null
          source?: 'manual' | 'apple_health' | 'google_fit' | 'strava'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          weight_kg?: number | null
          body_fat_percentage?: number | null
          muscle_mass_kg?: number | null
          resting_heart_rate?: number | null
          sleep_hours?: number | null
          steps?: number | null
          calories_consumed?: number | null
          water_intake_ml?: number | null
          source?: 'manual' | 'apple_health' | 'google_fit' | 'strava'
          created_at?: string
        }
      }
      device_syncs: {
        Row: {
          id: string
          user_id: string
          provider: 'apple_health' | 'google_fit' | 'strava'
          provider_user_id: string
          access_token: string
          refresh_token: string | null
          token_expires_at: string | null
          last_sync_at: string | null
          sync_status: 'active' | 'error' | 'disconnected'
          sync_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: 'apple_health' | 'google_fit' | 'strava'
          provider_user_id: string
          access_token: string
          refresh_token?: string | null
          token_expires_at?: string | null
          last_sync_at?: string | null
          sync_status?: 'active' | 'error' | 'disconnected'
          sync_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: 'apple_health' | 'google_fit' | 'strava'
          provider_user_id?: string
          access_token?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          last_sync_at?: string | null
          sync_status?: 'active' | 'error' | 'disconnected'
          sync_settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      trainer_client_relationships: {
        Row: {
          id: string
          trainer_id: string
          client_id: string
          status: 'pending' | 'active' | 'paused' | 'ended'
          start_date: string
          end_date: string | null
          monthly_rate: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          client_id: string
          status?: 'pending' | 'active' | 'paused' | 'ended'
          start_date: string
          end_date?: string | null
          monthly_rate?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          client_id?: string
          status?: 'pending' | 'active' | 'paused' | 'ended'
          start_date?: string
          end_date?: string | null
          monthly_rate?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workout_plans: {
        Row: {
          id: string
          trainer_id: string
          client_id: string | null
          name: string
          description: string | null
          duration_weeks: number
          workouts_per_week: number
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          goals: string[]
          workout_templates: string[]
          is_template: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trainer_id: string
          client_id?: string | null
          name: string
          description?: string | null
          duration_weeks: number
          workouts_per_week: number
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          goals?: string[]
          workout_templates?: string[]
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trainer_id?: string
          client_id?: string | null
          name?: string
          description?: string | null
          duration_weeks?: number
          workouts_per_week?: number
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          goals?: string[]
          workout_templates?: string[]
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          tier: 'free' | 'pro' | 'enterprise'
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id?: string | null
          tier?: 'free' | 'pro' | 'enterprise'
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string | null
          tier?: 'free' | 'pro' | 'enterprise'
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_tier: 'free' | 'pro' | 'enterprise'
      subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive' | 'unpaid' | 'incomplete'
      workout_type: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'mixed'
      difficulty_level: 'beginner' | 'intermediate' | 'advanced'
      sync_provider: 'apple_health' | 'google_fit' | 'strava'
      visibility_level: 'public' | 'friends' | 'private'
      measurement_units: 'metric' | 'imperial'
      theme_preference: 'light' | 'dark' | 'system'
      device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown'
      login_method: 'email' | 'google' | 'apple' | 'magic_link'
      token_type: 'email_verification' | 'password_reset' | 'magic_link' | 'email_change'
      connection_status: 'pending' | 'accepted' | 'declined' | 'blocked'
      connection_type: 'friend' | 'trainer' | 'client' | 'blocked'
      gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
      activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
      invitation_status: 'pending' | 'accepted' | 'declined' | 'expired'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}