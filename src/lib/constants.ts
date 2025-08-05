// Application constants
export const APP_NAME = 'FitPlatform'
export const APP_DESCRIPTION = 'Ultimate Workout & Wellness Platform'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fitplatform.com'
export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@fitplatform.com'

// Subscription constants
export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      '3 custom workouts',
      '30-day workout history',
      '1 device sync',
      'Basic progress tracking',
      'Community access',
    ],
    limits: {
      workouts: 3,
      historyDays: 30,
      deviceSyncs: 1,
    },
  },
  PRO: {
    name: 'Pro',
    price: 9.99,
    features: [
      'Unlimited custom workouts',
      'Complete workout history',
      'Unlimited device syncs',
      'Advanced analytics',
      'Nutrition tracking',
      'Priority support',
    ],
    limits: {
      workouts: Infinity,
      historyDays: Infinity,
      deviceSyncs: Infinity,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 29.99,
    features: [
      'All Pro features',
      'Client management',
      'Custom branding',
      'API access',
      'Advanced reporting',
      'White-label options',
    ],
    limits: {
      workouts: Infinity,
      historyDays: Infinity,
      deviceSyncs: Infinity,
      clients: Infinity,
    },
  },
} as const

// Workout constants
export const WORKOUT_TYPES = [
  'strength',
  'cardio',
  'flexibility',
  'sports',
  'mixed',
] as const

export const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
] as const

export const MUSCLE_GROUPS = [
  'chest',
  'back',
  'shoulders',
  'arms',
  'core',
  'legs',
  'glutes',
  'full-body',
] as const

export const EQUIPMENT_TYPES = [
  'bodyweight',
  'dumbbells',
  'barbell',
  'kettlebell',
  'resistance-bands',
  'cable-machine',
  'cardio-machine',
  'yoga-mat',
  'foam-roller',
  'medicine-ball',
  'pull-up-bar',
  'bench',
  'other',
] as const

// Device sync providers
export const SYNC_PROVIDERS = {
  APPLE_HEALTH: {
    name: 'Apple Health',
    id: 'apple_health',
    icon: '/icons/apple-health.svg',
    supportedMetrics: ['workouts', 'heart_rate', 'steps', 'sleep'],
  },
  GOOGLE_FIT: {
    name: 'Google Fit',
    id: 'google_fit',
    icon: '/icons/google-fit.svg',
    supportedMetrics: ['workouts', 'heart_rate', 'steps', 'nutrition'],
  },
  STRAVA: {
    name: 'Strava',
    id: 'strava',
    icon: '/icons/strava.svg',
    supportedMetrics: ['workouts', 'heart_rate'],
  },
} as const

// Health metrics
export const HEALTH_METRICS = {
  WEIGHT: {
    key: 'weight_kg',
    name: 'Weight',
    unit: 'kg',
    category: 'body',
  },
  BODY_FAT: {
    key: 'body_fat_percentage',
    name: 'Body Fat',
    unit: '%',
    category: 'body',
  },
  MUSCLE_MASS: {
    key: 'muscle_mass_kg',
    name: 'Muscle Mass',
    unit: 'kg',
    category: 'body',
  },
  HEART_RATE: {
    key: 'resting_heart_rate',
    name: 'Resting Heart Rate',
    unit: 'bpm',
    category: 'cardio',
  },
  STEPS: {
    key: 'steps',
    name: 'Steps',
    unit: 'steps',
    category: 'activity',
  },
  SLEEP: {
    key: 'sleep_hours',
    name: 'Sleep',
    unit: 'hours',
    category: 'recovery',
  },
  CALORIES: {
    key: 'calories_consumed',
    name: 'Calories',
    unit: 'kcal',
    category: 'nutrition',
  },
  WATER: {
    key: 'water_intake_ml',
    name: 'Water Intake',
    unit: 'ml',
    category: 'nutrition',
  },
} as const

// Exercise defaults
export const DEFAULT_REST_TIME = 60 // seconds
export const DEFAULT_SETS = 3
export const DEFAULT_REPS = 12

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// File upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']

// API rate limits
export const RATE_LIMITS = {
  AUTH: 5, // requests per minute
  API: 100, // requests per minute
  UPLOAD: 10, // requests per minute
} as const

// Validation constants
export const PASSWORD_MIN_LENGTH = 8
export const NAME_MAX_LENGTH = 100
export const BIO_MAX_LENGTH = 500
export const WORKOUT_NAME_MAX_LENGTH = 100
export const EXERCISE_NAME_MAX_LENGTH = 100

// Colors for charts and UI
export const CHART_COLORS = {
  primary: '#0ea5e9',
  accent: '#f97316',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  purple: '#a855f7',
  pink: '#ec4899',
  indigo: '#6366f1',
} as const

// Feature flags (for development)
export const FEATURE_FLAGS = {
  SOCIAL_FEATURES: process.env.NODE_ENV === 'development',
  AI_RECOMMENDATIONS: false,
  ADVANCED_ANALYTICS: true,
  TRAINER_FEATURES: true,
  NUTRITION_TRACKING: true,
} as const

// External API endpoints
export const API_ENDPOINTS = {
  STRIPE_WEBHOOK: '/api/webhooks/stripe',
  HEALTH_SYNC: '/api/sync',
  WORKOUT_EXPORT: '/api/workouts/export',
  USER_EXPORT: '/api/user/export',
} as const