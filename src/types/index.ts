export interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  benefits?: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  metrics?: string;
  rating: number;
}

export interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
  highlight?: boolean;
}

export interface Integration {
  name: string;
  logo: string;
  description?: string;
}

export interface Statistic {
  value: string;
  label: string;
  suffix?: string;
}

// === FITPLATFORM CORE TYPES ===

// Core User Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing';
  subscription_end_date?: string;
  is_trainer: boolean;
  trainer_profile?: TrainerProfile;
  created_at: string;
  updated_at: string;
}

export interface TrainerProfile {
  id: string;
  user_id: string;
  business_name?: string;
  bio?: string;
  certifications: string[];
  specializations: string[];
  years_experience?: number;
  hourly_rate?: number;
  custom_branding?: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
  };
  created_at: string;
  updated_at: string;
}

// Workout Management Types
export interface Workout {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  duration_minutes?: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  workout_type: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'mixed';
  tags: string[];
  is_template: boolean;
  is_public: boolean;
  created_by_trainer?: string;
  assigned_to_client?: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle_groups: string[];
  equipment_needed: string[];
  instructions: string[];
  sets?: ExerciseSet[];
  notes?: string;
  rest_seconds?: number;
  video_url?: string;
  image_url?: string;
}

export interface ExerciseSet {
  set_number: number;
  reps?: number;
  weight_kg?: number;
  duration_seconds?: number;
  distance_meters?: number;
  rest_seconds?: number;
  completed?: boolean;
  notes?: string;
}

// Progress Tracking Types
export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_id: string;
  started_at: string;
  completed_at?: string;
  duration_minutes?: number;
  calories_burned?: number;
  exercises_completed: CompletedExercise[];
  notes?: string;
  mood_before?: number;
  mood_after?: number;
  perceived_exertion?: number;
  synced_from?: 'apple_health' | 'google_fit' | 'strava' | 'manual';
  created_at: string;
}

export interface CompletedExercise {
  exercise_id: string;
  sets_completed: CompletedSet[];
  notes?: string;
  perceived_exertion?: number;
}

export interface CompletedSet {
  set_number: number;
  reps_completed?: number;
  weight_used_kg?: number;
  duration_seconds?: number;
  distance_meters?: number;
  rest_taken_seconds?: number;
  completed: boolean;
}

// Health Data Integration Types
export interface HealthMetrics {
  id: string;
  user_id: string;
  date: string;
  weight_kg?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  resting_heart_rate?: number;
  sleep_hours?: number;
  steps?: number;
  calories_consumed?: number;
  water_intake_ml?: number;
  source: 'manual' | 'apple_health' | 'google_fit' | 'strava';
  created_at: string;
}

export interface DeviceSync {
  id: string;
  user_id: string;
  provider: 'apple_health' | 'google_fit' | 'strava';
  provider_user_id: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  last_sync_at?: string;
  sync_status: 'active' | 'error' | 'disconnected';
  sync_settings: {
    workouts: boolean;
    heart_rate: boolean;
    steps: boolean;
    sleep: boolean;
    nutrition: boolean;
  };
  created_at: string;
  updated_at: string;
}

// Trainer-Client Management Types
export interface TrainerClientRelationship {
  id: string;
  trainer_id: string;
  client_id: string;
  status: 'pending' | 'active' | 'paused' | 'ended';
  start_date: string;
  end_date?: string;
  monthly_rate?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlan {
  id: string;
  trainer_id: string;
  client_id?: string;
  name: string;
  description?: string;
  duration_weeks: number;
  workouts_per_week: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  workout_templates: string[];
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

// Subscription and Payment Types
export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id?: string;
  tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface WorkoutFormData {
  name: string;
  description?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  workout_type: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'mixed';
  exercises: ExerciseFormData[];
  tags: string[];
  is_template: boolean;
  is_public: boolean;
}

export interface ExerciseFormData {
  name: string;
  muscle_groups: string[];
  equipment_needed: string[];
  instructions: string[];
  sets: number;
  reps?: number;
  weight_kg?: number;
  duration_seconds?: number;
  rest_seconds?: number;
  notes?: string;
}

export interface ProfileFormData {
  full_name: string;
  email: string;
  bio?: string;
  fitness_goals: string[];
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  preferred_workout_types: string[];
  available_equipment: string[];
}

// === ENHANCED AUTHENTICATION TYPES ===

// User preferences and settings
export interface UserPreferences {
  id: string;
  user_id: string;
  // Notification preferences
  email_notifications: boolean;
  push_notifications: boolean;
  workout_reminders: boolean;
  progress_reports: boolean;
  social_updates: boolean;
  marketing_emails: boolean;
  // Privacy settings
  profile_visibility: 'public' | 'friends' | 'private';
  workout_visibility: 'public' | 'friends' | 'private';
  progress_visibility: 'public' | 'friends' | 'private';
  // App preferences
  measurement_units: 'metric' | 'imperial';
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  // Fitness preferences
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';
  fitness_goals: string[];
  preferred_workout_types: string[];
  available_equipment: string[];
  workout_duration_preference?: number;
  workouts_per_week_goal?: number;
  created_at: string;
  updated_at: string;
}

// User session tracking
export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  // Session metadata
  ip_address?: string;
  user_agent?: string;
  device_type?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  // Session lifecycle
  created_at: string;
  last_activity: string;
  expires_at: string;
  is_active: boolean;
  // Security flags
  is_suspicious?: boolean;
  login_method?: 'email' | 'google' | 'apple' | 'magic_link';
}

// Enhanced subscription management
export interface UserSubscription {
  id: string;
  user_id: string;
  // Stripe integration
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_price_id?: string;
  // Subscription metadata
  tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';
  // Billing periods
  trial_start?: string;
  trial_end?: string;
  current_period_start?: string;
  current_period_end?: string;
  // Subscription controls
  cancel_at_period_end: boolean;
  canceled_at?: string;
  ended_at?: string;
  // Pricing
  amount_cents?: number;
  currency?: string;
  interval_type?: 'month' | 'year';
  // Feature limits
  workout_limit?: number;
  device_sync_limit?: number;
  client_limit?: number; // for trainers
  created_at: string;
  updated_at: string;
}

// Authentication tokens
export interface AuthToken {
  id: string;
  user_id: string;
  token_hash: string;
  token_type: 'email_verification' | 'password_reset' | 'magic_link' | 'email_change';
  email?: string;
  expires_at: string;
  used_at?: string;
  is_used?: boolean;
  ip_address?: string;
  user_agent?: string;
  attempts?: number;
  max_attempts?: number;
  created_at: string;
}

// Extended user profile
export interface UserProfileExtended {
  id: string;
  user_id: string;
  // Personal information
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone_number?: string;
  // Location
  country?: string;
  state_province?: string;
  city?: string;
  timezone?: string;
  // Fitness profile
  height_cm?: number;
  starting_weight_kg?: number;
  current_weight_kg?: number;
  target_weight_kg?: number;
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  // Medical considerations
  medical_conditions?: string[];
  medications?: string[];
  injuries_limitations?: string[];
  allergies?: string[];
  // Social features
  bio?: string;
  website_url?: string;
  social_links?: Record<string, string>;
  // Privacy flags
  profile_completed?: boolean;
  onboarding_completed?: boolean;
  terms_accepted_at?: string;
  privacy_policy_accepted_at?: string;
  marketing_consent?: boolean;
  created_at: string;
  updated_at: string;
}

// User connections and friendships
export interface UserConnection {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  connection_type: 'friend' | 'trainer' | 'client' | 'blocked';
  requested_at: string;
  responded_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// User activity logging
export interface UserActivityLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Enhanced trainer business profile
export interface TrainerBusinessProfile {
  id: string;
  trainer_profile_id: string;
  // Business details
  business_license_number?: string;
  tax_id?: string;
  business_address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  // Professional credentials
  certifications_verified?: boolean;
  insurance_provider?: string;
  insurance_policy_number?: string;
  insurance_expiry?: string;
  // Business settings
  time_zone?: string;
  business_hours?: Record<string, { open: string; close: string }>;
  booking_settings?: Record<string, any>;
  // Payment settings
  stripe_connect_account_id?: string;
  payment_methods_enabled?: string[];
  default_session_rate?: number;
  currency?: string;
  // Business metrics
  total_clients?: number;
  total_sessions_completed?: number;
  average_rating?: number;
  total_reviews?: number;
  created_at: string;
  updated_at: string;
}

// Client invitations
export interface ClientInvitation {
  id: string;
  trainer_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token_hash: string;
  expires_at: string;
  client_id?: string;
  accepted_at?: string;
  invited_from?: string;
  created_at: string;
  updated_at: string;
}

// Database types for Supabase (updated to use the imported types)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id'>>;
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserPreferences, 'id'>>;
      };
      user_sessions: {
        Row: UserSession;
        Insert: Omit<UserSession, 'id' | 'created_at' | 'last_activity'>;
        Update: Partial<Omit<UserSession, 'id'>>;
      };
      user_subscriptions: {
        Row: UserSubscription;
        Insert: Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserSubscription, 'id'>>;
      };
      auth_tokens: {
        Row: AuthToken;
        Insert: Omit<AuthToken, 'id' | 'created_at'>;
        Update: Partial<Omit<AuthToken, 'id'>>;
      };
      user_profiles_extended: {
        Row: UserProfileExtended;
        Insert: Omit<UserProfileExtended, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfileExtended, 'id'>>;
      };
      user_connections: {
        Row: UserConnection;
        Insert: Omit<UserConnection, 'id' | 'created_at' | 'updated_at' | 'requested_at'>;
        Update: Partial<Omit<UserConnection, 'id'>>;
      };
      user_activity_log: {
        Row: UserActivityLog;
        Insert: Omit<UserActivityLog, 'id' | 'created_at'>;
        Update: Partial<Omit<UserActivityLog, 'id'>>;
      };
      trainer_business_profiles: {
        Row: TrainerBusinessProfile;
        Insert: Omit<TrainerBusinessProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TrainerBusinessProfile, 'id'>>;
      };
      client_invitations: {
        Row: ClientInvitation;
        Insert: Omit<ClientInvitation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ClientInvitation, 'id'>>;
      };
      workouts: {
        Row: Workout;
        Insert: Omit<Workout, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Workout, 'id'>>;
      };
      workout_sessions: {
        Row: WorkoutSession;
        Insert: Omit<WorkoutSession, 'id' | 'created_at'>;
        Update: Partial<Omit<WorkoutSession, 'id'>>;
      };
      health_metrics: {
        Row: HealthMetrics;
        Insert: Omit<HealthMetrics, 'id' | 'created_at'>;
        Update: Partial<Omit<HealthMetrics, 'id'>>;
      };
      device_syncs: {
        Row: DeviceSync;
        Insert: Omit<DeviceSync, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DeviceSync, 'id'>>;
      };
      trainer_client_relationships: {
        Row: TrainerClientRelationship;
        Insert: Omit<TrainerClientRelationship, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TrainerClientRelationship, 'id'>>;
      };
      workout_plans: {
        Row: WorkoutPlan;
        Insert: Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WorkoutPlan, 'id'>>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Subscription, 'id'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_subscription_limits: {
        Args: { user_uuid: string };
        Returns: {
          tier: string;
          workout_limit: number | null;
          device_sync_limit: number | null;
          client_limit: number | null;
          has_unlimited_workouts: boolean;
          has_unlimited_devices: boolean;
          has_unlimited_clients: boolean;
        }[];
      };
      create_trainer_profile: {
        Args: {
          user_uuid: string;
          business_name_param?: string;
          bio_param?: string;
        };
        Returns: string;
      };
      cleanup_expired_tokens: {
        Args: {};
        Returns: number;
      };
      cleanup_expired_sessions: {
        Args: {};
        Returns: number;
      };
    };
    Enums: {
      subscription_tier: 'free' | 'pro' | 'enterprise';
      subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive' | 'unpaid' | 'incomplete';
      workout_type: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'mixed';
      difficulty_level: 'beginner' | 'intermediate' | 'advanced';
      sync_provider: 'apple_health' | 'google_fit' | 'strava';
      visibility_level: 'public' | 'friends' | 'private';
      measurement_units: 'metric' | 'imperial';
      theme_preference: 'light' | 'dark' | 'system';
      device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
      login_method: 'email' | 'google' | 'apple' | 'magic_link';
      token_type: 'email_verification' | 'password_reset' | 'magic_link' | 'email_change';
      connection_status: 'pending' | 'accepted' | 'declined' | 'blocked';
      connection_type: 'friend' | 'trainer' | 'client' | 'blocked';
      gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
      activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
      invitation_status: 'pending' | 'accepted' | 'declined' | 'expired';
    };
  };
}